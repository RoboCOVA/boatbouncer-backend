import connectToDb from './mongoose';
import Adminstrators from '../models/Adminstrators';
import APIError from '../errors/APIError';
import { generateHashedPassword } from '../utils';
import { adminEmail, adminPass } from './environments';

connectToDb()
  .then(async () => {
    const admins = await Adminstrators.find();
    if (admins?.length)
      throw new APIError('Adminstrator model already contains a document');
    const password = await generateHashedPassword(adminPass);
    const adminEntry = new Adminstrators({
      userName: 'Boat Bouncer',
      email: adminEmail,
      password,
      super: true,
    });

    const superAdmin = await adminEntry.save();
    if (!superAdmin) throw new APIError('Error: Admin seeding failed');
    // eslint-disable-next-line no-console
    console.log('Super Admin created successfully');
  })
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err))
  .finally(() => {
    process.exit(0);
  });
