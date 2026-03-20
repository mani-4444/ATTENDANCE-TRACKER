import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { Clock } from "lucide-react";

const Attendance = () => {
  const sessions = useStore((state) => state.sessions);
  const attendance = useStore((state) => state.attendance);
  const navigate = useNavigate();

  const rows = useMemo(() => {
    const attendanceBySession = new Map(
      attendance.map((record) => [record.sessionId, record.status]),
    );

    const grouped = new Map<
      string,
      { present: number; absent: number; unmarked: number; total: number }
    >();

    sessions.forEach((session) => {
      const current = grouped.get(session.date) || {
        present: 0,
        absent: 0,
        unmarked: 0,
        total: 0,
      };

      current.total += 1;
      const status = attendanceBySession.get(session.id);
      if (status === "present") current.present += 1;
      else if (status === "absent") current.absent += 1;
      else current.unmarked += 1;

      grouped.set(session.date, current);
    });

    const _now = new Date();
    const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, "0")}-${String(_now.getDate()).padStart(2, "0")}`;

    return Array.from(grouped.entries())
      .map(([date, summary]) => ({ date, ...summary }))
      .filter((row) => row.date <= today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, attendance]);

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl font-black text-surface-900 dark:text-gray-100 tracking-tight dark:text-slate-100">
            Track Progress
          </h2>
          <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-400">
            {rows.length} Dates
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {rows.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 shadow-sm border-dashed dark:bg-slate-900 dark:border-slate-800">
            <div className="w-20 h-20 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-slate-800">
              <Clock className="w-10 h-10 text-gray-300 dark:text-slate-500" />
            </div>
            <p className="text-surface-900 dark:text-gray-100 font-black text-2xl mb-2 dark:text-slate-100">
              No sessions found
            </p>
            <p className="text-gray-400 font-medium dark:text-slate-400">
              Sessions will appear here once generated.
            </p>
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.date}
              className="bg-white dark:bg-gray-900 rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="flex-1">
                <div className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-2 dark:text-slate-500">
                  {new Date(row.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex flex-wrap gap-2 text-sm font-bold text-gray-600">
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
                    Present: {row.present}
                  </span>
                  <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-100">
                    Absent: {row.absent}
                  </span>
                  <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    Unmarked: {row.unmarked}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/app/attendance/date/${row.date}`)}
                className="px-5 py-3 rounded-xl bg-surface-900 text-white text-sm font-bold hover:bg-black transition-all"
              >
                Open
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Attendance;
