"use client";

import { useState } from "react";
import { CalendarIcon, CheckIcon } from "./Icons";
import Reveal from "./Reveal";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const trackingParams = () => {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, params.get(key) || ""])
      .filter(([, value]) => value)
  );
};

export default function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    agree: false,
    company: "", // 허니팟 (스팸 봇 차단용, 사용자에겐 숨김)
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const update = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const validPhone = (p) => /^01[016789][0-9]{7,8}$/.test(p.replace(/[^0-9]/g, ""));

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
        body: JSON.stringify({ ...form, source: "홍보관 방문예약폼", tracking: trackingParams() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "예약 접수에 실패했습니다.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "잠시 후 다시 시도해 주세요.");
    }
  };

  if (status === "success") {
    return (
      <section id="reserve" className="scroll-mt-20 bg-ivory py-20 sm:py-28">
        <div className="container-content">
          <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-soft sm:p-12">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">
              <CheckIcon className="h-9 w-9" />
            </div>
            <h2 className="section-title">예약이 접수되었습니다</h2>
            <p className="mt-4 leading-relaxed text-ink/65">
              <b className="text-brand">{form.name}</b>님, 소중한 신청 감사합니다.
              <br />
              담당 상담사가 확인 후 <b>{form.phone}</b>로 연락드려
              방문 일정을 확정해 드리겠습니다.
            </p>
            <p className="mt-6 rounded-xl bg-ivory px-4 py-3 text-sm text-ink/60">
              희망 방문일 <b>{form.date}</b>
              <br />
              희망 방문시간 <b>{form.time}</b>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reserve" className="scroll-mt-20 bg-ivory py-20 sm:py-28">
      <div className="container-content">
        <div className="mx-auto max-w-xl">
          <Reveal>
          <div className="text-center">
            <span className="section-label">RESERVATION</span>
            <h2 className="section-title">홍보관 방문예약</h2>
            <p className="mt-4 leading-relaxed text-ink/65">
              간단한 정보만 남겨주시면, 담당자가 연락드려 일정을 확정해 드립니다.
              <br className="hidden sm:block" />
              예약 고객은 방문 시 우선 안내됩니다.
            </p>
          </div>
          </Reveal>

          <Reveal delay={100}>
          <form
            onSubmit={onSubmit}
            className="mt-9 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-8"
          >
            <div className="space-y-5">
              <Field label="이름" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="성함을 입력해 주세요"
                  className="input"
                  autoComplete="name"
                />
              </Field>

              <Field label="전화번호" required>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="010-0000-0000"
                  className="input"
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </Field>

              <Field label="희망 방문일" required>
                <input
                  type="date"
                  value={form.date}
                  min={todayStr()}
                  onChange={update("date")}
                  className="input"
                />
              </Field>

              <Field label="희망 방문시간" required>
                <input
                  type="time"
                  value={form.time}
                  step="60"
                  onChange={update("time")}
                  className="input"
                />
              </Field>

              {/* 허니팟 (봇 차단) — 사용자에게 보이지 않음 */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={update("company")}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />

              <label className="flex items-start gap-2.5 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={update("agree")}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                />
                <span>
                  <b className="text-ink">[필수]</b> 개인정보 수집, 이용에 동의합니다. 수집된 정보는
                  방문예약 상담 목적으로만 이용되며, 상담 완료 후 관련 법령에 따라 처리됩니다.
                </span>
              </label>

              {error && (
                <p className="rounded-xl bg-cta/10 px-4 py-3 text-sm font-medium text-cta">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-cta w-full text-lg disabled:opacity-60"
              >
                {status === "loading" ? (
                  "접수 중..."
                ) : (
                  <>
                    <CalendarIcon className="h-5 w-5" />
                    예약하기
                  </>
                )}
              </button>
            </div>
          </form>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(31, 36, 33, 0.15);
          background: #fff;
          padding: 0.8rem 1rem;
          font-size: 1rem;
          color: #1f2421;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #1c1917;
          box-shadow: 0 0 0 3px rgba(28, 25, 23, 0.1);
        }
      `}</style>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-cta">*</span>}
      </label>
      {children}
    </div>
  );
}
