import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "./config";

//reg
export const registerUser = async (formData) => {
  const response = await fetch(`${NOROFF_API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
    body: JSON.stringify(formData),
  });

  return await response.json();
};

//login
export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${NOROFF_API_BASE_URL}/auth/login?_holidaze=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  return await response.json();
};
