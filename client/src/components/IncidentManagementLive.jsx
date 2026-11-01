import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";

import {
  getIncidents,
  updateIncidentStatus,
} from "../services/api";

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
}

function SeverityBadge({ value }) {
  const styles = {
    Critical: "bg-red-400/10 text-red-400",
    High: "bg-orange-400/10 text-orange-400",
    Medium: "bg-amber-400/10 text-amber-400",
    Low: "bg-emerald-400/10 text-emerald-400",
  };

  return (
    <span
      className={`rounded-md px-2 py-1 text-xs ${
        styles[value] || styles.Low
      }`}
    >
      {value}
    </span>
  );
}

function StatusBadge({ value }) {
  const styles = {
    Open: "bg-red-400/10 text-red-400",
    "Under Review": "bg-amber-400/10 text-amber-400",
    Resolved: "bg-emerald-400/10 text-emerald-400",
  };

  return (
    <span
      className={`rounded-md px-2 py-1 text-xs ${
        styles[value] || "bg-slate-700 text-slate-300"
      }`}
    >
      {value}
    </span>
  );
}

export default function IncidentManagementLive() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  async function loadIncidents(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const result = await getIncidents();
      setIncidents(result.incidents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadIncidents();

    // Load the list when the page is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredIncidents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return incidents.filter((item) => {
      const matchesStatus =
        filter === "All" || item.status === filter;

      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [incidents, filter, search]);

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    setError("");

    try {
      const result = await updateIncidentStatus(id, newStatus);

      setIncidents((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...item, status: result.status }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const statusOptions = [
    "All",
    "Open",
    "Under Review",
    "Resolved",
  ];

  const openCount = incidents.filter(
    (item) => item.status === "Open"
  ).length;

  const reviewCount = incidents.filter(
    (item) => item.status === "Under Review"
  ).length;

  const resolvedCount = incidents.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Incident Management
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Review and monitor reported cybersecurity incidents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadIncidents(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-[#111c2e] p-4">
          <p className="text-xs text-slate-400">Total Reports</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : incidents.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#111c2e] p-4">
          <p className="text-xs text-slate-400">Open</p>
          <p className="mt-2 text-2xl font-bold text-red-400">
            {loading ? "..." : openCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#111c2e] p-4">
          <p className="text-xs text-slate-400">Under Review</p>
          <p className="mt-2 text-2xl font-bold text-amber-400">
            {loading ? "..." : reviewCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#111c2e] p-4">
          <p className="text-xs text-slate-400">Resolved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {loading ? "..." : resolvedCount}
          </p>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {/* Main table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111c2e] p-5">

        {/* Search and filters */}
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reports..."
              className="w-full rounded-xl border border-slate-700 bg-[#0b1525] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-400/60"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-lg px-3 py-2 text-xs transition ${
                  filter === status
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Loading incident records from Firestore...
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList
              size={35}
              className="mx-auto mb-3 text-slate-600"
            />

            <p className="text-sm font-medium text-slate-300">
              No incidents found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-500">
                <tr>
                  <th className="pb-4 font-medium">REPORT ID</th>
                  <th className="pb-4 font-medium">INCIDENT</th>
                  <th className="pb-4 font-medium">SEVERITY</th>
                  <th className="pb-4 font-medium">DATE REPORTED</th>
                  <th className="pb-4 font-medium">STATUS</th>
                  <th className="pb-4 font-medium">UPDATE STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filteredIncidents.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800/70 align-top last:border-0"
                  >
                    <td className="py-5 pr-4 font-medium text-cyan-300">
                      <span className="block max-w-[150px] break-all">
                        {item.id}
                      </span>
                    </td>

                    <td className="max-w-[280px] py-5 pr-4">
                      <p className="font-medium text-slate-200">
                        {item.category}
                      </p>

                      <p className="mt-1 whitespace-pre-wrap break-words leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </td>

                    <td className="py-5 pr-4">
                      <SeverityBadge value={item.severity} />
                    </td>

                    <td className="py-5 pr-4 text-slate-400">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="py-5 pr-4">
                      <StatusBadge value={item.status} />
                    </td>

                    <td className="py-5">
                      <select
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(event) =>
                          handleStatusChange(item.id, event.target.value)
                        }
                        className="rounded-lg border border-slate-700 bg-[#0b1525] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/60 disabled:opacity-50"
                      >
                        <option value="Open">Open</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      {updatingId === item.id && (
                        <p className="mt-1 text-[10px] text-cyan-400">
                          Updating...
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-500">
          <span>
            Showing {filteredIncidents.length} of {incidents.length} loaded reports
          </span>

          <span className="flex items-center gap-1">
            <AlertTriangle size={13} />
            Maximum 100 recent reports loaded
          </span>
        </div>
      </div>
    </div>
  );
}