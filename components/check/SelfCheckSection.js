"use client";

// 3분 내 집 마련 준비도 체크 — 랜딩 안에서 완결되는 섹션.
//
// 별도 경로로 이동하지 않는다. 도입 → 문항 5개 → 결과가 같은 자리에서 좌우
// 슬라이드로 전환된다. 페이지를 떠나지 않으니 진단을 중간에 그만두더라도
// 고객은 여전히 상세페이지 흐름 위에 남고, 결과의 방문예약 버튼도 같은
// 페이지의 #reserve로 바로 이어진다.
//
// 마지막 문항에 답하면 연락처를 받기 전에 결과부터 보여준다. 연락처는
// 결과 아래 폼에서 받고, 그때 서버로 접수된다.

import { useLayoutEffect, useRef, useState } from "react";
import { questions, resolveResult } from "@/lib/selfCheck";
import { isValidMobile } from "@/lib/phone";
import Reveal from "../Reveal";
import SelfCheckIntro from "./SelfCheckIntro";
import SelfCheckQuestions from "./SelfCheckQuestions";
import SelfCheckResult from "./SelfCheckResult";

const TOTAL = questions.length;

const trackingParams = () => {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, params.get(key) || ""])
      .filter(([, value]) => value)
  );
};

export default function SelfCheckSection() {
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState("intro"); // intro | quiz | result
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState("next");
  const [answers, setAnswers] = useState({});
  const [picked, setPicked] = useState(null);
  // 방문예약 폼과 같은 항목을 받는다(이름, 연락처, 희망 방문일시, 동의).
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    agree: false,
    company: "", // 허니팟
  });
  const [status, setStatus] = useState("idle");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resultType, setResultType] = useState(null);

  // 화면 전환 시 섹션이 줄어들지 않게 한다.
  //
  // 도입부와 문항의 콘텐츠 높이가 꽤 다르다(실측: 모바일 819 → 389).
  // 그대로 두면 진단을 시작하는 순간 아래 콘텐츠가 위로 딸려 올라온다.
  // 그래서 지금까지 본 것 중 가장 큰 높이를 min-height로 유지한다.
  // 늘어날 때(결과 화면)는 따라 늘어나고, 줄어들 때는 버틴다.
  const contentRef = useRef(null);
  const [minHeight, setMinHeight] = useState(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    // 창 폭이 바뀌면 기준 높이를 다시 잡는다. 세로 회전이나 창 크기 조절 후
    // 예전 폭에서 잰 높이가 남아 빈 공간이 생기는 것을 막는다.
    let lastWidth = window.innerWidth;
    const grow = () => {
      const h = el.offsetHeight;
      setMinHeight((prev) => (prev === null ? h : Math.max(prev, h)));
    };
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      setMinHeight(el.offsetHeight);
    };

    grow();
    const ro = new ResizeObserver(grow);
    ro.observe(el);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // 결과 단계에서는 기준 높이를 다시 잡는다.
  //
  // "줄어들지 않기"는 도입부에서 문항으로 넘어갈 때 아래 콘텐츠가 딸려
  // 올라오는 것을 막으려는 장치다. 결과가 뜨거나 접수가 끝나 폼이 사라질
  // 때까지 그 높이를 붙들고 있으면 카드 아래에 빈 공간만 남는다.
  useLayoutEffect(() => {
    if (phase !== "result") return;
    const el = contentRef.current;
    if (el) setMinHeight(el.offsetHeight);
  }, [phase, submitted]);

  // 결과는 문항보다 훨씬 길어서 섹션 머리를 다시 맞춰줘야 첫 줄부터 읽힌다.
  // 도입부에서 문항으로 넘어갈 때는 높이 전환만으로 충분해서 스크롤하지 않는다.
  const keepInView = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const start = () => {
    setDir("next");
    setPhase("quiz");
  };

  const pick = (value) => {
    if (picked) return; // 전환 중 중복 클릭 방지
    setPicked(value);
    const next = { ...answers, [questions[step].id]: value };
    // 선택이 확정됐다는 신호를 200ms 보여준 뒤 넘어간다.
    setTimeout(() => {
      setAnswers(next);
      setDir("next");
      setPicked(null);
      if (step + 1 >= TOTAL) {
        // 마지막 문항. 연락처를 받기 전에 결과부터 보여준다.
        setResultType(resolveResult(next));
        setPhase("result");
        keepInView();
        return;
      }
      setStep((s) => s + 1);
    }, 200);
  };

  const back = () => {
    setError("");
    setDir("prev");
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep((s) => s - 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    // 검증 순서와 문구를 방문예약 폼과 맞춘다.
    if (!contact.name.trim()) return setError("이름을 입력해 주세요.");
    if (!isValidMobile(contact.phone)) return setError("휴대폰 번호를 정확히 입력해 주세요.");
    if (!contact.date) return setError("희망 방문일을 선택해 주세요.");
    if (!contact.time) return setError("희망 방문 시간을 선택해 주세요.");
    if (!contact.agree) return setError("개인정보 수집, 이용에 동의해 주세요.");

    setStatus("loading");
    try {
      const res = await fetch("/api/self-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          phone: contact.phone,
          date: contact.date,
          time: contact.time,
          agree: contact.agree,
          company: contact.company,
          answers,
          tracking: trackingParams(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "접수에 실패했습니다.");
      // 서버가 다시 계산한 유형으로 맞춘다(클라이언트 계산은 표시용일 뿐이다).
      if (data.resultType) setResultType(data.resultType);
      setStatus("idle");
      setSubmitted(true);
    } catch (err) {
      setStatus("error");
      setError(err.message || "잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="check"
      className="relative overflow-hidden bg-brand py-20 text-white sm:py-28"
    >
      {/* 배경 광원. 섹션 위쪽 경계에서 잘려 보이지 않도록 원의 중심을 안쪽으로
          내리고, 위아래 가장자리는 배경색으로 자연스럽게 되돌린다. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 38%, rgba(184,150,90,.20), transparent 70%), linear-gradient(to bottom, #1C1917 0%, transparent 22%, transparent 78%, #1C1917 100%)",
        }}
      />

      {/* 높이 유지 래퍼. 한 번 커진 높이는 다시 줄어들지 않는다. */}
      <div
        className="check-morph relative z-10"
        style={minHeight ? { minHeight } : undefined}
      >
        <div ref={contentRef} className="container-content">
          {phase === "intro" && (
            <Reveal>
              <SelfCheckIntro onStart={start} />
            </Reveal>
          )}

          {phase === "quiz" && (
            <SelfCheckQuestions
              step={step}
              dir={dir}
              picked={picked}
              onPick={pick}
              onBack={back}
            />
          )}

          {phase === "result" && (
            <SelfCheckResult
              resultType={resultType}
              contact={contact}
              status={status}
              submitted={submitted}
              error={error}
              onContactChange={(patch) => setContact((c) => ({ ...c, ...patch }))}
              onSubmit={submit}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        :global(.result-input) {
          width: 100%;
          border-radius: 0.85rem;
          border: 1px solid rgba(31, 36, 33, 0.15);
          background: #fff;
          padding: 0.9rem 1.15rem;
          font-size: 1rem;
          color: #1f2421;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        :global(.result-input::placeholder) {
          color: rgba(31, 36, 33, 0.35);
        }
        :global(.result-input:focus) {
          outline: none;
          border-color: #1c1917;
          box-shadow: 0 0 0 3px rgba(28, 25, 23, 0.1);
        }
      `}</style>
    </section>
  );
}
