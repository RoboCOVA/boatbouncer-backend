import PaymentIntents from '../../../models/PaymentIntents';
import { components } from '../components/components';

export const PaymentResource = {
  resource: PaymentIntents,
  options: {
    properties: {
      _id: {
        isVisible: {
          list: false,
          show: true,
          edit: false,
          filter: false,
        },
        isEditable: false,
      },
      description: {
        isVisible: {
          list: false,
          show: true,
          edit: true,
          filter: false,
        },
      },
      payment_method_types: {
        isVisible: {
          list: false,
          show: true,
          edit: false,
          filter: false,
        },
      },
      'metadata.offerId': {
        isVisible: {
          list: false,
          show: true,
          edit: false,
          filter: true,
        },
      },
      customer: {
        isVisible: {
          list: false,
          show: true,
          edit: false,
          filter: true,
        },
      },
      amount: {
        isVisible: {
          list: true,
          show: true,
          edit: false,
          filter: true,
        },
      },
      intentId: {
        isVisible: {
          list: true,
          show: true,
          edit: false,
          filter: true,
        },
      },
      status: {
        type: 'string',
        components: {
          list: components.StatusButton,
          show: components.StatusButton,
        },
      },
      currency: {
        type: 'string',
        components: {
          list: components.CurrencyButton,
          show: components.CurrencyButton,
        },
      },
    },
    actions: {
      delete: {
        isVisible: false,
      },
      new: { isVisible: false },
    },
  },
};
