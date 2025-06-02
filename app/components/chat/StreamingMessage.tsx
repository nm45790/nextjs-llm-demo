import { Avatar } from "./Avatar";
import { MessageMarkdown } from "./MessageMarkdown";
import { CardGrid } from "../cards/CardGrid";
import { CardData } from "@/types/card";

interface StreamingMessageProps {
  displayedMessage: string;
  displayedCards: CardData[];
  isTyping: boolean;
}

export function StreamingMessage({
  displayedMessage,
  displayedCards,
  isTyping,
}: StreamingMessageProps) {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start gap-3 max-w-[80%]">
        <Avatar type="bot" />

        <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 flex-1">
          <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
            <MessageMarkdown content={displayedMessage} />
            {isTyping && (
              <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 typing-cursor"></span>
            )}
          </div>
        </div>
      </div>

      {/* 받은 카드들 표시 */}
      {displayedCards.length > 0 && (
        <div className="my-6">
          {displayedCards.map((cardData, index) => (
            <div key={`streaming-card-${index}`} className="animate-fadeIn">
              <CardGrid cardData={cardData} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
