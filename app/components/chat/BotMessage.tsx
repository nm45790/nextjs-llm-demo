import React from "react";
import { Avatar } from "./Avatar";
import { MessageMarkdown } from "./MessageMarkdown";
import { CardData } from "../../types/card";
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
    // 카드가 없는 경우 기본 렌더링
    if (!cards || cards.length === 0) {
      return (
        <div className="flex flex-col justify-start mb-6">
          <div className="flex items-start gap-3">
            <Avatar type="bot" />
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 max-w-[80%]">
                <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                  <MessageMarkdown content={currentDisplayed} />
                  {isStreaming && (
                    <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 typing-cursor"></span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {isClient ? timestamp.toLocaleTimeString() : ""}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 카드가 있는 경우: 순서를 유지하면서 카드 그리드만 통합
    const parts = currentDisplayed.split(/(\[CARD_PLACEHOLDER_\d+\])/);

    return (
      <div className="flex flex-col justify-start mb-6">
        <div className="flex items-start gap-3">
          <Avatar type="bot" />
          <div className="flex-1">
            {/* 통합된 메시지 컨테이너 */}
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 w-full">
              <div className="space-y-4">
                {parts.map((part, index) => {
                  const cardMatch = part.match(/\[CARD_PLACEHOLDER_(\d+)\]/);

                  if (cardMatch) {
                    // 카드 플레이스홀더인 경우
                    const cardId = cardMatch[1];
                    const cardIndex = parseInt(cardId) - 1;
                    const matchingCard = cards[cardIndex];

                    if (matchingCard) {
                      if ("id" in matchingCard) {
                        // 개별 카드
                        return (
                          <div
                            key={`single-card-${index}`}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow h-[160px] inline-block mr-3 mb-3"
                            style={{ width: "23%" }}
                          >
                            <div className="flex flex-col h-full">
                              <div className="flex items-center gap-2 mb-2">
                                {matchingCard.icon && (
                                  <span className="text-sm">
                                    {matchingCard.icon}
                                  </span>
                                )}
                                <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                  {matchingCard.title}
                                </h3>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-2 text-xs leading-relaxed line-clamp-2 flex-1">
                                {matchingCard.description}
                              </p>
                              {matchingCard.features &&
                                matchingCard.features.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {matchingCard.features
                                      .slice(0, 2)
                                      .map(
                                        (
                                          feature: string,
                                          featureIndex: number
                                        ) => (
                                          <span
                                            key={featureIndex}
                                            className="inline-block bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded-full text-xs"
                                          >
                                            {feature}
                                          </span>
                                        )
                                      )}
                                    {matchingCard.features.length > 2 && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        +{matchingCard.features.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      } else {
                        // 카드 그리드
                        return matchingCard.cards.map(
                          (serviceCard: any, serviceIndex: number) => (
                            <div
                              key={`service-card-${index}-${serviceIndex}`}
                              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow h-[160px] inline-block mr-3 mb-3"
                              style={{ width: "23%" }}
                            >
                              <div className="flex flex-col h-full">
                                <h3 className="text-xs font-semibold mb-2 text-gray-900 dark:text-white line-clamp-1">
                                  {serviceCard.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-2 text-xs leading-relaxed line-clamp-2 flex-1">
                                  {serviceCard.description}
                                </p>
                                {serviceCard.features &&
                                  serviceCard.features.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {serviceCard.features
                                        .slice(0, 2)
                                        .map(
                                          (
                                            feature: string,
                                            featureIndex: number
                                          ) => (
                                            <span
                                              key={featureIndex}
                                              className="inline-block bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded-full text-xs"
                                            >
                                              {feature}
                                            </span>
                                          )
                                        )}
                                      {serviceCard.features.length > 2 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          +{serviceCard.features.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                <div className="flex items-center justify-between mt-auto">
                                  {serviceCard.price && (
                                    <div className="text-xs font-bold text-teal-600 dark:text-teal-400">
                                      {serviceCard.price}
                                    </div>
                                  )}
                                  {serviceCard.link && (
                                    <a
                                      href={serviceCard.link}
                                      className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      보기
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        );
                      }
                    }
                    return null;
                  } else if (part.trim()) {
                    // 텍스트 부분
                    return (
                      <div
                        key={`text-${index}`}
                        className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                      >
                        <MessageMarkdown content={part} />
                      </div>
                    );
                  }
                  return null;
                })}

                {/* 스트리밍 커서 */}
                {isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 typing-cursor"></span>
                )}
              </div>
            </div>

            {/* 타임스탬프 */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {isClient ? timestamp.toLocaleTimeString() : ""}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderContentWithCards();
}
