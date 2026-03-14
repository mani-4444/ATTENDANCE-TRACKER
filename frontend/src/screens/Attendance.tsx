import React, { useState } from 'react';
import { useStore, Session } from '../store';
import { Check, X, Clock, Filter, Search } from 'lucide-react';

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
          onClick={() => toggleAttendance(session.id, session.status === 'Present' ? 'Pending' : 'Present')}
          className={`px-8 sm:px-6 py-3 rounded-xl font-bold transition-all focus:outline-none flex items-center justify-center gap-2 flex-1 sm:flex-none
            ${session.status === 'Present' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
              : 'text-gray-400 hover:text-emerald-500 hover:bg-white'}`}
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          {session.status === 'Present' && <span className="sm:hidden ml-1">Present</span>}
        </button>
        <button
          onClick={() => toggleAttendance(session.id, session.status === 'Absent' ? 'Pending' : 'Absent')}
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
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Unknown';
  
  const filteredSessions = sessions.filter(s => {
    const matchesSubject = subjectFilter === 'All' || s.subjectId === subjectFilter;
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Unmarked' && s.status === 'Pending') ||
                         (statusFilter === 'Present' && s.status === 'Present') ||
                         (statusFilter === 'Absent' && s.status === 'Absent');
    return matchesSubject && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const today = new Date();
  const fullDayString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const dayOfWeek = today.getDay(); 
  
  const tzOffset = today.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(today.getTime() - tzOffset)).toISOString().split('T')[0];
  const todayHoliday = holidays.find(h => h.date === localISOTime);
  const todaysClasses = timetable.filter(t => t.day === dayOfWeek);

  return (
    <div className="animate-fade-in pb-10">
      
      {/* Today's Classes Section */}
      <div className="mb-8">
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

      {/* Filters Section */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl font-black text-surface-900 tracking-tight flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary-500" />
            Track Progress
          </h2>
          <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">
            {filteredSessions.length} Sessions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 uppercase font-black ml-1">Subject</p>
            <select 
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-4 font-bold text-surface-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJncmF5Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat"
            >
              <option value="All">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 uppercase font-black ml-1">Status</p>
            <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200/50">
              {['All', 'Present', 'Absent', 'Unmarked'].map((status) => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${statusFilter === status ? 'bg-white shadow-sm text-primary-600 border border-gray-200/50' : 'text-gray-500 hover:text-surface-900'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm border-dashed">
            <div className="w-20 h-20 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Clock className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-surface-900 font-black text-2xl mb-2">No matching sessions</p>
            <p className="text-gray-400 font-medium">Try changing your filters.</p>
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
