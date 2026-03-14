import React from 'react';
import { useStore, Subject } from '../store';
import { Sparkles, TrendingUp } from 'lucide-react';

const DashboardCard = ({ subject, reqPercent }: { subject: Subject; reqPercent: number }) => {
  const percentage = subject.total > 0 ? (subject.attended / subject.total) * 100 : 100;
  
  let statusColor = "text-emerald-700 bg-emerald-100/50";
  let ringColor = "ring-emerald-200 border-emerald-100";
  let progressColor = "bg-emerald-500 shadow-emerald-500/30";
  
  if (percentage < reqPercent) {
    statusColor = "text-rose-700 bg-rose-100/50";
    ringColor = "ring-rose-200 border-rose-100";
    progressColor = "bg-rose-500 shadow-rose-500/30";
  } else if (percentage < reqPercent + 5) {
    statusColor = "text-amber-700 bg-amber-100/50";
    ringColor = "ring-amber-200 border-amber-100";
    progressColor = "bg-amber-500 shadow-amber-500/30";
  }

  return (
    <div className={`p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="font-bold text-surface-900 text-lg leading-tight mb-1">{subject.name}</div>
          <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">{subject.attended} / {subject.total}</span>
            <span>classes</span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-sm font-black ${statusColor}`}>
          {percentage.toFixed(0)}%
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full mt-auto">
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
          <span>Progress</span>
          <span>{reqPercent}% Req</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
          <div 
            className={`absolute top-0 bottom-0 left-0 w-0.5 bg-gray-300 z-10 transition-all`}
            style={{ left: `${reqPercent}%` }}
          />
          <div 
            className={`h-full ${progressColor} shadow-md transition-all duration-1000 ease-out rounded-full relative z-0`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { subjects, requiredPercentage } = useStore();
  
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 100;

  const today = new Date();
  const fullDayString = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <div className="flex justify-between items-end px-1 -mb-2">
         <h2 className="text-xl font-bold text-gray-400">{fullDayString}</h2>
      </div>
      
      {/* Overview Hero - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative overflow-hidden bg-surface-900 rounded-[2rem] p-8 text-white shadow-bento group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
            <TrendingUp className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white/90 mb-6 border border-white/10 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary-300" /> Current Standing
            </div>
            <div className="text-6xl md:text-7xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
              {overallPercentage.toFixed(1)}%
            </div>
            <p className="text-gray-300 font-medium text-lg">
              {totalAttended} attended out of {totalClasses} total classes
            </p>
          </div>
        </div>

        {/* Small Stat Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[2rem] p-8 text-white shadow-bento flex flex-col justify-center relative overflow-hidden">
           <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="absolute top-4 left-4 w-24 h-24 bg-primary-400/30 rounded-full blur-xl"></div>
           <div className="relative z-10">
              <div className="text-primary-100 font-bold uppercase tracking-wider text-sm mb-2">Target</div>
              <div className="text-5xl font-black mb-4">{requiredPercentage}%</div>
              <p className="text-primary-100/80 text-sm font-medium leading-relaxed">Keep your overall attendance above this line to stay safe.</p>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-surface-900 tracking-tight">Subject Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <DashboardCard 
              key={subject.id} 
              subject={subject} 
              reqPercent={requiredPercentage} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
