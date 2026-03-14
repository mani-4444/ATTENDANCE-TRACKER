import React, { useState } from "react";
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

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
          navigate("/login");
        }
      }
    } catch (error: any) {
      alert(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-bento border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
            <CheckSquare className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-surface-900 tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-center">
            {isLogin
              ? "Enter your details to access your account."
              : "Sign up to start tracking your attendance."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-surface-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-primary-500 transition-colors font-medium text-surface-900"
                  placeholder="John Doe"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-surface-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-primary-500 transition-colors font-medium text-surface-900"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-surface-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-primary-500 transition-colors font-medium text-surface-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {isLogin ? "Log In" : "Sign Up"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
              className="text-primary-600 font-bold hover:text-primary-700 transition-colors disabled:opacity-50"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
