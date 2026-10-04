/* global DELCOM_BASEURL */
import { fetchWithAuth } from "../../../helpers/apiHelper";
const BASE_URL = DELCOM_BASEURL;

export async function getLostFoundsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const json = await fetchWithAuth(`${BASE_URL}/lost-founds${query ? `?${query}` : ""}`);
  return json.data;
}

export async function getLostFoundDetailApi(id) {
  const json = await fetchWithAuth(`${BASE_URL}/lost-founds/${id}`);
  return json.data;
}

export async function createLostFoundApi({ title, description, status }) {
  const json = await fetchWithAuth(`${BASE_URL}/lost-founds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, status }),
  });
  return json.data;
}

export async function updateLostFoundApi(id, { title, description, status, is_completed }) {
  const json = await fetchWithAuth(`${BASE_URL}/lost-founds/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, status, is_completed }),
  });
  return json.data;
}

export async function uploadCoverLostFoundApi(id, formData) {
  const json = await fetchWithAuth(`${BASE_URL}/lost-founds/${id}/cover`, {
    method: "POST",
    body: formData,
  });
  return json.data;
}

export async function deleteLostFoundApi(id) {
  const json = await fetchWithAuth(`${BASE_URL}/lost-founds/${id}`, {
    method: "DELETE",
  });
  return json.data;
}

export async function getDailyStatsApi() {
  const json = await fetchWithAuth(`${BASE_URL}/lost-founds/stats/daily`);
  return json.data;
}

export async function getMonthlyStatsApi() {
  const json = await fetchWithAuth(`${BASE_URL}/lost-founds/stats/monthly`);
  return json.data;
}