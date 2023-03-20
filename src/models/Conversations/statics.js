export async function getConversation({ userId }) {
  const conversation = await this.find({
    members: { $in: [userId] },
  }).populate('members');

  const members = conversation.reduce((accumulator, current) => {
    if (Array.isArray(current?.members)) {
      const user = current.members.filter(
        (member) => !member?._id?.equals(userId)
      );
      accumulator.push(...user);
    }
    return accumulator;
  }, []);

  return members?.map((member) => {
    const { email, userName, firstName, lastName, phoneNumber } = member;
    return { email, userName, firstName, lastName, phoneNumber };
  });
}
