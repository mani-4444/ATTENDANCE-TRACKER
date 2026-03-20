import React, { useMemo } from "react";
import { useStore } from "../store";
import { CalendarDays } from "lucide-react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Timetable = () => {
  const { timetable, subjects } = useStore();

  const groupedByDay = useMemo(() => {
    return DAYS.map((dayName, dayIndex) => {
      const dayClasses = timetable
        .filter((entry) => entry.day === dayIndex)
        .map((entry) => {
          const subject = subjects.find((sub) => sub.id === entry.subjectId);
          return {
            id: entry.id,
            name: subject?.name || "Unknown",
          };
        });

      return {
        dayName,
        classes: dayClasses,
      };
    });
  }, [timetable, subjects]);

  return (
    <div className="animate-fade-in pb-10 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 md:p-8 shadow-bento border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary-600">
              <CalendarDays className="w-5 h-5" />
            </div>
            Weekly Timetable
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groupedByDay.map((group) => (
            <div
              key={group.dayName}
              className="rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5"
            >
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-3">
                {group.dayName}
              </h3>
              {group.classes.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium">No classes</p>
              ) : (
                <div className="space-y-2">
                  {group.classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="text-sm font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2"
                    >
                      {cls.name}
                    </div>
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

export default Timetable;
