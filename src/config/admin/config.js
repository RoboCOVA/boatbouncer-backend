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
import { componentLoader, components } from './components/components';
import { OwnersResource } from './resources/owners';
import { RentersResource } from './resources/renters';
import {
  getAllBoats,
  getPaginatedBookingsPerStatusForAllBoats,
} from './utils/fetches';

AdminJS.registerAdapter(AdminJSMongoose);

export const adminJs = new AdminJS({
  assets: {
    styles: ['/CSS/style.css', '/CSS/mapbox-gl.css'], // add assets path
  },
  databases: [], // We don’t have any resources connected yet.
  resources: [
    AdminResource,
    PaymentResource,
    OfferResource,
    UsersResource,
    BoatsResource,
    BookingResource,
    OwnersResource,
    RentersResource,
    SettingsResource,
    ConversationsResource,
  ],
  componentLoader,
  branding: {
    companyName: 'Boatbouncer',
    withMadeWithLove: false,
    logo: '/images/boatbouncer-new.png',
    favicon: '/images/boatbouncer-favicon.png',
  },
  dashboard: { component: AdminJS.bundle('./components/dashboard') },
  rootPath: '/admin', // Path to the AdminJS dashboard.
  pages: {
    Analytics: {
      icon: 'Analytics',
      component: components.Analytics,
      handler: getPaginatedBookingsPerStatusForAllBoats,
    },
    Statistics: {
      icon: 'Statistics',
      component: components.Statistics,
      handler: getAllBoats,
    },
  },
  session: {
    cookieMaxAge: 60 * 60 * 1000,
  },
});

adminJs.watch();
