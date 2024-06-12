import bcrypt from 'bcrypt';
import Users from '../../../models/Users';

export const UsersResource = {
  resource: Users,
  options: {
    properties: {
      newPassword: {
        type: 'custom',
        label: 'New Password',
        isVisible: {
          show: false,
          edit: true,
          list: false,
          filter: false,
        },
      },
      _id: {
        isVisible: false,
      },
      profilePicture: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      password: {
        isVisible: false,
      },
      firstName: {
        isVisible: {
          list: true,
          edit: true,
          show: true,
          filter: true,
        },
      },
      email: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      lastName: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      city: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      state: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      zipCode: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      session: {
        isVisible: false,
      },
      stripeAccountId: {
        isVisible: {
          list: false,
          edit: false,
          show: true,
          filter: true,
        },
      },
      stripeCustomerId: {
        isVisible: {
          list: false,
          edit: false,
          show: true,
          filter: true,
        },
      },
      chargesEnabled: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      createdAt: {
        isVisible: {
          list: false,
          edit: false,
          show: true,
          filter: true,
        },
      },
      updatedAt: {
        isVisible: {
          list: false,
          edit: false,
          show: true,
          filter: true,
        },
      },
    },
    actions: {
      edit: {
        before: async (request) => {
          if (request?.payload?.newPassword) {
            request.payload = {
              ...request.payload,
              password: await bcrypt.hash(request.payload.newPassword, 10),
            };
            delete request.payload.newPassword;
          }
          return request;
        },
      },
    },
  },
};
