import Conversations from '../models/Conversations';

export const createConversationController = async (req, res, next) => {
  try {
    const { userOne, userTwo } = req.body;
    const conversation = new Conversations({
      memebers: [userOne, userTwo],
    });

    const savedConversation = await conversation.createMessage();
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
