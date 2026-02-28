import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatsItem = (props) => {
  const { chats, getChatPartners, isUsersLoading, setSelectedUser } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  const { chat } = props;
  console.log(chat);
  const { fullName, profilePic } = chat;
  const isOnline = onlineUsers.includes(chat._id);
  return (
    <li
      className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
      onClick={() => setSelectedUser(chat)}
    >
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="relative">
            <div className="size-12 rounded-full overflow-hidden">
              <img
                src={
                  profilePic ||
                  "https://github.com/burakorkmez/chatify/blob/master/frontend/public/avatar.png?raw=true"
                }
                alt={fullName}
              />
            </div>

            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ring-2 ring-slate-800 ${
                isOnline ? "bg-green-400" : "bg-black"
              }`}
            />
          </div>
        </div>

        <h4 className="text-slate-300 font-[550]">{fullName}</h4>
      </div>
    </li>
  );
};

export default ChatsItem;
