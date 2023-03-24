import { Server } from 'socket.io';

/**
 * The function takes a server and an options object as arguments and returns a new Server object
 * @param server - The server instance to attach to. This is usually an HTTP server instance.
 * @param [options] - An object containing the following options:
 * @returns A new instance of the Server class.
 */
function io(server, options = {}) {
  return new Server(server, options);
}

export default io;
