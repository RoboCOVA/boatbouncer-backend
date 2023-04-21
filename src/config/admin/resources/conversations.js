import Conversations from '../../../models/Conversations';

export const ConversationsResource = {
  resource: Conversations,
  options: {
    properties: {
      members: {
        isVisible: {
          show: true,
          edit: false,
          list: true,
          filter: false,
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
    },
    actions: {
      edit: {
        isVisible: false,
      },
      delete: { isVisible: false },
      new: { isVisible: false },
    },
  },
};
