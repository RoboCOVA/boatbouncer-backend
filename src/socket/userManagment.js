export const users = [];

export const removeUser = (userId) => {
  const index = users.findIndex((item) => item.userId === userId);
  if (index !== -1) {
    users.splice(index, 1);
  }
};

/**
 * Removes by socket id rather than user id. Socket.IO hands the disconnect
 * handler a reason string, never a user id, so the id has to come from the
 * connection itself; matching on the socket id also means a closing tab cannot
 * evict the entry belonging to another tab that has since replaced it.
 */
export const removeUserBySocketId = (socketId) => {
  const index = users.findIndex((item) => item.socketId === socketId);
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
