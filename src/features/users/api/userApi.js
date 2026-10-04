/* global DELCOM_BASEURL */
import { fetchWithAuth } from "../../../helpers/apiHelper";
const BASE_URL = DELCOM_BASEURL;

export async function getProfileApi() {
  const json = await fetchWithAuth(`${BASE_URL}/users/me`);
  return json.data;
}

export async function getUsersApi() {
  const json = await fetchWithAuth(`${BASE_URL}/users`);
  return json.data;
}

export async function updateProfileApi({ name, bio }) {
  const json = await fetchWithAuth(`${BASE_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, bio }),
  });
  return json.data;
}

export async function updateAvatarApi(formData) {
  const json = await fetchWithAuth(`${BASE_URL}/users/me/photo`, {
    method: "POST",
    body: formData,
  });
  return json.data;
}

export async function updatePasswordApi({ current_password, new_password }) {
  const json = await fetchWithAuth(`${BASE_URL}/users/me/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current_password, new_password }),
  });
  return json.data;
}