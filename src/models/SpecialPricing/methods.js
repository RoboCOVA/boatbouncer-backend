import {
  specialPricingInvalidDates,
  specialPricingNameUsed,
  specialPricingOverlap,
  specialPricingPastDate,
} from './errors';

export async function createSpecialPricing() {
  // Validate dates
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);

  if (start >= end) {
    throw specialPricingInvalidDates;
  }

  if (start < now) {
    throw specialPricingPastDate;
  }

  // Check for duplicate title for the same boat
  const existingTitle = await this.constructor.findOne({
    boatId: this.boatId,
    title: { $eq: this.title },
    isActive: true,
  });

  if (existingTitle) {
    throw specialPricingNameUsed;
  }

  // Check for date overlaps
  const overlappingPricing = await this.constructor.findOne({
    boatId: this.boatId,
    isActive: true,
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

  const specialPricing = await this.save();
  return specialPricing;
}
