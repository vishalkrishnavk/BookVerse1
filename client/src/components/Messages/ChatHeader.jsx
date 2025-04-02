import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../../redux/messageSlice";

const ChatHeader = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.messages);
  const { onlineUsers } = useSelector((state) => state.user);

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-[#66666645] bg-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profileUrl || "/avatar.png"}
                alt={selectedUser.firstName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-ascent-1">
              {selectedUser.firstName}
            </h3>
            <p className="text-sm text-ascent-2">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => dispatch(setSelectedUser(null))}
          className="text-ascent-1"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
