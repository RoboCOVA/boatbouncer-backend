export async function getMessages({ conversationId }) {
  const message = await this.find({ conversation: conversationId });
  return message;
}
