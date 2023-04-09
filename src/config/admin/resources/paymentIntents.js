import PaymentIntents from '../../../models/PaymentIntents';

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
      'paymentMethod.card.exp_month': {
        isVisible: {
          list: false,
          show: true,
          edit: false,
          filter: true,
        },
      },
      'paymentMethod.card.exp_year': {
        isVisible: {
          list: false,
          show: true,
          edit: false,
          filter: true,
        },
      },
      'paymentMethod.type': {
        isVisible: {
          list: false,
          show: true,
          edit: false,
          filter: true,
        },
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
      'paymentMethod.card.number': {
        isVisible: {
          list: true,
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
      currency: {
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
      'paymentMethod.card.cvc': {
        isVisible: {
          list: true,
          show: true,
          edit: false,
          filter: true,
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
