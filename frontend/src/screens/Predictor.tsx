import React, { useState } from "react";
import { useStore } from "../store";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

const PredictorCard = ({
  title,
  value,
  colorClass,
}: {
  title: string;
  value: number | string;
  colorClass: string;
}) => (
  <div
    className={`p-6 rounded-3xl flex flex-col justify-center items-center shadow-bento ${colorClass}`}
  >
    <div className="text-xs font-bold opacity-80 mb-2 leading-tight text-center uppercase tracking-wider">
      {title}
    </div>
    <div className="text-4xl sm:text-5xl font-black tracking-tight">
      {value}
    </div>
  </div>
);

const Predictor = () => {
  const { subjects, requiredPercentage } = useStore();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("overall");
  const [targetPercent, setTargetPercent] =
    useState<number>(requiredPercentage);

  const isOverall = selectedSubjectId === "overall";
  const subject = isOverall
    ? null
    : subjects.find((s) => s.id === selectedSubjectId);

  if (!isOverall && !subject)
    return (
      <div className="p-4 text-center font-medium text-gray-500">
        No subjects available
      </div>
    );

  const reqDecimal = targetPercent / 100;

  const hypotheticalTotal = isOverall
    ? subjects.reduce((sum, s) => sum + s.totalPossibleClasses, 0)
    : subject!.totalPossibleClasses;

  const currentAttended = isOverall
    ? subjects.reduce((sum, s) => sum + s.presentCount, 0)
    : subject!.presentCount;
  const targetRequiredCount = Math.ceil(hypotheticalTotal * reqDecimal);
  const classesNeededToAttend = Math.max(
    0,
    targetRequiredCount - currentAttended,
  );
  const classesCanMiss = Math.max(0, currentAttended - targetRequiredCount);

  const isSafe = currentAttended >= targetRequiredCount;
  const isDanger = currentAttended < targetRequiredCount;
  const isWarning = isSafe && currentAttended - targetRequiredCount <= 2;

  let statusIcon = <CheckCircle className="w-14 h-14 text-emerald-500" />;
  let statusText = "You are Safe";
  let statusColor = "bg-emerald-50 border-emerald-100 text-emerald-900";
  let statusGradient = "from-emerald-400 to-emerald-600";

  if (isDanger) {
    statusIcon = <XCircle className="w-14 h-14 text-rose-500" />;
    statusText = "Shortage Risk";
    statusColor = "bg-rose-50 border-rose-100 text-rose-900";
    statusGradient = "from-rose-400 to-rose-600";
  } else if (isWarning) {
    statusIcon = <AlertTriangle className="w-14 h-14 text-amber-500" />;
    statusText = "At Risk";
    statusColor = "bg-amber-50 border-amber-100 text-amber-900";
    statusGradient = "from-amber-400 to-amber-600";
  }

  const today = new Date();
  const fullDayString = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="animate-fade-in pb-10 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="flex justify-between items-end px-1 -mb-2">
        <h2 className="text-xl font-bold text-gray-400">{fullDayString}</h2>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block px-1">
            Select Subject to Analyze
          </label>
          <div className="relative group">
            <select
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-lg font-bold rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-500 px-6 py-4 transition-all hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <option value="overall" className="font-sans font-medium">
                Overall
              </option>
              {subjects.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                  className="font-sans font-medium"
                >
                  {s.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-400 group-hover:text-primary-500 transition-colors">
              <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Target Percentage Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block px-1">
            Target Percentage
          </label>
          <div className="relative group">
            <select
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-lg font-bold rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-500 px-6 py-4 transition-all hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
              value={targetPercent}
              onChange={(e) => setTargetPercent(Number(e.target.value))}
            >
              <option value={75} className="font-sans font-medium">
                75%
              </option>
              <option value={80} className="font-sans font-medium">
                80%
              </option>
              <option value={85} className="font-sans font-medium">
                85%
              </option>
              <option value={90} className="font-sans font-medium">
                90%
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-400 group-hover:text-primary-500 transition-colors">
              <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Status */}
      <div
        className={`p-8 md:p-12 rounded-[2rem] border overflow-hidden relative text-center ${statusColor}`}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${statusGradient} opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr ${statusGradient} opacity-5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2`}
        ></div>

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 inline-block">
            {statusIcon}
          </div>
          <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            {statusText}
          </h3>
          <p className="text-lg font-medium opacity-80 max-w-[300px] mx-auto leading-relaxed">
            {isDanger
              ? `You must attend the next ${classesNeededToAttend} classes to reach ${targetPercent}%.`
              : `You can safely miss ${classesCanMiss} more class${classesCanMiss !== 1 ? "es" : ""} while staying above ${targetPercent}%.`}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PredictorCard
          title="Total Classes"
          value={hypotheticalTotal}
          colorClass="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
        />
        <PredictorCard
          title="Attended"
          value={currentAttended}
          colorClass="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
        />
        <PredictorCard
          title={`Required (${targetPercent}%)`}
          value={targetRequiredCount}
          colorClass="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
        />
        {isDanger ? (
          <PredictorCard
            title="Must Attend"
            value={classesNeededToAttend}
            colorClass="bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-400 border border-gray-200 dark:border-gray-700"
          />
        ) : (
          <PredictorCard
            title="Safe to Miss"
            value={classesCanMiss}
            colorClass="bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-700"
          />
        )}
      </div>
    </div>
  );
};

export default Predictor;
