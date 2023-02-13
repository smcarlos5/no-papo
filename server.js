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

// chat
const participantArr = [];

io.on("connection", (socket) => {
  socket.on("add participant", (nickname) => {
    console.log(`New Participant: ${ nickname }`);
    
    socket.nickname = nickname;
    participantArr.push(nickname);
    
    socket.broadcast.emit("participant joined", {
      nickname: nickname,
      list: participantArr
    });
    socket.emit("connection", {list: participantArr});
  });
  
  socket.on("new message", (receivedMsg) => {
    console.log(`${socket.nickname}: ${receivedMsg}`);

    socket.broadcast.emit("new message", {
      nickname: socket.nickname,
      message: receivedMsg
    });
  });

  socket.on("disconnect", () => {
    const nickname = socket.nickname;
    const pIndex = participantArr.indexOf(nickname);
    participantArr.splice(pIndex, 1);

    socket.broadcast.emit("participant left", {
      nickname: nickname,
      list: participantArr
    });
  });
});
