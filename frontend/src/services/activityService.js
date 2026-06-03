import { authFetch } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function getActivities() {
  const response = await authFetch(`${API_BASE_URL}/activities/`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Aktiviteler getirilemedi");
  }
  return response.json();
}

export async function getCustomerActivities(customerId) {
  const response = await authFetch(`${API_BASE_URL}/activities/customer/${customerId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Müşteri aktiviteleri getirilemedi");
  }
  return response.json();
}

export async function createActivity(payload) {
  const response = await authFetch(`${API_BASE_URL}/activities/`, {
    method: "POST",
    body: JSON.stringify({
      customer_id: payload.customerId,
      type: payload.type,
      note: payload.note,
      activity_date: payload.activityDate,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Aktivite kaydedilemedi");
  }

  return response.json();
}

export async function deleteActivity(activityId) {
  const response = await authFetch(`${API_BASE_URL}/activities/${activityId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Aktivite silinemedi");
  }
  return response.json();
}
