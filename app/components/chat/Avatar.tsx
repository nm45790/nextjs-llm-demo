interface AvatarProps {
  type: "bot" | "user";
  className?: string;
}

export function Avatar({ type, className = "" }: AvatarProps) {
  const isBot = type === "bot";

  return (
    <div
      className={`w-8 h-8 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center flex-shrink-0 mt-1 ${className}`}
    >
      <span className="text-white text-lg">{isBot ? "🤖" : "👤"}</span>
    </div>
  );
}
