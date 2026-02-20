import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSignUp: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/verify");
      set({ authUser: response.data });
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
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network Error: Unable to sign up";
      toast.error(errorMessage);
      console.error(`SignUp Error: ${error}`);
    } finally {
      set({ isSignUp: false });
    }
  },
}));
