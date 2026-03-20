import React, { useMemo, useState } from "react";
import { useStore } from "../store";
import { Plus } from "lucide-react";

const DAYS = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const DEFAULT_SUBJECT_COLOR = "bg-blue-500 text-white";

const Subjects = () => {
  const { subjects, timetable, addSubjectWithDays } = useStore();

  const [subjectName, setSubjectName] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const grouped = useMemo(() => {
    return DAYS.reduce<Record<number, string[]>>((acc, day) => {
      const names = timetable
        .filter((entry) => entry.day === day.value)
        .map(
          (entry) =>
            subjects.find((s) => s.id === entry.subjectId)?.name || "Unknown",
        );
      acc[day.value] = names;
      return acc;
    }, {});
  }, [subjects, timetable]);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = subjectName.trim();
    if (!name) {
      alert("Please enter a subject name.");
      return;
    }

    if (selectedDays.length === 0) {
      alert("Please select at least one day.");
      return;
    }

    setSaving(true);
    try {
      await addSubjectWithDays(name, DEFAULT_SUBJECT_COLOR, selectedDays);
      setSubjectName("");
      setSelectedDays([]);
    } catch (error: any) {
      alert(error?.message || "Failed to save subject.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10 max-w-5xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-2xl font-black text-surface-900 dark:text-gray-100 tracking-tight dark:text-slate-100">
            Subjects Dashboard
          </h2>
          <p className="text-gray-500 font-medium mt-2 dark:text-slate-400">
            Add a subject and select the days when it is scheduled.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block dark:text-slate-500">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. DBMS"
              className="w-full bg-surface-50 border border-gray-100 rounded-xl px-4 py-3 text-surface-900 dark:text-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              disabled={saving}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block dark:text-slate-500">
              Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DAYS.map((day) => {
                const active = selectedDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-4 py-3 rounded-xl font-bold text-sm border transition-all ${
                      active
                        ? "bg-primary-50 text-primary-700 border-primary-100"
                        : "bg-white dark:bg-gray-900 text-gray-500 border-gray-100 hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                    }`}
                    disabled={saving}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-surface-900 text-white font-black py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {saving ? "Saving..." : "Save Subject"}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-xl font-black text-surface-900 dark:text-gray-100 tracking-tight mb-4 dark:text-slate-100">
          Weekly Subjects
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((day) => (
            <div
              key={day.value}
              className="bg-surface-50 border border-gray-100 rounded-2xl p-4 dark:bg-slate-800 dark:border-slate-700"
            >
              <p className="text-sm font-black text-surface-900 dark:text-gray-100 mb-2 dark:text-slate-100">
                {day.label}
              </p>
              {grouped[day.value].length === 0 ? (
                <p className="text-sm text-gray-400 font-medium dark:text-slate-500">
                  No subjects
                </p>
              ) : (
                <div className="space-y-1">
                  {grouped[day.value].map((name, idx) => (
                    <p
                      key={`${day.value}-${idx}`}
                      className="text-sm text-gray-600 font-bold dark:text-slate-300"
                    >
                      {name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
