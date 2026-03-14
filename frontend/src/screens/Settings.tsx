import React, { useEffect, useState } from "react";
import { useStore } from "../store";

const Settings = () => {
  const {
    studentName,
    semesterStart,
    semesterEnd,
    requiredPercentage,
    updateSettings,
    updateProfile,
  } = useStore();

  const [nameVal, setNameVal] = useState(studentName);
  const [startVal, setStartVal] = useState(semesterStart);
  const [endVal, setEndVal] = useState(semesterEnd);
  const [reqVal, setReqVal] = useState(requiredPercentage);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNameVal(studentName);
    setStartVal(semesterStart);
    setEndVal(semesterEnd);
    setReqVal(requiredPercentage);
  }, [studentName, semesterStart, semesterEnd, requiredPercentage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startVal || !endVal) {
      alert("Please select both semester dates.");
      return;
    }

    if (startVal > endVal) {
      alert("Semester start date must be before end date.");
      return;
    }

    if (Number.isNaN(reqVal) || reqVal < 0 || reqVal > 100) {
      alert("Required percentage must be between 0 and 100.");
      return;
    }

    setSaving(true);
    try {
      await Promise.all([
        updateProfile(nameVal.trim()),
        updateSettings(startVal, endVal, reqVal),
      ]);
    } catch (error: any) {
      alert(error?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10 max-w-2xl mx-auto">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-black text-surface-900 tracking-tight">
            Settings Dashboard
          </h2>
          <p className="text-gray-500 font-medium mt-2">
            Update your profile and semester settings.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
              Student Name
            </label>
            <input
              type="text"
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              className="w-full bg-surface-50 border border-gray-100 rounded-xl px-4 py-3 text-surface-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Your name"
              disabled={saving}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
              Semester Duration
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase font-black mb-1 ml-1">
                  Start Date
                </p>
                <input
                  type="date"
                  value={startVal}
                  onChange={(e) => setStartVal(e.target.value)}
                  className="w-full bg-surface-50 border border-gray-100 rounded-xl px-4 py-3 text-surface-900 font-bold focus:outline-none"
                  required
                  disabled={saving}
                />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase font-black mb-1 ml-1">
                  End Date
                </p>
                <input
                  type="date"
                  value={endVal}
                  onChange={(e) => setEndVal(e.target.value)}
                  className="w-full bg-surface-50 border border-gray-100 rounded-xl px-4 py-3 text-surface-900 font-bold focus:outline-none"
                  required
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-surface-50/50 rounded-2xl p-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Required Percentage
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={reqVal}
                  onChange={(e) => setReqVal(Number(e.target.value))}
                  className="w-24 bg-surface-50 border border-gray-100 rounded-xl px-4 py-3 text-center text-surface-900 font-black text-lg"
                  min="0"
                  max="100"
                  required
                  disabled={saving}
                />
                <span className="text-gray-400 ml-3 font-bold text-xl">%</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-surface-900 text-white font-black py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
