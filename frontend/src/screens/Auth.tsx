import React from "react";
import { useSearchParams } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import ThemeToggle from "../components/ThemeToggle";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignupMode = searchParams.get("mode") === "signup";

  return (
    <div className="min-h-screen bg-surface-50 p-4 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-5xl justify-end py-2">
        <ThemeToggle />
      </div>
      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center">
        <AuthForm initialMode={isSignupMode ? "signup" : "login"} />
      </div>
    </div>
  );
};

export default Auth;
