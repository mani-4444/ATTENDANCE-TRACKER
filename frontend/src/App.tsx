import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./screens/LandingPage";
import Auth from "./screens/Auth";
import Dashboard from "./screens/Dashboard";
import Attendance from "./screens/Attendance";
import Timetable from "./screens/Timetable";
import Holidays from "./screens/Holidays";
import Predictor from "./screens/Predictor";
import Subjects from "./screens/Subjects";
import Settings from "./screens/Settings";
import { useStore } from "./store";
import { supabase } from "./lib/supabase";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { setUser, fetchData } = useStore();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, fetchData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />

        {/* App routes wrapped in Layout with bottom nav */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/app"
            element={<Navigate to="/app/dashboard" replace />}
          />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/attendance" element={<Attendance />} />
          <Route path="/app/timetable" element={<Timetable />} />
          <Route path="/app/subjects" element={<Subjects />} />
          <Route path="/app/holidays" element={<Holidays />} />
          <Route path="/app/predictor" element={<Predictor />} />
          <Route path="/app/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
