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

// Extra APIs
export async function deleteNotice(id: number, token: string): Promise<void>{
  const res = await fetch(`${API_BASE}/api/notices/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
  if(!res.ok) throw new Error('Failed to delete')
}

export async function getNotice(id: number) : Promise<Notice>{
  const res = await fetch(`${API_BASE}/api/notices/${id}`)
  if(!res.ok) throw new Error('Not found')
  return res.json()
}

export async function updateNotice(id: number, data: { title?: string; description?: string; file?: File | null }, token: string): Promise<Notice>{
  const form = new FormData()
  if(data.title !== undefined) form.append('title', data.title)
  if(data.description !== undefined) form.append('description', data.description)
  if(data.file) form.append('file', data.file)
  const res = await fetch(`${API_BASE}/api/notices/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: form })
  if(!res.ok) throw new Error('Failed to update notice')
  return res.json()
}

// Contact
export async function sendContact(payload: { name: string; email: string; message: string }): Promise<{ ok: boolean; sent?: boolean }>{
  const res = await fetch(`${API_BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if(!res.ok) throw new Error('Failed to send message')
  return res.json()
}

// Events
export type EventItem = { id: number; title: string; description?: string; start_date: string; end_date?: string | null; category?: string | null }
export async function listEvents(): Promise<EventItem[]>{
  const res = await fetch(`${API_BASE}/api/events`)
  if(!res.ok) throw new Error('Failed to load events')
  return res.json()
}

// Staff
export type Staff = { id:number; name:string; title:string; bio?:string|null; image_url?:string|null }
export async function listStaff(): Promise<Staff[]>{
  const res = await fetch(`${API_BASE}/api/staff`)
  if(!res.ok) throw new Error('Failed to load staff')
  return res.json()
}

// Gallery
export type GalleryItem = { id:number; title:string; description?:string|null; file_url:string; type:'image'|'video'; album?:string|null; created_at:string }
export async function listGallery(): Promise<GalleryItem[]>{
  const res = await fetch(`${API_BASE}/api/gallery`)
  if(!res.ok) throw new Error('Failed to load gallery')
  return res.json()
}

// Articles
export type ArticleSummary = { id:number; title:string; author?:string|null; publish_date:string; hero_image_url?:string|null }
export type Article = ArticleSummary & { content: string }
export async function listArticles(): Promise<ArticleSummary[]>{
  const res = await fetch(`${API_BASE}/api/articles`)
  if(!res.ok) throw new Error('Failed to load articles')
  return res.json()
}
export async function getArticle(id:number): Promise<Article>{
  const res = await fetch(`${API_BASE}/api/articles/${id}`)
  if(!res.ok) throw new Error('Article not found')
  return res.json()
}
