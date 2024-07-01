import Offers from '../../../models/Offers';
import { components } from '../components/components';

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
      status: {
        components: {
          list: components.StatusButton,
          show: components.StatusButton,
        },
        isVisible: {
          list: true,
          edit: true,
          show: true,
          filter: true,
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
      captainPrice: {
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
