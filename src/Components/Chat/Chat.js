import {
  AttachFile,
  InsertEmoticon,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import MicIcon from "@mui/icons-material/Mic";
import { Avatar, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import _axios from "../../axios";
import "./chat.css";
import _ from "lodash";
import { useDataLayerValue } from "../../DataLayer/DataLayer";
import Pusher from "pusher-js";

function Chat() {
  const [{ user, name, seed, uid }] = useDataLayerValue();
  const roomName = _.upperFirst(_.lowerCase(name));
  const [input, setInput] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lastSeen, setLastSeen] = useState();
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    const config = {
      method: "get",
      url: `https://kind-erin-mite-hem.cyclic.app/messages/sync/${name}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        const msg = response.data;
        setMessages(response.data);
        setLastSeen(msg ? msg[msg.length - 1]?.timestamp : undefined);
      })
      .catch(function (error) {
        console.log(error);
      });
    // axios.get(`/messages/sync/${name}`).then((response) => {
    //   const msg = response.data;
    //   setMessages(response.data);
    //   setLastSeen(msg ? msg[msg.length - 1]?.timestamp : undefined);
    // });
  }, [name]);

  useEffect(() => {
    const pusher = new Pusher("fa9b0c5b136778f262ec", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("update", (newMessage) => {
      setMessages([...messages, newMessage]);
      setLastSeen(newMessage.timestamp);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.length === 0) return;
    await _axios.post(`/messages/new/${name}`, {
      message: input,
      name: user.displayName.split(" ")[0],
      timestamp:
        new Date().toLocaleTimeString().split(":").slice(0, 2).join(":") +
        " " +
        new Date().toLocaleTimeString().split(" ")[1],
      uid: uid,
    });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar
          src={`https://api.dicebear.com/5.x/adventurer/svg?seed=${seed}&scale=130`}
        />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>Last Seen at {lastSeen ? lastSeen : "..."}</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages?.map((message, i) => (
          <p
            className={`chat_message ${message.uid === uid && "chat_receiver"}`}
            key={i}
          >
            <span className="chat_name">
              {message.uid !== uid && message.name}
            </span>
            {message.message}
            <span className="chat_timestamp">{message.timestamp}</span>
          </p>
        ))}
        <div ref={divRef} />
      </div>
      <div className="chat_footer">
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit"></button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
