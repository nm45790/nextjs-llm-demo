import { NextRequest } from "next/server";

// 인사 응답
const GREETING_RESPONSE = `안녕하세요! 👋

저는 **메디씨앤씨 전문 AI**입니다. 메디씨앤씨의 모든 서비스와 솔루션에 대해 자세히 알려드릴 수 있습니다.

🔍 **이런 것들을 물어보세요:**
- 메디씨앤씨 회사 소개
- 주요 서비스 및 솔루션
- 의료 IT 기술과 혁신
- 병원 정보시스템 (HIS)
- 전자의무기록 (EMR) 솔루션
- 고객 지원 및 문의 방법

궁금한 점이 있으시면 언제든 편하게 물어보세요! 😊`;

// 메디씨앤씨에 대한 하드코딩된 응답 텍스트 (마크다운만, 카드 데이터는 별도 전송)
const MEDICNC_RESPONSE = `# 🏥 메디씨앤씨 (MediCNC)

> *"의료 IT 혁신을 통한 더 나은 의료 서비스 구현"*

메디씨앤씨는 **의료 정보기술(IT) 전문 기업**으로, 병원과 의료기관의 디지털 혁신을 선도하는 대한민국의 대표적인 의료 IT 솔루션 제공업체입니다.

---

## 🌟 주요 서비스

[CARD_PLACEHOLDER_1]

### 📊 5. 의료 데이터 분석 솔루션
- **빅데이터 분석**을 통한 의료 인사이트 제공 📈
- **AI 기반 진단 보조** 시스템
- **병원 경영 분석** 및 최적화 컨설팅
- **예측 분석**을 통한 선제적 의료 서비스

---

## 🏆 핵심 강점

[CARD_PLACEHOLDER_2]

---

## 🎯 비전 및 미션

### 🌟 비전
> "의료 IT 기술을 통해 모든 사람이 더 나은 의료 서비스를 받을 수 있는 세상 만들기"

### 🎯 미션
- **의료진의 업무 효율성** 극대화
- **환자 안전 및 만족도** 향상
- **의료기관 경영 최적화** 지원
- **의료 서비스 접근성** 개선

---

## 📞 문의 및 지원

### 🏢 본사 정보
- **주소**: 서울특별시 강남구 (구체적 주소는 공식 홈페이지 참조)
- **대표전화**: 1588-0000 (예시)
- **이메일**: info@medicnc.co.kr (예시)

💡 **메디씨앤씨에 대해 더 궁금한 점이 있으시면 언제든 물어보세요!**

*더 자세한 정보는 공식 홈페이지를 참조해주세요.*`;

// 카드 데이터 정의
const CARD_DATA: Record<string, any> = {
  CARD_PLACEHOLDER_1: {
    type: "service_cards",
    title: "메디씨앤씨 핵심 서비스",
    cards: [
      {
        id: "his",
        title: "병원정보시스템 (HIS)",
        description: "통합 병원 관리 시스템 구축 및 운영",
        icon: "🏥",
        features: ["환자 관리", "진료 관리", "수납 관리", "실시간 데이터 처리"],
        color: "blue",
      },
      {
        id: "emr",
        title: "전자의무기록 (EMR)",
        description: "디지털 의무기록 시스템으로 종이 차트 완전 대체",
        icon: "📋",
        features: ["디지털 기록", "업무 효율성", "환자 안전성", "법적 준수"],
        color: "green",
      },
      {
        id: "ocs",
        title: "처방전달시스템 (OCS)",
        description: "전자처방전 시스템으로 정확하고 신속한 처방 전달",
        icon: "💊",
        features: ["전자처방", "상호작용 체크", "오류 방지", "실시간 연동"],
        color: "purple",
      },
      {
        id: "pacs",
        title: "의료영상저장전송시스템 (PACS)",
        description: "의료 영상 데이터 디지털 저장 및 전송",
        icon: "🔬",
        features: ["영상 저장", "빠른 처리", "원격 판독", "장기 보관"],
        color: "orange",
      },
    ],
  },
  CARD_PLACEHOLDER_2: {
    type: "strength_cards",
    title: "메디씨앤씨의 핵심 강점",
    cards: [
      {
        id: "tech",
        title: "기술 혁신",
        description: "최신 IT 기술 적극 도입 및 활용",
        icon: "💡",
        highlights: ["클라우드 기반", "모바일 최적화", "AI/ML 기술"],
        color: "blue",
      },
      {
        id: "service",
        title: "고객 중심 서비스",
        description: "24시간 기술 지원 및 맞춤형 솔루션",
        icon: "🤝",
        highlights: ["24시간 지원", "맞춤형 설계", "지속적 개선"],
        color: "green",
      },
      {
        id: "security",
        title: "보안 및 안정성",
        description: "의료 데이터 보안 최고 수준 보장",
        icon: "🔒",
        highlights: ["데이터 보안", "개인정보보호", "재해복구"],
        color: "red",
      },
    ],
  },
};

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // 스트리밍 모드 설정 (환경변수로 제어 가능)
    const STREAMING_MODE = process.env.STREAMING_MODE || "chunk"; // 기본값을 chunk로 변경
    const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE || "8"); // 청크 모드일 때 단어 개수

    console.log(
      `[SSE] 스트리밍 모드: ${STREAMING_MODE}, 청크 크기: ${CHUNK_SIZE}`
    );

    // 메시지 분류
    const lowerMessage = message.toLowerCase();

    // 인사 관련 키워드 확인
    const isGreeting =
      lowerMessage.includes("안녕") ||
      lowerMessage.includes("안녕하세요") ||
      lowerMessage.includes("반가") ||
      lowerMessage.includes("처음") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("헬로") ||
      lowerMessage.includes("하이");

    // 메디씨앤씨 관련 키워드 확인
    const isAboutMedicnc =
      lowerMessage.includes("메디씨앤씨") ||
      lowerMessage.includes("메디씨") ||
      lowerMessage.includes("medicnc") ||
      lowerMessage.includes("회사") ||
      lowerMessage.includes("서비스") ||
      lowerMessage.includes("솔루션") ||
      lowerMessage.includes("his") ||
      lowerMessage.includes("emr") ||
      lowerMessage.includes("병원") ||
      lowerMessage.includes("의료") ||
      lowerMessage.includes("정보시스템") ||
      lowerMessage.includes("전자의무기록");

    // SSE 응답 설정
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        const sendChunk = (text: string, isLast = false) => {
          const chunk = encoder.encode(
            `data: ${JSON.stringify({
              type: "text",
              content: text,
              done: isLast,
            })}\n\n`
          );
          controller.enqueue(chunk);
        };

        const sendCard = (cardData: any) => {
          const chunk = encoder.encode(
            `data: ${JSON.stringify({
              type: "card",
              content: cardData,
              done: false,
            })}\n\n`
          );
          controller.enqueue(chunk);
        };

        // 응답 텍스트 결정
        let responseText;
        if (isGreeting) {
          responseText = GREETING_RESPONSE;
        } else if (isAboutMedicnc) {
          responseText = MEDICNC_RESPONSE;
        } else {
          responseText = `"${message}"에 대한 질문이군요! 저는 메디씨앤씨에 대해서만 설명드릴 수 있습니다. 

메디씨앤씨의 서비스, 솔루션, HIS, EMR 등에 대해 궁금한 점이 있으시면 언제든 물어보세요! 

또는 간단히 "안녕하세요"라고 인사해주셔도 좋습니다. 😊`;
        }

        // 스트리밍 모드에 따른 처리
        if (STREAMING_MODE === "chunk") {
          // 청크 단위로 스트리밍 (최고 성능) - 델타 방식
          const words = responseText.split(/(\s+)/);
          let wordIndex = 0;

          const sendNextChunk = () => {
            if (wordIndex >= words.length) {
              sendChunk("", true);
              controller.close();
              return;
            }

            // 청크 크기만큼 단어들을 모아서 전송 (델타만)
            let chunkText = "";
            for (let i = 0; i < CHUNK_SIZE && wordIndex < words.length; i++) {
              chunkText += words[wordIndex];
              wordIndex++;
            }

            // 카드 플레이스홀더 감지 및 처리
            if (chunkText.includes("[CARD_PLACEHOLDER_")) {
              // 플레이스홀더를 찾아서 카드 데이터 전송
              const placeholderMatch = chunkText.match(
                /\[CARD_PLACEHOLDER_(\d+)\]/
              );
              if (placeholderMatch) {
                const placeholderKey = `CARD_PLACEHOLDER_${placeholderMatch[1]}`;
                if (CARD_DATA[placeholderKey]) {
                  // 카드 데이터 전송
                  sendCard(CARD_DATA[placeholderKey]);
                  // 플레이스홀더 제거
                  chunkText = chunkText.replace(/\[CARD_PLACEHOLDER_\d+\]/, "");
                }
              }
            }

            // 텍스트가 있으면 전송
            if (chunkText.trim()) {
              sendChunk(chunkText, false);
            }

            // 청크 간 지연 시간
            let delay = 150;
            if (
              chunkText.includes(".") ||
              chunkText.includes("!") ||
              chunkText.includes("?")
            ) {
              delay = 400;
            } else if (chunkText.includes("\n")) {
              delay = 300;
            }

            setTimeout(sendNextChunk, delay);
          };

          setTimeout(sendNextChunk, 400);
        } else {
          // 단어 단위로 스트리밍 (성능 최적화) - 델타 방식
          const words = responseText.split(/(\s+)/); // 공백도 포함하여 분할
          let wordIndex = 0;

          const sendNextWord = () => {
            if (wordIndex >= words.length) {
              // 완료 신호 전송
              sendChunk("", true);
              controller.close();
              return;
            }

            const currentWord = words[wordIndex];
            wordIndex++;

            // 카드 플레이스홀더 감지 및 처리
            if (currentWord.includes("[CARD_PLACEHOLDER_")) {
              // 플레이스홀더를 찾아서 카드 데이터 전송
              const placeholderMatch = currentWord.match(
                /\[CARD_PLACEHOLDER_(\d+)\]/
              );
              if (placeholderMatch) {
                const placeholderKey = `CARD_PLACEHOLDER_${placeholderMatch[1]}`;
                if (CARD_DATA[placeholderKey]) {
                  // 카드 데이터 전송
                  sendCard(CARD_DATA[placeholderKey]);
                  // 다음 단어로 넘어가기 (플레이스홀더는 텍스트로 전송하지 않음)
                  setTimeout(sendNextWord, 100);
                  return;
                }
              }
            }

            // 델타(새로운 단어)만 전송
            sendChunk(currentWord, false);

            // 다음 단어를 위한 지연 시간 계산
            let delay = 50; // 기본 지연 시간

            // 문장부호가 포함된 단어에서 더 긴 지연
            if (
              currentWord.includes(".") ||
              currentWord.includes("!") ||
              currentWord.includes("?")
            ) {
              delay = 300;
            } else if (currentWord.includes(",") || currentWord.includes(";")) {
              delay = 150;
            } else if (currentWord.includes("\n")) {
              delay = 200;
            } else if (currentWord.includes("*") || currentWord.includes("#")) {
              delay = 100;
            }

            // 약간의 랜덤성 추가 (더 자연스러운 타이핑)
            delay += Math.random() * 30;

            setTimeout(sendNextWord, delay);
          };

          // 첫 번째 단어 전송 시작 (초기 지연)
          setTimeout(sendNextWord, 400);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("SSE API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
