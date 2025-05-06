import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import Boats from '../models/Boats';
import Bookings from '../models/Bookings';
import Users from '../models/Users';
import { boatListTypes, bookingStatus, pricingType } from '../utils/constants';
import { sendMessage } from '../utils/twilio';
import { addHoursToDate } from '../utils';

function calculateActivityBoatPrice(peopleCount, pricing) {
  const price = pricing.perPerson;
  let renterPrice = price;
  let discountPercentage = 0;
  const sortedDiscounts = pricing.discountPercentage.sort(
    (a, b) => b.minPeople - a.minPeople
  );

  const applicableDiscount = sortedDiscounts.find(
    (discount) => peopleCount >= discount.minPeople
  );
  if (applicableDiscount) {
    renterPrice -= (price * applicableDiscount.percentage) / 100;
    discountPercentage = applicableDiscount.percentage;
  }

  return { renterPrice, price, discountPercentage };
}

function calculateRentalBoatPrice(period, pricing, type) {
  if (type === pricingType.PER_DAY && period.days < pricing.minDays)
    throw new APIError(
      `Number of days should be greater than ${pricing.minDays}`,
      httpStatus.BAD_REQUEST
    );
  if (type === pricingType.PER_HOUR && period.hours < pricing.minHours)
    throw new APIError(
      `Number of hours should be greater than ${pricing.minHours}`,
      httpStatus.BAD_REQUEST
    );
  const price = type === pricingType.PER_DAY ? pricing.perDay : pricing.perHour;
  let renterPrice = price;
  let discountPercentage = 0;

  const sortedDiscounts =
    type === pricingType.PER_DAY
      ? pricing.dayDiscount.sort((a, b) => b.minPeople - a.minPeople)
      : pricing.hourDiscount.sort((a, b) => b.minPeople - a.minPeople);

  const applicableDiscount = sortedDiscounts.find((discount) => {
    if (type === pricingType.PER_DAY)
      return period.days >= discount.minDaysForDiscount;
    if (type === pricingType.PER_HOUR)
      return period.hours >= discount.minHoursForDiscount;
    return period.days >= discount.minDaysForDiscount;
  });
  if (applicableDiscount) {
    renterPrice -= (price * applicableDiscount.discountPercentage) / 100;
    discountPercentage = applicableDiscount.discountPercentage;
  }

  return { price, renterPrice, discountPercentage };
}

/**
 * It creates a new booking and saves it to the database.
 * @param req - {
 * @param res - {
 * @param next - A function to be called if an error occurs or processing is complete.
 */
export const createBookingController = async (req, res, next) => {
  try {
    // const { boatId, type, duration, renterPrice, captainPrice } = req.body;

    const { boatId, type, duration, days, noPeople, hours, activityType } =
      req.body;

    const id = req?.user?._id;

    let boakingParam = {
      boatId,
      type,
      duration,
      renter: id,
      status: bookingStatus.PENDING,
    };

    const boat = await Boats.getBoat({ boatId });
    if (!boat) throw new 'Boat not found'();
    const listingType = boat?.listingType;

    if (listingType === boatListTypes.RENTAL) {
      const isTypeValid = [pricingType.PER_HOUR, pricingType.PER_DAY].includes(
        type
      );
      if (!isTypeValid)
        throw new APIError(
          `Invalid booking type for ${listingType} boat `,
          httpStatus.BAD_REQUEST
        );
      if (type === pricingType.PER_HOUR) {
        if (!hours)
          throw new APIError(
            `Hours are required for ${pricingType.PER_HOUR} pricing `,
            httpStatus.BAD_REQUEST
          );
        boakingParam.hours = hours;
        boakingParam.days = 0;
      }

      if (type === pricingType.PER_DAY) {
        if (!days)
          throw new APIError(
            `Days are required for ${pricingType.PER_HOUR} pricing `,
            httpStatus.BAD_REQUEST
          );

        boakingParam.days = days;
        boakingParam.hours = 0;
      }

      boakingParam = {
        ...boakingParam,
        ...calculateRentalBoatPrice({ hours, days }, boat.pricing, type),
      };
    }
    if (listingType === boatListTypes.ACTIVITY) {
      const isTypeValid = [pricingType.PER_PERSON].includes(type);
      if (!isTypeValid)
        throw new APIError(
          `Invalid booking type for ${listingType} boat `,
          httpStatus.BAD_REQUEST
        );

      if (!activityType)
        throw new APIError(
          `activity Type is required for for ${listingType} boat `,
          httpStatus.BAD_REQUEST
        );

      if (type === pricingType.PER_PERSON) {
        if (!noPeople)
          throw new APIError(
            `Number of people  is required for ${pricingType.PER_PERSON} pricing `,
            httpStatus.BAD_REQUEST
          );
      }
      boakingParam.noPeople = noPeople;
      boakingParam.activityType = activityType;
      const selectedAactivityType = boat?.activityTypes.find(
        ({ type: fechtecType }) => fechtecType === activityType
      );
      if (selectedAactivityType) {
        boakingParam.duration = {
          ...duration,
          end: addHoursToDate(
            duration.start,
            selectedAactivityType.durationHours
          ),
        };
      }
      boakingParam = {
        ...boakingParam,
        ...calculateActivityBoatPrice(noPeople, boat.pricing),
      };
    }

    const ownerId = boat.owner;
    const owner = await Users.findOne({ _id: ownerId });
    if (!owner) throw new Error('Owner not found');

    const booking = new Bookings({
      ...boakingParam,
    });

    const savedReservation = await booking.createBooking();
    const ownerPhoneNumber = owner.phoneNumber;

    const requesterFirstName = req?.user?.firstName ?? '';
    const requesterLastName = req?.user?.lastName ?? '';

    sendMessage(ownerPhoneNumber, 'bookingRequest', {
      requesterFirstName,
      requesterLastName,
    });

    res.send(savedReservation);
  } catch (error) {
    next(error);
  }
};

/**
 * It takes a bookId and a userId and cancels the booking.
 * @param req - {
 * @param res - the response object
 * @param next - is a function that you call to pass control to the next matching route.
 */
export const cancelBookingController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { bookId } = req.params;
    const { isRenter } = req.query;

    const booking = await Bookings.getBooking({
      bookId,
      userId,
      isRenter,
    });

    let phoneNumber;
    let firstName;
    let lastName;

    const cancelledBooking = await Bookings.cancelBooking({
      bookId,
      userId,
      isRenter,
    });

    if (isRenter) {
      firstName = booking.renter.firstName;
      lastName = booking.renter.lastName;

      const ownerId = booking.owner;
      const owner = await Users.findOne({ _id: ownerId });

      if (!owner) throw new Error('Owner not found');
      phoneNumber = owner.phoneNumber;
    } else {
      firstName = booking.renter.firstName;
      lastName = booking.renter.lastName;
      phoneNumber = booking.renter.phoneNumber;
    }

    sendMessage(phoneNumber, 'bookingCancellation', {
      firstName,
      lastName,
    });

    res.send(cancelledBooking);
  } catch (error) {
    next(error);
  }
};

/**
 * It gets all the bookings for a user, and sends them back to the client.
 * @param req - {
 * @param res - the response object
 * @param next - a function that you call to pass control to the next middleware function.
 */
export const getBookingsController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { isRenter } = req.query;

    const bookings = await Bookings.getBookings({
      userId,
      isRenter,
    });
    res.send(bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * It gets the bookings for a bookId and userId.
 * @param req - {
 * @param res - {
 * @param next - is a function that you call to pass control to the next middleware function.
 */
export const getBookingController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { bookId } = req.params;
    const { isRenter } = req.query;

    const bookings = await Bookings.getBooking({
      bookId,
      userId,
      isRenter,
    });
    res.send(bookings);
  } catch (error) {
    next(error);
  }
};

// Get canceled bookings
/**
 * It gets the canceled bookings for a user.
 * @param req - {
 * @param res - {
 * @param next - is a function that you call to pass control to the next middleware function.
 */
export const getCanceledBookingsController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { as } = req.query;
    const canceledBookings = await Bookings.getCanceledBookings({
      userId,
      as,
    });
    res.send(canceledBookings);
  } catch (error) {
    next(error);
  }
};

export const getCompletedBookingsController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { as } = req.query;
    const canceledBookings = await Bookings.getCompletedBookings({
      userId,
      as,
    });
    res.send(canceledBookings);
  } catch (error) {
    next(error);
  }
};
