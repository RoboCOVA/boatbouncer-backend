import Offers from '../models/Offers';
import Notifications from '../models/Notifications';
import { modelNames } from '../models/constants';
import { notificationActionTypes } from '../models/Notifications/constants';
import { bookingStatus } from '../utils/constants';
import { sendMessage } from '../utils/twilio';
import Bookings from '../models/Bookings';
import Users from '../models/Users';
import { formatDuration } from '../utils';

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
      boatName: booking?.boatId?.boatName,
      duration: formatDuration(booking.duration),
      departureTime: new Date(departureDate).toLocaleTimeString(),
      bookingId: booking._id.toString(),
    });

    const offerCreatedNotif = new Notifications({
      title: 'New Offer',
      content: 'Offer Information',
      modelType: modelNames.OFFERS,
      userType: modelNames.USERS,
      createdBy: userId,
      actionType: notificationActionTypes.CREATE,
      model: savedOffer._id,
    });
    offerCreatedNotif
      .createNotification({ userIds: [renter._id] })
      .catch((err) => console.error('[Notification]', err));

    res.send(savedOffer);
  } catch (error) {
    next(error);
  }
};

export const updateOfferController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { offerId } = req.params;
    const {
      boatPrice,
      captainPrice,
      paymentServiceFee,
      localTax,
      departureDate,
      returnDate,
    } = req.body;
    const updateObject = {};

    if (boatPrice) updateObject.boatPrice = boatPrice;
    if (captainPrice === '0' || captainPrice === 0 || captainPrice)
      updateObject.captainPrice = captainPrice;
    if (paymentServiceFee) updateObject.paymentServiceFee = paymentServiceFee;
    if (localTax) updateObject.localTax = localTax;

    if (departureDate || returnDate) {
      const existing = await Offers.findOne({
        _id: offerId,
        createdBy: userId,
      });
      if (!existing) throw new Error('Offer not found');

      const resolvedDeparture = new Date(
        departureDate ?? existing.departureDate
      );
      const resolvedReturn = new Date(returnDate ?? existing.returnDate);

      if (resolvedReturn <= resolvedDeparture) {
        throw new Error('Return date must be after departure date');
      }

      if (departureDate) updateObject.departureDate = departureDate;
      if (returnDate) updateObject.returnDate = returnDate;
    }

    const updatedOffer = await Offers.updateOffer({
      offerId,
      userId,
      updateObject,
    });

    const booking = await Bookings.findOne({ _id: updatedOffer.bookId });
    if (booking) {
      const offerUpdatedNotif = new Notifications({
        title: 'Offer Updated',
        content: 'Offer Information',
        modelType: modelNames.OFFERS,
        userType: modelNames.USERS,
        createdBy: userId,
        actionType: notificationActionTypes.UPDATE,
        model: updatedOffer._id,
      });
      offerUpdatedNotif
        .createNotification({ userIds: [booking.renter] })
        .catch((err) => console.error('[Notification]', err));
    }

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
      boatName: booking?.boatId?.boatName,
      duration: formatDuration(booking.duration),
      departureTime: new Date(offer?.departureDate).toLocaleTimeString(),
      bookingId: booking._id.toString(),
    });

    const offerAcceptedNotif = new Notifications({
      title: 'Offer Accepted',
      content: 'Offer Information',
      modelType: modelNames.OFFERS,
      userType: modelNames.USERS,
      createdBy: userId,
      actionType: notificationActionTypes.UPDATE,
      model: offerId,
    });
    // userId = renter (acceptor); offer.createdBy = owner
    offerAcceptedNotif
      .createNotification({ userIds: [userId, offer.createdBy] })
      .catch((err) => console.error('[Notification]', err));

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
