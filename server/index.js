const express = require("express");
const socketio = require("socket.io");
const http = require("http");
// var cors = require("cors");

const { addUser, getUser, remoteUser, getUsersInRoom } = require("./users");

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

    // socket.id is the individual client socket's id
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) callback({ error });

    // Send to the specific user
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    // Send to everybody in a specific room
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `User ${user.name} has joined` });

    socket.join(user.room);

    callback();
  });

  // handle user messages
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
