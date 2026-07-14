"use client";

import { useState } from "react";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState(null);
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const load = async (e) => {
    e?.preventDefault();
    setError("");
    setState("loading");
    try {
      const res = await fetch(`/api/reservations?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "조회 실패");
      setRows(data.reservations);
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  };

  const downloadCsv = () => {
    if (!rows?.length) return;
    const header = ["접수일시", "이름", "연락처", "희망방문일시", "유입경로", "상태"];
    const lines = rows.map((r) =>
      [
        new Date(r.created_at).toLocaleString("ko-KR"),
        r.name,
        r.phone,
        `${r.visit_date || ""} ${r.visit_time || ""}`.trim(),
        [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / "),
        r.status,
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = "﻿" + [header.join(","), ...lines].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `예약목록_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-ivory py-10">
      <div className="container-content">
        <h1 className="text-2xl font-extrabold text-brand">방문예약 관리자</h1>

        <form onSubmit={load} className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="관리자 토큰 입력"
            className="w-full max-w-xs rounded-xl border border-black/15 px-4 py-2.5 focus:border-brand focus:outline-none"
          />
          <button type="submit" className="btn-cta !py-2.5" disabled={state === "loading"}>
            {state === "loading" ? "불러오는 중..." : "불러오기"}
          </button>
          {rows?.length ? (
            <button type="button" onClick={downloadCsv} className="btn-call !py-2.5">
              CSV 다운로드
            </button>
          ) : null}
        </form>

        {error && <p className="mt-4 text-sm font-medium text-cta">{error}</p>}

        {rows && (
          <div className="mt-6">
            <p className="mb-3 text-sm text-ink/60">
              총 <b className="text-brand">{rows.length}</b>건
            </p>
            <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-card">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-ivory text-left text-ink/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold">접수일시</th>
                    <th className="px-4 py-3 font-semibold">이름</th>
                    <th className="px-4 py-3 font-semibold">연락처</th>
                    <th className="px-4 py-3 font-semibold">희망방문일시</th>
                    <th className="px-4 py-3 font-semibold">유입경로</th>
                    <th className="px-4 py-3 font-semibold">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-ivory/50">
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                        {new Date(r.created_at).toLocaleString("ko-KR")}
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/80">{r.phone}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                        {r.visit_date} {r.visit_time || ""}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                        {[r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ") || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-ink/50">
                        접수된 예약이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
