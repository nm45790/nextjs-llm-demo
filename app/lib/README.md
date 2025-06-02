# Lib

유틸리티 함수, 헬퍼, 설정 파일들을 이 폴더에 저장합니다.

## 구조

- `utils.ts` - 일반적인 유틸리티 함수들
- `constants.ts` - 상수 정의
- `api.ts` - API 관련 함수들
- `validations.ts` - 데이터 검증 함수들

## 예시

```typescript
// lib/utils.ts
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR").format(date);
}
```
