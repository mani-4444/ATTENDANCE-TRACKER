import React from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  BookOpen,
  CalendarOff,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
import { useStore } from "../store";
import ThemeToggle from "./ThemeToggle";

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, studentName } = useStore();

  const getTitle = () => {
    if (location.pathname.startsWith("/app/attendance/subject/")) {
      return "Subject Attendance";
    }
    if (location.pathname.startsWith("/app/attendance/date/")) {
      return "Date Attendance";
    }

    switch (location.pathname) {
      case "/app/dashboard":
        return "Dashboard";
      case "/app/attendance":
        return "Track Progress";
      case "/app/timetable":
        return "Weekly Timetable";
      case "/app/subjects":
        return "Subjects Dashboard";
      case "/app/holidays":
        return "Holidays";
      case "/app/predictor":
        return "Smart Predictor";
      case "/app/settings":
        return "Settings";
      default:
        return "Smart Attendance";
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-gray-200/50 bg-white/80 px-4 shadow-sm backdrop-blur-xl md:px-8 dark:border-slate-800/70 dark:bg-slate-950/80">
      <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
        {getTitle()}
      </h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="md:hidden flex items-center justify-center p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-gray-500 dark:text-slate-400">
          {studentName || "Student"}
        </span>
      </div>
    </header>
  );
};

const navItems = [
  { name: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
  { name: "Track", path: "/app/attendance", icon: CheckSquare },
  { name: "Timetable", path: "/app/timetable", icon: CalendarDays },
  { name: "Subjects", path: "/app/subjects", icon: BookOpen },
  { name: "Holidays", path: "/app/holidays", icon: CalendarOff },
  { name: "Predictor", path: "/app/predictor", icon: TrendingUp },
  { name: "Settings", path: "/app/settings", icon: Settings },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useStore();
  return (
    <div className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:fixed md:inset-y-0 relative z-50">
      <div className="flex grow flex-col gap-y-8 overflow-y-auto border-r border-gray-200/50 bg-surface-50 px-6 pb-4 pt-8 h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 shrink-0 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <CheckSquare className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tight text-surface-900 dark:text-slate-100">
            TrackMate
          </span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 transition-all duration-300 ${
                        isActive
                          ? "bg-primary-50 text-primary-700 shadow-sm border border-primary-100/50"
                          : "text-gray-500 hover:text-primary-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto border-t border-gray-200/50 pt-4 dark:border-slate-800">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="group flex w-full items-center gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all duration-300"
          >
            <LogOut className="h-5 w-5 shrink-0" strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 z-50 px-4 pb-safe shadow-[0_-8px_24px_rgba(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-full items-center justify-between gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-14 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-primary-600 bg-primary-50 shadow-sm"
                    : "text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-[22px] h-[22px] mb-1 ${isActive ? "scale-110" : ""} transition-transform`}
                    strokeWidth={2.5}
                  />
                  <span className="text-[10px] font-bold leading-none">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 w-full font-sans dark:bg-slate-950">
      <Sidebar />
      <div className="md:pl-64 lg:pl-72 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 overflow-x-hidden w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-0 max-w-7xl">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
