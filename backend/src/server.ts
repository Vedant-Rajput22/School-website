import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { db, Notice, Event, Staff, GalleryItem, Article } from './db.js'
import { signToken, requireAuth } from './auth.js'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3000
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

app.use(cors({ origin: true, credentials: false }))

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

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

// Contact endpoint
app.post('/api/contact', express.json(), async (req, res) => {
  const { name, email, message } = req.body as { name?: string; email?: string; message?: string }
  if(!name || !email || !message) return res.status(400).json({ error: 'name, email, message required' })
  const to = process.env.CONTACT_TO || 'info@babystars.school'
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = Number(process.env.SMTP_PORT || '587')
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true'
  try{
    if(host && user && pass){
      const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
      await transporter.sendMail({ from: `Baby Stars <${user}>`, to, subject: `Contact: ${name}` , replyTo: email, text: message })
      return res.json({ ok: true, sent: true })
    }else{
      console.log('[CONTACT] (no SMTP) ', { name, email, message })
      return res.json({ ok: true, sent: false })
    }
  }catch(err){
    console.error('Contact error', err)
    res.status(500).json({ error: 'Failed to send' })
  }
})

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

// Update notice
app.put('/api/notices/:id', requireAuth, upload.single('file'), (req, res) => {
  const id = req.params.id
  const row = db.prepare('SELECT * FROM notices WHERE id = ?').get(id) as Notice | undefined
  if (!row) return res.status(404).json({ error: 'Not found' })
  const { title = row.title, description = row.description } = req.body as { title?: string; description?: string }
  let filePath = row.file_path
  if(req.file){ if(filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); filePath = req.file.path }
  db.prepare('UPDATE notices SET title=?, description=?, file_path=? WHERE id=?').run(title, description, filePath, id)
  res.json({ id:Number(id), title, description, created_at: row.created_at, file_url: filePath ? `/uploads/${path.basename(filePath)}` : null })
})

// Events CRUD
app.get('/api/events', (_req,res)=>{
  const rows = db.prepare('SELECT * FROM events ORDER BY datetime(start_date) ASC').all() as Event[]
  res.json(rows)
})
app.get('/api/events/:id', (req,res)=>{
  const row = db.prepare('SELECT * FROM events WHERE id=?').get(req.params.id) as Event | undefined
  if(!row) return res.status(404).json({ error:'Not found' })
  res.json(row)
})
app.post('/api/events', requireAuth, express.json(), (req,res)=>{
  const { title, description, start_date, end_date, category } = req.body as Partial<Event>
  if(!title || !start_date) return res.status(400).json({ error:'title and start_date required' })
  const info = db.prepare('INSERT INTO events (title, description, start_date, end_date, category) VALUES (?,?,?,?,?)')
    .run(title, description, start_date, end_date, category)
  res.status(201).json({ id:Number(info.lastInsertRowid), title, description, start_date, end_date, category })
})
app.put('/api/events/:id', requireAuth, express.json(), (req,res)=>{
  const id = req.params.id
  const row = db.prepare('SELECT * FROM events WHERE id=?').get(id) as Event | undefined
  if(!row) return res.status(404).json({ error:'Not found' })
  const { title=row.title, description=row.description, start_date=row.start_date, end_date=row.end_date, category=row.category } = req.body as Partial<Event>
  db.prepare('UPDATE events SET title=?, description=?, start_date=?, end_date=?, category=? WHERE id=?').run(title, description, start_date, end_date, category, id)
  res.json({ id:Number(id), title, description, start_date, end_date, category })
})
app.delete('/api/events/:id', requireAuth, (req,res)=>{
  db.prepare('DELETE FROM events WHERE id=?').run(req.params.id)
  res.json({ ok:true })
})

// Staff CRUD
app.get('/api/staff', (_req,res)=>{
  const rows = db.prepare('SELECT * FROM staff ORDER BY name ASC').all() as Staff[]
  res.json(rows.map(r=>({ ...r, image_url: r.image_path? `/uploads/${path.basename(r.image_path)}`: null })))
})
app.post('/api/staff', requireAuth, upload.single('image'), (req,res)=>{
  const { name, title, bio } = req.body as Partial<Staff>
  if(!name || !title) return res.status(400).json({ error:'name and title required' })
  const img = req.file ? req.file.path : null
  const info = db.prepare('INSERT INTO staff (name, title, bio, image_path) VALUES (?,?,?,?)').run(name, title, bio, img)
  res.status(201).json({ id:Number(info.lastInsertRowid), name, title, bio, image_url: img? `/uploads/${path.basename(img)}`: null })
})
app.put('/api/staff/:id', requireAuth, upload.single('image'), (req,res)=>{
  const id = req.params.id
  const row = db.prepare('SELECT * FROM staff WHERE id=?').get(id) as Staff | undefined
  if(!row) return res.status(404).json({ error:'Not found' })
  const { name=row.name, title=row.title, bio=row.bio } = req.body as Partial<Staff>
  let img = row.image_path
  if(req.file){ if(img && fs.existsSync(img)) fs.unlinkSync(img); img = req.file.path }
  db.prepare('UPDATE staff SET name=?, title=?, bio=?, image_path=? WHERE id=?').run(name, title, bio, img, id)
  res.json({ id:Number(id), name, title, bio, image_url: img? `/uploads/${path.basename(img)}`: null })
})
app.delete('/api/staff/:id', requireAuth, (req,res)=>{
  const row = db.prepare('SELECT * FROM staff WHERE id=?').get(req.params.id) as Staff | undefined
  if(row?.image_path && fs.existsSync(row.image_path)) fs.unlinkSync(row.image_path)
  db.prepare('DELETE FROM staff WHERE id=?').run(req.params.id)
  res.json({ ok:true })
})

// Gallery CRUD
app.get('/api/gallery', (_req,res)=>{
  const rows = db.prepare('SELECT * FROM gallery ORDER BY datetime(created_at) DESC').all() as GalleryItem[]
  res.json(rows.map(r=>({ ...r, file_url: `/uploads/${path.basename(r.file_path)}` })))
})
app.post('/api/gallery', requireAuth, upload.single('file'), (req,res)=>{
  const { title, description, type, album } = req.body as any
  if(!title || !req.file || !type) return res.status(400).json({ error:'title, type and file required' })
  const created_at = new Date().toISOString()
  const file_path = req.file.path
  const info = db.prepare('INSERT INTO gallery (title, description, file_path, type, album, created_at) VALUES (?,?,?,?,?,?)')
    .run(title, description, file_path, type, album, created_at)
  res.status(201).json({ id:Number(info.lastInsertRowid), title, description, type, album, created_at, file_url:`/uploads/${path.basename(file_path)}` })
})
app.delete('/api/gallery/:id', requireAuth, (req,res)=>{
  const row = db.prepare('SELECT * FROM gallery WHERE id=?').get(req.params.id) as GalleryItem | undefined
  if(row?.file_path && fs.existsSync(row.file_path)) fs.unlinkSync(row.file_path)
  db.prepare('DELETE FROM gallery WHERE id=?').run(req.params.id)
  res.json({ ok:true })
})

// Articles CRUD
app.get('/api/articles', (_req,res)=>{
  const rows = db.prepare('SELECT id,title,author,publish_date,hero_image_path FROM articles ORDER BY datetime(publish_date) DESC').all() as Article[]
  res.json(rows.map(r=>({ ...r, hero_image_url: r.hero_image_path? `/uploads/${path.basename(r.hero_image_path)}`: null })))
})
app.get('/api/articles/:id', (req,res)=>{
  const row = db.prepare('SELECT * FROM articles WHERE id=?').get(req.params.id) as Article | undefined
  if(!row) return res.status(404).json({ error:'Not found' })
  res.json({ ...row, hero_image_url: row.hero_image_path? `/uploads/${path.basename(row.hero_image_path)}`: null })
})
app.post('/api/articles', requireAuth, upload.single('hero'), (req,res)=>{
  const { title, content, author, publish_date } = req.body as any
  if(!title || !content) return res.status(400).json({ error:'title and content required' })
  const hero = req.file ? req.file.path : null
  const date = publish_date || new Date().toISOString()
  const info = db.prepare('INSERT INTO articles (title, content, author, publish_date, hero_image_path) VALUES (?,?,?,?,?)')
    .run(title, content, author, date, hero)
  res.status(201).json({ id:Number(info.lastInsertRowid), title, author, publish_date: date, hero_image_url: hero? `/uploads/${path.basename(hero)}`: null })
})
app.put('/api/articles/:id', requireAuth, upload.single('hero'), (req,res)=>{
  const id = req.params.id
  const row = db.prepare('SELECT * FROM articles WHERE id=?').get(id) as Article | undefined
  if(!row) return res.status(404).json({ error:'Not found' })
  const { title=row.title, content=row.content, author=row.author, publish_date=row.publish_date } = req.body as any
  let hero = row.hero_image_path
  if(req.file){ if(hero && fs.existsSync(hero)) fs.unlinkSync(hero); hero = req.file.path }
  db.prepare('UPDATE articles SET title=?, content=?, author=?, publish_date=?, hero_image_path=? WHERE id=?')
    .run(title, content, author, publish_date, hero, id)
  res.json({ id:Number(id), title, author, publish_date, hero_image_url: hero? `/uploads/${path.basename(hero)}`: null })
})
app.delete('/api/articles/:id', requireAuth, (req,res)=>{
  const row = db.prepare('SELECT * FROM articles WHERE id=?').get(req.params.id) as Article | undefined
  if(row?.hero_image_path && fs.existsSync(row.hero_image_path)) fs.unlinkSync(row.hero_image_path)
  db.prepare('DELETE FROM articles WHERE id=?').run(req.params.id)
  res.json({ ok:true })
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
