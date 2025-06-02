"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatTime } from "../../lib/utils";
import { UserMessage } from "./UserMessage";
import { BotMessage } from "./BotMessage";
import { CardData } from "@/types/card";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  cards?: CardData[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <UserMessage content={message.content} timestamp={message.timestamp} />
    );
  }

  return (
    <BotMessage
      content={message.content}
      timestamp={message.timestamp}
      cards={message.cards}
    />
  );
}
