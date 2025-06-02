"use client";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">M</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              메디씨앤씨 AI
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
