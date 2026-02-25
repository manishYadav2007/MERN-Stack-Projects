import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatWindowHeader from "./ChatWindowHeader";
import NoChatHistoryContainer from "./NoChatHistoryContainer";
import { useEffect } from "react";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
const ChatWindow = () => {
  const { selectedUser, getMessagesByUserId, isMessagesLoading, messages } =
    useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser?._id);
  }, [selectedUser, getMessagesByUserId]);

  return (
    <>
      <ChatWindowHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <ul className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message._id}
                message={message}
                isOwnMessage={message.senderId === authUser._id}
              />
            ))}
          </ul>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryContainer name={selectedUser?.name} />
        )}
      </div>

      <MessageInput />
    </>
  );
};

export default ChatWindow;
