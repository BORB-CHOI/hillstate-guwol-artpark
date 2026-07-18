// 준비도 체크 결과 화면의 시그니처 요소 — 관문 인장.
//
// 분양 상담의 실제 물성은 서류와 날인이다. 계약서에 도장을 찍는 행위가
// 이 고객이 향하는 종착점이고, 결과에 미리 한 번 찍어보는 것이 이 기능의
// 정서적 보상이다.
//
// 뜻은 '확인 완료'이지 '심사 통과'가 아니다. 세 인장은 어떤 결과 유형에서도
// 모두 찍히며, 라벨 문구만 달라진다. 인장의 유무로 합격 불합격을 연상시키면
// 확정 표현 금지 원칙을 어기게 된다.

export default function SelfCheckSeal({ className = "", style }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`seal-mark ${className}`}
      style={style}
      role="img"
      aria-label="확인"
    >
      {/* 바깥 테두리 — 살짝 두껍게, 인주가 눌린 느낌 */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#5C1C1D" strokeWidth="5" />
      {/* 안쪽 얇은 테두리 */}
      <circle cx="50" cy="50" r="36" fill="none" stroke="#5C1C1D" strokeWidth="1.5" opacity="0.75" />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#5C1C1D"
        fontSize="42"
        fontWeight="800"
        fontFamily="var(--font-pretendard), sans-serif"
      >
        確
      </text>
    </svg>
  );
}
