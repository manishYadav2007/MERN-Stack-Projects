import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
}));
