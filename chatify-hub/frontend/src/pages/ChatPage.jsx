
import React from "react";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTab from "../components/ActiveTab";
import ChatPartners from "../components/ChatPartners";
import ContactLists from "../components/ContactLists";
import { useChatStore } from "../store/useChatStore";
import AnimatedBorderContainer from "../components/AnimatedBorderContainer";
import ChatWindow from "../components/ChatWindow";
// import NoConversionPlaceholder from "../components/NoConversionPlaceholder";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <AnimatedBorderContainer>
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTab />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatPartners /> : <ContactLists />}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatWindow /> : <NoConversationPlaceholder />}
        </div>
      </AnimatedBorderContainer>
    </div>
  );
};

export default ChatPage;
