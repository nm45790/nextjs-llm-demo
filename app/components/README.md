# Components

재사용 가능한 React 컴포넌트들을 이 폴더에 저장합니다.

## 구조

- `ui/` - 기본 UI 컴포넌트 (버튼, 입력 필드 등)
- `layout/` - 레이아웃 관련 컴포넌트 (헤더, 푸터 등)
- `features/` - 기능별 컴포넌트

## 예시

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        variant === "primary"
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}
```
