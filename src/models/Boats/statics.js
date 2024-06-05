import { getPaginationValues } from '../../utils';
import { boatDeleteFailed, boatNotFound, boatUpdateFailed } from './errors';
import Bookings from '../Bookings';
import { bookingStatus } from '../../utils/constants';

/**
 * It returns a list of boats, with a total count of all boats, based on the page number and size of
 * the page.
 * @returns An object with two properties: data and total.
 */
export async function getBoats({ pageNo, size, filter }) {
  const {
    boatName,
    captained,
    category,
    subCategory,
    features,
    coordinates,
    bbox,
  } = filter || {};
  const { skip, limit } = getPaginationValues(pageNo, size);

  const match = {};

  /** Temporarily disabled filters */
  // if (city) match['location.city'] = { $regex: city.trim(), $options: 'i' };
  // if (state) match['location.state'] = { $regex: state.trim(), $options: 'i' };
  // if (address)
  //   match['location.address'] = { $regex: address.trim(), $options: 'i' };
  /** Temporarily disabled filters */

  if (features) match.features = { $regex: features.trim(), $options: 'i' };
  if (category) match.category = { $regex: category.trim(), $options: 'i' };
  if (boatName) match.boatName = { $regex: boatName.trim(), $options: 'i' };
  if (subCategory)
    match.subCategory = { $regex: subCategory.trim(), $options: 'i' };
  if (typeof captained === 'boolean') match.captained = captained;

  if (bbox?.length && Array.isArray(bbox)) {
    const boundingBox = [
      [bbox?.[2] || 180, bbox?.[3] || 90],
      [bbox?.[0] || -180, bbox?.[1] || 0],
    ];
    match.latLng = {
      $geoWithin: {
        $box: boundingBox,
      },
    };
  }

  const aggregationQuery = [
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'favorites',
        let: {
          boatId: '$_id',
          owner: '$owner',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$boat', '$$boatId'],
                  },
                  {
                    $eq: ['$user', '$$owner'],
                  },
                ],
              },
            },
          },
        ],
        as: 'favorite',
      },
    },
    {
      $unwind: {
        path: '$favorite',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        isFavorite: {
          $cond: [
            {
              $ifNull: ['$favorite', false],
            },
            true,
            false,
          ],
        },
        boatName: 1,
        boatType: 1,
        description: 1,
        manufacturer: 1,
        model: 1,
        year: 1,
        length: 1,
        amenities: 1,
        imageUrls: 1,
        owner: 1,
        location: 1,
        latLng: 1,
        category: 1,
        subCategory: 1,
        currency: 1,
        features: 1,
        pricing: 1,
        securityAllowance: 1,
        captained: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
        metadata: [
          {
            $count: 'total',
          },
        ],
      },
    },
    {
      $project: {
        data: 1,
        total: {
          $arrayElemAt: ['$metadata.total', 0],
        },
      },
    },
  ];

  // If no bounding box and coordinate is present
  if (
    !Array.isArray(bbox) &&
    !bbox?.length &&
    coordinates?.longitude &&
    coordinates?.latitude
  )
    aggregationQuery.unshift({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [coordinates?.longitude, coordinates?.latitude],
        },
        distanceField: 'distance',
        maxDistance: 50 * 1609.34, // 50 miles
        key: 'latLng',
        spherical: true,
      },
    });

  const boats = await this.aggregate(aggregationQuery);
  return boats;
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

  // get copy of boats
  const copyOfBoats = JSON.parse(JSON.stringify(boats));
  // add booked count to each boat
  await Promise.all(
    copyOfBoats.map(async (boat) => {
      const matchQuery = {
        boatId: { $in: boat._id },
        status: { $nin: [bookingStatus.CANCELLED] },
      };
      const numofboatbooked = await Bookings.countDocuments(matchQuery);
      // eslint-disable-next-line no-param-reassign
      boat.count = numofboatbooked;
      return boat;
    })
  );

  const total = await this.count(query);
  return { data: copyOfBoats, total };
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
