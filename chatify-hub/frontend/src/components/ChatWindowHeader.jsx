import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { XIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ChatWindowHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);
  console.log(isOnline);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
      window.addEventListener("keydown", handleEscKey);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 h-20 px-6"
    >
      {/* wrapper to keep avatar/name on left and button on right */}
      <div className="flex justify-between items-center w-full">
        <div
          className={`flex items-center gap-3 ${isOnline ? "avatar online" : "avatar offline"}`}
        >
          {/* make avatar a fixed square using utility classes */}
          <div className="size-14 rounded-full overflow-hidden">
            <img
              src={
                selectedUser.profilePic ||
                "https://github.com/burakorkmez/chatify/blob/master/frontend/public/avatar.png?raw=true"
              }
              className="size-full object-cover"
              alt={selectedUser.fullName}
            />
          </div>

          <div>
            <h3 className="text-slate-200 font-medium truncate max-w-[150px]">
              {selectedUser.fullName}
            </h3>
            <p className="text-slate-400 text-sm">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* close button stays rightmost */}
        <button onClick={() => setSelectedUser(null)}>
          <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindowHeader;
