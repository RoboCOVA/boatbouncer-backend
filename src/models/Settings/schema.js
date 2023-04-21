import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    platformCut: { type: Number, min: 0, max: 50, required: true },
  },
  { timestamps: true }
);

settingsSchema.pre('save', async function callback(next) {
  const count = await this.constructor.countDocuments();
  if (count) next(new Error('Setting model alerady have a document'));
  next();
});

export default settingsSchema;
