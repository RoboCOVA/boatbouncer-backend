import Messages from '../models/Messages';

export const createMessageController = async (req, res, next) => {
  try {
    const { conversation, sender, text } = req.body;
    const message = new Messages({
      conversation,
      sender,
      text,
    });

    const savedMessage = await message.createMessage();
    res.send(savedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessagesController = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const message = await Messages.getMessages({ conversationId });
    res.send(message);
  } catch (error) {
    next(error);
  }
};
