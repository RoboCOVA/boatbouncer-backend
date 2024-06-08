import Bookings from '../../../models/Bookings';

export const BookingResource = {
  resource: Bookings,
  options: {
    properties: {
      _id: {
        isVisible: {
          list: false,
          edit: false,
          show: false,
          filter: false,
        },
      },
      owner: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      renter: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      offerId: {
        isVisible: {
          list: false,
          edit: false,
          show: true,
          filter: false,
        },
      },
      conversationId: {
        isVisible: {
          list: false,
          edit: false,
          show: true,
          filter: false,
        },
      },
      renterPrice: {
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
