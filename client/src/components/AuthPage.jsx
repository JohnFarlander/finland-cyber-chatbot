import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";

import { Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { auth } from "../services/firebase";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isRegister = mode === "register";

  async function handleDemo() {
    setError("");
    setNotice("");
    setLoading(true);

    try {
      await signInAnonymously(auth);
    } catch (err) {
      const message =
        err.code === "auth/operation-not-allowed"
          ? "Guest preview is not enabled in Firebase yet. Enable Anonymous sign-in in Firebase Authentication."
          : err.message || "Unable to start the guest preview.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      if (isRegister) {
        if (password.length < 8) {
          throw new Error("Password must contain at least 8 characters.");
        }

        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await updateProfile(credential.user, {
          displayName: name.trim(),
        });
        await sendEmailVerification(credential.user);
        await signOut(auth);

        setMode("login");
        setPassword("");
        setNotice(
          "Account created. Check your email and verify your address before signing in."
        );
      } else {
        const credential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        if (!credential.user.emailVerified) {
          await sendEmailVerification(credential.user);
          await signOut(auth);
          throw new Error(
            "Your email is not verified yet. We sent another verification email."
          );
        }
      }
    } catch (err) {
      const messages = {
        "auth/email-already-in-use":
          "An account already exists with this email address.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/weak-password": "Choose a stronger password.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/operation-not-allowed":
          "Guest preview is not enabled in Firebase yet.",
      };

      setError(messages[err.code] || err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-[#0b1525] px-4 py-3 pl-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080f1d] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
            <img
              src="/favicon.svg"
              alt="Finland Cybersecurity Assistant"
              className="h-16 w-16"
            />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-white">
            Finland Cybersecurity Assistant
          </h1>

          <p className="mt-2 text-[10px] tracking-[0.2em] text-cyan-400">
            CYBERSECURITY GUIDANCE · INCIDENT AWARENESS
          </p>

          <p className="mt-4 text-sm text-slate-400">
            Secure access to your cybersecurity workspace.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111c2e] p-7 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isRegister ? "Create an account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {isRegister
                ? "Register to access the cybersecurity assistant."
                : "Sign in to continue to your workspace."}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
            >
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full name
                </label>
                <div className="relative">
                  <UserPlus
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    maxLength={100}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="example@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  placeholder={isRegister ? "Minimum 8 characters" : "Enter password"}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleDemo}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/5 py-3 font-semibold text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Try the interactive demo"}
            </button>
            <p className="mt-2 text-center text-xs leading-5 text-slate-500">
              Explore the chatbot without creating an account. Incident submission and admin tools require a verified account.
            </p>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-sm text-slate-400">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setMode(isRegister ? "login" : "register");
                setError("");
                setNotice("");
              }}
              className="mt-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Finland Cybersecurity Assistant · Interactive project preview
        </p>
      </div>
    </div>
  );
}
