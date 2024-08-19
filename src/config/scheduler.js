import Bookings from '../models/Bookings';
import Offers from '../models/Offers';
import Users from '../models/Users';
import { getMinutesDifference } from '../utils';
import { bookingStatus, offerStatus } from '../utils/constants';
import { sendMessage } from '../utils/twilio';

export const Scheduler = async () => {
  console.log('scheduler is running ...');

  try {
    const offers = await Offers.find({
      status: offerStatus.PROCESSING,
    });

    const completedOffers = offers.filter((offer) => {
      return new Date() > new Date(offer.returnDate);
    });

    if (completedOffers && completedOffers.length > 0) {
      const offerIds = completedOffers.map(({ _id }) => _id);
      const bookIds = completedOffers.map(({ bookId }) => bookId);

      await Offers.updateMany(
        { _id: { $in: offerIds } },
        { $set: { status: offerStatus.COMPLETED } }
      );

      await Bookings.updateMany(
        { _id: { $in: bookIds } },
        { $set: { status: bookingStatus.COMPLETED } }
      );
    }

    // offer not notified but departure period is ahead
    const notNotifiedOffers = offers.filter((offer) => {
      const minutes = getMinutesDifference(
        new Date(offer.departureDate),
        new Date()
      );

      if (!offer.notified && minutes < 65 && minutes > 55) {
        return true;
      }

      return false;
    });

    if (notNotifiedOffers && notNotifiedOffers.length > 0) {
      // update these offers after sending sms
      const offerIds = notNotifiedOffers.map(({ _id }) => _id);

      const bookIds = notNotifiedOffers.map(({ bookId }) => bookId);

      const bookingDetails = await Bookings.find({ _id: { $in: bookIds } });

      const renters = bookingDetails.map(({ renter }) => renter);
      const owners = bookingDetails.map(({ owner }) => owner);

      const rentersPhoneNumber = (
        await Users.find({ _id: { $in: renters } })
      ).map(({ phoneNumber }) => phoneNumber);

      const ownersPhoneNumber = (
        await Users.find({ _id: { $in: owners } })
      ).map(({ phoneNumber }) => phoneNumber);

      rentersPhoneNumber.forEach((number) => {
        sendMessage(number, 'notifyRenter');
      });

      ownersPhoneNumber.forEach((number) => {
        sendMessage(number, 'notifyOwner');
      });

      await Offers.updateMany(
        { _id: { $in: offerIds } },
        { $set: { notified: true } }
      );
    }
  } catch (error) {
    console.log('scheduler failed to run');
  }
};
