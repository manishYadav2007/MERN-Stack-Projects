import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSignUp: false,
  isLogin: false,
  socket: null,
  onlineUsers: [],
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/verify");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log(`Error in authCheck: ${error}`);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSignUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success("Sign up successful!");
      get().connectSocket();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network Error: Unable to sign up";
      toast.error(errorMessage);
      console.error(`SignUp Error: ${error}`);
    } finally {
      set({ isSignUp: false });
    }
  },

  login: async (data) => {
    set({ isLogin: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success("Login successful!");
      get().connectSocket();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network Error: Unable to login";

      toast.error(errorMessage);
      console.error(`Login Error: ${error}`);
    } finally {
      set({ isLogin: false });
    }
  },

  logout: async () => {
    set({ isLoggedOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successful!");
      get().disconnectSocket();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network Error: Unable to logout";
      toast.error(errorMessage);
      console.log(`Logout Error: ${error}`);
    } finally {
      set({ isLoggedOut: false });
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    console.log("Sending data:", formData);
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        formData,
      );
      set({ authUser: response.data.updatedUser });
      toast.success("Profile updated successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Network Error: Unable to update profile";
      toast.error(errorMessage);
      console.error(`Profile Update Error: ${error}`);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();

    set({ socket });

    socket.on("onlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
