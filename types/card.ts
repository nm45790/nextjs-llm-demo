export interface CardData {
  title: string;
  cards: {
    title: string;
    description: string;
    features?: string[];
    price?: string;
    link?: string;
  }[];
}
