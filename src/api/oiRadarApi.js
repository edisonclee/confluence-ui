import api from "./axios";

export async function getOiRadar() {
  const response = await api.get("/api/oi-radar");
  return response.data;
}