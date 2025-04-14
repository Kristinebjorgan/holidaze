// src/api.js
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "./config";

export async function apiFetch(endpoint, options = {}) {
  // Attempt to retrieve the token from localStorage.
  let token;
  try {
    token = localStorage.getItem("holidazeToken");
  } catch (error) {
    console.error("localStorage access error:", error);
    token = "";
  }

  // Build headers. Only include the Authorization header if a token is available.
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": NOROFF_API_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${NOROFF_API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || data.message || "API Error");
  }
  return data;
}
