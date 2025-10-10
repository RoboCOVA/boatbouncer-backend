import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import Reviews from '../models/Reviews';
import Bookings from '../models/Bookings';
import { getPaginationValues } from '../utils';

/**
 * Create a new review for a booking
 */
export const createReviewController = async (req, res, next) => {
  try {
    const { bookingId, rating, reviewMessage } = req.body;
    const userId = req?.user?._id;

    const review = new Reviews({
      bookingId,
      userId,
      rating,
      reviewMessage,
      date: new Date(),
    });

    const savedReview = await review.createReview();
    res.status(httpStatus.CREATED).send(savedReview);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing review
 */
export const updateReviewController = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req?.user?._id;
    const { rating, reviewMessage } = req.body;

    const updatedReview = await Reviews.updateReview(reviewId, userId, {
      rating,
      reviewMessage,
    });

    res.send(updatedReview);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a review
 */
export const deleteReviewController = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req?.user?._id;

    await Reviews.deleteReview(reviewId, userId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single review by ID
 */
export const getReviewController = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Reviews.findById(reviewId)
      .populate('userId', 'firstName lastName profilePicture')
      .populate('bookingId', 'duration status')
      .populate('boatId', 'boatName imageUrls');

    if (!review) {
      throw new APIError('Review not found', httpStatus.NOT_FOUND);
    }

    res.send(review);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reviews for a specific boat
 */
export const getBoatReviewsController = async (req, res, next) => {
  try {
    const { boatId } = req.params;
    const { pageNo = 1, size = 10 } = req.query;

    const reviews = await Reviews.getBoatReviews({
      boatId,
      pageNo: parseInt(pageNo, 10),
      size: parseInt(size, 10),
    });

    res.send(reviews);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reviews written by the current user
 */
export const getUserReviewsController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { pageNo = 1, size = 10 } = req.query;

    const reviews = await Reviews.getUserReviews({
      userId,
      pageNo: parseInt(pageNo, 10),
      size: parseInt(size, 10),
    });

    res.send(reviews);
  } catch (error) {
    next(error);
  }
};

export const getBookingReviewsController = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { pageNo = 1, size = 10 } = req.query;

    const { skip, limit } = getPaginationValues(
      parseInt(pageNo, 10),
      parseInt(size, 10)
    );

    const reviews = await Reviews.find({ bookingId })
      .populate('userId', 'firstName lastName profilePicture')
      .populate('boatId', 'boatName imageUrls owner')
      .populate({
        path: 'bookingId',
        populate: [
          {
            path: 'boatId',
            select: 'boatName imageUrls owner pricing',
          },
          {
            path: 'renter',
            select: 'firstName lastName profilePicture',
          },
        ],
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reviews.countDocuments({ bookingId });

    res.send({
      data: reviews,
      total,
      page: parseInt(pageNo, 10),
      size: limit,
    });
  } catch (error) {
    next(error);
  }
};
