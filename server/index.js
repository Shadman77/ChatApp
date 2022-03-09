const express = require("express");
const socketio = require("socket.io");
const http = require("http");
// var cors = require("cors");

const app = express();
const server = http.createServer(app);

const router = require("./router");
app.use(router);

// app.use(cors);

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

// socket parameter is the client socket who have joined
io.on("connection", (socket) => {
  console.log("We have a new connection");

  // listen to the join event
  // Callback sends reply to client, usually used for error handling
  // This callback function is passed from the client side, apparently
  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);

    const error = true;

    // if (error) {
    //   callback({ error: "error" });
    // }
  });

  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
