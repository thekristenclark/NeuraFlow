const BASE_URL = "http://localhost:8080/api";

export async function createSession(session: any) {
  const response = await fetch(`${BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });

  return response.json();
}
