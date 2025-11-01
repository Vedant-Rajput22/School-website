import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export function signToken(payload: object){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' })
}

export function requireAuth(req: Request, res: Response, next: NextFunction){
  const hdr = req.headers['authorization'] || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : undefined
  if(!token) return res.status(401).json({ error: 'Unauthorized' })
  try{
    const decoded = jwt.verify(token, JWT_SECRET)
    ;(req as any).user = decoded
    next()
  }catch{
    return res.status(401).json({ error: 'Invalid token' })
  }
}

