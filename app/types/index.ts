// 채팅 관련 타입들
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// UI 컴포넌트 관련 타입들
export interface ButtonVariant {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

// API 관련 타입들
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface LLMRequest {
  message: string;
  sessionId?: string;
  model?: string;
}

export interface LLMResponse {
  response: string;
  sessionId: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
