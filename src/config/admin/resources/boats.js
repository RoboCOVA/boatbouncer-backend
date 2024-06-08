import Boats from '../../../models/Boats';

export const BoatsResource = {
  resource: Boats,
  options: {
    properties: {
      _id: {
        isVisible: false,
      },
      amenities: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      'location.city': {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      'location.state': {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      'location.zipCode': {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      imageUrls: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      'latLng.type': {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      'latLng.coordinates': {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      pricing: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      category: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      subCategory: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      currency: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      features: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      securityAllowance: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      captained: {
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
