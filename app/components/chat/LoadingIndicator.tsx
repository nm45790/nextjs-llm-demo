import { Avatar } from "./Avatar";

export function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start gap-3 max-w-[80%]">
        <Avatar type="bot" />

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              응답을 생성하고 있습니다...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
