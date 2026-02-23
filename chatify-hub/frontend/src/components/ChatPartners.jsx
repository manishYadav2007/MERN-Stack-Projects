import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatPartnerMessages from "./NoChatPartnersMessages";
import ChatsItem from "./ChatsItem";

const ChatPartners = () => {
  const { chats, getChatPartners, isUsersLoading, setSelectedUser } =
    useChatStore();
  useEffect(() => {
    getChatPartners();
  }, [getChatPartners]); 


    if(isUsersLoading) return <UsersLoadingSkeleton/>
    if (chats.length === 0)  return <NoChatPartnerMessages/>

    return (
      <>
      <ul>
        {chats.map((chat) => (
          <ChatsItem key={chat._id} chat={chat} />
        ))}
      </ul>
      </>
    )

  };


export default ChatPartners;
