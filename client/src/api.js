const API_URL = process.env.REACT_APP_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export function fetchTables() {
  return request("/tables");
}

export function fetchTableData(name, { limit = 100, offset = 0 } = {}) {
  return request(`/tables/${encodeURIComponent(name)}?limit=${limit}&offset=${offset}`);
}

export function executeQuery(sql, params = []) {
  return request("/query", {
    method: "POST",
    body: JSON.stringify({ sql, params }),
  });
}
