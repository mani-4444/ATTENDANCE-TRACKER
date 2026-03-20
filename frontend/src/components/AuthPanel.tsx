import React from "react";
import { X } from "lucide-react";
import AuthForm from "./AuthForm";

type AuthPanelProps = {
  isOpen: boolean;
  mode: "login" | "signup";
  onClose: () => void;
};

const AuthPanel = ({ isOpen, mode, onClose }: AuthPanelProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/45 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[420px] overflow-y-auto border-l border-gray-200/70 bg-surface-50 p-4 shadow-2xl transition-transform duration-300 ease-out dark:border-slate-700/60 dark:bg-slate-950 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="mb-3 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close auth panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-96px)] items-center justify-center">
          <AuthForm initialMode={mode} />
        </div>
      </aside>
    </>
  );
};

export default AuthPanel;
