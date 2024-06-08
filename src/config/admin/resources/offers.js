import Offers from '../../../models/Offers';

export const OfferResource = {
  resource: Offers,
  options: {
    properties: {
      _id: {
        isVisible: false,
      },
      bookId: {
        isVisible: {
          list: false,
          edit: false,
          show: true,
          filter: false,
        },
      },
      paymentServiceFee: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      localTax: {
        isVisible: {
          list: false,
          edit: true,
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
