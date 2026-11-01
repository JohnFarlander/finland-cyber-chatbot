import { auth } from "./firebase";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

async function apiRequest(endpoint, options = {}) {
  const currentUser = auth.currentUser;

  // Get the signed-in user's Firebase ID token.
  const token = currentUser
    ? await currentUser.getIdToken()
    : null;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export function sendChatMessage(message, sessionId) {
  return apiRequest("/chat", {
    method: "POST",
    body: JSON.stringify({ message, sessionId }),
  });
}

export function submitIncident(incident) {
  return apiRequest("/incidents", {
    method: "POST",
    body: JSON.stringify(incident),
  });
}

export function getIncidents() {
  return apiRequest("/incidents");
}

export function updateIncidentStatus(incidentId, status) {
  return apiRequest(
    `/incidents/${encodeURIComponent(incidentId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}