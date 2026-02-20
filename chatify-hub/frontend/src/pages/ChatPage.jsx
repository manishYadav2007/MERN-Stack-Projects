import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  const { logout } = useAuthStore();

  return (
    <>
      <button className="btn btn-group z-10" onClick={logout}>
        Logout
      </button>
    </>
  );
};

export default ChatPage;
