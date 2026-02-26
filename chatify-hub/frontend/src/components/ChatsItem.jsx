import { useChatStore } from "../store/useChatStore";

const ChatsItem = (props) => {
  const { chats, getChatPartners, isUsersLoading, setSelectedUser } =
    useChatStore();

  const { chat } = props;
  console.log(chat);
  const { fullName, profilePic } = chat;
  return (
    <li
      className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
      onClick={() => setSelectedUser(chat)}
    >
      <div className="flex items-center gap-3">
        <div className="avatar-online">
          <div className="size-12 rounded-full">
            <img
              src={
                profilePic ||
                "https://github.com/burakorkmez/chatify/blob/master/frontend/public/avatar.png?raw=true"
              }
              alt={fullName}
            />
          </div>
          <h4 className="text-slate-300 font-[550]">{fullName}</h4>
        </div>
      </div>
    </li>
  );
};

export default ChatsItem;
