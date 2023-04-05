import { setYear, setMonth, isBefore } from 'date-fns';
import { methodNotFound } from './errors';

/** @STATIC_FUNCTIONS */

/**
 * It checks if the payment method is expired
 * @returns A boolean value.
 */
export async function checkMethodExpiration({ methodId }) {
  const paymentMethod = await this.findOne({ _id: methodId });
  if (!paymentMethod) throw methodNotFound;

  const { expMonth, expYear } = paymentMethod;

  const now = new Date();
  const expirationDate = setMonth(setYear(new Date(), expYear), expMonth);

  if (isBefore(now, expirationDate)) return false; // Card is not expired.

  return true; // Card is expired.
}
