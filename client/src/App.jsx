
import { useEffect, useState } from "react";

import {
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  FileWarning,
  ClipboardList,
  Settings,
  Bell,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Activity,
} from "lucide-react";

import AuthPage from "./components/AuthPage";
import ChatbotLive from "./components/ChatbotLive";
import ReportIncidentLive from "./components/ReportIncidentLive";
import OverviewLive from "./components/OverviewLive";
import IncidentManagementLive from "./components/IncidentManagementLive";

import { useAuth } from "./context/AuthContext";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Cyber Assistant", icon: MessageSquare },
  { name: "Report Incident", icon: FileWarning },
  { name: "Incident Management", icon: ClipboardList },
];

function Sidebar({
  active,
  setActive,
  open,
  setOpen,
  isAdmin,
  isGuest,
  onLogout,
}) {
  function navigate(page) {
    setActive(page);
    setOpen(false);
  }

  const visibleNavigation = navigation.filter((item) => {
    if (isGuest) {
      return item.name === "Cyber Assistant";
    }

    const adminOnly = [
      "Overview",
      "Incident Management",
    ].includes(item.name);

    return isAdmin || !adminOnly;
  });

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0b1525] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt="Finland Cybersecurity Assistant"
              className="h-11 w-11 shrink-0"
            />

            <div>
              <h1 className="text-sm font-bold leading-tight text-white">
                FINLAND
              </h1>

              <p className="mt-1 text-[9px] tracking-[0.12em] text-cyan-400">
                CYBERSECURITY ASSISTANT
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            className="text-slate-400 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-8">
          <p className="mb-4 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
            WORKSPACE
          </p>

          <nav className="space-y-1" aria-label="Main navigation">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const selected = active === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.name)}
                  aria-current={selected ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    selected
                      ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>

                  {selected && (
                    <ChevronRight
                      className="ml-auto"
                      size={16}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="mt-auto p-4">
          {!isGuest && (
            <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-cyan-400">
                <ShieldCheck size={18} />

                <span className="text-xs font-semibold">
                  Stay Protected
                </span>
              </div>

              <p className="text-xs leading-5 text-slate-400">
                Stay informed. Stay alert. Stay secure.
              </p>
            </div>
          )}

          {!isGuest && (
            <button
              type="button"
              onClick={() => navigate("Settings")}
              className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-800"
            >
              <Settings size={18} />
              Settings
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-400 hover:bg-red-400/10"
          >
            <LogOut size={18} />
            {isGuest ? "Exit Demo" : "Sign Out"}
          </button>

          <div className="mt-3 border-t border-slate-800 pt-4 text-center text-[10px] text-slate-600">
            FINLAND CYBERSECURITY ASSISTANT
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ active, setOpen, isGuest }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-[#080f1d]/90 px-5 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setOpen(true)}
          className="text-slate-400 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-white">
            {active}
          </h2>

          <p className="hidden text-xs text-slate-500 sm:block">
            Finland Cybersecurity Assistance Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-xs text-emerald-400">
            {isGuest ? "Demo Mode" : "System Online"}
          </span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-slate-800 p-2.5 text-slate-400 hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">
          <Activity size={17} />
        </div>
      </div>
    </header>
  );
}

function SettingsPage() {
  return (
    <div className="max-w-2xl rounded-2xl border border-slate-800 bg-[#111c2e] p-6">
      <h3 className="text-lg font-semibold text-white">
        Application Settings
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        Application preferences and configuration.
      </p>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <p className="text-sm text-white">
              Application version
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Development build
            </p>
          </div>

          <span className="text-xs text-cyan-400">
            v1.0.0
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">
              Backend integration
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Express API, Dialogflow and Firebase
            </p>
          </div>

          <span className="text-xs text-cyan-400">
            Configured
          </span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const {
    user,
    isAdmin,
    loading,
    logout,
  } = useAuth();

  const [active, setActive] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isGuest = user?.isAnonymous === true;

  // Redirect users away from administrator-only pages.
  useEffect(() => {
    if (
      !isAdmin &&
      ["Overview", "Incident Management"].includes(active)
    ) {
      setActive("Cyber Assistant");
    }

    if (isGuest && active !== "Cyber Assistant") {
      setActive("Cyber Assistant");
    }
  }, [isAdmin, isGuest, active]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080f1d]">
        <div className="text-center">
          <img
            src="/favicon.svg"
            alt=""
            className="mx-auto mb-4 h-14 w-14"
          />

          <p className="text-sm text-cyan-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Regular users must verify their email.
  // Anonymous guest sessions are permitted.
  if (
    !user ||
    (!isGuest && !user.emailVerified)
  ) {
    return <AuthPage />;
  }

  function renderPage() {
    switch (active) {
      case "Cyber Assistant":
        return (
          <ChatbotLive
            setActive={setActive}
            isGuest={isGuest}
          />
        );

      case "Report Incident":
        return isGuest
          ? (
              <ChatbotLive
                setActive={setActive}
                isGuest={true}
              />
            )
          : <ReportIncidentLive />;

      case "Incident Management":
        return isAdmin
          ? <IncidentManagementLive />
          : (
              <ChatbotLive
                setActive={setActive}
                isGuest={isGuest}
              />
            );

      case "Settings":
        return isGuest
          ? (
              <ChatbotLive
                setActive={setActive}
                isGuest={true}
              />
            )
          : <SettingsPage />;

      case "Overview":
      default:
        return isAdmin
          ? <OverviewLive setActive={setActive} />
          : (
              <ChatbotLive
                setActive={setActive}
                isGuest={isGuest}
              />
            );
    }
  }

  return (
    <div className="min-h-screen bg-[#080f1d]">
      <Sidebar
        active={active}
        setActive={setActive}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isAdmin={isAdmin}
        isGuest={isGuest}
        onLogout={logout}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          active={active}
          setOpen={setSidebarOpen}
          isGuest={isGuest}
        />

        <main className="mx-auto max-w-[1600px] p-5 md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              {isGuest
                ? "Exploring as a guest"
                : `Signed in as ${user.email}`}
            </p>

            <span
              className={`rounded-full px-3 py-1 text-xs ${
                isAdmin
                  ? "bg-violet-400/10 text-violet-300"
                  : isGuest
                    ? "bg-amber-400/10 text-amber-300"
                    : "bg-cyan-400/10 text-cyan-300"
              }`}
            >
              {isAdmin
                ? "Administrator"
                : isGuest
                  ? "Demo Guest"
                  : "Regular User"}
            </span>
          </div>

          {isGuest && (
            <div className="mb-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <p className="text-sm font-semibold text-cyan-300">
                Welcome to the interactive demo
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                You can explore the cybersecurity chatbot without
                creating an account. Incident reporting and
                administrator features require a verified account
                with the appropriate permissions.
              </p>
            </div>
          )}

          {renderPage()}

          <footer className="mt-10 border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
            Finland Cybersecurity Assistant · Interactive Project Preview
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
