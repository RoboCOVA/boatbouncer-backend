import bcrypt from 'bcrypt';
import Adminstrators from '../../../models/Adminstrators';

export const AdminResource = {
  resource: Adminstrators,
  options: {
    properties: {
      _id: { isVisible: false },
      password: {
        type: 'custom',
        label: 'Password',
        isVisible: {
          show: false,
          edit: true,
          list: false,
          filter: false,
        },
      },
      createdAt: { isVisible: false },
      updatedAt: { isVisible: false },
    },
    actions: {
      new: {
        before: async (request) => {
          if (request?.payload?.password) {
            request.payload = {
              ...request.payload,
              password: await bcrypt.hash(request.payload.password, 10),
            };
          }
          return request;
        },
      },
      edit: {
        before: async (request) => {
          if (request?.payload?.password) {
            request.payload = {
              ...request.payload,
              password: await bcrypt.hash(request.payload.password, 10),
            };
            delete request.payload.password;
          }
          return request;
        },
      },
    },
  },
};
