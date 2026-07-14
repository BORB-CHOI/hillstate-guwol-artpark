"use client";

import { useState } from "react";
import Link from "next/link";

const statusLabel = {
  new: { text: "접수 완료", cls: "bg-brand/10 text-brand" },
  contacted: { text: "상담 예정", cls: "bg-gold/15 text-gold" },
  visited: { text: "방문 완료", cls: "bg-black/8 text-ink/70" },
  done: { text: "완료", cls: "bg-black/8 text-ink/70" },
};

export default function LookupPage() {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setState("loading");
    try {
      const res = await fetch("/api/reservations/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "조회에 실패했습니다.");
      setRows(data.reservations);
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  };

  return (
    <main className="min-h-screen bg-ivory py-16">
      <div className="container-content max-w-xl">
        <Link href="/" className="text-sm font-medium text-brand hover:underline">
          ← 홈으로
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-7 shadow-soft ring-1 ring-black/5 sm:p-9">
          <h1 className="section-title text-2xl">예약 내역 조회</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            예약 시 입력하신 휴대폰 번호로 방문 예약 내역을 확인하실 수 있습니다.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full rounded-xl border border-black/15 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="btn-cta shrink-0 disabled:opacity-60"
            >
              {state === "loading" ? "조회 중..." : "조회하기"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm font-medium text-cta">{error}</p>}

          {state === "done" && (
            <div className="mt-6">
              {rows.length === 0 ? (
                <p className="rounded-xl bg-ivory px-4 py-6 text-center text-sm text-ink/60">
                  해당 번호로 접수된 예약 내역이 없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {rows.map((r, i) => {
                    const s = statusLabel[r.status] || statusLabel.new;
                    return (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-black/5 bg-ivory/60 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-ink">
                            {r.visit_date} {r.visit_time}
                          </p>
                          <p className="text-xs text-ink/50">
                            접수일 {new Date(r.created_at).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>
                          {s.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
