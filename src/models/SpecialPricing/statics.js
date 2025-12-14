import { getPaginationValues } from '../../utils';
import {
  boatOwnershipError,
  specialPricingCannotDelete,
  specialPricingCannotUpdate,
  specialPricingDeleteFailed,
  specialPricingInvalidDates,
  specialPricingNameUsed,
  specialPricingNotFound,
  specialPricingOverlap,
  specialPricingPastDate,
  specialPricingUpdateFailed,
} from './errors';

/**
 * Get special pricing by ID
 */
export async function getSpecialPricingById(pricingId) {
  const pricing = await this.findOne({
    _id: pricingId,
    isActive: true,
  }).populate('boatId');

  if (!pricing) {
    throw specialPricingNotFound;
  }

  return pricing;
}

export async function getSpecialPricingByBoat(
  boatId,
  { page = 1, size = 10 } = {}
) {
  const { skip, limit } = getPaginationValues(page, size);

  const query = {
    boatId,
    isActive: true,
  };

  const [pricing, total] = await Promise.all([
    this.find(query)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate('boatId'),
    this.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  const pagination = {
    page: parseInt(page, 10),
    size: parseInt(size, 10),
    totalItems: total,
    totalPages,
    next: page < totalPages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    startIndex: skip + 1,
    endIndex: Math.min(skip + limit, total),
  };

  return {
    data: pricing,
    total,
    pagination,
  };
}

/**
 * Update special pricing
 */
export async function updateSpecialPricing(pricingId, updateData, userId) {
  const existingPricing = await this.findOne({
    _id: pricingId,
    isActive: true,
  }).populate('boatId');

  if (!existingPricing) {
    throw specialPricingNotFound;
  }

  // Check if pricing has been used
  if (
    existingPricing.timesUsed > 0 ||
    existingPricing.usedInBookings.length > 0
  ) {
    throw specialPricingCannotUpdate;
  }
  // Verify user owns the boat
  if (existingPricing.boatId.owner.toString() !== userId.toString()) {
    throw boatOwnershipError;
  }

  // Check if pricing time has passed
  const now = new Date();
  if (existingPricing.startDate < now) {
    throw specialPricingCannotUpdate;
  }

  const { title, startDate, endDate, boatId } = updateData;

  // Validate dates if provided
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : existingPricing.startDate;
    const end = endDate ? new Date(endDate) : existingPricing.endDate;

    if (start >= end) {
      throw specialPricingInvalidDates;
    }

    if (start < now) {
      throw specialPricingPastDate;
    }
  }

  // Check for duplicate title if title is being updated
  if (title && title !== existingPricing.title) {
    const existingTitle = await this.findOne({
      boatId: boatId || existingPricing.boatId,
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      isActive: true,
      _id: { $ne: pricingId },
    });

    if (existingTitle) {
      throw specialPricingNameUsed;
    }
  }

  // Check for date overlaps if dates are being updated
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : existingPricing.startDate;
    const end = endDate ? new Date(endDate) : existingPricing.endDate;

    const overlappingPricing = await this.findOne({
      boatId: boatId || existingPricing.boatId,
      isActive: true,
      _id: { $ne: pricingId },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
      ],
    });

    if (overlappingPricing) {
      throw specialPricingOverlap;
    }
  }

  const updatedPricing = await this.findByIdAndUpdate(
    pricingId,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate('boatId');

  if (!updatedPricing) {
    throw specialPricingUpdateFailed;
  }

  return updatedPricing;
}

/**
 * Delete special pricing
 */
export async function deleteSpecialPricing(pricingId, userId) {
  const existingPricing = await this.findOne({
    _id: pricingId,
    isActive: true,
  }).populate('boatId');

  if (!existingPricing) {
    throw specialPricingNotFound;
  }

  if (!existingPricing) {
    throw specialPricingNotFound;
  }

  // Verify user owns the boat
  if (existingPricing.boatId.owner.toString() !== userId.toString()) {
    throw boatOwnershipError;
  }

  // Check if pricing can be deleted
  if (
    existingPricing.timesUsed > 0 ||
    existingPricing.usedInBookings.length > 0
  ) {
    throw specialPricingCannotDelete;
  }

  // Soft delete by setting isActive to false
  const deletedPricing = await this.findByIdAndUpdate(
    pricingId,
    {
      isActive: false,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!deletedPricing) {
    throw specialPricingDeleteFailed;
  }

  return pricingId;
}

/**
 * Increment usage count
 */
export async function incrementUsage(pricingId) {
  const updated = await this.findByIdAndUpdate(
    pricingId,
    {
      $inc: { timesUsed: 1 },
      updatedAt: new Date(),
    },
    { new: true }
  );

  return updated;
}

/**
 * Get active special pricing for a boat within date range
 */
export async function getActivePricingForBoat(boatId, date) {
  const targetDate = new Date(date);

  return this.findOne({
    boatId,
    isActive: true,
    startDate: { $lte: targetDate },
    endDate: { $gte: targetDate },
  });
}

// Add to SpecialPricing model
export async function getActivePricingForDateRange(boatId, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return this.findOne({
    boatId,
    isActive: true,

    $or: [
      {
        startDate: { $lte: end },
        endDate: { $gte: start },
      },
    ],
  });
}

/**
 * Check all special pricing entries across all boats and update their isActive status
 * based on the current date (startDate <= now <= endDate).
 */
export async function updateAllSpecialPricingStatus() {
  const now = new Date();
  const allPricings = await this.find({});

  if (!allPricings.length) return { updatedCount: 0 };

  let updatedCount = 0;

  /* eslint-disable */
  for (const pricing of allPricings) {
    const shouldBeActive = pricing.startDate <= now && pricing.endDate >= now;

    if (pricing.isActive !== shouldBeActive) {
      await this.findByIdAndUpdate(pricing._id, {
        isActive: shouldBeActive,
        updatedAt: now,
      });
      updatedCount = updatedCount + 1;
    }
  }
  /* eslint-disable */

  return { updatedCount };
}
