import { startSession } from 'mongoose';
import compareAsc from 'date-fns/compareAsc';
import { modelNames } from '../constants';
import {
  boatNotBookable,
  boatNotFound,
  bookingNotAvailable,
  invalidDateRange,
  invalidOperaton,
} from './errors';
import { userNotFound } from '../Users/errors';
import { boatStatus } from '../../utils/constants';

export async function createBooking() {
  const session = await startSession();
  const Boats = this.model(modelNames.BOATS);
  const Users = this.model(modelNames.USERS);
  const Conversations = this.model(modelNames.CONVERSATIONS);

  try {
    let reservation;

    await session.withTransaction(async () => {
      const { boatId, renter, duration } = this;

      /**
       * `withTransaction` retries on write conflict, and Mongoose marks a
       * document as no longer new once `save()` resolves — which would turn a
       * retry into an update against a rolled-back row.
       */
      this.isNew = true;

      /** Check if the given range is valid */
      const { start, end } = duration;
      const result = compareAsc(new Date(end), new Date(start));
      if (result === -1) throw invalidDateRange;

      /**
       * Claim the boat for this transaction before reading its availability.
       * This write is what makes two concurrent bookings of the same boat
       * conflict; without it the availability check is a range read that
       * nothing serializes against, and both callers see a free slot.
       */
      const boat = await Boats.findOneAndUpdate(
        { _id: boatId },
        { $inc: { bookingSeq: 1 } },
        { session, new: true }
      );
      if (!boat) throw boatNotFound;
      // A paused or deleted listing is still reachable by direct link, so the
      // booking path is where availability has to be enforced.
      if (boat.status !== boatStatus.ACTIVE) throw boatNotBookable;
      // If not captained remove captain price
      // if (!boat?.captained && this.captainPrice) delete this.captainPrice;

      const isAvailable = await this.constructor.checkAvailability({
        boatId,
        start,
        end,
        session,
      });

      if (!isAvailable) throw bookingNotAvailable;
      /** Check if the provided user exists */
      const user = await Users.findOne({ _id: renter }).session(session);
      if (!user || user.isDeleted) throw userNotFound;

      if (!boat?.owner) throw userNotFound;

      if (boat?.owner?.equals(renter)) throw invalidOperaton;
      /** Create Conversaton */
      const conversation = await Conversations({
        members: [boat?.owner, renter],
      });

      const savedConversation = await conversation.save({ session });

      this.owner = boat.owner;
      this.conversationId = savedConversation._id;
      reservation = await this.save({ session });
    });

    return reservation;
  } finally {
    await session.endSession();
  }
}
