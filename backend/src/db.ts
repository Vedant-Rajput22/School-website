import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

const dbPath = path.join(dataDir, 'database.sqlite')
export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    file_path TEXT,
    created_at TEXT NOT NULL
  );
`)

export type Notice = {
  id: number
  title: string
  description: string
  file_path?: string | null
  created_at: string
}

// Additional domain models
export type Event = {
  id: number
  title: string
  description?: string
  start_date: string
  end_date?: string | null
  category?: string | null
}

export type Staff = {
  id: number
  name: string
  title: string
  bio?: string | null
  image_path?: string | null
}

export type GalleryItem = {
  id: number
  title: string
  description?: string | null
  file_path: string
  type: 'image' | 'video'
  album?: string | null
  created_at: string
}

export type Article = {
  id: number
  title: string
  content: string
  author?: string | null
  publish_date: string
  hero_image_path?: string | null
}

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    category TEXT
  );
  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT,
    image_path TEXT
  );
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    type TEXT NOT NULL,
    album TEXT,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    publish_date TEXT NOT NULL,
    hero_image_path TEXT
  );
`)
