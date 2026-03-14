import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, CalendarDays } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = () => {
  const { timetable, subjects } = useStore();
  const [selectedDay, setSelectedDay] = useState(1); // Default Monday

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Unknown';
  
  const currentDayClasses = timetable.filter(t => t.day === selectedDay);

  return (
    <div className="animate-fade-in pb-10">
      {/* Day Selector */}
      <div className="flex overflow-x-auto gap-3 pb-6 mb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {DAYS.slice(1, 6).map((day, idx) => {
          const dayId = idx + 1;
          const isSelected = selectedDay === dayId;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(dayId)}
              className={`px-6 py-3.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all duration-300 flex-shrink-0 border
                ${isSelected 
                  ? 'bg-surface-900 text-white border-surface-900 shadow-md shadow-surface-900/20 translate-y-[-2px]' 
                  : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50 hover:text-surface-900 shadow-sm'}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Classes for the day */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-bento border border-gray-100 min-h-[400px]">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100/50 pb-6">
          <h2 className="text-2xl font-black text-surface-900 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                <CalendarDays className="w-5 h-5" />
             </div>
             {DAYS[selectedDay]} Classes
          </h2>
          <button className="w-12 h-12 rounded-2xl bg-surface-900 text-white flex items-center justify-center hover:bg-black transition-all shadow-md shadow-surface-900/20 active:scale-95 group">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {currentDayClasses.length === 0 ? (
          <div className="text-center py-16 mt-4">
             <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
               🎉
             </div>
            <p className="text-surface-900 font-black text-2xl mb-2">No classes today!</p>
            <p className="text-gray-400 font-medium">Enjoy your free day.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDayClasses.map((cls, idx) => (
              <div 
                key={cls.id} 
                className="flex items-center justify-between p-5 rounded-3xl bg-surface-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 font-black text-lg border border-gray-100 group-hover:text-primary-500 group-hover:border-primary-100 transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-black text-surface-900 text-xl tracking-tight">
                      {getSubjectName(cls.subjectId)}
                    </div>
                  </div>
                </div>
                
                <button className="p-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-rose-500 hover:shadow-md hover:shadow-rose-500/20 opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
