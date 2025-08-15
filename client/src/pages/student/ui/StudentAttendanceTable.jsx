import React, { useMemo } from "react";
import ProgressBar from "./ProgressBar";

// Flexible aggregator (handles different backend shapes)
function normalizeSubjectId(entry) {
  return String(
    entry?.subject?._id ??
    entry?.subjectId ??
    entry?.subject_id ??
    entry?.subject ??
    ""
  );
}

function aggregate(attendance = [], subjects = []) {
  const bySubject = new Map();

  for (const a of attendance) {
    const key = normalizeSubjectId(a);
    if (!key) continue;

    const cur = bySubject.get(key) || { present: 0, absent: 0, leave: 0, total: 0 };
    const status = String(a.status || "").toLowerCase();
    if (status === "present") cur.present += 1;
    else if (status === "absent") cur.absent += 1;
    else cur.leave += 1;

    cur.total += 1;
    // keep a backref to any subject object found in logs
    if (a.subject && typeof a.subject === "object") cur._subjectObj = a.subject;
    bySubject.set(key, cur);
  }

  const findSubjectMeta = (sid) =>
    subjects.find((s) => String(s._id) === String(sid)) ||
    bySubject.get(sid)?._subjectObj ||
    { name: "Subject", code: "—", _id: sid };

  return Array.from(bySubject.entries()).map(([sid, stats]) => {
    const pct = stats.total ? Math.round((stats.present / stats.total) * 100) : 0;
    return {
      subjectId: sid,
      subject: findSubjectMeta(sid),
      ...stats,
      percent: pct,
    };
  });
}

export default function StudentAttendanceTable({ attendance = [], subjects = [] }) {
  const rows = useMemo(() => aggregate(attendance, subjects), [attendance, subjects]);
  const overall = useMemo(() => {
    const t = rows.reduce((acc, r) => {
      acc.present += r.present; acc.absent += r.absent; acc.leave += r.leave; acc.total += r.total;
      return acc;
    }, { present: 0, absent: 0, leave: 0, total: 0 });
    const percent = t.total ? Math.round((t.present / t.total) * 100) : 0;
    return { ...t, percent };
  }, [rows]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">No attendance records yet.</div>
      ) : (
        <>
          <div className="mb-5">
            <ProgressBar value={overall.percent} label="Overall Attendance" />
            <p className="mt-2 text-xs text-gray-500">
              Present: <b>{overall.present}</b> • Absent: <b>{overall.absent}</b> • Leave: <b>{overall.leave}</b> • Total: <b>{overall.total}</b>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4">Code</th>
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Present</th>
                  <th className="py-2 pr-4">Absent</th>
                  <th className="py-2 pr-4">Leave</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.subjectId}>
                    <td className="py-2 pr-4 font-mono">{r.subject?.code || "—"}</td>
                    <td className="py-2 pr-4">{r.subject?.name || "Subject"}</td>
                    <td className="py-2 pr-4">{r.present}</td>
                    <td className="py-2 pr-4">{r.absent}</td>
                    <td className="py-2 pr-4">{r.leave}</td>
                    <td className="py-2 pr-4">{r.total}</td>
                    <td className="py-2 pr-4">
                      <div className="w-28">
                        <ProgressBar value={r.percent} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
