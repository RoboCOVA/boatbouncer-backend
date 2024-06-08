import Boats from '../../../models/Boats';

export const BoatsResource = {
  resource: Boats,
  options: {
    properties: {
      _id: {
        isVisible: false,
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
          show: false,
          filter: false,
        },
      },
      description: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      manufacturer: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      model: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
      year: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: true,
        },
      },
    },
  },
};
