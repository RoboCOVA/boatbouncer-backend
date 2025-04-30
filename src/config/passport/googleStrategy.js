import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import { google } from 'googleapis';
import * as environments from '../environments';
import Users from '../../models/Users';
import { generateUserNameFromEmail } from '../../utils';
import { authProviders, oAuthDefaultPassword } from '../../utils/constants';

async function getGoogleUserPhone(oauthToken) {
  const oauth2Client = new google.auth.OAuth2(
    environments.googleClientId,
    environments.googleClientSecret,
    environments.googleCallbackUrl
  );
  oauth2Client.setCredentials({
    access_token: oauthToken,
  });

  const people = google.people({
    version: 'v1',
    auth: oauth2Client,
  });

  try {
    const res = await people.people.get({
      resourceName: 'people/me',
      personFields: 'phoneNumbers,emailAddresses,names,photos',
    });
    return res.data;
  } catch (error) {
    return null;
  }
}

const googleStrategy = new GoogleStrategy(
  {
    clientID: environments.googleClientId,
    clientSecret: environments.googleClientSecret,
    callbackURL: environments.googleCallbackUrl,
    passReqToCallback: true,
    scope: [
      'profile',
      'email',
      'openid',
      'https://www.googleapis.com/auth/user.phonenumbers.read',
    ],
    accessType: 'offline',
  },
  async function (request, accessToken, refreshToken, profile, done) {
    try {
      // Get additional user data from People API

      const userDetails = await getGoogleUserPhone(accessToken);
      let googleId = '';
      const userData = {
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePicture: profile.photos[0]?.value,
        phoneNumber:
          userDetails?.phoneNumbers?.length > 0
            ? userDetails?.phoneNumbers[0].canonicalForm
            : null,
        googleId: profile.id,
        authProviders: [authProviders.GOOGLE],
        verified: true,
        userName: generateUserNameFromEmail(profile.emails[0].value),
        password: oAuthDefaultPassword,
      };
      googleId = userData.googleId;
      const previouseUser = await Users.getUserByGoogleId(googleId);

      if (!previouseUser) {
        const newUser = new Users({
          ...userData,
        });
        await newUser.createNewUser();
      }
      return done(null, { googleId });
    } catch (error) {
      return done(error, null);
    }
  }
);

export default googleStrategy;
