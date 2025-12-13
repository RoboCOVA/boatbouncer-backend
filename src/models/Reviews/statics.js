import { ObjectId } from 'mongodb';
import { getPaginationValues } from '../../utils';

import {
  reviewDeleteFailed,
  reviewNotFound,
  reviewUpdateFailed,
} from './errors';
import { modelNames } from '../constants';

// Add to your review schema file
export async function updateReview(reviewId, userId, updateObject) {
  const review = await this.findOne({
    _id: reviewId,
    userId,
  });

  if (!review) throw reviewNotFound;

  // Only allow updating rating and reviewMessage, not bookingId or other fields
  const allowedUpdates = {};
  if (updateObject.rating !== undefined) {
    allowedUpdates.rating = updateObject.rating;
  }
  if (updateObject.reviewMessage !== undefined) {
    allowedUpdates.reviewMessage = updateObject.reviewMessage;
  }

  const updatedReview = await this.findOneAndUpdate(
    { _id: reviewId, userId },
    {
      ...allowedUpdates,
      date: new Date(), // Update the date when review is modified
    },
    { new: true }
  );

  if (!updatedReview) throw reviewUpdateFailed;

  await this.model(modelNames.BOATS).calculateRating(review.boatId);
  return updatedReview;
}

export async function deleteReview(reviewId, userId) {
  const review = await this.findOne({
    _id: reviewId,
    userId,
  });

  if (!review) throw reviewNotFound;

  const deletedReview = await this.findOneAndDelete({
    _id: reviewId,
    userId,
  });

  if (!deletedReview) throw reviewDeleteFailed;

  await this.model(modelNames.BOATS).calculateRating(review.boatId);
  return reviewId;
}

export async function getBoatReviews({ boatId, pageNo, size }) {
  const { skip, limit } = getPaginationValues(pageNo, size);

  // Get only the latest review per user for this boat
  const reviews = await this.aggregate([
    { $match: { boatId: new ObjectId(boatId) } },
    {
      $sort: { date: -1 }, // Sort by date descending to get latest first
    },
    // {
    //   $group: {
    //     _id: '$userId', // Group by user
    //     allReviews: { $push: '$$ROOT' },
    //   },
    // },
    // {
    //   $replaceRoot: { newRoot: '$allReviews' }, // Replace root with the review document
    // },
    {
      $group: {
        _id: '$userId', // Group by user
        latestReview: { $first: '$$ROOT' }, // Get the first (latest) review for each user
      },
    },
    {
      $replaceRoot: { newRoot: '$latestReview' }, // Replace root with the review document
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              profilePicture: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: '$user', // Unwind the user array
    },
    {
      $sort: { date: -1 }, // Sort all reviews by date
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  // Get total count of unique users who reviewed this boat
  const totalResult = await this.aggregate([
    { $match: { boatId: new ObjectId(boatId) } },
    {
      $group: {
        _id: '$userId', // Group by user to get unique users
      },
    },
    {
      $count: 'total',
    },
  ]);

  const total = totalResult[0]?.total || 0;
  const page = pageNo || 1;
  const totalPages = Math.ceil(total / limit);

  // Calculate next and previous page numbers
  const next = page < totalPages ? page + 1 : null;
  const prev = page > 1 ? page - 1 : null;

  return {
    data: reviews,
    pagination: {
      page,
      size: limit,
      totalItems: total,
      totalPages,
      next,
      prev,
    },
  };
}

export async function getUserReviews({ userId, pageNo, size }) {
  const { skip, limit } = getPaginationValues(pageNo, size);

  const reviews = await this.find({ userId })
    .populate('boatId', 'boatName imageUrls')
    .populate('bookingId', 'duration status')
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ userId });

  return {
    data: reviews,
    total,
    page: pageNo,
    size: limit,
  };
}
