// 문항 5개. 보기를 고르면 200ms 뒤 자동으로 다음 문항으로 슬라이드된다.
// 마지막 문항을 고르면 곧바로 결과 화면으로 넘어간다(연락처를 먼저 받지 않는다).

import { questions } from "@/lib/selfCheck";
import { ArrowRightIcon } from "../Icons";

const TOTAL = questions.length;

export default function SelfCheckQuestions({ step, dir, picked, onPick, onBack }) {
  const q = questions[step];

  return (
    <div key={step} className={`mx-auto w-full max-w-xl ${dir === "next" ? "step-next" : "step-prev"}`}>
      {/* 진행 표시 — 문항 수만큼의 눈금. 눈금은 장식이고 진행 상황은
          옆의 "3 / 5" 텍스트가 그대로 읽어준다. */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex flex-1 items-center gap-1.5" aria-hidden="true">
          {questions.map((item, i) => (
            <span
              key={item.id}
              className={`tick ${i < step ? "is-done" : ""} ${i === step ? "is-current" : ""}`}
            />
          ))}
        </div>
        <p className="shrink-0 text-sm font-bold text-gold [font-variant-numeric:tabular-nums]">
          {step + 1}
          <span className="text-white/35"> / {TOTAL}</span>
        </p>
      </div>

      <h2 className="break-keep text-2xl font-extrabold leading-snug sm:text-3xl">{q.title}</h2>
      <p className="mt-3 break-keep text-sm text-white/55">{q.hint}</p>

      <div className="mt-8 grid gap-3">
        {q.options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onPick(o.value)}
            className={`choice ${picked === o.value ? "is-picked" : ""}`}
          >
            <span>{o.label}</span>
            <ArrowRightIcon className="choice-arrow h-5 w-5" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="nav-link mx-auto mt-8 block text-sm text-white/45 hover:text-white/80"
      >
        {step === 0 ? "처음으로" : "이전 질문"}
      </button>
    </div>
  );
}
