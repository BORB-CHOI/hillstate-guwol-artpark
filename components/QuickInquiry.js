"use client";

// 관심고객 등록(빠른상담) — 히어로 직후 배치되는 초저마찰 1차 전환 접점.
// 이름·전화번호 두 항목만 받고, 방문일·시간은 서버에서 "협의 필요"로 채워
// 담당자가 유선으로 확정하는 방식. 하단 정식 예약폼(#reserve)과는 별개의
// 진입점으로, 스크롤 초반에 이탈하는 고객을 한 번 더 붙잡기 위한 장치.
import { useState } from "react";
import { CheckIcon } from "./Icons";
import Reveal from "./Reveal";
import { formatPhone, isValidMobile } from "@/lib/phone";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const trackingParams = () => {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, params.get(key) || ""])
      .filter(([, value]) => value)
  );
};

export default function QuickInquiry() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", agree: false, company: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (k) => (e) => {
    const raw = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const v = k === "phone" ? formatPhone(raw) : raw;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const validPhone = isValidMobile;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("이름을 입력해 주세요.");
    if (!validPhone(form.phone)) return setError("휴대폰 번호를 정확히 입력해 주세요.");
    if (!form.date) return setError("희망 방문일을 선택해 주세요.");
    if (!form.time) return setError("희망 방문 시간을 선택해 주세요.");
    if (!form.agree) return setError("개인정보 수집, 이용에 동의해 주세요.");

    setStatus("loading");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "관심고객 등록(빠른상담)",
          tracking: trackingParams(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "접수에 실패했습니다.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <section className="border-b border-black/5 bg-ivory py-8 sm:py-10">
      <div className="container-content">
        <Reveal className="mx-auto max-w-3xl">
        <div className="lift-card rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-2 py-3 text-center">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
                <CheckIcon className="h-6 w-6" />
              </div>
              <p className="font-semibold text-ink">
                <b className="text-brand">{form.name}</b>님, 접수되었습니다. 담당 상담사가 곧 연락드립니다.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-bold text-ink">관심고객 등록</p>
                <p className="mt-0.5 text-xs text-ink/55">성함과 연락처만 남겨주시면 담당자가 순차 연락드립니다</p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="성함"
                  className="quick-input"
                  autoComplete="name"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="010-0000-0000"
                  className="quick-input"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={13}
                />
                <input
                  type="date"
                  value={form.date}
                  min={todayStr()}
                  onChange={update("date")}
                  aria-label="희망 방문일"
                  className="quick-input"
                />
                <input
                  type="time"
                  value={form.time}
                  step="60"
                  onChange={update("time")}
                  aria-label="희망 방문시간"
                  className="quick-input"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-cta w-full !px-5 !py-2.5 text-sm disabled:opacity-60 sm:col-span-2"
                >
                  {status === "loading" ? "접수 중..." : "관심고객 등록하기"}
                </button>
              </div>

              {/* 허니팟 (봇 차단) */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={update("company")}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />
            </form>
          )}

          {status !== "success" && (
            <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-start gap-1.5 text-[11px] leading-snug text-ink/50">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={update("agree")}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand"
                />
                <span>[필수] 개인정보 수집, 이용에 동의합니다. (상담 목적으로만 이용)</span>
              </label>
              {error && <p className="text-[11px] font-medium text-cta">{error}</p>}
            </div>
          )}
        </div>
        </Reveal>
      </div>

      <style jsx>{`
        :global(.quick-input) {
          border-radius: 0.7rem;
          border: 1px solid rgba(31, 36, 33, 0.15);
          background: #fff;
          padding: 0.65rem 0.9rem;
          font-size: 0.9rem;
          color: #1f2421;
        }
        :global(.quick-input:focus) {
          outline: none;
          border-color: #1c1917;
          box-shadow: 0 0 0 3px rgba(28, 25, 23, 0.1);
        }
      `}</style>
    </section>
  );
}
