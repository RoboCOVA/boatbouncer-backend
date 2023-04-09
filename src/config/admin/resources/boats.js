import Boats from '../../../models/Boats';

export const BoatsResource = {
  resource: Boats,
  options: {
    properties: {
      _id: {
        isVisible: {
          list: false,
          edit: false,
          show: true,
          filter: false,
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
  },
};
