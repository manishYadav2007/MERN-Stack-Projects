import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isImageUploading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  // actions
  toggleSound: () => {
    const isSoundEnabled = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(isSoundEnabled));
    set({ isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("messages/contacts");
      set({ allContacts: response.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.messages ||
        "Network Error: Unable to fetch contacts";
      toast.error(errorMessage);
      console.error(`Error fetching contacts: ${errorMessage}`);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getChatPartners: async () => {
    set({ isImageUploading: true });
    try {
      const response = await axiosInstance.get("messages/chats");
      set({ chats: response.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.messages ||
        "Network Error: Unable to fetch chat partners";
      toast.error(errorMessage);
      console.error(`Error fetching chat partners: ${errorMessage}`);
    } finally {
      set({ isImageUploading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`messages/${userId}`);
      console.log(response.data);
      set({ messages: response.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.messages ||
        "Network Error: Unable to fetch messages";
      toast.error(errorMessage);
      console.error(`Error fetching messages: ${errorMessage}`);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMsg: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      message: messageData.message,
      createdAt: new Date(),
      image: messageData.image,
      isOptimistic: true, // Flag to identify optimistic messages
    };

    set({ messages: [...messages, optimisticMessage] });
    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );

      set({ messages: messages.concat(response.data) });
    } catch (error) {
      set({ messages: messages });
      const errorMessage =
        error.response?.data?.messages ||
        "Network Error: Unable to send message";
      toast.error(errorMessage);
      console.error(`Error sending message: ${errorMessage}`);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (message) => {
      const isMessageFromSelectedUser = message.senderId === selectedUser._id;
      if (!isMessageFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, message] });
      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((error) => console.log(`Audio Play failed: ${error}`));
      }
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
