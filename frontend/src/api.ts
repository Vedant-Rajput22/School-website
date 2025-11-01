export type Notice = {
  id: number
  title: string
  description: string
  created_at: string
  file_url?: string | null
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'

export async function listNotices(): Promise<Notice[]>{
  const res = await fetch(`${API_BASE}/api/notices`)
  if(!res.ok) throw new Error('Failed to load notices')
  return res.json()
}

export async function createNotice(data: {title: string; description: string; file?: File | null}, token: string): Promise<Notice>{
  const form = new FormData()
  form.append('title', data.title)
  form.append('description', data.description)
  if(data.file) form.append('file', data.file)
  const res = await fetch(`${API_BASE}/api/notices`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: form })
  if(!res.ok) throw new Error('Failed to create notice')
  return res.json()
}

export async function login(username: string, password: string): Promise<string>{
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password })
  })
  if(!res.ok) throw new Error('Login failed')
  const data = await res.json() as { token: string }
  return data.token
}

export { API_BASE }

