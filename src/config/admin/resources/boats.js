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
        availableValues: [
          { value: true, label: 'Yes' },
          { value: null, label: 'No' },
        ],
      },
      avgResponseTime: {
        type: 'string',
        isVisible: {
          list: true,
          edit: false,
          show: true,
          filter: true,
        },
        components: {
          list: components.ResponseTime,
          show: components.ResponseTime,
        },
        availableValues: [
          { value: 'lessThanOneMinute', label: 'Less than a minute' },
          { value: 'oneToTwoMinutes', label: '1 to 2 minutes' },
          { value: 'twoToFiveMinutes', label: '2 to 5 minutes' },
          { value: 'fiveToTenMinutes', label: '5 to 10 minutes' },
          { value: 'moreThanTenMinutes', label: 'More than 10 minutes' },
        ],
      },
    },
    actions: {
      list: {
        before: async (request) => {
          const avgResponseTime = request.query['filters.avgResponseTime'];

          if (avgResponseTime) {
            switch (avgResponseTime) {
              case 'lessThanOneMinute':
                request.query['filters.avgResponseTime~~$lt'] = 60000;
                break;
              case 'oneToTwoMinutes':
                request.query['filters.avgResponseTime~~$gt'] = 60000;
                request.query['filters.avgResponseTime~~$lt'] = 120000;
                break;
              case 'twoToFiveMinutes':
                request.query['filters.avgResponseTime~~$gt'] = 120000;
                request.query['filters.avgResponseTime~~$lt'] = 300000;
                break;
              case 'fiveToTenMinutes':
                request.query['filters.avgResponseTime~~$gt'] = 300000;
                request.query['filters.avgResponseTime~~$lt'] = 600000;
                break;
              case 'moreThanTenMinutes':
                request.query['filters.avgResponseTime~~$gt'] = 600000;
                break;
              default:
                break;
            }
          }

          delete request.query['filters.avgResponseTime'];

          return request;
        },
      },
    },
  },
};
