/**
 * Stable identifiers returned as `code` on error responses, for clients that
 * need to branch on a specific failure. Values are part of the API contract —
 * change the message freely, never the code.
 */
// eslint-disable-next-line import/prefer-default-export
export const errorCodes = {
  USER_NOT_VERIFIED: 'USER_NOT_VERIFIED',
};

export default errorCodes;
