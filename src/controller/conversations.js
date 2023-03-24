import Conversations from '../models/Conversations';

export const createConversationController = async (req, res, next) => {
  try {
    const { userOne, userTwo } = req.body;
    const conversation = new Conversations({
      members: [userOne, userTwo],
    });

    const savedConversation = await conversation.createConversation();
    res.send(savedConversation);
  } catch (error) {
    next(error);
  }
};

export const getConversationController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const conversation = await Conversations.getConversation({ userId });
    res.send(conversation);
  } catch (error) {
    next(error);
  }
};
