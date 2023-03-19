export async function getConversation({ userId }) {
  const conversation = await this.find({
    memebers: { $in: [userId] },
  }).populate('members');
  return conversation;
}
