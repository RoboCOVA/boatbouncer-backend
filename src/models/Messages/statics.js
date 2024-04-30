export async function getMessages({ conversationId }) {
  const message = await this.find({ conversation: conversationId }).populate([
    {
      path: 'conversation',
      populate: {
        path: 'members',
        select: 'userName',
      },
    },
  ]);
  return message;
}
