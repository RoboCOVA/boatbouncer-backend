import { generateEnumArrayFromObject } from '../../utils';

export const notificationActionTypes = {
  UPDATE: 'UPDATE',
  CREATE: 'CREATE',
  READ: 'READ',
  DELETE: 'DELETE',
};

export const notificationActionTypesEnum = generateEnumArrayFromObject(
  notificationActionTypes
);
