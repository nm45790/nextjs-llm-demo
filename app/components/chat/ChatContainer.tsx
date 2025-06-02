"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { StreamingMessage } from "./StreamingMessage";
import { LoadingIndicator } from "./LoadingIndicator";
import { CardData } from "@/types/card";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  cards?: CardData[];
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "안녕하세요! 저는 메디씨앤씨와 의료 IT 솔루션에 대해 알려드리는 AI입니다. 궁금한 점이 있으시면 언제든 물어보세요.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [displayedMessage, setDisplayedMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTypingIndexRef = useRef<number>(0);
  const [receivedCards, setReceivedCards] = useState<CardData[]>([]);
  const [displayedCards, setDisplayedCards] = useState<CardData[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 타이핑 애니메이션 함수
  const animateTyping = (targetText: string, startIndex: number = 0) => {
    if (startIndex >= targetText.length) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const currentChar = targetText[startIndex];
    const newDisplayText = targetText.slice(0, startIndex + 1);
    setDisplayedMessage(newDisplayText);
    currentTypingIndexRef.current = startIndex + 1;

    // 플레이스홀더 감지 및 카드 표시 동기화
    const placeholderMatches = newDisplayText.match(
      /\[CARD_PLACEHOLDER_(\d+)\]/g
    );
    if (placeholderMatches) {
      const placeholderNumbers = placeholderMatches.map((match) =>
        parseInt(match.match(/\[CARD_PLACEHOLDER_(\d+)\]/)?.[1] || "0")
      );

      const cardsToShow = receivedCards.filter((_, index) =>
        placeholderNumbers.includes(index + 1)
      );

      if (cardsToShow.length !== displayedCards.length) {
        setDisplayedCards(cardsToShow);
      }
    }

    let delay = 15;
    if (currentChar === "." || currentChar === "!" || currentChar === "?") {
      delay = 150;
    } else if (currentChar === "," || currentChar === ";") {
      delay = 100;
    } else if (currentChar === " ") {
      delay = 30;
    }

    typingTimeoutRef.current = setTimeout(() => {
      animateTyping(targetText, startIndex + 1);
    }, delay);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedMessage, displayedCards]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // 메시지 전송 함수
  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setStreamingMessage("");
    setDisplayedMessage("");
    setReceivedCards([]);
    setDisplayedCards([]);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      abortControllerRef.current = new AbortController();
      let accumulatedMessage = "";
      const receivedCardData: CardData[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "text") {
                accumulatedMessage += data.content;
                setStreamingMessage(accumulatedMessage);
              } else if (data.type === "card") {
                receivedCardData.push(data.content);
                setReceivedCards([...receivedCardData]);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      // 스트리밍 완료 후 타이핑 애니메이션 시작
      setIsLoading(false);
      animateTyping(accumulatedMessage);

      // 최종 메시지 저장
      const finalMessage: Message = {
        id: Date.now().toString(),
        content: accumulatedMessage,
        role: "assistant",
        timestamp: new Date(),
        cards: receivedCardData.length > 0 ? receivedCardData : undefined,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, finalMessage]);
        setStreamingMessage("");
        setDisplayedMessage("");
        setDisplayedCards([]);
      }, accumulatedMessage.length * 15 + 500);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setStreamingMessage("");
      setDisplayedMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* 스트리밍 메시지 표시 */}
        {(streamingMessage || displayedMessage) && (
          <StreamingMessage
            displayedMessage={displayedMessage}
            displayedCards={displayedCards}
            isTyping={
              !!displayedMessage &&
              displayedMessage.length < streamingMessage.length
            }
          />
        )}

        {/* 로딩 인디케이터 */}
        {isLoading && !streamingMessage && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
