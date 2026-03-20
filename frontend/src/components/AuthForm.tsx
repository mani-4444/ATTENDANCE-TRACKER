import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  CheckSquare,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  initialMode?: AuthMode;
};

const AuthForm = ({ initialMode = "login" }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/app/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          navigate("/app/dashboard");
        } else {
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      alert(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-gray-100 bg-white dark:bg-gray-900 p-8 shadow-bento dark:border-slate-700/50 dark:bg-slate-900">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
          <CheckSquare className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-surface-900 dark:text-slate-100">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-2 text-center font-medium text-gray-500 dark:text-slate-400">
          {isLogin
            ? "Enter your details to access your account."
            : "Sign up to start tracking your attendance."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-gray-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border-2 border-gray-100 bg-surface-50 py-3 pl-11 pr-4 font-medium text-surface-900 dark:text-gray-100 transition-colors focus:border-primary-500 focus:ring-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="John Doe"
                required={!isLogin}
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-slate-300">
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Mail className="h-5 w-5 text-gray-400 dark:text-slate-500" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border-2 border-gray-100 bg-surface-50 py-3 pl-11 pr-4 font-medium text-surface-900 dark:text-gray-100 transition-colors focus:border-primary-500 focus:ring-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Lock className="h-5 w-5 text-gray-400 dark:text-slate-500" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border-2 border-gray-100 bg-surface-50 py-3 pl-11 pr-4 font-medium text-surface-900 dark:text-gray-100 transition-colors focus:border-primary-500 focus:ring-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="........"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 text-lg font-bold text-white shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] disabled:opacity-70 hover:bg-primary-700"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              {isLogin ? "Log In" : "Sign Up"}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="font-medium text-gray-500 dark:text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
            className="font-bold text-primary-600 transition-colors hover:text-primary-700 disabled:opacity-50"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
