import { create } from "zustand";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";

export type Subject = {
  id: string;
  name: string;
  color: string;
  attended: number;
  total: number;
};

export type Session = {
  id: string;
  date: string;
  subjectId: string;
  status: "Present" | "Absent" | "Pending" | "Holiday";
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
  timetable: TimetableEntry[];
  holidays: Holiday[];

  // Actions
  fetchData: () => Promise<void>;
  toggleAttendance: (
    id: string,
    newStatus: "Present" | "Absent" | "Pending",
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

      const subjects = (subjectsData || []).map((sub) => {
        const subSessions = (sessionsData || []).filter(
          (s) => s.subject_id === sub.id,
        );
        const subAttendance = (attendanceData || []).filter((a) =>
          subSessions.some((s) => s.id === a.session_id),
        );

        return {
          id: sub.id,
          name: sub.name,
          color: sub.color || "bg-blue-500 text-white",
          attended: subAttendance.filter((a) => a.status === "Present").length,
          total: subAttendance.length,
        };
      });

      const sessions = (sessionsData || []).map((s) => {
        const att = (attendanceData || []).find((a) => a.session_id === s.id);
        return {
          id: s.id,
          date: s.class_date,
          subjectId: s.subject_id || "",
          status: (att?.status as any) || "Pending",
        };
      });

      set({
        subjects,
        sessions,
        studentName: profileData?.name || "",
        semesterStart: semesterData?.start_date || "2023-08-01",
        semesterEnd: semesterData?.end_date || "2023-11-30",
        requiredPercentage: semesterData?.required_percentage || 75,
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

  addSubject: async (name, color) => {
    const { user } = get();
    if (!user) return;

    try {
      await supabase.from("subjects").insert({ name, color, user_id: user.id });
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

  toggleAttendance: async (id, newStatus) => {
    const { user } = get();
    if (!user) return;

    try {
      const { data: existingAtt } = await supabase
        .from("attendance")
        .select("*")
        .eq("session_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingAtt) {
        if (newStatus === "Pending") {
          await supabase.from("attendance").delete().eq("id", existingAtt.id);
        } else {
          await supabase
            .from("attendance")
            .update({ status: newStatus })
            .eq("id", existingAtt.id);
        }
      } else if (newStatus !== "Pending") {
        await supabase.from("attendance").insert({
          session_id: id,
          status: newStatus,
          user_id: user.id,
        });
      }

      await get().fetchData();
    } catch (error) {
      console.error("Error toggling attendance:", error);
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
      timetable: [],
      holidays: [],
    });
  },

  setRequiredPercentage: (req) => set({ requiredPercentage: req }),
}));
