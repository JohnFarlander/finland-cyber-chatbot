import { useState } from 'react'
import ChatbotLive from './components/ChatbotLive'
import ReportIncidentLive from './components/ReportIncidentLive'
import OverviewLive from "./components/OverviewLive";
import IncidentManagementLive from "./components/IncidentManagementLive";

import { useEffect } from "react";
import { LogOut } from "lucide-react";

import AuthPage from "./components/AuthPage";
import { useAuth } from "./context/AuthContext";
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
  Activity,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'

const navigation = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Cyber Assistant', icon: MessageSquare },
  { name: 'Report Incident', icon: FileWarning },
  { name: 'Incident Management', icon: ClipboardList },
]

// Temporary sample records.
// Actual Firestore records will be connected in Phase 6.
const sampleIncidents = [
  {
    id: 'FIN-2026-001',
    type: 'Phishing',
    description: 'Suspicious banking email',
    severity: 'High',
    status: 'Under Review',
    date: '01 Nov 2026',
  },
  {
    id: 'FIN-2026-002',
    type: 'Account Compromise',
    description: 'Unauthorized login attempt',
    severity: 'Critical',
    status: 'Open',
    date: '31 Oct 2026',
  },
  {
    id: 'FIN-2026-003',
    type: 'Online Fraud',
    description: 'Suspicious payment request',
    severity: 'Medium',
    status: 'Resolved',
    date: '30 Oct 2026',
  },
]

function Sidebar({
  active,
  setActive,
  open,
  setOpen,
  isAdmin,
  onLogout,
}) 

  {
  function navigate(page) {
    setActive(page)
    setOpen(false)
  }

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
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-400">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h1 className="text-base font-bold text-white">FINLAND</h1>
              <p className="text-[10px] tracking-[0.2em] text-cyan-400">
                CYBER ASSISTANT
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

        <div className="px-4 pt-8">
          <p className="mb-4 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
            WORKSPACE
          </p>

          <nav className="space-y-1" aria-label="Main navigation">
           {navigation
  .filter(
    (item) =>
      isAdmin ||
      !["Overview", "Incident Management"].includes(item.name)
  )
  .map((item) => {
              const Icon = item.icon
              const selected = active === item.name

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.name)}
                  aria-current={selected ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    selected
                      ? 'border border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>

                  {selected && (
                    <ChevronRight className="ml-auto" size={16} />
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-cyan-400">
              <ShieldCheck size={18} />
              <span className="text-xs font-semibold">Stay Protected</span>
            </div>

            <p className="text-xs leading-5 text-slate-400">
              Stay informed. Stay alert. Stay secure.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('Settings')}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-800"
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            type="button"
                   onClick={onLogout}
                        className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-400 hover:bg-red-400/10"
>
                          <LogOut size={18} />
                               Sign Out
                               </button>

          <div className="mt-3 border-t border-slate-800 pt-4 text-center text-[10px] text-slate-600">
            TEAM FINLAND · 2026
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({ active, setOpen }) {
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
          <h2 className="text-lg font-semibold text-white">{active}</h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Finland Cybersecurity Assistance Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-emerald-400">System Online</span>
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
          TF
        </div>
      </div>
    </header>
  )
}

function StatCard({ title, value, change, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111c2e] p-5 transition hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{title}</span>

        <div className={`rounded-xl p-2.5 ${color}`}>
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <span className="text-3xl font-bold tracking-tight text-white">
          {value}
        </span>

        <span className="text-xs text-slate-500">{change}</span>
      </div>
    </div>
  )
}

function Overview({ setActive }) {
  return (
    <div className="space-y-7">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-[#102a43] to-[#102033] p-7 md:p-9">
        <div className="relative z-10 max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-300">
            <Sparkles size={14} />
            Your digital security companion
          </div>

          <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            Stay ahead of{' '}
            <span className="text-cyan-400">cyber threats.</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Get cybersecurity guidance, understand potential threats and report
            suspicious online activity through one platform.
          </p>

          <button
            type="button"
            onClick={() => setActive('Cyber Assistant')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Talk to Cyber Assistant <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-16 hidden h-80 w-80 items-center justify-center rounded-full border border-cyan-400/10 md:flex">
          <div className="flex h-60 w-60 items-center justify-center rounded-full border border-cyan-400/10">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-cyan-400/5 text-cyan-400">
              <ShieldCheck size={95} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">Security Overview</h3>
          <span className="text-xs text-slate-500">Sample dashboard data</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Incidents"
            value="128"
            change="All time"
            icon={ClipboardList}
            color="bg-cyan-400/10 text-cyan-400"
          />

          <StatCard
            title="Open Reports"
            value="24"
            change="Requires attention"
            icon={AlertTriangle}
            color="bg-amber-400/10 text-amber-400"
          />

          <StatCard
            title="Resolved Cases"
            value="96"
            change="All time"
            icon={CheckCircle2}
            color="bg-emerald-400/10 text-emerald-400"
          />

          <StatCard
            title="Threat Categories"
            value="08"
            change="Monitored"
            icon={Activity}
            color="bg-violet-400/10 text-violet-400"
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-[#111c2e] p-5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-white">Recent Incidents</h3>

            <button
              type="button"
              onClick={() => setActive('Incident Management')}
              className="text-xs text-cyan-400 hover:text-cyan-300"
            >
              View all <ArrowUpRight className="inline" size={13} />
            </button>
          </div>

          <IncidentTable compact />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111c2e] p-5">
          <h3 className="font-semibold text-white">Quick Actions</h3>

          <div className="mt-5 space-y-3">
            <QuickAction
              icon={MessageSquare}
              title="Ask Cyber Assistant"
              subtitle="Get security guidance"
              onClick={() => setActive('Cyber Assistant')}
            />

            <QuickAction
              icon={FileWarning}
              title="Report an Incident"
              subtitle="Submit a cyber threat"
              onClick={() => setActive('Report Incident')}
            />

            <QuickAction
              icon={ClipboardList}
              title="Track Incidents"
              subtitle="Review existing reports"
              onClick={() => setActive('Incident Management')}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function QuickAction({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-800 p-3 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/5"
    >
      <div className="rounded-lg bg-slate-800 p-2.5 text-cyan-400">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>

      <ChevronRight size={16} className="text-slate-500" />
    </button>
  )
}

function IncidentTable({ compact = false }) {
  const [filter, setFilter] = useState('All')

  const filtered = sampleIncidents.filter(
    (item) => filter === 'All' || item.status === filter,
  )

  return (
    <div>
      {!compact && (
        <div className="mb-5 flex flex-wrap gap-2">
          {['All', 'Open', 'Under Review', 'Resolved'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-2 text-xs ${
                filter === status
                  ? 'bg-cyan-400/10 text-cyan-300'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[590px] text-left text-xs">
          <thead className="border-b border-slate-800 text-slate-500">
            <tr>
              <th className="pb-3 font-medium">REPORT ID</th>
              <th className="pb-3 font-medium">INCIDENT</th>
              <th className="pb-3 font-medium">SEVERITY</th>
              <th className="pb-3 font-medium">STATUS</th>
              {!compact && <th className="pb-3 font-medium">DATE</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-800/70 last:border-0"
              >
                <td className="py-4 font-medium text-cyan-300">{item.id}</td>

                <td className="py-4">
                  <p className="font-medium text-slate-200">{item.type}</p>
                  <p className="mt-1 text-slate-500">{item.description}</p>
                </td>

                <td className="py-4">
                  <Severity value={item.severity} />
                </td>

                <td className="py-4">
                  <Status value={item.status} />
                </td>

                {!compact && (
                  <td className="py-4 text-slate-400">{item.date}</td>
                )}
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={compact ? 4 : 5}
                  className="py-8 text-center text-slate-500"
                >
                  No incidents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Severity({ value }) {
  const styles = {
    Critical: 'bg-red-400/10 text-red-400',
    High: 'bg-orange-400/10 text-orange-400',
    Medium: 'bg-amber-400/10 text-amber-400',
    Low: 'bg-emerald-400/10 text-emerald-400',
  }

  return (
    <span className={`rounded-md px-2 py-1 ${styles[value] || styles.Low}`}>
      {value}
    </span>
  )
}

function Status({ value }) {
  const styles = {
    Open: 'text-red-400',
    'Under Review': 'text-amber-400',
    Resolved: 'text-emerald-400',
  }

  return <span className={styles[value] || 'text-slate-400'}>{value}</span>
}

function IncidentManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Incident Management
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Review and monitor reported cybersecurity incidents.
          </p>
        </div>

        <span className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400">
          Sample records
        </span>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#111c2e] p-5">
        <IncidentTable />
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="max-w-2xl rounded-2xl border border-slate-800 bg-[#111c2e] p-6">
      <h3 className="text-lg font-semibold text-white">Application Settings</h3>

      <p className="mt-2 text-sm text-slate-400">
        Application preferences and configuration will be available here.
      </p>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <p className="text-sm text-white">Application version</p>
            <p className="mt-1 text-xs text-slate-500">Development build</p>
          </div>

          <span className="text-xs text-cyan-400">v1.0.0</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Backend integration</p>
            <p className="mt-1 text-xs text-slate-500">
              Express API, Dialogflow and Firebase Admin SDK
            </p>
          </div>

          <span className="text-xs text-cyan-400">
            Configured for development
          </span>
        </div>
      </div>
    </div>
  )
}

// function App() {
//   const [active, setActive] = useState('Overview')
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   function renderPage() {
//   switch (active) {
//     case "Cyber Assistant":
//       return <ChatbotLive setActive={setActive} />;

//     case "Report Incident":
//       return <ReportIncidentLive />;

//     case "Incident Management":
//       return <IncidentManagementLive />;

//     case "Settings":
//       return <SettingsPage />;

//     default:
//       return <OverviewLive setActive={setActive} />;
//   }
// }

//   return (
//     <div className="min-h-screen bg-[#080f1d]">
//       <Sidebar
//         active={active}
//         setActive={setActive}
//         open={sidebarOpen}
//         setOpen={setSidebarOpen}
//       />

//       <div className="min-h-screen lg:pl-64">
//         <Header active={active} setOpen={setSidebarOpen} />

//         <main className="mx-auto max-w-[1600px] p-5 md:p-8">
//           {renderPage()}

//           <footer className="mt-10 border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
//             Finland Cybersecurity Assistant · Team Finland · Educational Project
//           </footer>
//         </main>
//       </div>
//     </div>
//   )
// }

function App() {
  const { user, isAdmin, loading, logout } = useAuth();

  const [active, setActive] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect regular users away from administrator pages.
  useEffect(() => {
    if (
      !isAdmin &&
      ["Overview", "Incident Management"].includes(active)
    ) {
      setActive("Cyber Assistant");
    }
  }, [isAdmin, active]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080f1d]">
        <p className="text-sm text-cyan-400">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!user || !user.emailVerified) {
    return <AuthPage />;
  }

  function renderPage() {
    switch (active) {
      case "Cyber Assistant":
        return <ChatbotLive setActive={setActive} />;

      case "Report Incident":
        return <ReportIncidentLive />;

      case "Incident Management":
        return isAdmin
          ? <IncidentManagementLive />
          : <ChatbotLive setActive={setActive} />;

      case "Settings":
        return <SettingsPage />;

      case "Overview":
      default:
        return isAdmin
          ? <OverviewLive setActive={setActive} />
          : <ChatbotLive setActive={setActive} />;
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
        onLogout={logout}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          active={active}
          setOpen={setSidebarOpen}
        />

        <main className="mx-auto max-w-[1600px] p-5 md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              Signed in as {user.email}
            </p>

            <span
              className={`rounded-full px-3 py-1 text-xs ${
                isAdmin
                  ? "bg-violet-400/10 text-violet-300"
                  : "bg-cyan-400/10 text-cyan-300"
              }`}
            >
              {isAdmin ? "Administrator" : "Regular User"}
            </span>
          </div>

          {renderPage()}

          <footer className="mt-10 border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
            Finland Cybersecurity Assistant · Team Finland · Educational Project
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App