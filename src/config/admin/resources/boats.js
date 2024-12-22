import { categoriesEnum, subCategoriesEnum } from '../../../models/constants';
import { boatFeaturesEnum } from '../../../utils/constants';
import { components } from '../components/components';
import Boats from '../../../models/Boats';

export const BoatsResource = {
  resource: Boats,
  options: {
    properties: {
      _id: {
        isVisible: false,
      },
      amenities: {
        type: 'array',
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
        components: {
          show: components.MyImage,
          edit: components.MyImage,
        },
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
      status: {
        type: 'string',
        components: {
          list: components.StatusButton,
          show: components.StatusButton,
        },
      },
      category: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
        availableValues: Object.entries(categoriesEnum).map(([, value]) => ({
          value,
          label: value,
        })),
      },
      subCategory: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
        availableValues: Object.entries(subCategoriesEnum).map(([, value]) => ({
          value,
          label: value,
        })),
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
        type: 'array',
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
        availableValues: Object.entries(boatFeaturesEnum).map(
          ([key, value]) => ({
            value: key,
            label: value,
          })
        ),
      },
      securityAllowance: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
          filter: false,
        },
      },
      cancelationPolicy: {
        isVisible: {
          list: false,
          edit: true,
          show: true,
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
      searchable: {
        type: 'string',
        components: {
          list: components.BooleanButton,
          show: components.BooleanButton,
        },
      },
    },
  },
};
