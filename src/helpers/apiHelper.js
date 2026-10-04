export const ACCESS_TOKEN_KEY = "DELCOM_AUTH_TOKEN";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function putAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function fetchWithAuth(url, options = {}) {
  const token = getAccessToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const responseJson = await res.json();
  if (!res.ok) {
    throw new Error(responseJson.message || "Terjadi kesalahan saat memproses permintaan.");
  }

  return responseJson;
}