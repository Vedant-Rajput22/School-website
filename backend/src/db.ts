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

