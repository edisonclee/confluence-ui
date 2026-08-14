import api from "./axios";

export async function runScanner() {

    const response =
        await api.get("/api/scanner/run");

    return response.data;

}