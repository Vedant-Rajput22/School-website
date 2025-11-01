import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { db, Notice } from './db.js'
import { signToken, requireAuth } from './auth.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3000
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    cb(null, safe)
  }
})
const upload = multer({ storage })

// List
app.get('/api/notices', (req, res) => {
  const rows = db.prepare('SELECT * FROM notices ORDER BY datetime(created_at) DESC').all() as Notice[]
  const base = `${req.protocol}://${req.get('host')}`
  res.json(rows.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    created_at: r.created_at,
    file_url: r.file_path ? base + '/uploads/' + path.basename(r.file_path) : null
  })))
})

// Single
app.get('/api/notices/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM notices WHERE id = ?').get(req.params.id) as Notice | undefined
  if (!row) return res.status(404).json({ error: 'Not found' })
  const base = `${req.protocol}://${req.get('host')}`
  res.json({
    ...row,
    file_url: row.file_path ? base + '/uploads/' + path.basename(row.file_path) : null
  })
})

// Create (admin only)
app.post('/api/notices', requireAuth, upload.single('file'), (req, res) => {
  const { title, description } = req.body as { title?: string; description?: string }
  if (!title || !description) return res.status(400).json({ error: 'title and description are required' })
  const filePath = req.file ? req.file.path : null
  const created_at = new Date().toISOString()
  const info = db.prepare('INSERT INTO notices (title, description, file_path, created_at) VALUES (?, ?, ?, ?)')
    .run(title, description, filePath, created_at)
  const id = Number(info.lastInsertRowid)
  res.status(201).json({ id, title, description, created_at, file_url: filePath ? `/uploads/${path.basename(filePath)}` : null })
})

// Delete (optional)
app.delete('/api/notices/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM notices WHERE id = ?').get(req.params.id) as Notice | undefined
  if (!row) return res.status(404).json({ error: 'Not found' })
  db.prepare('DELETE FROM notices WHERE id = ?').run(req.params.id)
  if (row.file_path && fs.existsSync(row.file_path)) fs.unlinkSync(row.file_path)
  res.json({ ok: true })
})

app.get('/', (_req, res) => res.send('Baby Stars backend running'))

// Simple admin login
app.post('/api/auth/login', express.json(), (req, res) => {
  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'password123'
  const { username, password } = req.body as { username?: string; password?: string }
  if(username === ADMIN_USER && password === ADMIN_PASS){
    const token = signToken({ role: 'admin', username })
    return res.json({ token })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
})


app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`))
