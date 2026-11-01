import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  FileWarning,
  ChevronRight,
} from "lucide-react";

import { getIncidents } from "../services/api";

function StatCard({ title, value, description, icon: Icon, color }) {
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

        <span className="text-xs text-slate-500">{description}</span>
      </div>
    </div>
  );
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
  );
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString();
}

function StatusLabel({ status }) {
  const styles = {
    Open: "text-red-400",
    "Under Review": "text-amber-400",
    Resolved: "text-emerald-400",
  };

  return (
    <span className={styles[status] || "text-slate-400"}>
      {status}
    </span>
  );
}

export default function OverviewLive({ setActive }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const result = await getIncidents();

        if (!cancelled) {
          setIncidents(result.incidents || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const total = incidents.length;

  const openReports = incidents.filter(
    (item) => item.status !== "Resolved"
  ).length;

  const resolvedReports = incidents.filter(
    (item) => item.status === "Resolved"
  ).length;

  const categories = new Set(
    incidents.map((item) => item.category)
  ).size;

  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="space-y-7">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-[#102a43] to-[#102033] p-7 md:p-9">
        <div className="relative z-10 max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-300">
            <Sparkles size={14} />
            Your digital security companion
          </div>

          <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            Stay ahead of{" "}
            <span className="text-cyan-400">cyber threats.</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Get cybersecurity guidance, understand potential threats
            and report suspicious online activity through one platform.
          </p>

          <button
            type="button"
            onClick={() => setActive("Cyber Assistant")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Talk to Cyber Assistant
            <ArrowUpRight size={17} />
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

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">Security Overview</h3>

          <span className="text-xs text-slate-500">
            Live Firestore data
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            Unable to load dashboard data: {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Incidents"
            value={loading ? "..." : total}
            description="Stored reports"
            icon={ClipboardList}
            color="bg-cyan-400/10 text-cyan-400"
          />

          <StatCard
            title="Open Reports"
            value={loading ? "..." : openReports}
            description="Requires attention"
            icon={AlertTriangle}
            color="bg-amber-400/10 text-amber-400"
          />

          <StatCard
            title="Resolved Cases"
            value={loading ? "..." : resolvedReports}
            description="Completed reports"
            icon={CheckCircle2}
            color="bg-emerald-400/10 text-emerald-400"
          />

          <StatCard
            title="Threat Categories"
            value={loading ? "..." : categories}
            description="Reported categories"
            icon={Activity}
            color="bg-violet-400/10 text-violet-400"
          />
        </div>
      </section>

      {/* Recent incidents and actions */}
      <section className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-[#111c2e] p-5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              Recent Incidents
            </h3>

            <button
              type="button"
              onClick={() => setActive("Incident Management")}
              className="text-xs text-cyan-400 hover:text-cyan-300"
            >
              View all <ArrowUpRight className="inline" size={13} />
            </button>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading incidents...
            </p>
          ) : recentIncidents.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No incidents have been reported yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentIncidents.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200">
                      {item.category}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      ID: {item.id}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">
                      {item.severity}
                    </span>

                    <StatusLabel status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111c2e] p-5">
          <h3 className="font-semibold text-white">Quick Actions</h3>

          <div className="mt-5 space-y-3">
            <QuickAction
              icon={MessageSquare}
              title="Ask Cyber Assistant"
              subtitle="Get security guidance"
              onClick={() => setActive("Cyber Assistant")}
            />

            <QuickAction
              icon={FileWarning}
              title="Report an Incident"
              subtitle="Submit a cyber threat"
              onClick={() => setActive("Report Incident")}
            />

            <QuickAction
              icon={ClipboardList}
              title="Manage Incidents"
              subtitle="Review submitted reports"
              onClick={() => setActive("Incident Management")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}