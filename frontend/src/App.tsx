import React, { useCallback, useEffect, useRef, useState } from "react";
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
import SubjectAttendance from "./screens/SubjectAttendance";
import DateAttendanceDetails from "./screens/DateAttendanceDetails";
import { useStore } from "./store";
import { supabase } from "./lib/supabase";

// Protected Route Component
const ProtectedRoute = ({
  children,
  isAuthLoading,
}: {
  children: React.ReactNode;
  isAuthLoading: boolean;
}) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (isAuthLoading) {
    return <div className="min-h-screen" />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicAuthRoute = ({
  children,
  isAuthLoading,
}: {
  children: React.ReactNode;
  isAuthLoading: boolean;
}) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (isAuthLoading) {
    return <div className="min-h-screen" />;
  }

  return isAuthenticated ? (
    <Navigate to="/app/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

function App() {
  const { setUser, fetchData, generateSessions } = useStore();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const lastFetchedUserRef = useRef<string | null>(null);

  const loadUserDataOnce = useCallback(
    async (userId: string) => {
      if (lastFetchedUserRef.current === userId) {
        return;
      }
      lastFetchedUserRef.current = userId;
      // Generate sessions first, then fetch all data
      await generateSessions();
      await fetchData();
    },
    [fetchData, generateSessions],
  );

  useEffect(() => {
    let isMounted = true;

    console.log("[AuthInit] Starting session restore");

    // Check initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;

        console.log("[AuthInit] getSession result", {
          hasSession: !!session,
          userId: session?.user?.id || null,
        });

        setUser(session?.user ?? null);
        if (session?.user) {
          console.log("[AuthInit] Session found, loading data");
          loadUserDataOnce(session.user.id);
        } else {
          lastFetchedUserRef.current = null;
          console.log("[AuthInit] No session found");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false);
          console.log("[AuthInit] Session restore completed");
        }
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      console.log("[AuthInit] Auth state changed", {
        eventHasSession: !!session,
        userId: session?.user?.id || null,
      });

      setUser(session?.user ?? null);
      if (session?.user) {
        if (event !== "INITIAL_SESSION") {
          console.log("[AuthInit] Auth change has session, loading data");
          loadUserDataOnce(session.user.id);
        }
      } else {
        lastFetchedUserRef.current = null;
      }

      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, loadUserDataOnce]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicAuthRoute isAuthLoading={isAuthLoading}>
              <Auth />
            </PublicAuthRoute>
          }
        />

        {/* App routes wrapped in Layout with bottom nav */}
        <Route
          element={
            <ProtectedRoute isAuthLoading={isAuthLoading}>
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
          <Route
            path="/app/attendance/subject/:subjectId"
            element={<SubjectAttendance />}
          />
          <Route
            path="/app/attendance/date/:date"
            element={<DateAttendanceDetails />}
          />
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
