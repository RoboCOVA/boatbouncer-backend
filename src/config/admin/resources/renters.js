import Bookings from '../../../models/Bookings';
import { components } from '../components/components';
import { boatersProperties } from '../utils/properties';

export const RentersResource = {
  resource: Bookings,
  options: {
    id: 'Renters',
    properties: {
      userName: {
        type: 'string',
        components: {
          list: components.RenterInfo,
          show: components.RenterInfo,
        },
        props: {
          name: 'userName',
        },
        isVisible: {
          edit: false,
          show: true,
        },
      },
      Email: {
        type: 'string',
        components: {
          list: components.RenterInfo,
          show: components.RenterInfo,
        },
        isVisible: {
          edit: false,
          show: true,
        },
        props: {
          name: 'email',
        },
      },
      'First Name': {
        type: 'string',
        components: {
          list: components.RenterInfo,
          show: components.RenterInfo,
        },
        isVisible: {
          edit: false,
          show: true,
        },
        props: {
          name: 'firstName',
        },
      },
      'Last Name': {
        type: 'string',
        components: {
          list: components.RenterInfo,
          show: components.RenterInfo,
        },
        isVisible: {
          edit: false,
          show: true,
        },
        props: {
          name: 'lastName',
        },
      },
      'Phone Number': {
        type: 'string',
        components: {
          list: components.RenterInfo,
          show: components.RenterInfo,
        },
        isVisible: {
          edit: false,
          show: true,
        },
        props: {
          name: 'phoneNumber',
        },
      },
      'Boat Name': {
        type: 'string',
        components: {
          list: components.RenterInfo,
          show: components.RenterInfo,
        },
        isVisble: {
          edit: false,
          show: true,
          list: true,
        },
        props: {
          name: 'boatName',
        },
      },
      status: {
        type: 'string',
        components: {
          list: components.StatusButton,
          show: components.StatusButton,
        },
      },
    },
    ...boatersProperties,
    listProperties: [
      'userName',
      'Email',
      'First Name',
      'Last Name',
      'Phone Number',
      'Boat Name',
      'status',
    ],
  },
};
