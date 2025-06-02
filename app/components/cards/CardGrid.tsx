import { CardData, SingleCardData, CardGridData } from "@/types/card";

// 개별 카드 컴포넌트 - 가로 레이아웃용으로 수정
const SingleCard = ({ card }: { card: SingleCardData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow min-h-[180px] w-full">
      <div className="flex items-center gap-2 mb-3">
        {card.icon && <span className="text-lg">{card.icon}</span>}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
          {card.title}
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs leading-relaxed line-clamp-3">
        {card.description}
      </p>

      {/* Features와 Highlights를 간략하게 표시 */}
      <div className="space-y-2">
        {card.features && card.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-block bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
            {card.features.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{card.features.length - 3}개
              </span>
            )}
          </div>
        )}

        {card.highlights && card.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.highlights.slice(0, 2).map((highlight, index) => (
              <span
                key={index}
                className="inline-block bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs"
              >
                ★ {highlight}
              </span>
            ))}
            {card.highlights.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{card.highlights.length - 2}개
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ServiceCard = ({ card }: { card: CardGridData["cards"][0] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow min-h-[180px] w-full">
      <div className="flex flex-col h-full">
        <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white line-clamp-1">
          {card.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs leading-relaxed line-clamp-3 flex-1">
          {card.description}
        </p>

        {card.features && card.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-block bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
            {card.features.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{card.features.length - 3}개
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          {card.price && (
            <div className="text-sm font-bold text-teal-600 dark:text-teal-400">
              {card.price}
            </div>
          )}
          {card.link && (
            <a
              href={card.link}
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              보기
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const CardGrid = ({ cardData }: { cardData: CardData }) => {
  // 개별 카드인지 카드 그리드인지 확인
  if ("id" in cardData) {
    // 개별 카드 렌더링 - 반응형 그리드에 단일 카드
    return (
      <div className="my-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <SingleCard card={cardData} />
        </div>
      </div>
    );
  }

  // 카드 그리드 렌더링 - 반응형 그리드 레이아웃
  return (
    <div className="my-4 w-full">
      <h2 className="text-base font-bold mb-3 text-gray-900 dark:text-white">
        {cardData.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {cardData.cards.map((card, index) => (
          <ServiceCard key={`${card.title}-${index}`} card={card} />
        ))}
      </div>
    </div>
  );
};
