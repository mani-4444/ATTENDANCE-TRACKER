import React, { useState } from "react";
import {
  CheckSquare,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Zap,
  Sparkles,
} from "lucide-react";
import AuthPanel from "../components/AuthPanel";
import ThemeToggle from "../components/ThemeToggle";

const LandingPage = () => {
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuthPanel = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthPanel(true);
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans selection:bg-primary-500 selection:text-white dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-2xl lg:px-12 dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <CheckSquare className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-2xl tracking-tight text-surface-900 dark:text-slate-100">
            TrackMate
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            onClick={() => openAuthPanel("login")}
            className="text-sm font-bold text-primary-700 bg-primary-50 border border-primary-100 px-4 sm:px-5 py-2.5 rounded-full hover:bg-primary-100 hover:scale-105 active:scale-95 transition-all shadow-sm dark:border-primary-900/70 dark:bg-primary-900/30 dark:text-primary-100 dark:hover:bg-primary-900/40"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthPanel("signup")}
            className="text-sm font-bold text-white bg-primary-600 border border-primary-600 px-4 sm:px-5 py-2.5 rounded-full hover:bg-primary-700 hover:border-primary-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main
        className={`mx-auto max-w-7xl px-6 pb-24 pt-20 transition-[padding] duration-300 lg:pt-32 ${
          showAuthPanel ? "lg:pr-[430px]" : ""
        }`}
      >
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto mb-32">
          <div className="inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-surface-100 px-4 py-1.5 text-sm font-bold text-surface-800 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>Attendance tracking, redefined.</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-surface-900 dark:text-gray-100 leading-[1.1] dark:text-slate-100">
            Own Your Time. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600">
              Never Guess Again.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-gray-500 md:text-xl dark:text-slate-400">
            Smart class tracking with predictive analytics, automatic
            timetables, and offline sync. Designed for students who value their
            time.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuthPanel("login")}
              className="w-full sm:w-auto px-8 py-4 bg-surface-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl shadow-surface-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          {/* Large Feature */}
          <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-bento border border-gray-200/60 overflow-hidden relative group dark:bg-slate-900 dark:border-slate-700/60">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-6 shadow-sm border border-primary-200/50">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-black text-surface-900 dark:text-gray-100 mb-4 tracking-tight dark:text-slate-100">
                Smart Predictor
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm dark:text-slate-400">
                Instantly know how many classes you can afford to safely skip or
                how many you must attend to stay above the 75% red line.
              </p>
              <div className="mt-auto hidden sm:block">
                <div className="bg-white/80 backdrop-blur border border-white p-4 rounded-2xl shadow-sm inline-flex items-center gap-4 dark:bg-slate-800/80 dark:border-slate-700">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-surface-900 dark:text-slate-100">
                      Safe to Miss
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      3 Classes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Small Feature 1 */}
          <div className="md:col-span-1 lg:col-span-2 bg-surface-900 text-white rounded-[2rem] p-8 shadow-bento overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <CalendarDays className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 backdrop-blur-md">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-3">Auto Schedule</h3>
              <p className="text-gray-400 font-medium dark:text-slate-400">
                Input your weekly timetable once. We'll automatically generate
                your classes for every week, skipping holidays.
              </p>
            </div>
          </div>

          {/* Small Feature 2 */}
          <div className="md:col-span-1 lg:col-span-1 bg-gradient-to-br from-indigo-500 to-primary-600 text-white rounded-[2rem] p-8 shadow-bento overflow-hidden relative group">
            <div className="relative z-10 flex flex-col h-full items-center text-center justify-center mt-4">
              <Zap className="w-12 h-12 mb-4 text-indigo-200 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black mb-2">Lightning Fast</h3>
              <p className="text-indigo-100 text-sm">
                Mark attendance in seconds with our optimized UI.
              </p>
            </div>
          </div>

          {/* Small Feature 3 */}
          <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-bento border border-gray-200/60 overflow-hidden relative dark:bg-slate-900 dark:border-slate-700/60">
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-surface-900 dark:text-gray-100 mb-3 dark:text-slate-100">
                Sync & Save
              </h3>
              <p className="text-gray-500 text-sm font-medium dark:text-slate-400">
                Built for mobile. Mark your attendance with a single tap as you
                walk out of class, everything is saved locally.
              </p>
            </div>
          </div>
        </div>
      </main>

      <AuthPanel
        isOpen={showAuthPanel}
        mode={authMode}
        onClose={() => setShowAuthPanel(false)}
      />
    </div>
  );
};

export default LandingPage;
