import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: { name: "John", _id: 1001, age: 20 },
  isLoggedIn: false,
  login: () => {
    console.log("We just logged in");
    set((prevState) => ({ isLoggedIn: !prevState.isLoggedIn }));
  },
}));
