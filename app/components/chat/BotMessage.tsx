import { Avatar } from "./Avatar";
import { MessageMarkdown } from "./MessageMarkdown";
import { CardGrid } from "../cards/CardGrid";
import { CardData } from "@/types/card";

interface BotMessageProps {
  content: string;
  timestamp: Date;
  cards?: CardData[];
}

export function BotMessage({ content, timestamp, cards }: BotMessageProps) {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start gap-3 max-w-[80%]">
        <Avatar type="bot" />

        <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 flex-1">
          <MessageMarkdown content={content} />

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* 카드 표시 */}
      {cards && cards.length > 0 && (
        <div className="mt-4 w-full">
          {cards.map((cardData, index) => (
            <div key={`bot-card-${index}`} className="animate-fadeIn">
              <CardGrid cardData={cardData} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
