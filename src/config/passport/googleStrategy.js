// import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

// import * as environments from '../../config/environments';

// const googleStrategy = new GoogleStrategy(
//   {
//     clientID: environments.googleClientId,
//     clientSecret: environments.googleClientSecret,
//     callbackURL: environments.googleCallbackUrl,
//     passReqToCallback: true,
//     scope: ['profile', 'email', 'phone'],
//     accessType: 'offline',
//   },
//   function (request, accessToken, refreshToken, profile, done) {
//     // The profile object will now contain more information
//     console.log('Full profile:', profile);

//     // Example of user data you can access:
//     const userData = {
//       id: profile.id,
//       email: profile.email,
//       verifiedEmail: profile.verified_email,
//       name: profile.displayName,
//       firstName: profile.given_name,
//       lastName: profile.family_name,
//       picture: profile.picture,
//       locale: profile.locale,
//       phone: profile.phone || null, // Phone number if scope includes it
//       accessToken: accessToken,
//       refreshToken: refreshToken || null,
//     };

//     console.log('Extracted user data:', userData);

//     // User.findOrCreate({ googleId: profile.id }, userData, function (err, user) {
//     //   return done(err, user);
//     // });

//     // For now, just return the profile
//     return done(null, profile);
//   }
// );

// export default googleStrategy;
