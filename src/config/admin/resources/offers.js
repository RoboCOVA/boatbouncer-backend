import Offers from '../../../models/Offers';

export const OfferResource = {
  resource: Offers,
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
