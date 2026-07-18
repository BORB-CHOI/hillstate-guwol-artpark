// =============================================================
// 3분 내 집 마련 준비도 체크 — 문항 정의와 결과 판정
//
// 서버와 클라이언트가 같은 모듈을 쓴다. 결과 유형은 접수 시 서버에서
// 다시 계산하며, 클라이언트가 보낸 값은 신뢰하지 않는다.
//
// 문항 5개는 담당자가 DB에 남기고 싶어 한 항목과 1:1로 맞춘 것이다.
//   무주택 / 신용불량 / 기존대출 / 가족구성 / 희망타입
// 전화를 걸기 전에 "이 사람은 무주택이고 84A 관심이네"를 미리 아는 것이
// 이 기능의 실제 값어치라, 문항을 임의로 늘리거나 줄이지 않는다.
//
// 원칙 (CLAUDE.md):
//   - 금액을 묻지 않고, 금액을 보여주지 않는다.
//   - "대출 가능합니다" 같은 확정 표현을 쓰지 않는다.
//   - 여기는 분양 페이지다. 우리가 해줄 수 있는 것은 홍보관 상담이지
//     금융 상담이 아니다. 결과 문구에 '금융 상담'을 쓰지 않는다.
// =============================================================

export const questions = [
  {
    id: "own",
    title: "현재 무주택이신가요",
    hint: "가장 먼저 확인하는 항목입니다",
    options: [
      { value: "none", label: "무주택입니다" },
      { value: "one", label: "1주택 보유" },
      { value: "multi", label: "2주택 이상 보유" },
    ],
  },
  {
    id: "credit",
    title: "신용불량 또는 금융채무불이행 이력이 있으신가요",
    hint: "상담 방향을 정하기 위한 항목이며, 금액이나 내역은 묻지 않습니다",
    options: [
      { value: "no", label: "없습니다" },
      { value: "yes", label: "있습니다" },
      { value: "unsure", label: "잘 모르겠습니다" },
    ],
  },
  {
    id: "loan",
    title: "기존 대출이 있으신가요",
    hint: "금액은 묻지 않습니다. 종류만 알려주세요",
    options: [
      { value: "none", label: "없습니다" },
      { value: "credit", label: "신용대출이 있습니다" },
      { value: "mortgage", label: "주택담보대출이 있습니다" },
      { value: "multiple", label: "여러 건이 있습니다" },
    ],
  },
  {
    id: "family",
    title: "가족 구성은 어떻게 되시나요",
    hint: "세대 구성에 따라 챙길 서류가 다릅니다",
    options: [
      { value: "single", label: "1인 가구" },
      { value: "newlywed", label: "신혼부부 또는 예비부부" },
      { value: "children", label: "자녀가 있는 가구" },
      { value: "three_gen", label: "부모님을 포함한 3세대" },
    ],
  },
  {
    id: "type",
    title: "희망 타입은 무엇인가요",
    hint: "정하지 않으셨어도 괜찮습니다",
    options: [
      { value: "t84a", label: "84A  4Bay 판상형" },
      { value: "t84b", label: "84B  4Bay 맞통풍 판상형" },
      { value: "t101", label: "101  드레스룸 별도" },
      { value: "undecided", label: "아직 고민 중입니다" },
    ],
  },
];

// 저장된 코드값을 사람이 읽을 문구로 되돌린다(관리자 화면용).
// 코드값으로 저장해 두었으므로 문구를 바꿔도 과거 기록이 깨지지 않는다.
const labels = Object.fromEntries(
  questions.map((q) => [q.id, Object.fromEntries(q.options.map((o) => [o.value, o.label]))])
);

export function answerLabel(questionId, value) {
  return labels[questionId]?.[value] || value || "-";
}

// 답변 화이트리스트 — 서버 검증에 쓴다.
const allowed = Object.fromEntries(
  questions.map((q) => [q.id, new Set(q.options.map((o) => o.value))])
);

export function validateAnswers(answers) {
  if (!answers || typeof answers !== "object") return false;
  return questions.every((q) => allowed[q.id].has(answers[q.id]));
}

// 결과 판정 — 신용, 주택 순으로 본다. 나머지 답변은 문구 개인화와
// 담당자 참고용이며 판정에는 쓰지 않는다.
//
//   신용 이력 있음(또는 모름) → credit : 개별 확인이 필요
//   주택 보유                → owner  : 일반 분양 상담
//   그 외(무주택 + 신용 정상) → ready  : 중도금 대출 상담 가능성이 높음
export function resolveResult(answers) {
  if (answers.credit === "yes" || answers.credit === "unsure") return "credit";
  if (answers.own !== "none") return "owner";
  return "ready";
}

// 결과 화면 문구.
//   seals   : 시그니처인 3단 관문 인장. 세 개 모두 항상 찍히고 라벨만 달라진다.
//             인장은 '심사 통과'가 아니라 '확인 완료'를 뜻한다.
//   formTitle / formBody : 결과 아래 상담 신청 폼의 문구. 결과에 따라 다르다.
export const results = {
  ready: {
    label: "중도금 대출 상담 가능",
    headline: "중도금 대출 상담이 가능한 조건입니다",
    body: "무주택이시고 신용에도 걸리는 부분이 없어서, 준비하실 것이 많지 않습니다. 홍보관에서 타입별 조건과 일정을 함께 살펴보세요.",
    seals: [
      { label: "주택 상태", value: "무주택" },
      { label: "신용 상태", value: "이력 없음" },
      { label: "상담 방향", value: "중도금 대출 상담" },
    ],
    checklist: [
      "무주택 확인 자료",
      "세대 구성 기준",
      "청약통장 가입 기간",
      "입주 시점 자금 일정",
    ],
    formTitle: "중도금 조건, 방문하실 때 함께 정리해 드릴까요",
    formBody: "편하신 방문 시간을 남겨주시면 담당자가 확인 후 일정을 확정해 드립니다.",
  },
  owner: {
    label: "일반 분양 상담",
    headline: "보유 주택을 어떻게 하실지가 먼저입니다",
    body: "처분 시점과 방법에 따라 조건이 갈립니다. 화면으로 정리하기 어려운 부분이라 담당자와 일대일로 짚어보시는 편이 빠릅니다.",
    seals: [
      { label: "주택 상태", value: "보유 주택 있음" },
      { label: "신용 상태", value: "이력 없음" },
      { label: "상담 방향", value: "일반 분양 상담" },
    ],
    checklist: [
      "보유 주택 처분 계획",
      "기존 대출 잔여 조건",
      "세대 구성 기준",
      "입주 시점 자금 일정",
    ],
    formTitle: "처분 계획부터 같이 정리해 보실까요",
    formBody: "편하신 방문 시간을 남겨주시면 담당자가 상황에 맞춰 안내드립니다.",
  },
  credit: {
    label: "개별 확인 필요",
    headline: "먼저 확인할 것이 하나 있습니다",
    body: "신용 이력은 시점과 해소 여부에 따라 결과가 크게 달라져서, 지금 화면에서 판단하기 어렵습니다. 홍보관에서 어떤 방법이 있는지 함께 확인해 보세요.",
    seals: [
      { label: "주택 상태", value: "확인 완료" },
      { label: "신용 상태", value: "개별 확인 필요" },
      { label: "상담 방향", value: "방문 상담 권장" },
    ],
    checklist: [
      "신용 이력 해소 시점",
      "기존 대출 잔여 조건",
      "세대 구성 기준",
      "입주 시점 자금 일정",
    ],
    formTitle: "어떤 방법이 있는지 알아봐 드릴까요",
    formBody: "편하신 방문 시간을 남겨주시면 담당자가 확인 후 연락드립니다.",
  },
};

// 결과 화면 하단 고정 문구. 어떤 유형에서도 그대로 노출한다.
export const disclaimer =
  "정확한 공급조건과 금융 가능 여부는 홍보관 방문과 금융기관 심사를 통해 확인해 주세요.";
