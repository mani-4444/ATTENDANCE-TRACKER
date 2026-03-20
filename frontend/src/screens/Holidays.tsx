import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, CalendarOff } from 'lucide-react';

const Holidays = () => {
  const { holidays, addHoliday, deleteHoliday } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      addHoliday(name, date);
      setName('');
      setDate('');
      setIsAdding(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 md:p-8 shadow-bento border border-gray-100 min-h-[400px]">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100/50">
          <h2 className="text-2xl font-black text-surface-900 dark:text-gray-100 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
               <CalendarOff className="w-5 h-5 text-primary-500" />
             </div>
             Holidays
          </h2>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-12 h-12 rounded-2xl bg-surface-900 text-white flex items-center justify-center hover:bg-black transition-all shadow-md shadow-surface-900/20 active:scale-95 group"
          >
            <Plus className={`w-6 h-6 transition-transform duration-300 ${isAdding ? 'rotate-45' : ''}`} />
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="mb-8 bg-surface-50 p-6 rounded-[1.5rem] border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Holiday Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Diwali"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 text-surface-900 dark:text-gray-100 font-bold focus:outline-none focus:ring-0 focus:border-primary-500 transition-all placeholder:text-gray-300 placeholder:font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 text-surface-900 dark:text-gray-100 font-bold focus:outline-none focus:ring-0 focus:border-primary-500 transition-all font-sans"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
              >
                Save Holiday
              </button>
            </div>
          </form>
        )}

        {holidays.length === 0 ? (
          <div className="text-center py-16 mt-4">
             <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <CalendarOff className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-surface-900 dark:text-gray-100 font-black text-2xl mb-2">No holidays added.</p>
            <p className="text-gray-400 font-medium pb-4">Tap the + button to add an upcoming holiday.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {holidays.map((h) => (
              <div 
                key={h.id} 
                className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="font-black text-surface-900 dark:text-gray-100 text-xl tracking-tight mb-1">{h.name}</div>
                  <div className="text-sm font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                    {new Date(h.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteHoliday(h.id)}
                  className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-white transition-colors rounded-2xl hover:bg-rose-500 hover:shadow-md hover:shadow-rose-500/20"
                >
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

export default Holidays;
