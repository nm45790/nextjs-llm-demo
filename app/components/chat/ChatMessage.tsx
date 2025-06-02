"use client";

import { UserMessage } from "./UserMessage";
import { BotMessage } from "./BotMessage";
import { CardData } from "../../types/card";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  cards?: CardData[];
  displayedContent?: string;
  isLoadingCards?: boolean;
}

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <UserMessage content={message.content} timestamp={message.timestamp} />
    );
  }

  return (
    <BotMessage
      content={message.content}
      displayedContent={message.displayedContent}
      timestamp={message.timestamp}
      cards={message.cards}
      isStreaming={isStreaming}
      isLoadingCards={message.isLoadingCards}
    />
  );
}
