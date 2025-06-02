"use client";

import { Header } from "./components/layout/Header";
import { ChatContainer } from "./components/chat/ChatContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main>
          <ChatContainer />
        </main>
      </div>
    </div>
  );
}
