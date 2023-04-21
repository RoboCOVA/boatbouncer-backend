import Settings from '../../../models/Settings';

export const SettingsResource = {
  resource: Settings,
  options: {
    properties: {
      platformCut: {
        type: 'number',
        label: 'Platform cut (in %)',
        isVisible: {
          show: true,
          edit: true,
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
    actions: {},
  },
};
