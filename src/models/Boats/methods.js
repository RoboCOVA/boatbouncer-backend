import { boatNameUsed } from './errors';

export async function createBoat() {
  const existingBoat = await this.constructor.findOne({
    boatName: { $regex: new RegExp(`^${this.boatName}$`, 'i') },
  });

  if (existingBoat) {
    throw boatNameUsed;
  }

  const boat = await this.save();
  return boat;
}
