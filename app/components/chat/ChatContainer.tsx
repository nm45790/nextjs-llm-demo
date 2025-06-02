"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { CardData } from "../../types/card";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  cards?: CardData[];
  isStreaming?: boolean; // 스트리밍 중인지 여부
  displayedContent?: string; // 타이핑 애니메이션용 표시 텍스트
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [currentStreamingId, setCurrentStreamingId] = useState<string>("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 초기 로딩이 아닐 때만 스크롤
    if (!isInitialLoad) {
      scrollToBottom();
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    // 컴포넌트 마운트 후 초기 로딩 상태 해제
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 메시지 전송 함수
  const handleSendMessage = async (content: string) => {
    // 메시지 전송 시에는 스크롤 허용
    setIsInitialLoad(false);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // 스트리밍 메시지 초기화
    const streamingId = (Date.now() + 1).toString();
    setCurrentStreamingId(streamingId);

    const initialStreamingMessage: Message = {
      id: streamingId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
      displayedContent: "", // 타이핑 애니메이션용 초기값
    };

    setMessages((prev) => [...prev, initialStreamingMessage]);

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

                // 실시간으로 메시지 업데이트
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingId
                      ? {
                          ...msg,
                          content: accumulatedMessage,
                        }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      // 스트리밍 완료 후 플레이스홀더 감지 및 카드 데이터 조회
      const placeholderMatches = accumulatedMessage.match(
        /\[CARD_PLACEHOLDER_(\d+)\]/g
      );
      if (placeholderMatches) {
        console.log("플레이스홀더 감지:", placeholderMatches);

        const cardPromises = placeholderMatches.map(async (placeholder) => {
          const match = placeholder.match(/\[CARD_PLACEHOLDER_(\d+)\]/);
          if (match) {
            const cardId = match[1];
            try {
              console.log(`카드 ID ${cardId} 조회 중...`);
              const cardResponse = await fetch(`/api/cards/${cardId}`);
              if (cardResponse.ok) {
                const cardData = await cardResponse.json();
                console.log(`카드 ID ${cardId} 조회 완료:`, cardData.title);
                return cardData;
              }
            } catch (error) {
              console.error(`카드 ID ${cardId} 조회 실패:`, error);
            }
          }
          return null;
        });

        const cardResults = await Promise.all(cardPromises);
        const validCards = cardResults.filter((card) => card !== null);

        console.log("조회된 카드 데이터:", validCards.length, "개");
        console.log("카드 데이터 상세:", validCards);

        // 카드 데이터를 메시지에 추가
        setMessages((prev) => {
          console.log("메시지 업데이트 중... 현재 메시지 수:", prev.length);
          const updated = prev.map((msg) =>
            msg.id === streamingId
              ? {
                  ...msg,
                  cards: validCards,
                }
              : msg
          );
          console.log("업데이트된 메시지 수:", updated.length);
          return updated;
        });
      }

      // 스트리밍 완료 - isStreaming 플래그 제거
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingId
            ? {
                ...msg,
                isStreaming: false,
              }
            : msg
        )
      );

      setIsLoading(false);
      setCurrentStreamingId("");
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setCurrentStreamingId("");

      // 에러 발생 시 스트리밍 메시지 제거
      setMessages((prev) => prev.filter((msg) => msg.id !== streamingId));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="p-6 space-y-6 pb-24">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={message.isStreaming}
          />
        ))}

        {/* 로딩 인디케이터 */}
        {isLoading && !currentStreamingId && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* 하단 고정 입력창 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="w-full max-w-6xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
