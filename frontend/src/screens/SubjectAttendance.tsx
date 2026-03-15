import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store";

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
      {label}
    </p>
    <p className="text-3xl font-black text-surface-900">{value}</p>
  </div>
);

const SubjectAttendance = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { subjects } = useStore();

  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <div className="animate-fade-in pb-10">
        <div className="text-center py-16 px-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm border-dashed">
          <p className="text-surface-900 font-black text-2xl mb-2">
            Subject not found
          </p>
          <button
            onClick={() => navigate("/app/dashboard")}
            className="mt-4 px-5 py-3 rounded-xl bg-surface-900 text-white text-sm font-bold hover:bg-black transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10 space-y-6">
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-bento">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Subject Attendance
        </p>
        <h2 className="text-3xl font-black text-surface-900 tracking-tight">
          {subject.name}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Possible Classes"
          value={subject.totalPossibleClasses}
        />
        <StatCard
          label="Classes Held Till Now"
          value={subject.classesTillNow}
        />
        <StatCard
          label="Percentage"
          value={`${subject.percentage.toFixed(1)}%`}
        />
        <StatCard label="Present" value={subject.presentCount} />
        <StatCard label="Absent" value={subject.absentCount} />
        <StatCard label="Unmarked" value={subject.unmarkedCount} />
      </div>
    </div>
  );
};

export default SubjectAttendance;
