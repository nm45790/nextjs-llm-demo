import React from "react";
import { Avatar } from "./Avatar";
import { MessageMarkdown } from "./MessageMarkdown";
import { CardGrid } from "../cards/CardGrid";
import { CardData } from "@/types/card";
import { useEffect, useState, useRef } from "react";

interface BotMessageProps {
  content: string;
  displayedContent?: string;
  timestamp: Date;
  cards?: CardData[];
  isStreaming?: boolean;
}

export function BotMessage({
  content,
  displayedContent,
  timestamp,
  cards,
  isStreaming,
}: BotMessageProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentDisplayed, setCurrentDisplayed] = useState(
    displayedContent || ""
  );
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    setCurrentDisplayed(newDisplayText);
    currentIndexRef.current = startIndex + 1;

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

  // content가 변경될 때 타이핑 애니메이션 시작
  useEffect(() => {
    if (isStreaming && content && content.length > currentDisplayed.length) {
      // 현재 표시된 텍스트보다 새로운 content가 더 길면 애니메이션 시작
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      animateTyping(content, currentDisplayed.length);
    } else if (!isStreaming) {
      // 스트리밍이 완료되면 전체 텍스트 표시
      setCurrentDisplayed(content);
    }
  }, [content, isStreaming]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // 마크다운 텍스트를 파싱하여 카드 플레이스홀더 위치에 카드 삽입
  const renderContentWithCards = () => {
    if (!cards || cards.length === 0) {
      return (
        <div className="flex flex-col justify-start mb-6">
          <div className="flex items-start gap-3 max-w-[80%]">
            <Avatar type="bot" />
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 flex-1">
              <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                <MessageMarkdown content={currentDisplayed} />
                {isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 typing-cursor"></span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {isClient ? timestamp.toLocaleTimeString() : ""}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 카드 플레이스홀더로 텍스트 분할
    const parts = currentDisplayed.split(/(\[CARD_PLACEHOLDER_\d+\])/);
    const elements: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      const cardMatch = part.match(/\[CARD_PLACEHOLDER_(\d+)\]/);

      if (cardMatch) {
        // 카드 플레이스홀더인 경우 - 전체 너비 사용
        const cardIndex = parseInt(cardMatch[1]) - 1;
        if (cards[cardIndex]) {
          elements.push(
            <div key={`card-${index}`} className="my-6 w-full">
              <CardGrid cardData={cards[cardIndex]} />
            </div>
          );
        }
      } else if (part.trim()) {
        // 일반 텍스트인 경우 - 80% 너비 제한
        elements.push(
          <div
            key={`text-${index}`}
            className="flex items-start gap-3 max-w-[80%] mb-4"
          >
            <Avatar type="bot" />
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 flex-1">
              <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                <MessageMarkdown content={part} />
              </div>
            </div>
          </div>
        );
      }
    });

    // 스트리밍 중이면 마지막에 타이핑 커서 추가
    if (isStreaming) {
      const lastTextIndex = elements.length - 1;
      if (lastTextIndex >= 0) {
        // 마지막 텍스트 요소에 커서 추가
        elements[lastTextIndex] = (
          <div
            key={`text-${lastTextIndex}`}
            className="flex items-start gap-3 max-w-[80%] mb-4"
          >
            <Avatar type="bot" />
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 flex-1">
              <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                <MessageMarkdown content={parts[parts.length - 1]} />
                <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 typing-cursor"></span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {isClient ? timestamp.toLocaleTimeString() : ""}
              </div>
            </div>
          </div>
        );
      }
    } else {
      // 스트리밍이 완료되면 마지막 텍스트 요소에 타임스탬프 추가
      const lastTextIndex = elements.length - 1;
      if (lastTextIndex >= 0) {
        elements[lastTextIndex] = (
          <div
            key={`text-${lastTextIndex}`}
            className="flex items-start gap-3 max-w-[80%] mb-4"
          >
            <Avatar type="bot" />
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 flex-1">
              <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                <MessageMarkdown content={parts[parts.length - 1]} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {isClient ? timestamp.toLocaleTimeString() : ""}
              </div>
            </div>
          </div>
        );
      }
    }

    return <div className="flex flex-col justify-start mb-6">{elements}</div>;
  };

  return renderContentWithCards();
}
