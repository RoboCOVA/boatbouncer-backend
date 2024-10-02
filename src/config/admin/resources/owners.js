import Boats from '../../../models/Boats';
import { components } from '../components/components';
import { boatersProperties } from '../utils/properties';

export const OwnersResource = {
  resource: Boats,
  options: {
    id: 'Owners',
    properties: {
      userName: {
        type: 'string',
        components: {
          list: components.OwnerInfo,
          show: components.OwnerInfo,
        },
        props: {
          name: 'userName',
        },
        isVisible: {
          edit: false,
          show: true,
        },
        custom: {
          color: 'red',
        },
      },
      email: {
        type: 'string',
        components: {
          list: components.OwnerInfo,
          show: components.OwnerInfo,
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
          list: components.OwnerInfo,
          show: components.OwnerInfo,
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
          list: components.OwnerInfo,
          show: components.OwnerInfo,
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
          list: components.OwnerInfo,
          show: components.OwnerInfo,
        },
        isVisible: {
          edit: false,
          show: true,
        },
        props: {
          name: 'phoneNumber',
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
      'email',
      'First Name',
      'Last Name',
      'Phone Number',
      'boatName',
      'status',
    ],
  },
};
