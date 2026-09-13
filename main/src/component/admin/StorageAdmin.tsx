"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, ApiError, type StorageReportDTO } from "@/lib/api";

const fmt = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
};

const pct = (part: number, whole: number) =>
  whole > 0 ? Math.min(100, (part / whole) * 100) : 0;

const BAR_COLORS = [
  "var(--brand-blue)",
  "var(--brand-orange)",
  "var(--brand-amber-deep)",
  "var(--brand-cyan-deep)",
  "#7c5cff",
  "#2fb36f",
  "#c94b8a",
];

/** Admin: database storage usage, remaining quota, and where the bytes go. */
const StorageAdmin = ({ adminPw }: { adminPw: string }) => {
  const [report, setReport] = useState<StorageReportDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!adminPw) return;
    setLoading(true);
    setError(null);
    try {
      setReport(await adminApi.storage(adminPw));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not load storage stats."
      );
    } finally {
      setLoading(false);
    }
  }, [adminPw]);

  useEffect(() => {
    load();
  }, [load]);

  const used = report?.usedPercent ?? 0;
  const gaugeColor =
    used >= 90
      ? "var(--status-closed)"
      : used >= 70
      ? "var(--brand-amber-deep)"
      : "var(--accent)";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="g-heading-sm">Storage</h2>
          <p className="g-body mt-1 text-sm">
            Database size, quota left, and a breakdown by table and photos.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="g-btn disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <p className="text-[0.85rem] text-red-500" role="alert">
          {error}
        </p>
      )}

      {!report ? (
        !error && <p className="g-body">Loading storage stats…</p>
      ) : (
        <>
          {/* Overall gauge */}
          <section className="g-card">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-2xl font-medium">
                {fmt(report.totalBytes)}{" "}
                <span className="text-base text-[var(--muted)]">
                  of {fmt(report.limitBytes)} used
                </span>
              </p>
              <p className="text-sm font-medium" style={{ color: gaugeColor }}>
                {used.toFixed(1)}% · {fmt(report.remainingBytes)} left
              </p>
            </div>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[var(--border)]">
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${used}%`, background: gaugeColor }}
              />
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              Quota is set by <code>DB_STORAGE_LIMIT_MB</code> on the backend
              (currently {Math.round(report.limitBytes / 1024 / 1024)} MB).
            </p>
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Per-table breakdown */}
            <section className="g-card">
              <h3 className="g-heading-sm mb-4 text-sm">Where storage is going</h3>
              <ul className="flex flex-col gap-3">
                {report.tables.map((t, i) => {
                  const color = BAR_COLORS[i % BAR_COLORS.length];
                  return (
                    <li key={t.table}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: color }}
                          />
                          {t.table}
                          <span className="text-xs text-[var(--muted)]">
                            {t.rows.toLocaleString()} rows
                          </span>
                        </span>
                        <span className="text-[var(--muted)]">
                          {fmt(t.totalBytes)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct(t.totalBytes, report.tablesTotalBytes)}%`,
                            background: color,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-[0.7rem] text-[var(--muted)]">
                        data {fmt(t.dataBytes)} · indexes {fmt(t.indexBytes)} · toast{" "}
                        {fmt(t.toastBytes)}
                      </p>
                    </li>
                  );
                })}
                <li className="mt-1 flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
                  <span className="text-[var(--muted)]">
                    System overhead (catalogs, WAL, free space)
                  </span>
                  <span className="text-[var(--muted)]">
                    {fmt(report.overheadBytes)}
                  </span>
                </li>
              </ul>
            </section>

            {/* Photo blobs */}
            <section className="g-card h-fit">
              <h3 className="g-heading-sm mb-1 text-sm">Inline photos</h3>
              <p className="mb-4 text-xs text-[var(--muted)]">
                Base64 images stored directly in the database — usually the
                biggest single cost.
              </p>
              <ul className="flex flex-col gap-3">
                {report.blobs.map((b) => (
                  <li
                    key={`${b.table}.${b.column}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{b.label}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {b.table}.{b.column} · {b.count} photo
                        {b.count === 1 ? "" : "s"}
                        {b.count > 0 && <> · avg {fmt(b.bytes / b.count)}</>}
                      </p>
                    </div>
                    <span className="font-medium">{fmt(b.bytes)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default StorageAdmin;
