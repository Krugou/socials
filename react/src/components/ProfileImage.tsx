interface ProfileImageProps {
  visible: boolean;
  isDarkMode: boolean;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  visible,
  isDarkMode,
}) => {
  if (!visible) {
    return (
      <div
        className={`mx-auto mb-6 h-32 w-32 rounded-full animate-pulse ${
          isDarkMode ? 'bg-card/40' : 'bg-white/5'
        }`}
      ></div>
    );
  }

  return (
    <div
      className={`relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full ring-4 transition-transform hover:scale-105 ${
        isDarkMode ? 'ring-purple-500/50 bg-background/80' : 'ring-purple-500/30 bg-white/10'
      }`}
    >
      <img
        src="https://avatars.githubusercontent.com/u/59641229?v=4"
        alt="Profile"
        className="h-full w-full object-cover"
      />
    </div>
  );
};
