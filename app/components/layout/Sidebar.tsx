"use client";

import { useState } from "react";
import { Button } from "../ui/Button";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [chatSessions] = useState<ChatSession[]>([
    { id: "1", title: "세종대왕에 대해 알려줘", timestamp: new Date() },
    {
      id: "2",
      title: "한글 창제 과정",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "3",
      title: "훈민정음의 특징",
      timestamp: new Date(Date.now() - 172800000),
    },
  ]);

  const handleSessionClick = (sessionId: string) => {
    console.log("채팅 세션 선택:", sessionId);
    // 여기에 채팅 세션 선택 로직 추가
  };

  const handleDeleteSession = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // 부모 클릭 이벤트 방지
    console.log("채팅 세션 삭제:", sessionId);
    // 여기에 채팅 세션 삭제 로직 추가
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <h2 className="text-lg font-semibold text-foreground">
                채팅 기록
              </h2>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 새 채팅 버튼 */}
          <div className="p-6">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              새로운 채팅
            </Button>
          </div>

          {/* 채팅 세션 목록 */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-2">
              {chatSessions.map((session, index) => (
                <div
                  key={session.id}
                  className="group relative p-4 rounded-xl hover:bg-accent/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/50"
                  onClick={() => handleSessionClick(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {session.timestamp.toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      aria-label="채팅 삭제"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 호버 시 그라데이션 보더 */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                </div>
              ))}
            </div>
          </div>

          {/* 푸터 */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span>LLM Demo v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
