let io;

// to re-use the same socket io object that manages the same connection across multiple files
module.exports = {
  // The init object is used in app.js to set the connection between the client and server.
  init: (httpServer) => {
    io = require("socket.io")(httpServer);
    return io;
  },
  // The getIo object is used across multiple files (Check it in controllers > inventory.js)
  getIo: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
