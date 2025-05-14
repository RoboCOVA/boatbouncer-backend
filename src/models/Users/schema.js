import mongoose from 'mongoose';
import { authProviders, authProvidersEnum } from '../../utils/constants';

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: false },
    email: { type: String, required: true },
    // email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    lastName: { type: String },
    phoneNumber: { type: String },
    // phoneNumber: { type: String, required: true },
    verified: { type: Boolean, required: true },
    profilePicture: { type: String, required: false },
    session: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    stripeCustomerId: { type: String },
    stripeAccountId: { type: String },
    chargesEnabled: { type: Boolean },

    authProviders: {
      type: [
        {
          type: String,
          enum: Object.values(authProvidersEnum),
        },
      ],
      default: [authProviders.LOCAL],
      validate: {
        validator: (providers) => providers.length > 0,
        message: 'User must have at least one authentication provider',
      },
    },
    googleId: { type: String, sparse: true },
    appleId: { type: String, sparse: true },
    facebookId: { type: String, sparse: true },
    googleIdTemp: { type: String },
    appleIdTemp: { type: String },
    facebookIdTemp: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default userSchema;
