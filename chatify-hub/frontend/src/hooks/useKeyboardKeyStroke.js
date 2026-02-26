const keyStrokeSounds = [
  new Audio("sounds/keystroke1.mp3"),
  new Audio("sounds/keystroke2.mp3"),
  new Audio("sounds/keystroke3.mp3"),
  new Audio("sounds/keystroke4.mp3"),
];

const useKeyboardKeyStroke = () => {
  const playRandomKeyStrokeSound = () => {
    const randomIndex = Math.floor(Math.random() * keyStrokeSounds.length);
    const sound = keyStrokeSounds[randomIndex];
    sound.currentTime = 0; // Reset the sound to the beginning
    sound.play().catch((err) => {
      console.error("Error playing keystroke sound:", err);
    });
  };
  return { playRandomKeyStrokeSound };
};

export default useKeyboardKeyStroke;
