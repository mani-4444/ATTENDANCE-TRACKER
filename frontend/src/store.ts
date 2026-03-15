import { create } from "zustand";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";

export type Subject = {
  id: string;
  name: string;
  presentCount: number;
  absentCount: number;
  unmarkedCount: number;
  classesTillNow: number;
  totalPossibleClasses: number;
  percentage: number;
};

export type Session = {
  id: string;
  date: string;
  subjectId: string;
};

export type AttendanceRecord = {
  id: string;
  sessionId: string;
  status: "present" | "absent";
};

export type TimetableEntry = {
  id: string;
  subjectId: string;
  day: number; // 0-6
};

export type Holiday = {
  id: string;
  name: string;
  date: string;
};

interface AppState {
  user: User | null;
  loading: boolean;
  studentName: string;
  semesterStart: string;
  semesterEnd: string;
  requiredPercentage: number;
  subjects: Subject[];
  sessions: Session[];
  attendance: AttendanceRecord[];
  timetable: TimetableEntry[];
  holidays: Holiday[];

  // Actions
  fetchData: () => Promise<void>;
  generateSessions: () => Promise<void>;
  upsertAttendance: (
    sessionId: string,
    status: "present" | "absent" | null,
  ) => Promise<void>;
  updateSettings: (start: string, end: string, req: number) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  addHoliday: (name: string, date: string) => Promise<void>;
  deleteHoliday: (id: string) => Promise<void>;

  addSubject: (name: string, color: string) => Promise<void>;
  addSubjectWithDays: (
    name: string,
    color: string,
    days: number[],
  ) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addTimetableEntry: (subjectId: string, day: number) => Promise<void>;
  deleteTimetableEntry: (id: string) => Promise<void>;

  // Auth
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  setRequiredPercentage: (req: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  loading: false,
  studentName: "",
  semesterStart: "2023-08-01",
  semesterEnd: "2023-11-30",
  requiredPercentage: 75,
  isAuthenticated: false,
  subjects: [],
  sessions: [],
  attendance: [],
  timetable: [],
  holidays: [],

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  fetchData: async () => {
    const { user } = get();
    if (!user) return;

    set({ loading: true });

    try {
      // Fetch everything in parallel
      const [
        { data: subjectsData },
        { data: semesterData },
        { data: sessionsData },
        { data: attendanceData },
        { data: timetableData },
        { data: holidaysData },
        { data: profileData },
      ] = await Promise.all([
        supabase.from("subjects").select("*").eq("user_id", user.id),
        supabase
          .from("semester")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase.from("sessions").select("*").eq("user_id", user.id),
        supabase.from("attendance").select("*").eq("user_id", user.id),
        supabase.from("timetable").select("*").eq("user_id", user.id),
        supabase.from("holidays").select("*").eq("user_id", user.id),
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      ]);

      const semesterStart = semesterData?.start_date || "2023-08-01";
      const semesterEnd = semesterData?.end_date || "2023-11-30";
      const requiredPercentage = semesterData?.required_percentage || 75;
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      const normalizeAttendanceStatus = (
        status: string,
      ): "present" | "absent" | null => {
        const normalized = status.toLowerCase();
        if (normalized === "present") return "present";
        if (normalized === "absent") return "absent";
        return null;
      };

      const attendance = (attendanceData || [])
        .map((a) => {
          const normalizedStatus = normalizeAttendanceStatus(a.status);
          if (!a.session_id || !normalizedStatus) return null;

          return {
            id: a.id,
            sessionId: a.session_id,
            status: normalizedStatus,
          };
        })
        .filter((a): a is AttendanceRecord => a !== null);

      // Compute subjects from sessions + attendance (subjects are computed, not stored)
      const subjects = (subjectsData || []).map((sub) => {
        const subSessions = (sessionsData || []).filter(
          (s) => s.subject_id === sub.id,
        );

        // Strict: only sessions where class_date <= today
        const subSessionsTillNow = subSessions.filter(
          (s) => s.class_date <= today,
        );
        const subSessionsInSemester = subSessions.filter(
          (s) => s.class_date >= semesterStart && s.class_date <= semesterEnd,
        );

        // Join attendance using only past session IDs
        const subSessionIdsTillNow = new Set(
          subSessionsTillNow.map((s) => String(s.id)),
        );
        const subAttendanceTillNow = attendance.filter((a) =>
          subSessionIdsTillNow.has(String(a.sessionId)),
        );

        const presentCount = subAttendanceTillNow.filter(
          (a) => a.status === "present",
        ).length;
        const absentCount = subAttendanceTillNow.filter(
          (a) => a.status === "absent",
        ).length;
        const classesTillNow = subSessionsTillNow.length;
        const totalPossibleClasses = subSessionsInSemester.length;
        const unmarkedCount = Math.max(
          0,
          classesTillNow - presentCount - absentCount,
        );
        const percentage =
          classesTillNow > 0 ? (presentCount / classesTillNow) * 100 : 0;

        // Debug logs
        console.log("[JOIN DEBUG]", {
          subjectId: sub.id,
          sessionIds: [...subSessionIdsTillNow].slice(0, 5),
          attendanceSessionIds: attendance.map((a) => a.sessionId).slice(0, 5),
        });

        console.log("[COUNT DEBUG]", {
          subject: sub.name,
          classesTillNow,
          attendanceRows: subAttendanceTillNow.length,
          presentCount,
          absentCount,
        });

        return {
          id: sub.id,
          name: sub.name,
          presentCount,
          absentCount,
          unmarkedCount,
          classesTillNow,
          totalPossibleClasses,
          percentage,
        };
      });

      console.log("[SubjectsAfterCalc]", subjects);

      const sessions = (sessionsData || []).map((s) => ({
        id: s.id,
        date: s.class_date,
        subjectId: s.subject_id || "",
      }));

      set({
        subjects,
        sessions,
        attendance,
        studentName: profileData?.name || "",
        semesterStart,
        semesterEnd,
        requiredPercentage,
        timetable: (timetableData || []).map((t) => ({
          id: t.id,
          subjectId: t.subject_id || "",
          day: t.weekday,
        })),
        holidays: (holidaysData || []).map((h) => ({
          id: h.id,
          name: h.holiday_name,
          date: h.holiday_date,
        })),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Generate sessions from timetable + semester dates.
   * For each subject's timetable entry (weekday), generates a session row
   * for every matching date between semesterStart and semesterEnd, skipping holidays.
   * Uses ON CONFLICT to avoid duplicates.
   */
  generateSessions: async () => {
    const { user } = get();
    if (!user) return;

    try {
      // Fetch current state from DB for accuracy
      const [
        { data: subjectsData },
        { data: semesterData },
        { data: timetableData },
        { data: holidaysData },
        { data: existingSessionsData },
      ] = await Promise.all([
        supabase.from("subjects").select("*").eq("user_id", user.id),
        supabase
          .from("semester")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase.from("timetable").select("*").eq("user_id", user.id),
        supabase.from("holidays").select("*").eq("user_id", user.id),
        supabase.from("sessions").select("*").eq("user_id", user.id),
      ]);

      if (!semesterData || !subjectsData || !timetableData) {
        console.log("[SessionGen] Missing semester/subjects/timetable data, skipping");
        return;
      }

      const semesterStart = semesterData.start_date;
      const semesterEnd = semesterData.end_date;

      if (!semesterStart || !semesterEnd) {
        console.log("[SessionGen] Missing semester dates, skipping");
        return;
      }

      // Helper: format date as YYYY-MM-DD using LOCAL time (not UTC)
      // This avoids the timezone bug where toISOString() shifts dates back
      const formatLocalDate = (d: Date): string => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Build a set of holiday dates for quick lookup
      const holidayDates = new Set(
        (holidaysData || []).map((h) => h.holiday_date),
      );

      // Build timetable lookup: weekday → list of subject_ids
      const timetableByWeekday = new Map<number, string[]>();
      for (const entry of timetableData) {
        const existing = timetableByWeekday.get(entry.weekday) || [];
        existing.push(entry.subject_id);
        timetableByWeekday.set(entry.weekday, existing);
      }

      // Build set of valid session keys from timetable: "subjectId|classDate"
      const validSessionKeys = new Set<string>();

      // Build a set of existing sessions for dedup: "subjectId|classDate"
      const existingSessionKeys = new Set(
        (existingSessionsData || []).map(
          (s) => `${s.subject_id}|${s.class_date}`,
        ),
      );

      // Generate session rows — iterate dates, look up timetable per weekday
      const newSessions: {
        subject_id: string;
        class_date: string;
        user_id: string;
      }[] = [];

      // Parse semester dates using local time
      const [startY, startM, startD] = semesterStart.split("-").map(Number);
      const [endY, endM, endD] = semesterEnd.split("-").map(Number);
      const currentDate = new Date(startY, startM - 1, startD);
      const endDate = new Date(endY, endM - 1, endD);

      while (currentDate <= endDate) {
        const dateStr = formatLocalDate(currentDate);
        const weekday = currentDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

        // Find timetable subjects for this weekday
        const timetableSubjects = timetableByWeekday.get(weekday) || [];

        if (timetableSubjects.length > 0) {
          console.log("[GenerateSessionsDay]", {
            date: dateStr,
            weekday,
            timetableSubjects,
          });
        }

        // Skip holidays
        if (!holidayDates.has(dateStr)) {
          for (const subjectId of timetableSubjects) {
            const key = `${subjectId}|${dateStr}`;
            validSessionKeys.add(key);

            // Only insert if not already existing
            if (!existingSessionKeys.has(key)) {
              newSessions.push({
                subject_id: subjectId,
                class_date: dateStr,
                user_id: user.id,
              });
            }
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Delete stale sessions that don't match timetable
      const staleSessionIds = (existingSessionsData || [])
        .filter((s) => {
          const key = `${s.subject_id}|${s.class_date}`;
          // Session is stale if it's not a valid timetable+date combo
          return !validSessionKeys.has(key);
        })
        .map((s) => s.id);

      if (staleSessionIds.length > 0) {
        // Delete attendance for stale sessions first
        const BATCH_SIZE = 500;
        for (let i = 0; i < staleSessionIds.length; i += BATCH_SIZE) {
          const batch = staleSessionIds.slice(i, i + BATCH_SIZE);
          await supabase
            .from("attendance")
            .delete()
            .in("session_id", batch)
            .eq("user_id", user.id);
        }
        // Delete stale sessions
        for (let i = 0; i < staleSessionIds.length; i += BATCH_SIZE) {
          const batch = staleSessionIds.slice(i, i + BATCH_SIZE);
          await supabase
            .from("sessions")
            .delete()
            .in("id", batch)
            .eq("user_id", user.id);
        }
        console.log("[SessionsDeleted] Stale sessions removed:", staleSessionIds.length);
      }

      if (newSessions.length > 0) {
        // Insert in batches of 500 to avoid payload limits
        const BATCH_SIZE = 500;
        for (let i = 0; i < newSessions.length; i += BATCH_SIZE) {
          const batch = newSessions.slice(i, i + BATCH_SIZE);
          const { error } = await supabase.from("sessions").insert(batch);
          if (error) {
            console.error("[SessionGen] Insert error:", error);
          }
        }
      }

      console.log("[SessionsGenerated]", newSessions.length);
    } catch (error) {
      console.error("[SessionGen] Error:", error);
    }
  },

  addSubject: async (name, color) => {
    const { user } = get();
    if (!user) return;

    try {
      await supabase.from("subjects").insert({ name, color, user_id: user.id });
      await get().generateSessions();
      await get().fetchData();
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  },

  addSubjectWithDays: async (name, color, days) => {
    const { user } = get();
    if (!user) return;

    try {
      const { data: subject, error: subjectError } = await supabase
        .from("subjects")
        .insert({ name, color, user_id: user.id })
        .select("id")
        .single();

      if (subjectError || !subject) {
        throw subjectError || new Error("Subject creation failed");
      }

      if (days.length > 0) {
        const timetableRows = days.map((weekday) => ({
          subject_id: subject.id,
          weekday,
          user_id: user.id,
        }));

        const { error: timetableError } = await supabase
          .from("timetable")
          .insert(timetableRows);

        if (timetableError) {
          throw timetableError;
        }
      }

      // Generate sessions for the new subject + timetable
      await get().generateSessions();
      await get().fetchData();
    } catch (error) {
      console.error("Error creating subject with timetable:", error);
      throw error;
    }
  },

  deleteSubject: async (id) => {
    const { user } = get();
    if (!user) return;

    try {
      // Delete attendance records for sessions of this subject first
      const { data: subjectSessions } = await supabase
        .from("sessions")
        .select("id")
        .eq("subject_id", id)
        .eq("user_id", user.id);

      if (subjectSessions && subjectSessions.length > 0) {
        const sessionIds = subjectSessions.map((s) => s.id);
        await supabase
          .from("attendance")
          .delete()
          .in("session_id", sessionIds)
          .eq("user_id", user.id);
      }

      // Delete sessions for this subject
      await supabase
        .from("sessions")
        .delete()
        .eq("subject_id", id)
        .eq("user_id", user.id);

      // Delete timetable entries for this subject
      await supabase
        .from("timetable")
        .delete()
        .eq("subject_id", id)
        .eq("user_id", user.id);

      // Delete the subject itself
      await supabase.from("subjects").delete().eq("id", id);

      await get().fetchData();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  },

  addTimetableEntry: async (subjectId, day) => {
    const { user } = get();
    if (!user) return;

    try {
      await supabase
        .from("timetable")
        .insert({ subject_id: subjectId, weekday: day, user_id: user.id });
      // Regenerate sessions since timetable changed
      await get().generateSessions();
      await get().fetchData();
    } catch (error) {
      console.error("Error adding timetable entry:", error);
    }
  },

  deleteTimetableEntry: async (id) => {
    const { user } = get();
    if (!user) return;

    try {
      await supabase.from("timetable").delete().eq("id", id);
      await get().fetchData();
    } catch (error) {
      console.error("Error deleting timetable entry:", error);
    }
  },

  upsertAttendance: async (sessionId, status) => {
    const { user } = get();
    if (!user) return;

    try {
      // Safety check: block writes for future sessions
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const { data: sessionRow } = await supabase
        .from("sessions")
        .select("class_date")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!sessionRow) {
        console.log("[AttendanceBlockedFuture]", sessionId, "session not found");
        return;
      }

      if (sessionRow.class_date > today) {
        console.log("[AttendanceBlockedFuture]", sessionId, "date:", sessionRow.class_date);
        return;
      }

      const { data: existingAtt } = await supabase
        .from("attendance")
        .select("*")
        .eq("session_id", sessionId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (status === null) {
        // Delete attendance record (unmark)
        if (existingAtt) {
          await supabase.from("attendance").delete().eq("id", existingAtt.id);
        }
      } else if (existingAtt) {
        // Update existing record
        await supabase
          .from("attendance")
          .update({ status })
          .eq("id", existingAtt.id);
      } else {
        // Insert new record
        await supabase.from("attendance").insert({
          session_id: sessionId,
          status,
          user_id: user.id,
        });
      }

      await get().fetchData();
      console.log("[AttendanceWriteDone]", sessionId, status);
    } catch (error) {
      console.error("Error upserting attendance:", error);
    }
  },

  updateSettings: async (start, end, req) => {
    const { user } = get();
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from("semester")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("semester")
          .update({
            start_date: start,
            end_date: end,
            required_percentage: req,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("semester").insert({
          start_date: start,
          end_date: end,
          required_percentage: req,
          user_id: user.id,
        });
      }

      set({
        semesterStart: start,
        semesterEnd: end,
        requiredPercentage: req,
      });

      // Semester changed → regenerate sessions + refresh data
      await get().generateSessions();
      await get().fetchData();
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  },

  updateProfile: async (name) => {
    const { user } = get();
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("profiles").update({ name }).eq("id", user.id);
      } else {
        await supabase.from("profiles").insert({ id: user.id, name });
      }
      set({ studentName: name });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  addHoliday: async (name, date) => {
    const { user } = get();
    if (!user) return;

    try {
      await supabase.from("holidays").insert({
        holiday_name: name,
        holiday_date: date,
        user_id: user.id,
      });

      // Delete any sessions on this holiday date
      await supabase
        .from("sessions")
        .delete()
        .eq("class_date", date)
        .eq("user_id", user.id);

      await get().fetchData();
    } catch (error) {
      console.error("Error adding holiday:", error);
    }
  },

  deleteHoliday: async (id) => {
    const { user } = get();
    if (!user) return;

    try {
      await supabase.from("holidays").delete().eq("id", id);
      // Regenerate sessions since a holiday was removed (new sessions may be needed)
      await get().generateSessions();
      await get().fetchData();
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      isAuthenticated: false,
      subjects: [],
      sessions: [],
      attendance: [],
      timetable: [],
      holidays: [],
    });
  },

  setRequiredPercentage: (req) => set({ requiredPercentage: req }),
}));
