import { NextRequest } from "next/server";

// 개별 카드 데이터 정의 (각 카드가 고유 ID를 가짐)
const CARD_DATA: Record<string, any> = {
  "1": {
    type: "service_card",
    id: "his",
    title: "병원정보시스템 (HIS)",
    description: "통합 병원 관리 시스템 구축 및 운영",
    icon: "🏥",
    features: ["환자 관리", "진료 관리", "수납 관리", "실시간 데이터 처리"],
    color: "blue",
  },
  "2": {
    type: "service_card",
    id: "emr",
    title: "전자의무기록 (EMR)",
    description: "디지털 의무기록 시스템으로 종이 차트 완전 대체",
    icon: "📋",
    features: ["디지털 기록", "업무 효율성", "환자 안전성", "법적 준수"],
    color: "green",
  },
  "3": {
    type: "service_card",
    id: "ocs",
    title: "처방전달시스템 (OCS)",
    description: "전자처방전 시스템으로 정확하고 신속한 처방 전달",
    icon: "💊",
    features: ["전자처방", "상호작용 체크", "오류 방지", "실시간 연동"],
    color: "purple",
  },
  "4": {
    type: "service_card",
    id: "pacs",
    title: "의료영상저장전송시스템 (PACS)",
    description: "의료 영상 데이터 디지털 저장 및 전송",
    icon: "🔬",
    features: ["영상 저장", "빠른 처리", "원격 판독", "장기 보관"],
    color: "orange",
  },
  "5": {
    type: "strength_card",
    id: "tech",
    title: "기술 혁신",
    description: "최신 IT 기술 적극 도입 및 활용",
    icon: "💡",
    highlights: ["클라우드 기반", "모바일 최적화", "AI/ML 기술"],
    color: "blue",
  },
  "6": {
    type: "strength_card",
    id: "service",
    title: "고객 중심 서비스",
    description: "24시간 기술 지원 및 맞춤형 솔루션",
    icon: "🤝",
    highlights: ["24시간 지원", "맞춤형 설계", "지속적 개선"],
    color: "green",
  },
  "7": {
    type: "strength_card",
    id: "security",
    title: "보안 및 안정성",
    description: "의료 데이터 보안 최고 수준 보장",
    icon: "🔒",
    highlights: ["데이터 보안", "개인정보보호", "재해복구"],
    color: "red",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log(`[카드 API] 카드 ID ${id} 조회 요청`);

    const cardData = CARD_DATA[id];

    if (!cardData) {
      console.log(`[카드 API] 카드 ID ${id}를 찾을 수 없음`);
      return new Response(JSON.stringify({ error: "Card not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`[카드 API] 카드 ID ${id} 데이터 반환:`, cardData.title);

    return new Response(JSON.stringify(cardData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[카드 API] 오류:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
