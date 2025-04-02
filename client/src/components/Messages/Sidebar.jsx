import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setSelectedUser } from "../../redux/messageSlice";
import { User } from "lucide-react";
import { connectSocket, disconnectSocket } from "../../redux/userSlice";
import { getSocket } from "../../utils/socketService";

const Sidebar = () => {
  const dispatch = useDispatch();

  const { users, selectedUser, isUsersLoading } = useSelector(
    (state) => state.messages
  );
  const { onlineUsers } = useSelector((state) => state.user);
  const socket = getSocket();

  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  useEffect(() => {
    dispatch(getUsers());

    if (!socket) {
      dispatch(connectSocket());
    }

    // ✅ Wait for the socket to initialize before setting up event listeners
    const interval = setInterval(() => {
      const activeSocket = getSocket();
      if (activeSocket) {
        console.log("✅ Socket connected:", activeSocket.id);

        activeSocket.on("newMessage", (newMessage) => {
          console.log("📩 New message received:", newMessage);
          dispatch({
            type: "messages/newMessageReceived",
            payload: newMessage,
          });
        });

        activeSocket.on("messagesRead", ({ userId }) => {
          dispatch({ type: "messages/messagesRead", payload: { userId } });
        });

        clearInterval(interval); // Stop checking once socket is ready
      }
    }, 500);

    return () => {
      const activeSocket = getSocket();
      if (activeSocket) {
        activeSocket.off("newMessage");
        activeSocket.off("messagesRead");
      }
      dispatch(disconnectSocket());
      clearInterval(interval); // Cleanup interval on unmount
    };
  }, [dispatch]);

  const filteredUsers = showOnlineUsers
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  /* if (isUsersLoading) return */

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-[#66666645] bg-primary flex flex-col transition-all duration-200">
      <div className="border-b border-[#66666645] w-full p-5">
        <div className="flex items-center gap-2">
          <User className="size-6 text-ascent-1" />
          <span className="font-medium hidden lg:block text-ascent-1">
            Contacts
          </span>
        </div>

        {/* Toggle Online Users */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineUsers}
              onChange={(e) => setShowOnlineUsers(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-ascent-2">Show online only</span>
          </label>
          <span className="text-xs text-ascent-2">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => dispatch(setSelectedUser(user))}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-[#66666645] transition-colors
              ${selectedUser?._id === user._id ? "bg-[#66666645]" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profileUrl || "/avatar.png"}
                alt={user.firstName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate text-ascent-1">
                {user.firstName}
              </div>
              <div className="text-sm text-ascent-2">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
            {user.hasUnreadMessages && (
              <div className="hidden lg:block relative">
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-20 size-3 bg-[#991C97] rounded-full" />
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
