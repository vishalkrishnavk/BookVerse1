import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import NoChatSelected from "./NoChatSelected";
import ChatContainer from "./ChatContainer";

const ChatHome = () => {
  const selectedUser = useSelector((state) => state.messages.selectedUser);

  return (
    <div className="h-screen bg-bgColor">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full bg-primary rounded-lg overflow-hidden shadow-sm">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
