import { Avatar } from "./Avatar";

interface UserMessageProps {
  content: string;
  timestamp: Date;
}

export function UserMessage({ content, timestamp }: UserMessageProps) {
  return (
    <div className="flex justify-end mb-6">
      <div className="flex items-start gap-3 max-w-[80%]">
        <div className="bg-teal-600 text-white rounded-lg px-4 py-3 flex-1">
          <div className="text-sm leading-relaxed">{content}</div>
          <div className="text-xs text-white/70 mt-2">
            {timestamp.toLocaleTimeString()}
          </div>
        </div>
        <Avatar type="user" />
      </div>
    </div>
  );
}
