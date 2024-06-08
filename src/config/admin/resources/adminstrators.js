import Adminstrators from '../../../models/Adminstrators';

export const AdminResource = {
  resource: Adminstrators,
  options: {
    properties: {
      _id: { isVisible: false },
      createdAt: { isVisible: false },
      updatedAt: { isVisible: false },
      password: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
    },
  },
};
