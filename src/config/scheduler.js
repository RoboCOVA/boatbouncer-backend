import Bookings from '../models/Bookings';
import Notifications from '../models/Notifications';
import Offers from '../models/Offers';
import { modelNames } from '../models/constants';
import { notificationActionTypes } from '../models/Notifications/constants';
import { getMinutesDifference, getRemainingTime } from '../utils';
import { bookingStatus, offerStatus } from '../utils/constants';
import { notifyUserSafely } from '../utils/notify';

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
      /**
       * Claim each offer before announcing it. Reading the offers and then
       * updating them is two steps, and anything that runs the scheduler twice
       * over the same window — an overlapping tick, a second app instance, a
       * restart that leaves the old process alive — passes the read before
       * either write lands, so both runs go on to notify. That is why
       * "Booking Completed" showed up twice.
       *
       * The conditional update is the serialization point: only the run whose
       * write actually flipped PROCESSING gets a document back, and only those
       * offers are notified about.
       */
      const claimedOffers = (
        await Promise.all(
          completedOffers.map((offer) =>
            Offers.findOneAndUpdate(
              { _id: offer._id, status: offerStatus.PROCESSING },
              { $set: { status: offerStatus.COMPLETED } },
              { new: true }
            )
          )
        )
      ).filter(Boolean);

      // One booking can hold several offers; notify it once.
      const bookIds = [
        ...new Set(claimedOffers.map(({ bookId }) => bookId.toString())),
      ];

      await Bookings.updateMany(
        { _id: { $in: bookIds } },
        { $set: { status: bookingStatus.COMPLETED } }
      );

      const completedBookings = await Bookings.find({
        _id: { $in: bookIds },
      })
        .populate(
          'renter',
          '_id firstName lastName email phoneNumber deviceTokens'
        )
        .populate(
          'owner',
          '_id firstName lastName email phoneNumber deviceTokens'
        )
        .populate('boatId', 'boatName');

      await Promise.all(
        completedBookings.map((booking) => {
          const completedNotif = new Notifications({
            title: 'Booking Completed',
            content: 'Booking Information',
            modelType: modelNames.BOOKINGS,
            userType: modelNames.USERS,
            createdBy: booking.renter._id,
            actionType: notificationActionTypes.UPDATE,
            model: booking._id,
          });

          /**
           * The bell entry alone only reaches someone who happens to open the
           * site. Completion is the one event nobody is sitting on the page
           * for — the trip has just ended — so it needs the push/email half
           * as well, the way every request-time notification already does.
           */
          const values = {
            boatName: booking.boatId?.boatName ?? 'your booking',
            bookingId: booking._id.toString(),
          };
          notifyUserSafely({
            user: booking.renter,
            templateKey: 'bookingCompletedRenter',
            values,
          });
          notifyUserSafely({
            user: booking.owner,
            templateKey: 'bookingCompletedOwner',
            values,
          });

          return completedNotif
            .createNotification({
              userIds: [booking.renter._id, booking.owner._id],
            })
            .catch((err) => console.error('[Notification]', err));
        })
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
      /**
       * Claimed the same way completions are, and for the same reason: the flag
       * used to be set only after every send had gone out, so two runs over the
       * same window both saw `notified: false` and both sent the reminder.
       */
      const claimedReminders = (
        await Promise.all(
          notNotifiedOffers.map((offer) =>
            Offers.findOneAndUpdate(
              { _id: offer._id, notified: { $ne: true } },
              { $set: { notified: true } },
              { new: true }
            )
          )
        )
      ).filter(Boolean);

      const bookIds = claimedReminders.map(({ bookId }) => bookId);

      const bookingDetails = await Bookings.find({ _id: { $in: bookIds } })
        .populate({
          path: 'owner',
          select: 'firstName lastName phoneNumber email deviceTokens',
        })
        .populate({
          path: 'renter',
          select: 'firstName lastName phoneNumber email deviceTokens',
        });

      bookingDetails.forEach((booking) => {
        const departureTime = new Date(
          claimedReminders.find(
            (offer) => offer.bookId.toString() === booking._id.toString()
          )?.departureDate
        );
        // getRemainingTime takes the departure instant, not a minute count. It
        // was being handed the latter, so `new Date(58)` resolved to 1970 and
        // every reminder went out reading "in -29781022 minutes".
        const remainingTime = getRemainingTime(departureTime);
        const clockTime = departureTime.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });

        // Renter notification
        notifyUserSafely({
          user: booking.renter,
          templateKey: 'notifyRenter',
          values: {
            remainingTime,
            departureTime: clockTime,
            bookingId: booking._id.toString(),
          },
        });

        // Owner notification
        notifyUserSafely({
          user: booking.owner,
          templateKey: 'notifyOwner',
          values: {
            remainingTime,
            departureTime: clockTime,
            bookingId: booking._id.toString(),
          },
        });

        /**
         * `notifyUserSafely` covers push, email and SMS but writes nothing to
         * the bell and emits nothing over the socket — so until now a departure
         * reminder was invisible to anyone already sitting on the site, which
         * is exactly who is about to depart.
         */
        const reminderNotif = new Notifications({
          title: 'Departure Reminder',
          content: 'Booking Information',
          modelType: modelNames.BOOKINGS,
          userType: modelNames.USERS,
          createdBy: booking.renter._id,
          actionType: notificationActionTypes.UPDATE,
          model: booking._id,
        });
        reminderNotif
          .createNotification({
            userIds: [booking.renter._id, booking.owner._id],
          })
          .catch((err) => console.error('[Notification]', err));
      });
    }
  } catch (error) {
    console.log('scheduler failed to run');
  }
};
