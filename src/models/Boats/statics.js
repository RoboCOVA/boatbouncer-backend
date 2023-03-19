import { getPaginationValues } from '../../utils';
import { boatDeleteFailed, boatNotFound, boatUpdateFailed } from './errors';

/**
 * It returns a list of boats, with a total count of all boats, based on the page number and size of
 * the page.
 * @returns An object with two properties: data and total.
 */
export async function getBoats({ pageNo, size }) {
  const { skip, limit } = getPaginationValues(pageNo, size);
  const query = {};
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
