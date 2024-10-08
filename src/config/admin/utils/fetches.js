import Bookings from '../../../models/Bookings';

export const getPaginatedBookingsPerStatusForAllBoats = async (currPage) => {
  const page = Number(currPage.query.page);

  const skip = (page - 1) * 10;
  const result = await Bookings.aggregate([
    {
      $group: {
        _id: { boatId: '$boatId', status: '$status' }, // First group by boatId and status
        count: { $sum: 1 }, // Count occurrences of each status
      },
    },
    {
      $group: {
        _id: '$_id.boatId', // Now group by boatId only
        status: {
          $push: { status: '$_id.status', count: '$count' }, // Push status and count into an array
        },
      },
    },
    {
      $lookup: {
        from: 'boats', // The Boats collection to join with
        localField: '_id', // The boatId from the current aggregation result
        foreignField: '_id', // The _id field in the Boats collection (assuming it's the same as boatId)
        as: 'boatDetails', // The name of the field to store the joined boat details
        pipeline: [
          {
            $project: {
              boatName: 1, // Include only boatName
              searchable: 1, // Include only searchable
            },
          },
        ],
      },
    },
    {
      $facet: {
        metadata: [{ $count: 'total' }], // Count the total number of documents
        data: [
          // This pipeline handles pagination
          { $skip: skip },
          { $limit: 10 },
          {
            $project: {
              _id: 1, // Include boatId
              status: 1, // Include the status and count array
              boatDetails: { $arrayElemAt: ['$boatDetails', 0] }, // Include the first element of boat details
            },
          },
        ],
      },
    },
  ]);

  return result;
};
