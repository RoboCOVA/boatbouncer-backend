import Offers from '../models/Offers';
import { bookingStatus } from '../utils/constants';

export const createOfferController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const {
      bookId,
      boatPrice,
      captainPrice,
      paymentServiceFee,
      localTax,
      departureDate,
      returnDate,
    } = req.body;

    const offer = new Offers({
      bookId,
      boatPrice,
      captainPrice,
      paymentServiceFee,
      localTax,
      departureDate,
      returnDate,
      status: bookingStatus.PENDING,
      createdBy: userId,
    });

    const savedOffer = await offer.createOffers();
    res.send(savedOffer);
  } catch (error) {
    next(error);
  }
};

export const updateOfferController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || ' ';
    const { offerId } = req.params;
    const { boatPrice, captainPrice, paymentServiceFee, localTax } = req.body;
    const updateObject = {};

    if (boatPrice) updateObject.boatPrice = boatPrice;
    if (captainPrice) updateObject.captainPrice = captainPrice;
    if (paymentServiceFee) updateObject.paymentServiceFee = paymentServiceFee;
    if (localTax) updateObject.localTax = localTax;
    const updatedOffer = await Offers.updateOffer({
      offerId,
      userId,
      updateObject,
    });
    res.send(updatedOffer);
  } catch (error) {
    next(error);
  }
};

export const acceptOfferController = async (req, res, next) => {
  try {
    const userId = req?.user?._id || '';
    const { offerId } = req.params;

    const accept = await Offers.acceptOffer({
      userId,
      offerId,
    });

    res.send(accept);
  } catch (error) {
    next(error);
  }
};
