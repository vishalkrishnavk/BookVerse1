import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./ChatHeader.jsx";
import SendMsg from "./SendMsg.jsx";
import MsgLoading from "./MsgLoading.jsx";
import correctDate from "../../lib/utils.js";
import {
  getUsers,
  getMessages,
  markMessageAsRead,
} from "../../redux/messageSlice.js";
import { connectSocket, disconnectSocket } from "../../redux/userSlice.js";
import { getSocket } from "../../utils/socketService.js";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const messageRef = useRef(null);

  const { messages, selectedUser, isGettingMessages } = useSelector(
    (state) => state.messages
  );
  const { user: authUser } = useSelector((state) => state.user);
  const socket = getSocket();

  useEffect(() => {
    if (!selectedUser) return;
    if (!socket) {
      dispatch(connectSocket());
      return;
    }

    const fetchData = async () => {
      try {
        await dispatch(getUsers()).unwrap();
        await dispatch(getMessages(selectedUser._id)).unwrap();
        await dispatch(markMessageAsRead(selectedUser._id)).unwrap();
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    };

    fetchData();

    socket.on("newMessage", (newMessage) => {
      console.log("📩 New message received:", newMessage);
      dispatch({ type: "messages/newMessageReceived", payload: newMessage });
      // Mark message as read if chat is open with this user
      if (newMessage.senderId === selectedUser._id) {
        dispatch(markMessageAsRead(selectedUser._id));
      }
    });

    socket.on("messagesRead", ({ userId }) => {
      dispatch({ type: "messages/messagesRead", payload: { userId } });
    });

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("messagesRead");
        dispatch(disconnectSocket());
      }
    };
  }, [socket, selectedUser, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }, [messages, selectedUser]);

  if (isGettingMessages) return <MsgLoading />;

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-primary">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`flex ${
              message.senderId === authUser._id
                ? "justify-end"
                : "justify-start"
            }`}
            ref={index === messages.length - 1 ? messageRef : null}
          >
            <div className="flex max-w-[75%] gap-2 items-end">
              {message.senderId !== authUser._id && (
                <div className="w-8 h-8 rounded-full border border-[#66666645] overflow-hidden flex-shrink-0">
                  <img
                    src={selectedUser.profileUrl || "/avatar.png"}
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`flex flex-col gap-1 ${
                  message.senderId === authUser._id
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.senderId === authUser._id
                      ? "bg-blue text-white rounded-br-sm"
                      : "bg-primary text-ascent-1 rounded-bl-sm"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-[200px] rounded-lg mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
                <span className="text-xs text-ascent-2">
                  {correctDate(message.createdAt)}
                </span>
              </div>

              {message.senderId === authUser._id && (
                <div className="w-8 h-8 rounded-full border border-[#66666645] overflow-hidden flex-shrink-0">
                  <img
                    src={authUser.profileUrl || "/avatar.png"}
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messageRef}></div>
      </div>
      <SendMsg />
    </div>
  );
};

export default ChatContainer;
