import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "./config";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token"); 

  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": NOROFF_API_KEY,
    ...(token && { Authorization: `Bearer ${token}` }), 
    ...options.headers, 
  };

  const response = await fetch(`${NOROFF_API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API ERROR:", response.status, data);
    throw new Error(data.errors?.[0]?.message || data.message || "API Error");
  }

  return data;
}
