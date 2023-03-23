export async function getConversation({ userId }) {
  const conversation = await this.find({
    members: { $in: [userId] },
  }).populate('members');

  const members = conversation.reduce((accumulator, current) => {
    if (Array.isArray(current?.members)) {
      const user = current.members.filter(
        (member) => !member?._id?.equals(userId)
      );
      const member = user?.[0];
      member.convoId = current?._id;
      accumulator.push(member);
    }
    return accumulator;
  }, []);

  return members?.map((member) => {
    const { email, userName, firstName, lastName, phoneNumber, convoId, _id } =
      member;
    return {
      email,
      userName,
      firstName,
      lastName,
      phoneNumber,
      _id: convoId,
      userId: _id,
    };
  });
}
