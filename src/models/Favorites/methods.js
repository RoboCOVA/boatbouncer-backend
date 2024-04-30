import { modelNames } from '../constants';

export async function addOrRemoveFavorite() {
  const { boat, user } = this;
  const existFavorite = await this.model(modelNames.FAVORITES).findOne({
    boat,
    user,
  });
  if (existFavorite) {
    await this.model(modelNames.FAVORITES).findOneAndRemove({ boat, user });
    return { existFavorite, removed: true };
  }
  const favorite = await this.save();
  return favorite;
}
