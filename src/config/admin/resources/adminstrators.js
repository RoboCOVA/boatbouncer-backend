import bcrypt from 'bcrypt';
import Admin from '../../../models/Adminstrators';
import { components } from '../components/components';

export const AdminResource = {
  resource: Admin,
  options: {
    properties: {
      _id: { isVisible: false },
      password: {
        isVisible: {
          show: false,
          edit: false,
          list: false,
          filter: false,
        },
      },
      newPassword: {
        type: 'password',
        label: 'Password',
        isVisible: {
          show: false,
          edit: true,
          list: false,
          filter: false,
        },
        props: {
          placeholder: 'Enter new password to change',
        },
      },
      super: {
        type: 'string',
        components: {
          list: components.SuperButton,
          show: components.SuperButton,
          edit: components.EditButton,
        },
        isVisible: {
          list: true,
          show: true,
          edit: true,
          filter: false,
        },
        availableValues: [
          { value: true, label: 'Yes' },
          { value: null, label: 'No' },
        ],
      },
      createdAt: { isVisible: false },
      updatedAt: { isVisible: false },
    },
    actions: {
      list: {
        before: async (request, context) => {
          const { currentAdmin } = context;

          if (!currentAdmin.super) {
            request.query = {
              ...request.query,
              'filters.email': currentAdmin.email,
            };
          }
          return request;
        },
      },
      edit: {
        isAccessible: ({ currentAdmin, record }) => {
          if (currentAdmin.super) return true;
          return currentAdmin._id.toString() === record.params._id.toString();
        },
        before: async (request, context) => {
          const { currentAdmin } = context;

          if (!currentAdmin.super) {
            delete request.payload.super;
          }

          if (request?.payload?.newPassword) {
            request.payload = {
              ...request.payload,
              password: await bcrypt.hash(request.payload.newPassword, 10),
            };
          }

          return request;
        },
      },
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin.super,
        before: async (request) => {
          if (request?.payload?.newPassword) {
            request.payload = {
              ...request.payload,
              password: await bcrypt.hash(request.payload.newPassword, 10),
            };
          }

          return request;
        },
      },
      delete: {
        isAccessible: ({ currentAdmin, record }) => {
          const currentAdminId = currentAdmin._id.toString();
          const deleteAdminId = record.params._id;

          return currentAdmin.super && currentAdminId !== deleteAdminId;
        },
      },
      show: {
        isAccessible: ({ currentAdmin, record }) => {
          if (currentAdmin.super) return true;
          return currentAdmin._id.toString() === record.params._id.toString();
        },
      },
    },
    isAccessible: true,
  },
};
