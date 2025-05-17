/* eslint-disable */
import { ObjectId } from 'mongodb';
import { getPaginationValues } from '../../utils';
import { boatStatus, bookingStatus } from '../../utils/constants';
import Bookings from '../Bookings';
import {
  boatDeleteFailed,
  boatNameUsed,
  boatNotFound,
  boatUpdateFailed,
  updatelistingTypeNotAllowed,
} from './errors';
//   const Conversations = this.model(modelNames.CONVERSATIONS);
/**
 * It returns a list of boats, with a total count of all boats, based on the page number and size of
 * the page.
 * @returns An object with two properties: data and total.
 */
export async function getBoats({ pageNo, size, filter }) {
  const {
    boatName,
    address,
    city,
    state,
    listingType,
    boatTypes,
    activityTypes,
    coordinates,
    features,
    maxPassengers,
    bbox,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    radius = 50,
  } = filter || {};
  const { skip, limit } = getPaginationValues(pageNo, size);

  const match = {};

  /** Temporarily disabled filters */
  match.searchable = true;
  /** Temporarily disabled filters */

  match.status = { $regex: 'active', $options: 'i' };
  if (listingType)
    match.listingType = { $regex: listingType.trim(), $options: 'i' };
  if (features && Array.isArray(features) && features.length > 0) {
    match.features = { $in: features.map((f) => f.trim()) };
  }
  if (boatTypes && Array.isArray(boatTypes) && boatTypes.length > 0) {
    match.boatType = { $in: boatTypes.map((f) => f.trim()) };
  }

  if (
    activityTypes &&
    Array.isArray(activityTypes) &&
    activityTypes.length > 0
  ) {
    const typesToMatch = activityTypes.map((item) => {
      if (typeof item === 'object' && item.activityType) {
        return item.activityType.trim();
      }
      return item.trim();
    });

    match['activityTypes.type'] = { $in: typesToMatch };
  }

  if (maxPassengers) {
    match.maxPassengers = { $gte: parseFloat(maxPassengers) };
  }

  if (listingType && listingType === 'activity') {
    if (minPrice || maxPrice) {
      match['pricing.perPerson'] = {};

      if (minPrice) {
        match['pricing.perPerson'].$gte = Number(minPrice);
      }

      if (maxPrice) {
        match['pricing.perPerson'].$lte = Number(maxPrice);
      }
    }
  }
  if (listingType && listingType === 'rental') {
    if (minPrice || maxPrice) {
      const priceConditions = [];

      if (minPrice) {
        priceConditions.push({
          $or: [
            { 'pricing.perHour': { $gte: Number(minPrice) } },
            { 'pricing.perDay': { $gte: Number(minPrice) } },
          ],
        });
      }

      if (maxPrice) {
        priceConditions.push({
          $or: [
            { 'pricing.perHour': { $lte: Number(maxPrice) } },
            { 'pricing.perDay': { $lte: Number(maxPrice) } },
          ],
        });
      }

      if (priceConditions.length > 0) {
        match.$and = priceConditions;
      }
    }
  }

  if (!listingType) {
    if (minPrice || maxPrice) {
      const priceConditions = [];

      if (minPrice) {
        priceConditions.push({
          $or: [
            { 'pricing.perHour': { $gte: Number(minPrice) } },
            { 'pricing.perDay': { $gte: Number(minPrice) } },
            { 'pricing.perPerson': { $gte: Number(minPrice) } },
          ],
        });
      }

      if (maxPrice) {
        priceConditions.push({
          $or: [
            { 'pricing.perHour': { $lte: Number(maxPrice) } },
            { 'pricing.perDay': { $lte: Number(maxPrice) } },
            { 'pricing.perPerson': { $lte: Number(minPrice) } },
          ],
        });
      }

      if (priceConditions.length > 0) {
        match.$or = priceConditions;
      }
    }
  }

  // if (category) match.category = { $regex: category.trim(), $options: 'i' };
  // if (subCategory)
  //   match.subCategory = { $regex: subCategory.trim(), $options: 'i' };
  // if (typeof captained === 'boolean') match.captained = captained;
  // if (typeof searchable === 'boolean') match.searchable = searchable;

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
  } else {
    if (boatName) match.boatName = { $regex: boatName.trim(), $options: 'i' };
    if (city) match['location.city'] = { $regex: city.trim(), $options: 'i' };
    if (state)
      match['location.state'] = { $regex: state.trim(), $options: 'i' };
    if (address)
      match['location.address'] = { $regex: address.trim(), $options: 'i' };
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
      $lookup: {
        from: 'bookings',
        let: { boatId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$boatId', '$$boatId'] },
              status: { $nin: ['Cancelled', 'Completed'] },
            },
          },
          {
            $project: {
              _id: 1,
              duration: 1,
              status: 1,
            },
          },
        ],
        as: 'bookings',
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
        bookings: 1,
        boatName: 1,
        boatType: 1,
        status: 1,
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
        currency: 1,
        features: 1,
        pricing: 1,
        securityAllowance: 1,
        searchable: 1,
        listingType: 1,
        maxPassengers: 1,
        agreementInfo: 1,
        address: 1,
        activityTypes: 1,
        cancelationPolicy: 1,
        avgResponseTime: 1,
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

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date order
    if (start >= end) {
      throw new Error('End date must be after start date');
    }

    // Add lookup for conflicting bookings
    aggregationQuery.unshift(
      {
        $lookup: {
          from: 'bookings',
          let: { boatId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$boatId', '$$boatId'] },
                    { $lt: ['$duration.start', new Date(endDate)] },
                    { $gt: ['$duration.end', new Date(startDate)] },
                  ],
                },
                status: { $nin: ['Cancelled', 'Completed'] }, // case-sensitive check
              },
            },
          ],
          as: 'conflictingBookings',
        },
      },
      {
        $match: {
          conflictingBookings: { $size: 0 },
        },
      }
    );

    // Debugging: Add this temporary stage to see conflicts
    aggregationQuery.unshift({
      $addFields: {
        debugConflicts: {
          $map: {
            input: '$conflictingBookings',
            as: 'conflict',
            in: {
              start: '$$conflict.duration.startDate',
              end: '$$conflict.duration.endDate',
              status: '$$conflict.status',
            },
          },
        },
      },
    });

    // Only include boats with no conflicting bookings
    match.conflictingBookings = { $size: 0 };
  }

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
        maxDistance: radius * 1609.34,
        key: 'latLng',
        spherical: true,
      },
    });

  const boats = await this.aggregate(aggregationQuery);
  return boats;
}

export async function getBoatListings({ pageNo, size, userId, filter }) {
  const {
    boatName,
    status,
    address,
    city,
    state,
    listingType,
    boatTypes,
    activityTypes,
    features,
  } = filter || {};
  const { skip, limit } = getPaginationValues(pageNo, size);
  const query = {};
  query.owner = userId;

  /** Temporarily disabled filters */
  if (boatName) query.boatName = { $regex: boatName.trim(), $options: 'i' };
  if (status) query.status = { $regex: status.trim(), $options: 'i' };
  if (city) query['location.city'] = { $regex: city.trim(), $options: 'i' };
  if (state) query['location.state'] = { $regex: state.trim(), $options: 'i' };
  if (address)
    query['location.address'] = { $regex: address.trim(), $options: 'i' };

  if (listingType)
    query.listingType = { $regex: listingType.trim(), $options: 'i' };
  if (features && Array.isArray(features) && features.length > 0) {
    query.features = { $in: features.map((f) => f.trim()) };
  }
  if (boatTypes && Array.isArray(boatTypes) && boatTypes.length > 0) {
    query.boatType = { $in: boatTypes.map((f) => f.trim()) };
  }

  if (
    activityTypes &&
    Array.isArray(activityTypes) &&
    activityTypes.length > 0
  ) {
    const typesToMatch = activityTypes.map((item) => {
      if (typeof item === 'object' && item.activityType) {
        return item.activityType.trim();
      }
      return item.trim();
    });

    query['activityTypes.type'] = { $in: typesToMatch };
  }

  const boats = await this.find(
    { ...query, status: { $ne: 'deleted' } },
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
export async function getBoatd({ boatId }) {
  const boat = await this.findOne({ _id: boatId, status: { $ne: 'deleted' } });
  if (!boat) throw boatNotFound;
  return boat;
}
export async function getBoat({ boatId }) {
  // Convert string ID to ObjectId if needed

  const _id = ObjectId.isValid(boatId) ? new ObjectId(boatId) : boatId;

  const [boat] = await this.aggregate([
    {
      $match: {
        _id: {
          $eq: _id,
        },
        status: { $ne: 'deleted' },
      },
    },
    {
      $lookup: {
        from: 'bookings',
        let: { boatId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$boatId', '$$boatId'] },
              status: { $nin: ['Cancelled', 'Completed'] },
            },
          },
          {
            $project: {
              _id: 1,
              duration: 1,
              status: 1,
              startDate: 1,
              endDate: 1,
            },
          },
          { $sort: { startDate: 1 } }, // Sort bookings by date
        ],
        as: 'bookings',
      },
    },
    {
      $addFields: {
        hasActiveBookings: { $gt: [{ $size: '$bookings' }, 0] },
      },
    },
  ]);

  if (!boat) throw boatNotFound;
  return boat;
}

export async function updateBoat(id, userId, updateObject) {
  const boat = await this.findOne({
    _id: id,
    owner: userId,
    status: { $ne: 'deleted' },
  });

  if (!boat) throw boatNotFound;
  if (boat.listingType !== updateObject.listingType)
    throw updatelistingTypeNotAllowed;

  const existingBoat = await this.findOne({
    boatName: { $regex: new RegExp(`^${this.boatName}$`, 'i') },
  });

  if (existingBoat && existingBoat._id !== id) {
    throw boatNameUsed;
  }

  const boatUpdate = await this.findOneAndUpdate(
    { _id: id, owner: userId },
    updateObject,
    {
      new: true,
    }
  );

  if (!boatUpdate) throw boatUpdateFailed;
  return boatUpdate;
}

export async function deleteBoat({ boatId, userId }) {
  // const removedBoat = await this.findOneAndRemove({
  //   _id: boatId,
  //   owner: userId,
  // });
  // if (!removedBoat) throw boatDeleteFailed;
  // return removedBoat;

  const boat = await this.findOne({
    _id: boatId,
    owner: userId,
    status: { $ne: 'deleted' },
  });
  if (!boat) throw boatNotFound;

  const boatDeleted = await this.findOneAndUpdate(
    { _id: boatId, owner: userId },
    { status: boatStatus.DELETED, boatName: `${boat.boatName}_${boatId}` },
    {
      new: true,
    }
  );

  if (!boatDeleted) throw boatDeleteFailed;

  return boatId;
}
