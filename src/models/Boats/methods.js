export async function createBoat() {
  const boat = await this.save();
  return boat;
}
