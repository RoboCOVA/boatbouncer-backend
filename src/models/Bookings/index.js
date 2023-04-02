import mongoose from 'mongoose';
import bookingSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import { modelNames } from '../constants';

bookingSchema.static(staticFunctions);
bookingSchema.method(methodFunctions);

const Bookings = mongoose.model(modelNames.BOOKINGS, bookingSchema);

export default Bookings;
