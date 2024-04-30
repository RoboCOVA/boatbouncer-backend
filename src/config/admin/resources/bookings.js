import Bookings from '../../../models/Bookings';

export const BookingResource = {
  resource: Bookings,
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
