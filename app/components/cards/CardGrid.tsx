import { CardData } from "@/types/card";

const ServiceCard = ({ card }: { card: CardData["cards"][0] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        {card.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
        {card.description}
      </p>
      <ul className="space-y-2 mb-4">
        {card.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="text-teal-500 mt-0.5">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {card.price && (
        <div className="text-lg font-bold text-teal-600 dark:text-teal-400 mb-3">
          {card.price}
        </div>
      )}
      {card.link && (
        <a
          href={card.link}
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          자세히 보기
        </a>
      )}
    </div>
  );
};

export const CardGrid = ({ cardData }: { cardData: CardData }) => {
  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {cardData.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardData.cards.map((card) => (
          <ServiceCard key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
};
