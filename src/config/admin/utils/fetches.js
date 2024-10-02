import Bookings from '../../../models/Bookings';

export async function getAllBookings() {
  const bookings = await Bookings.find().populate([
    {
      path: 'renter',
      select: [
        '-password',
        '-stripeCustomerId',
        '-stripeAccountId',
        '-chargesEnabled',
      ],
    },
    {
      path: 'owner',
      select: [
        '-password',
        '-stripeCustomerId',
        '-stripeAccountId',
        '-chargesEnabled',
      ],
    },
    {
      path: 'offerId',
    },
    {
      path: 'boatId',
    },
  ]);

  return { data: bookings };
}
