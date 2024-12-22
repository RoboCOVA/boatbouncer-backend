import { components } from '../components/components';
import Conversations from '../../../models/Conversations';
import Messages from '../../../models/Messages';

export const ConversationsResource = {
  resource: Conversations,
  options: {
    properties: {
      members: {
        isVisible: {
          show: true,
          edit: false,
          list: false,
          filter: false,
        },
      },
      member2: {
        components: { list: components.Members },
        isVisible: {
          list: true,
        },
      },
      member1: {
        components: { list: components.Members },
        isVisible: {
          list: true,
        },
      },
      createdAt: {
        isVisible: {
          show: true,
          edit: false,
          list: true,
          filter: false,
        },
      },
      updatedAt: {
        isVisible: {
          show: true,
          edit: false,
          list: true,
          filter: false,
        },
      },
      messages: {
        components: {
          show: components.Conversations,
        },
        isVisible: {
          list: false,
          show: true,
        },
      },
    },
    actions: {
      edit: {
        isVisible: false,
      },
      show: {
        handler: async (_, __, context) => {
          const { record, currentAdmin } = context;
          const conversationId = record.params._id;

          const messages = await Messages.getMessages({ conversationId });

          return {
            record: {
              ...record.toJSON(currentAdmin),
              messages,
            },
          };
        },
      },
      delete: { isVisible: false },
      new: { isVisible: false },
    },
  },
};
