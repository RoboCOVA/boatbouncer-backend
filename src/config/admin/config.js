import AdminJS from 'adminjs';
import AdminJSMongoose from '@adminjs/mongoose';
import { AdminResource } from './resources/adminstrators';
import { PaymentResource } from './resources/paymentIntents';
import { OfferResource } from './resources/offers';
import { UsersResource } from './resources/users';
import { BoatsResource } from './resources/boats';
import { BookingResource } from './resources/bookings';
import { SettingsResource } from './resources/settings';
import { ConversationsResource } from './resources/conversations';
import { componentLoader } from './components/components';

AdminJS.registerAdapter(AdminJSMongoose);

export const adminJs = new AdminJS({
  assets: {
    styles: ['/CSS/style.css'], // add assets path
  },
  databases: [], // We don’t have any resources connected yet.
  resources: [
    AdminResource,
    PaymentResource,
    OfferResource,
    UsersResource,
    BoatsResource,
    BookingResource,
    SettingsResource,
    ConversationsResource,
  ],
  componentLoader,
  branding: {
    companyName: 'Boat Bouncer',
    withMadeWithLove: false,
    logo: '',
  },
  dashboard: { component: AdminJS.bundle('./components/dashboard') },
  rootPath: '/admin', // Path to the AdminJS dashboard.
  session: {
    cookieMaxAge: 60 * 60 * 1000,
  },
});

adminJs.watch();
