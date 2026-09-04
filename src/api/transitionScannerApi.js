import api from "./axios";

export async function runTransitionScanner() {
  const response = await api.get("/api/transition/scan");

  return response.data;
}
