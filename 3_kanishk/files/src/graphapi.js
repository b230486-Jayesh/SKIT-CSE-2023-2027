export async function fetchDynamicRoute(from, to, blockedEdges = []) {
  const res = await fetch("http://localhost:5000/api/graph/plan-route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, blocked: blockedEdges })
  });
  return res.json();
}
