import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, LogOut, ChevronRight, UserCircle, Bell, Shield, Wallet, Sparkles } from 'lucide-react';

const SettingItem = ({ icon: Icon, title, description, badge, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 border-b border-gray-100 transition-colors last:border-b-0 group text-left"
  >
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-2xl bg-surface-50 flex items-center justify-center text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors border border-gray-100">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="font-bold text-surface-900 text-base flex items-center gap-2 mb-0.5">
          {title}
          {badge && <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] uppercase font-black tracking-wider flex items-center gap-1 shadow-sm"><Sparkles className="w-3 h-3" />{badge}</span>}
        </div>
        <div className="text-sm text-gray-400 font-medium">{description}</div>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
  </button>
);

const Settings = () => {
  const { semesterStart, semesterEnd, requiredPercentage, updateSettings, logout } = useStore();
  const navigate = useNavigate();
  const [isEditingReq, setIsEditingReq] = useState(false);
  const [reqVal, setReqVal] = useState(requiredPercentage);

  const handleSaveReq = () => {
    updateSettings(semesterStart, semesterEnd, reqVal);
    setIsEditingReq(false);
  };

  return (
    <div className="animate-fade-in pb-10 max-w-2xl mx-auto space-y-6">
      <div className="bg-surface-900 rounded-[2rem] p-8 shadow-bento flex items-center gap-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="w-20 h-20 rounded-[1.5rem] bg-white/10 border border-white/20 flex items-center justify-center relative backdrop-blur-md shadow-xl text-white">
          <UserCircle className="w-12 h-12" strokeWidth={1.5} />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-surface-900"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight mb-1">John Doe</h2>
          <p className="text-gray-400 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span> Semester 6 CS, Section A
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Academic config</h3>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Semester Dates</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="date" 
                value={semesterStart}
                className="w-full sm:w-1/2 bg-surface-50 border border-gray-100 rounded-xl px-4 py-3 text-surface-900 font-bold focus:outline-none focus:ring-0 font-sans"
                readOnly
              />
              <span className="hidden sm:flex text-gray-300 font-bold self-center">to</span>
              <input 
                type="date" 
                value={semesterEnd}
                className="w-full sm:w-1/2 bg-surface-50 border border-gray-100 rounded-xl px-4 py-3 text-surface-900 font-bold focus:outline-none focus:ring-0 font-sans"
                readOnly
              />
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
             <div>
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Required Percentage</label>
               <div className="flex items-center">
                 <input 
                   type="number" 
                   value={isEditingReq ? reqVal : requiredPercentage}
                   onChange={(e) => setReqVal(Number(e.target.value))}
                   className={`w-24 bg-surface-50 border ${isEditingReq ? 'border-primary-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20' : 'border-gray-100'} rounded-xl px-4 py-3 text-center text-surface-900 font-black text-lg transition-all`}
                   readOnly={!isEditingReq}
                 />
                 <span className="text-gray-400 ml-3 font-bold text-xl">%</span>
               </div>
             </div>
             
             {isEditingReq ? (
               <button 
                 onClick={handleSaveReq}
                 className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-md active:scale-95"
               >
                 Save
               </button>
             ) : (
               <button 
                 onClick={() => setIsEditingReq(true)}
                 className="bg-surface-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-md active:scale-95"
               >
                 Edit
               </button>
             )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Preferences</h3>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <SettingItem icon={Bell} title="Notifications" description="Daily reminders & smart alerts" />
          <SettingItem icon={Shield} title="Privacy & Security" description="Passcode, Cloud Backup" />
          <SettingItem icon={SettingsIcon} title="General Settings" description="Appearance, Theme" />
          <SettingItem icon={Wallet} title="Pro Version" description="Unlock advanced tracking" badge="Premium" />
        </div>
      </div>

      <button 
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="w-full bg-white border border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-black py-5 rounded-[2rem] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all text-lg flex items-center justify-center gap-3 mt-8"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </div>
  );
};

export default Settings;
