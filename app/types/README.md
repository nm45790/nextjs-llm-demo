# Types

TypeScript 타입 정의들을 이 폴더에 저장합니다.

## 구조

- `index.ts` - 공통 타입 정의
- `api.ts` - API 관련 타입들
- `components.ts` - 컴포넌트 관련 타입들

## 예시

```typescript
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```
