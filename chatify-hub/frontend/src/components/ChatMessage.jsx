import { useAuthStore } from "../store/useAuthStore";

const ChatMessage = (props) => {
  const { message, isOwnMessage } = props;
  const { text, image, senderId, receiverId, createdAt } = message;
  const { authUser } = useAuthStore();
  return (
    <li
      className={`chat ${senderId === authUser._id ? "chat-end" : "chat-start"}`}
    >
      <div
        className={`chat-bubble relative ${
          senderId === authUser._id
            ? "bg-cyan-600 text-white"
            : "bg-slate-800 text-slate-200"
        }`}
      >
        {image && (
          <img src={image} alt="" className="rounded-lg h-48 object-cover" />
        )}{" "}
        {text && <p className="mt-2">{text}</p>}
        <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
          {new Date(createdAt).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </li>
  );
};

export default ChatMessage;
