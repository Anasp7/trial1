const API_BASE_URL = 'http://localhost:5000/api';

function getToken() {
  try {
    return localStorage.getItem('jwt_token');
  } catch {
    return null;
  }
}

function headersJSON() {
  const h = { 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headersJSON(), ...(options.headers || {}) },
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const msg = data?.error || data?.msg || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const profileApi = {
  async getProfile(type, id) {
    const qs = new URLSearchParams({ type, id: String(id) }).toString();
    return request(`/profile?${qs}`);
  },
  async updateProfile(type, id, payload) {
    const qs = new URLSearchParams({ type, id: String(id) }).toString();
    return request(`/profile?${qs}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
};

export default profileApi;


