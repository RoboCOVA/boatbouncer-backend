export async function getFavorites(userId) {
  const favorites = await this.find({ user: userId }, { user: 0 }).populate(
    'boat'
  );
  const total = await this.count({ user: userId });

  return { data: favorites, total };
}
