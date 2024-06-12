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
        isVisible: false,
      },
      updatedAt: {
        isVisible: false,
      },
    },
    actions: {},
  },
};
