import Bookings from '../models/Bookings';
import Offers from '../models/Offers';
import SpecialPricing from '../models/SpecialPricing';
import {
  formatDuration,
  getMinutesDifference,
  getRemainingTime,
} from '../utils';
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

      const bookingDetails = await Bookings.find({ _id: { $in: bookIds } })
        .populate({
          path: 'owner',
          select: 'firstName lastName phoneNumber',
        })
        .populate({
          path: 'renter',
          select: 'firstName lastName phoneNumber',
        });

      bookingDetails.forEach((booking) => {
        const departureTime = new Date(
          notNotifiedOffers.find(
            (offer) => offer.bookId.toString() === booking._id.toString()
          )?.departureDate
        );
        const now = new Date();
        const remainingMs = departureTime - now;
        const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
        const remainingTime = getRemainingTime(remainingMinutes);

        // Renter notification
        sendMessage(booking.renter.phoneNumber, 'notifyRenter', {
          remainingTime,
          ownerFirstName: booking.owner.firstName,
          ownerLastName: booking.owner.lastName,
          departureTime: departureTime.toLocaleTimeString(),
          duration: formatDuration(booking.duration),
          bookingId: booking._id.toString(),
        });

        // Owner notification
        sendMessage(booking.owner.phoneNumber, 'notifyOwner', {
          remainingTime,
          renterFirstName: booking.renter.firstName,
          renterLastName: booking.renter.lastName,
          duration: formatDuration(booking.duration),
          departureTime: departureTime.toLocaleTimeString(),
          bookingId: booking._id.toString(),
        });
      });

      await Offers.updateMany(
        { _id: { $in: offerIds } },
        { $set: { notified: true } }
      );
    }

    SpecialPricing.updateAllSpecialPricingStatuses();
  } catch (error) {
    console.log('scheduler failed to run');
  }
};
