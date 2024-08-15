import Offers from '../models/Offers';
import { bookingStatus } from '../utils/constants';
import { sendMessage } from '../utils/twilio';
import Bookings from '../models/Bookings';
import Users from '../models/Users';

export const createOfferController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const {
      bookId,
      boatPrice,
      captainPrice,
      paymentServiceFee,
      localTax,
      departureDate,
      returnDate,
    } = req.body;

    const booking = await Bookings.getBooking({
      bookId,
      userId,
      isRenter: false,
    });
    if (!booking) throw new Error('Booking not found');

    const { renter } = booking;
    if (!renter) throw new Error('Renter not found');

    const offer = new Offers({
      bookId,
      boatPrice,
      captainPrice,
      paymentServiceFee,
      localTax,
      departureDate,
      returnDate,
      status: bookingStatus.PENDING,
      createdBy: userId,
    });

    const savedOffer = await offer.createOffers();

    const renterPhoneNumber = renter.phoneNumber;

    const ownerFirstName = req?.user?.firstName ?? '';
    const ownerLastName = req?.user?.lastName ?? '';

    sendMessage(renterPhoneNumber, 'offerSent', {
      ownerFirstName,
      ownerLastName,
    });

    res.send(savedOffer);
  } catch (error) {
    next(error);
  }
};

export const updateOfferController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { offerId } = req.params;
    const { boatPrice, captainPrice, paymentServiceFee, localTax } = req.body;
    const updateObject = {};

    if (boatPrice) updateObject.boatPrice = boatPrice;
    if (captainPrice === '0' || captainPrice === 0 || captainPrice)
      updateObject.captainPrice = captainPrice;
    if (paymentServiceFee) updateObject.paymentServiceFee = paymentServiceFee;
    if (localTax) updateObject.localTax = localTax;
    const updatedOffer = await Offers.updateOffer({
      offerId,
      userId,
      updateObject,
    });
    res.send(updatedOffer);
  } catch (error) {
    next(error);
  }
};

export const acceptOfferController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || '';
    const { offerId } = req.params;

    const offer = await Offers.getOffer({ offerId, userId });

    const booking = await Bookings.getBooking({
      bookId: offer.bookId,
      userId,
      isRenter: true,
    });

    const accept = await Offers.acceptOffer({
      userId,
      offerId,
    });

    const { firstName, lastName } = booking.renter;

    const ownerId = booking.owner;
    const owner = await Users.findOne({ _id: ownerId });

    if (!owner) throw new Error('Owner not found');
    const { phoneNumber } = owner;

    sendMessage(phoneNumber, 'offerAccepted', {
      firstName,
      lastName,
    });

    res.send(accept);
  } catch (error) {
    next(error);
  }
};

export const getOfferController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || '';
    const { offerId } = req.params;

    const offer = await Offers.getOffer({
      userId,
      offerId,
    });

    res.send(offer);
  } catch (error) {
    next(error);
  }
};
