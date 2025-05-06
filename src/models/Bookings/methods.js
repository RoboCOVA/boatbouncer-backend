import { startSession } from 'mongoose';
import compareAsc from 'date-fns/compareAsc';
import { modelNames } from '../constants';
import {
  boatNotFound,
  bookingNotAvailable,
  invalidDateRange,
  invalidOperaton,
} from './errors';
import { userNotFound } from '../Users/errors';

export async function createBooking() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const session = await startSession();
    const Boats = this.model(modelNames.BOATS);
    const Users = this.model(modelNames.USERS);
    const Conversations = this.model(modelNames.CONVERSATIONS);

    try {
      await session.withTransaction(async () => {
        const { boatId, renter, duration } = this;

        /** Check if the given range is valid */
        const { start, end } = duration;
        const result = compareAsc(new Date(end), new Date(start));
        if (result === -1) throw invalidDateRange;

        /** Check if the boat exists */
        const boat = await Boats.findOne({ _id: boatId });
        if (!boat) throw boatNotFound;
        // If not captained remove captain price
        // if (!boat?.captained && this.captainPrice) delete this.captainPrice;

        const isAvailable = await this.constructor.checkAvailability({
          boatId,
          start,
          end,
        });

        if (!isAvailable) throw bookingNotAvailable;
        /** Check if the provided user exists */
        const user = await Users.findOne({ _id: renter });
        if (!user) throw userNotFound;

        if (!boat?.owner) throw userNotFound;

        if (boat?.owner?.equals(renter)) throw invalidOperaton;
        /** Create Conversaton */
        const conversation = await Conversations({
          members: [boat?.owner, renter],
        });

        const savedConversation = await conversation.save({ session });

        this.owner = boat.owner;
        this.conversationId = savedConversation._id;
        const reservation = await this.save({ session });

        await session.commitTransaction();
        resolve(reservation);
      });
    } catch (error) {
      await session.endSession();
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}
