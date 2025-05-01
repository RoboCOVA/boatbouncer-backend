import axios from 'axios';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import Users from '../../models/Users';
import { generateRandomOAuthId, generateUserNameFromEmail } from '../../utils';
import { authProviders, oAuthDefaultPassword } from '../../utils/constants';
import * as environments from '../environments';

async function getFacebookUserPhone(accessToken) {
  try {
    // Facebook's Graph API endpoint for getting user phone number
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email,first_name,last_name,picture.width(500),phone&access_token=${accessToken}`
    );
    return response.data;
  } catch (error) {
    // console.error({ error });
    return null;
  }
}

const facebookStrategy = new FacebookStrategy(
  {
    clientID: environments.facebookAppId,
    clientSecret: environments.facebookAppSecret,
    callbackURL: environments.facebookCallbackUrl,
    profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
    enableProof: true,
    authType: 'reauthenticate',
    scope: ['email', 'public_profile'],
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      let userId = '';
      // Get additional user data from Facebook Graph API
      const userDetails = await getFacebookUserPhone(accessToken);
      const facebookIdTemp = generateRandomOAuthId();
      const userData = {
        email: profile.emails?.[0]?.value || userDetails?.email,
        firstName: profile.name?.givenName || userDetails?.first_name,
        lastName: profile.name?.familyName || userDetails?.last_name,
        profilePicture:
          profile.photos?.[0]?.value || userDetails?.picture?.data?.url,
        phoneNumber: userDetails?.phone, // Phone number from Graph API
        facebookId: profile.id,
        facebookIdTemp,
        authProviders: [authProviders.FACEBOOK],
        verified: true,
        userName: generateUserNameFromEmail(
          profile.emails?.[0]?.value || userDetails?.email
        ),
        password: oAuthDefaultPassword,
      };

      const previousUser = await Users.getUserByFacebookId(profile.id);

      if (previousUser) {
        userId = previousUser._id;
        await Users.setOAuthId(previousUser._id, {
          facebookIdTemp,
          facebookId: profile.id,
        });
      } else {
        const newUser = new Users({
          ...userData,
        });
        userId = newUser._id;
        await newUser.createNewUser();
      }
      Users.authClearTempOAuthId(userId, 'facebookIdTemp');
      return done(null, { facebookId: facebookIdTemp });
    } catch (error) {
      console.error('Facebook authentication error:', error);
      return done(error, null);
    }
  }
);

export default facebookStrategy;
