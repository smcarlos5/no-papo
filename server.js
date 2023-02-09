const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3500;

// initilizing server
httpServer = createServer(app);
io = new Server(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Http server listening to: ${PORT}`);
});

// routing
app.use(express.static("public"));

// socket.io
io.on("connection", (socket) => {
  console.log(`new connection: ${socket.id}`);
});