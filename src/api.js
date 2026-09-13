const TOKEN_KEY = 'ad_token'
const BASE = import.meta.env.VITE_API_URL || ''

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token || getToken()) headers['Authorization'] = 'Bearer ' + (token || getToken())
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if (res.status === 401) { clearToken(); window.location.reload() }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Erro na requisição')
  return data
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/api/auth/me'),
  public_: () => request('/api/public'),
  createLead: (lead) => request('/api/leads', { method: 'POST', body: lead }),
  getDevelopments: () => request('/api/admin/developments'),
  createDevelopment: (d) => request('/api/admin/developments', { method: 'POST', body: d }),
  updateDevelopment: (id, d) => request(`/api/admin/developments/${id}`, { method: 'PUT', body: d }),
  deleteDevelopment: (id) => request(`/api/admin/developments/${id}`, { method: 'DELETE' }),
  getLeads: () => request('/api/admin/leads'),
  setLeadStatus: (id, status) => request(`/api/admin/leads/${id}/status`, { method: 'PATCH', body: { status } }),
  getPosts: () => request('/api/posts'),
  createPosts: (d) => request('/api/posts', { method: 'POST', body: d }),
  updatePost: (id, d) => request(`/api/posts/${id}`, { method: 'PATCH', body: d }),
  deletePost: (id) => request(`/api/posts/${id}`, { method: 'DELETE' }),
  updateProfile: (p) => request('/api/profile', { method: 'PATCH', body: p }),
  upload: async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(BASE + '/api/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + getToken() }, body: fd })
    if (res.status === 401) { clearToken(); window.location.reload() }
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Falha no upload')
    return data
  }
}