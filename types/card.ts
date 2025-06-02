// 개별 카드 데이터 타입
export interface SingleCardData {
  type: "service_card" | "strength_card";
  id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  highlights?: string[];
  color?: string;
}

// 카드 그리드 데이터 타입 (기존)
export interface CardGridData {
  type: "service_cards" | "strength_cards";
  title: string;
  cards: {
    title: string;
    description: string;
    features?: string[];
    price?: string;
    link?: string;
  }[];
}

// 통합 카드 데이터 타입
export type CardData = SingleCardData | CardGridData;
