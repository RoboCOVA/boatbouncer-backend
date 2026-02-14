import Boats from '../models/Boats';
import { boatNotFound } from '../models/Boats/errors';
import SpecialPricing from '../models/SpecialPricing';

export const createSpecialPricingController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const specialPricingData = req.body;

    // Verify user owns the boat

    const boat = await Boats.findOne({
      _id: specialPricingData.boatId,
      owner: userId,
    });

    if (!boat) {
      throw boatNotFound;
    }
    const newSpecialPricing = new SpecialPricing({
      ...specialPricingData,
    });

    const specialPricing = await newSpecialPricing.createSpecialPricing();
    res.status(201).send(specialPricing);
  } catch (error) {
    next(error);
  }
};

export const getBoatSpecialPricingController = async (req, res, next) => {
  try {
    const { boatId } = req.params;
    const { pageNo, size } = req.query;
    const userId = req?.user?._id;

    // Verify user owns the boat
    const boat = await Boats.findOne({
      _id: boatId,
      // owner: userId,
    });

    if (!boat) {
      throw boatNotFound;
    }
    const isOwner = boat.owner?.toString() === userId?.toString();

    const specialPricing = await SpecialPricing.getSpecialPricingByBoat(
      boatId,
      isOwner,
      {
        page: pageNo,
        size,
      }
    );

    res.json(specialPricing);
  } catch (error) {
    next(error);
  }
};

export const getSpecialPricingController = async (req, res, next) => {
  try {
    const { pricingId } = req.params;
    const userId = req?.user?._id;

    const specialPricing = await SpecialPricing.getSpecialPricingById(
      pricingId
    );

    // Verify user owns the boat associated with this pricing
    const boat = await Boats.findOne({
      _id: specialPricing.boatId,
      owner: userId,
    });

    if (!boat) {
      throw boatNotFound;
    }

    res.json(specialPricing);
  } catch (error) {
    next(error);
  }
};

export const updateSpecialPricingController = async (req, res, next) => {
  try {
    const { pricingId } = req.params;
    const userId = req?.user?._id;
    const updateData = req.body;

    const updatedPricing = await SpecialPricing.updateSpecialPricing(
      pricingId,
      updateData,
      userId
    );

    res.json(updatedPricing);
  } catch (error) {
    next(error);
  }
};

export const deleteSpecialPricingController = async (req, res, next) => {
  try {
    const { pricingId } = req.params;
    const userId = req?.user?._id;

    await SpecialPricing.deleteSpecialPricing(pricingId, userId);

    res.json({
      message: 'Special pricing deleted successfully',
      pricingId,
    });
  } catch (error) {
    next(error);
  }
};
