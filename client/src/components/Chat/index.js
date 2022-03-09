import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";

import "./Chat.css";

let socket;

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState(searchParams.get("name"));
  const [room, setRoom] = useState(searchParams.get("room"));
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    socket = io(ENDPOINT);
    console.log(socket);

    // send the event "join" to the server with the data {name, room}
    socket.emit("join", { name, room }, () => {});

    // similar to component unmount
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [searchParams, ENDPOINT]);

  return <h1>Chat</h1>;
};

export default Chat;
