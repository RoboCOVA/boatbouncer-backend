import Bookings from '../models/Bookings';
import { bookingStatus } from '../utils/constants';

/**
 * It creates a new booking and saves it to the database.
 * @param req - {
 * @param res - {
 * @param next - A function to be called if an error occurs or processing is complete.
 */
export const createBookingController = async (req, res, next) => {
  try {
    const { boatId, type, duration, renterPrice, captainPrice } = req.body;
    const id = req?.user?._id;
    const booking = new Bookings({
      boatId,
      type,
      duration,
      renter: id,
      renterPrice,
      captainPrice,
      status: bookingStatus.PENDING,
    });

    const savedReservation = await booking.createBooking();
    res.send(savedReservation);
  } catch (error) {
    next(error);
  }
};

/**
 * It takes a bookId and a userId and cancels the booking.
 * @param req - {
 * @param res - the response object
 * @param next - is a function that you call to pass control to the next matching route.
 */
export const cancelBookingController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { bookId } = req.params;
    const { isRenter } = req.query;

    const cancelledBooking = await Bookings.cancelBooking({
      bookId,
      userId,
      isRenter,
    });
    res.send(cancelledBooking);
  } catch (error) {
    next(error);
  }
};

/**
 * It gets all the bookings for a user, and sends them back to the client.
 * @param req - {
 * @param res - the response object
 * @param next - a function that you call to pass control to the next middleware function.
 */
export const getBookingsController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { isRenter } = req.query;

    const bookings = await Bookings.getBookings({
      userId,
      isRenter,
    });
    res.send(bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * It gets the bookings for a bookId and userId.
 * @param req - {
 * @param res - {
 * @param next - is a function that you call to pass control to the next middleware function.
 */
export const getBookingController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { bookId } = req.params;
    const { isRenter } = req.query;

    const bookings = await Bookings.getBooking({
      bookId,
      userId,
      isRenter,
    });
    res.send(bookings);
  } catch (error) {
    next(error);
  }
};

// Get canceled bookings
/**
 * It gets the canceled bookings for a user.
 * @param req - {
 * @param res - {
 * @param next - is a function that you call to pass control to the next middleware function.
 */
export const getCanceledBookingsController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { isRenter } = req.query;
    const canceledBookings = await Bookings.getCanceledBookings({
      userId,
      isRenter,
    });
    res.send(canceledBookings);
  } catch (error) {
    next(error);
  }
};
