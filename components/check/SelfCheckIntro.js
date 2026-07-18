// 진단 도입부. 섹션의 첫 화면이며, 시작을 누르면 같은 자리에서 문항으로
// 좌측 슬라이드된다. 별도 페이지로 넘어가지 않는다.
//
// 3단계 번호(01/02/03)는 장식이 아니다. 실제로 이 순서로 판정이 진행되고
// 앞 단계 답이 뒤 단계 해석을 바꾼다. 순서가 정보를 담고 있어서 번호를 쓴다.

const gates = [
  { no: "01", title: "주택 상태", desc: "무주택 여부" },
  { no: "02", title: "신용 상태", desc: "이력 유무" },
  { no: "03", title: "상담 방향", desc: "방문 전 확인 항목" },
];

export default function SelfCheckIntro({ onStart }) {
  return (
    <div className="text-center">
      <span className="section-label !text-gold-light">SELF CHECK</span>
      <h2 className="section-title !text-white break-keep">
        지금 내 상황에서
        <br />
        무엇부터 준비해야 할까요
      </h2>
      <p className="mt-5 break-keep text-lg leading-relaxed text-white/70 sm:text-xl">
        5개 질문에 답하면 방문 전 확인할 항목을 정리해 드립니다.
        <br className="hidden sm:block" />
        소득과 금액은 묻지 않습니다.
      </p>

      <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
        {gates.map((g, i) => (
          <div
            key={g.no}
            className="gate-step is-lit rounded-2xl border border-white/12 p-6"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <p className="text-sm font-bold tracking-widest text-gold-light [font-variant-numeric:tabular-nums]">
              {g.no}
            </p>
            <p className="mt-3 text-lg font-bold">{g.title}</p>
            <p className="mt-1.5 text-sm text-white/55">{g.desc}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="btn mx-auto mt-10 w-full justify-center bg-gold-light px-10 py-5 text-lg font-extrabold !text-brand shadow-xl hover:!bg-gold sm:w-auto sm:text-xl"
      >
        3분 진단 시작하기
      </button>
      <p className="mt-4 text-sm text-white/55">
        소요 약 3분, 소득과 금액은 입력하지 않습니다
      </p>
    </div>
  );
}
