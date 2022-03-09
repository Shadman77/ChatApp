import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";

import "./Chat.css";

let socket;

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState(searchParams.get("name"));
  const [room, setRoom] = useState(searchParams.get("room"));
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  // function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(messages, message)

  return (
    <div className="outerContainer">
      <div className="container">
        <input
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
        />
      </div>
    </div>
  );
};

export default Chat;
