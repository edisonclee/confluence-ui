import api from "./axios";

export async function runScanner(bbTimeframes) {
  const response = await api.get("/api/scanner/run", {
    params: {
      bbTimeframes: bbTimeframes.join(","),
    },
  });

  return response.data;
}
