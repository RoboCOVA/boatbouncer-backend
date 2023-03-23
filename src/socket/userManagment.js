export const users = [];

export const removeUser = (userId) => {
  const index = users.findIndex((item) => item.userId === userId);
  if (index !== -1) {
    users.splice(index, 1);
  }
};

export const addUser = (userId, socketId) => {
  if (!users.some((user) => userId === user.userId))
    users.push({ userId, socketId });
  else {
    removeUser(userId);
    users.push({ userId, socketId });
  }
};

export const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
