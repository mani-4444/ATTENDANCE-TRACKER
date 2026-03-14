import React, { useState } from 'react';
import { useStore, Session } from '../store';
import { Check, X, Clock } from 'lucide-react';

const SessionCard = ({ session, subjectName }: { session: Session; subjectName: string }) => {
  const { toggleAttendance } = useStore();
  
  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 transition-transform active:scale-[0.98] hover:border-gray-200">
      <div className="flex-1">
        <div className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-2">
          {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <div className="font-black text-surface-900 text-xl leading-tight">{subjectName}</div>
      </div>
      
      <div className="flex bg-surface-50 p-1.5 rounded-2xl border border-gray-100 gap-1 mt-2 sm:mt-0">
        <button
          onClick={() => toggleAttendance(session.id, 'Present')}
          className={`px-8 sm:px-6 py-3 rounded-xl font-bold transition-all focus:outline-none flex items-center justify-center gap-2 flex-1 sm:flex-none
            ${session.status === 'Present' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
              : 'text-gray-400 hover:text-emerald-500 hover:bg-white'}`}
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          {session.status === 'Present' && <span className="sm:hidden ml-1">Present</span>}
        </button>
        <button
          onClick={() => toggleAttendance(session.id, 'Absent')}
          className={`px-8 sm:px-6 py-3 rounded-xl font-bold transition-all focus:outline-none flex items-center justify-center gap-2 flex-1 sm:flex-none
            ${session.status === 'Absent' 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
              : 'text-gray-400 hover:text-rose-500 hover:bg-white'}`}
        >
          <X className="w-5 h-5" strokeWidth={3} />
          {session.status === 'Absent' && <span className="sm:hidden ml-1">Absent</span>}
        </button>
      </div>
    </div>
  );
};

const Attendance = () => {
  const { sessions, subjects, timetable, holidays } = useStore();
  const [filter, setFilter] = useState<'All' | 'Pending'>('Pending');
  
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Unknown';
  
  const filteredSessions = sessions.filter(
    (s) => filter === 'All' || s.status === 'Pending'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const today = new Date();
  const fullDayString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon
  
  // Format to standard YYYY-MM-DD for checking holiday match (assuming timezone matches somewhat closely with simple split)
  const tzOffset = today.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(today.getTime() - tzOffset)).toISOString().split('T')[0];
  const todayHoliday = holidays.find(h => h.date === localISOTime);
  const todaysClasses = timetable.filter(t => t.day === dayOfWeek);

  return (
    <div className="animate-fade-in pb-10">
      
      {/* Today's Classes Section */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-black text-surface-900 tracking-tight">Today</h2>
            <p className="text-primary-600 font-bold">{fullDayString}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-6 shadow-bento border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Today's Classes</h3>
          {todayHoliday ? (
            <div className="py-6 text-center bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-amber-700 font-bold text-lg">🏖️ Holiday: {todayHoliday.name}</span>
            </div>
          ) : todaysClasses.length === 0 ? (
            <div className="py-6 text-center bg-gray-50 rounded-2xl border border-gray-100">
               <span className="text-gray-500 font-bold text-lg">No Classes Today 🎉</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {todaysClasses.map(c => {
                 const sub = subjects.find(s => s.id === c.subjectId);
                 return (
                   <div key={c.id} className="p-4 rounded-[1rem] bg-surface-50 border border-gray-100 flex items-center shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className={`w-3 h-3 rounded-full mr-3 ${sub?.color.split(' ')[0] || 'bg-gray-400'}`}></div>
                      <span className="font-bold text-surface-900">{sub?.name || 'Unknown'}</span>
                   </div>
                 );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-black text-surface-900 tracking-tight">Track Progress</h2>
      </div>

      {/* Sleek Tabs */}
      <div className="flex bg-gray-100/50 p-1.5 rounded-2xl mb-6 w-full max-w-sm border border-gray-200/50">
        <button 
          onClick={() => setFilter('Pending')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${filter === 'Pending' ? 'bg-white shadow-sm text-primary-600 border border-gray-200/50' : 'text-gray-500 hover:text-surface-900'}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter('All')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${filter === 'All' ? 'bg-white shadow-sm text-primary-600 border border-gray-200/50' : 'text-gray-500 hover:text-surface-900'}`}
        >
          All Sessions
        </button>
      </div>

      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm border-dashed">
            <div className="w-20 h-20 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Clock className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-surface-900 font-black text-2xl mb-2">You're all caught up!</p>
            <p className="text-gray-400 font-medium">No {filter === 'Pending' ? 'pending classes' : 'classes found'}.</p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <SessionCard 
              key={session.id} 
              session={session} 
              subjectName={getSubjectName(session.subjectId)} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Attendance;
