import { modelNames } from '../constants';
import { userNotFound } from '../Users/errors';

export async function createConversation() {
  const { members } = this;
  const Users = this.model(modelNames.USERS);

  /** Check if user exists */
  let exsitingUser = true;
  await Promise.all(
    members.map(async (_id) => {
      const user = await Users.findOne({ _id });
      if (!user) exsitingUser = false;
    })
  );
  if (!exsitingUser) throw userNotFound;
  const conversationEntry = await this.save();
  return conversationEntry;
}
