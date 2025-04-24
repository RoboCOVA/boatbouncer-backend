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
    const { user } = req;
    const { conversationId } = req.params;
    const message = await Messages.getMessages({
      conversationId,
      userId: user?.id,
    });
    res.send(message);
  } catch (error) {
    next(error);
  }
};

export const readMessageController = async (req, res, next) => {
  try {
    const { user } = req;
    const { messageId } = req.params;
    const message = await Messages.readMessage({ messageId, userId: user?.id });
    res.send(message);
  } catch (error) {
    next(error);
  }
};

export const deleteMessageController = async (req, res, next) => {
  try {
    const { user } = req;
    const { messageId } = req.params;
    const message = await Messages.deleteMessage({
      messageId,
      userId: user?.id,
    });
    res.send(message);
  } catch (error) {
    next(error);
  }
};

export const getUnMessgesCountController = async (req, res, next) => {
  try {
    const { user } = req;
    const newMessageCount = await Messages.getUnreadMessagesCount({
      userId: user?.id,
    });
    res.send({ newMessageCount });
  } catch (error) {
    next(error);
  }
};
