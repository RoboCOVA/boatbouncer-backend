import { getPaginationValues } from '../../utils';
import { boatDeleteFailed, boatNotFound, boatUpdateFailed } from './errors';

/**
 * It returns a list of boats, with a total count of all boats, based on the page number and size of
 * the page.
 * @returns An object with two properties: data and total.
 */
export async function getBoats({ pageNo, size, userId, filter }) {
  const { boatName, address, city, state, captained, category, subCategory } =
    filter || {};
  const { skip, limit } = getPaginationValues(pageNo, size);
  const query = {};
  if (userId) query.owner = userId;

  if (boatName) query.boatName = { $regex: boatName, $options: 'i' };
  if (address) query['location.address'] = { $regex: address, $options: 'i' };
  if (city) query['location.city'] = { $regex: city, $options: 'i' };
  if (state) query['location.state'] = { $regex: state, $options: 'i' };
  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (typeof captained === 'boolean') query.captained = captained;
  else if (captained) query.captained = captained;

  const boats = await this.find(
    query,
    {},
    { skip, limit, sort: { createdAt: -1 } }
  );
  const total = await this.count(query);
  return { data: boats, total };
}

export async function getBoatListings({ pageNo, size, userId, filter }) {
  const { boatName, address, city, state, captained, category, subCategory } =
    filter || {};
  const { skip, limit } = getPaginationValues(pageNo, size);
  const query = {};
  query.owner = userId;

  if (boatName) query.boatName = { $regex: boatName, $options: 'i' };
  if (address) query['location.address'] = { $regex: address, $options: 'i' };
  if (city) query['location.city'] = { $regex: city, $options: 'i' };
  if (state) query['location.state'] = { $regex: state, $options: 'i' };
  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (typeof captained === 'boolean') query.captained = captained;
  else if (captained) query.captained = captained;

  const boats = await this.find(
    query,
    {},
    { skip, limit, sort: { createdAt: -1 } }
  );
  const total = await this.count(query);
  return { data: boats, total };
}

/**
 * It finds a boat by its id and returns it
 * @returns The boat object
 */
export async function getBoat({ boatId }) {
  const boat = await this.findOne({ _id: boatId });
  if (!boat) throw boatNotFound;
  return boat;
}

export async function updateBoat(matchQuery, updateObject) {
  const boatUpdate = await this.findOneAndUpdate(matchQuery, updateObject, {
    new: true,
  });
  if (!boatUpdate) throw boatUpdateFailed;
  return boatUpdate;
}

export async function deleteBoat({ boatId, userId }) {
  const removedBoat = await this.findOneAndRemove({
    _id: boatId,
    owner: userId,
  });
  if (!removedBoat) throw boatDeleteFailed;
  return removedBoat;
}
