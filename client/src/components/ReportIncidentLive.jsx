
import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { submitIncident } from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  category: "Phishing",
  severity: "Medium",
  description: "",
};

const fieldClass =
  "w-full rounded-xl border border-slate-700 bg-[#0b1525] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/60";

const labelClass =
  "mb-2 block text-sm font-medium text-slate-300";

export default function ReportIncidentLive() {
  const { user } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const result = await submitIncident(form);

      setSuccess(result);
      setForm({ ...initialForm });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-[#111c2e] p-6">

      {/* Heading */}
      <h2 className="mb-2 text-xl font-semibold text-white">
        Report a Cybersecurity Incident
      </h2>

      <p className="mb-6 text-sm text-slate-400">
        Submit details of a suspected cybersecurity incident.
      </p>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 size={18} />
            {success.message}
          </p>

          <p className="mt-2 break-all">
            Incident ID: {success.incidentId}
          </p>
        </div>
      )}

      {/* Incident form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}
        <div>
          <label htmlFor="incident-name" className={labelClass}>
            Full Name
          </label>

          <input
            id="incident-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Enter your name"
            className={fieldClass}
          />
        </div>

        {/* Verified account email */}
        <div>
          <label htmlFor="incident-email" className={labelClass}>
            Registered Email Address
          </label>

          <input
            id="incident-email"
            type="email"
            value={user?.email || ""}
            readOnly
            className={`${fieldClass} cursor-not-allowed opacity-70`}
          />

          <p className="mt-2 text-xs text-slate-500">
            Your verified account email will be associated with this report.
          </p>
        </div>

        {/* Category and severity */}
        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <label
              htmlFor="incident-category"
              className={labelClass}
            >
              Incident Category
            </label>

            <select
              id="incident-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={fieldClass}
            >
              <option>Phishing</option>
              <option>Online Fraud</option>
              <option>Account Compromise</option>
              <option>Malware</option>
              <option>Data Breach</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="incident-severity"
              className={labelClass}
            >
              Severity
            </label>

            <select
              id="incident-severity"
              name="severity"
              value={form.severity}
              onChange={handleChange}
              className={fieldClass}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="incident-description"
            className={labelClass}
          >
            Incident Description
          </label>

          <textarea
            id="incident-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder="Describe what happened, when it happened and any suspicious activity..."
            className={`${fieldClass} resize-y`}
          />

          <p className="mt-2 text-xs text-slate-500">
            Provide relevant details without including passwords,
            OTPs or private authentication credentials.
          </p>
        </div>

        {/* Security disclaimer */}
        <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-4 text-xs leading-5 text-amber-200/80">
          <AlertTriangle className="mr-2 inline" size={15} />

          This application stores reports in its project database.
          It does not automatically submit reports to Finnish authorities.
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !user}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting Report..."
            : "Submit Incident Report"}
        </button>

      </form>
    </div>
  );
}
