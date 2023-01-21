import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./sidebarChat.css";
import _ from "lodash";
import Pusher from "pusher-js";
import axios from "../../../axios";

function SidebarChat({ addNewChat, roomName, active, seed }) {
  const [lastMessage, setLastMessage] = useState();

  useEffect(() => {
    axios.get(`/messages/sync/${roomName}`).then((response) => {
      const msg = response.data;
      setLastMessage(msg ? msg[msg.length - 1] : "");
    });
  });

  useEffect(() => {
    const pusher = new Pusher("fa9b0c5b136778f262ec", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("update", (newMessage) => {
      if (active) setLastMessage(newMessage);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [active]);

  roomName = _.upperFirst(_.lowerCase(roomName));

  const createChat = async () => {
    const newRoomName = prompt(
      "Please enter name for room within 15 characters"
    );
    const updatedRoomName = newRoomName.substring(
      0,
      Math.min(newRoomName.length, 15)
    );
    if (updatedRoomName) {
      console.log(updatedRoomName);
      const newRoomNamedb = _.kebabCase(updatedRoomName);
      await axios.post(`/new/db/${newRoomNamedb}`);
    }
  };

  return !addNewChat ? (
    <div className={`sidebarChat ${active && "active"}`}>
      <Avatar
        src={`https://api.dicebear.com/5.x/adventurer/svg?seed=${seed}&scale=130`}
      />
      <div className="sidebarChat_info">
        <h2>{roomName}</h2>
        <p>
          Last Message:{" "}
          {lastMessage?.message?.substring(
            0,
            Math.min(lastMessage?.message?.length, 8)
          ) + (lastMessage?.message?.length > 8 ? "...." : "")}
        </p>
      </div>
    </div>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
