import React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store";

const DateAttendanceDetails = () => {
  const { date } = useParams();
  const sessions = useStore((state) => state.sessions);
  const subjects = useStore((state) => state.subjects);
  const attendance = useStore((state) => state.attendance);
  const upsertAttendance = useStore((s) => s.upsertAttendance);

  const attendanceBySession = new Map(
    attendance.map((record) => [record.sessionId, record.status]),
  );

  const sessionsForDate = sessions
    .filter((session) => session.date === date)
    .sort((a, b) => {
      const aName = subjects.find((s) => s.id === a.subjectId)?.name || "";
      const bName = subjects.find((s) => s.id === b.subjectId)?.name || "";
      return aName.localeCompare(bName);
    });

  const dateLabel = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="animate-fade-in pb-10">
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-bento border border-gray-100 min-h-[400px]">
        <div className="mb-8 pb-6 border-b border-gray-100/50">
          <h2 className="text-2xl font-black text-surface-900">
            {dateLabel || "Date Details"}
          </h2>
        </div>

        {sessionsForDate.length === 0 ? (
          <div className="text-center py-16 mt-4">
            <p className="text-surface-900 font-black text-2xl mb-2">
              No sessions for this date
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessionsForDate.map((session) => {
              const subject = subjects.find((s) => s.id === session.subjectId);
              const subjectName = subject?.name || "Unknown";
              const status = attendanceBySession.get(session.id) || null;
              const _now = new Date();
              const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, "0")}-${String(_now.getDate()).padStart(2, "0")}`;
              const isFuture = session.date > today;

              const handleToggle = (targetStatus: "present" | "absent") => {
                if (isFuture) return;
                // Second tap on same status → unmark (null)
                if (status === targetStatus) {
                  upsertAttendance(session.id, null);
                } else {
                  upsertAttendance(session.id, targetStatus);
                }
              };

              return (
                <div
                  key={session.id}
                  className={`bg-white rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isFuture ? "opacity-60" : ""}`}
                >
                  <div className="font-black text-surface-900 text-xl leading-tight">
                    {subjectName}
                  </div>

                  {isFuture ? (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 text-sm font-bold">
                      Future — cannot mark
                    </span>
                  ) : (
                    <div className="flex bg-surface-50 p-1.5 rounded-2xl border border-gray-100 gap-1">
                      <button
                        onClick={() => handleToggle("present")}
                        className={`px-6 py-3 rounded-xl font-bold transition-all focus:outline-none ${
                          status === "present"
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                            : "text-gray-400 hover:text-emerald-500 hover:bg-white"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleToggle("absent")}
                        className={`px-6 py-3 rounded-xl font-bold transition-all focus:outline-none ${
                          status === "absent"
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                            : "text-gray-400 hover:text-rose-500 hover:bg-white"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateAttendanceDetails;
