import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader = () => {
  const { isSoundEnabled, toggleSound , isImageUploading} = useChatStore();
  const { authUser, logout, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null);

  const onChangeImageFileInput = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        updateProfile({ profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("No file selected");
    }
  };

  return (
    <>
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar online">
              <button
                className="size-14 rounded-full overflow-hidden relative group"
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={
                    selectedImage ||
                    authUser?.profilePic ||
                    "https://github.com/burakorkmez/chatify/blob/master/frontend/public/avatar.png?raw=true"
                  }
                  alt="User image"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
              </button>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={onChangeImageFileInput}
              />
            </div>

            <div>
              <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                {authUser.fullName}
              </h3>

              <p className="text-slate-400 text-xs">Online</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {/* LOGOUT BTN */}
            <button
              className="text-slate-400 hover:text-slate-200 transition-colors"
              onClick={logout}
            >
              <LogOutIcon className="size-5" />
            </button>

            {/* SOUND TOGGLE BTN */}
            <button
              className="text-slate-400 hover:text-slate-200 transition-colors"
              onClick={() => {
                // play click sound before toggling
                mouseClickSound.currentTime = 0; // reset to start
                mouseClickSound
                  .play()
                  .catch((error) => console.log("Audio play failed:", error));
                toggleSound();
              }}
            >
              {isSoundEnabled ? (
                <Volume2Icon className="size-5" />
              ) : (
                <VolumeOffIcon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
