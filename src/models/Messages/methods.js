import Boats from '../Boats';
import { boatNotFound } from '../Boats/errors';
import Bookings from '../Bookings';
import { bookingNotAvailable } from '../Bookings/errors';
import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';
import { conversationNotFound } from './errors';

export async function createMessage() {
  const { conversation, sender } = this;
  const Conversations = this.model(modelNames.CONVERSATIONS);
  const Users = this.model(modelNames.USERS);
  const Messages = this.model(modelNames.MESSAGES);

  const existingUser = await Users.findOne({ _id: sender });
  if (!existingUser) throw userNotFound;

  const existingConvo = await Conversations.findOne({ _id: conversation });
  if (!existingConvo) throw conversationNotFound;

  try {
    const booking = await Bookings.findOne({ conversationId: conversation });
    if (booking) throw bookingNotAvailable;

    const { renter, owner, boatId } = booking;

    if (sender.equals(owner)) {
      const firstRenterMessage = await Messages.findOne({
        conversation,
        sender: renter,
      }).sort({ createdAt: 1 });

      if (firstRenterMessage) {
        const renterTimestamp = firstRenterMessage.createdAt;

        // Step 2: Get the first owner message after renter's timestamp
        const firstOwnerMessageAfterRenter = await Messages.findOne({
          conversation,
          sender: owner,
          createdAt: { $gt: renterTimestamp },
        }).sort({ createdAt: 1 });

        if (!firstOwnerMessageAfterRenter) {
          // Calculate the time difference if no owner message exists after renter's message
          const timeDifference = Date.now() - renterTimestamp.getTime();
          const boat = await Boats.findOne({ _id: boatId });

          if (!boat) throw boatNotFound;

          const { avgResponseTime } = boat;
          let tempAvgResponseTime;

          if (!avgResponseTime) {
            tempAvgResponseTime = timeDifference;
          } else {
            tempAvgResponseTime = (timeDifference + avgResponseTime) / 2;
          }

          // Update the avgResponseTime in the database
          await Boats.updateOne(
            { _id: boatId },
            { $set: { avgResponseTime: tempAvgResponseTime } }
          );
        }
      }
    }
  } catch (error) {
    console.log('error occured when calculating average response time.');
  }

  const messages = await this.save();
  return messages;
}
