import React, { useEffect, useState } from "react";
import "./sidebar.css";
import ChatIcon from "@mui/icons-material/Chat";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, IconButton } from "@mui/material";
import SidebarChat from "./SidebarChat/SidebarChat";
import axios from "../../axios";
import Pusher from "pusher-js";
import { useDataLayerValue } from "../../DataLayer/DataLayer";

function Sidebar() {
  const [{ user }, dispatch] = useDataLayerValue();
  const [rooms, setRooms] = useState([]);
  const [active, setActive] = useState(0);
  const [seeds, setSeed] = useState([
    Math.floor(Math.random() * 5000),
    Math.floor(Math.random() * 5000),
  ]);

  useEffect(() => {
    axios.get("/all/db").then((response) => {
      setRooms(response.data);
    });
    dispatch({
      type: "SET_ACTIVE",
      name: "default-room",
      seed: seeds[0],
    });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const pusher = new Pusher("fa9b0c5b136778f262ec", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("rooms");
    channel.bind("inserted", (newRoom) => {
      setRooms([...rooms, newRoom]);
      setSeed([...seeds, Math.floor(Math.random() * 5000)]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
    // eslint-disable-next-line
  }, [rooms]);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user.photoURL} />
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchIcon />
          <input placeholder="Search or start a new chat" type="text" />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room, i) => (
          <button
            onClick={() => {
              setActive(i);
              dispatch({
                type: "SET_ACTIVE",
                name: room.name,
                seed: seeds[i],
              });
            }}
            key={i}
          >
            <SidebarChat
              roomName={room.name}
              key={i}
              active={active === i}
              seed={seeds[i]}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
