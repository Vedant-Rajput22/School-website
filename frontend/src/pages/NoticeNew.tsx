import { useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { createNotice } from '../api'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../auth'

export default function NoticeNew(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try{
      const token = getToken()!
      await createNotice({ title, description, file }, token)
      navigate('/notice-board')
    }catch(err){
      setError(String(err))
    }finally{
      setSubmitting(false)
    }
  }

  return (
    <main>
      <PageHeader title="Post a Notice" image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <form onSubmit={submit} style={{display:'grid',gap:12,maxWidth:700}}>
            <input required placeholder="Title / Subject" value={title} onChange={e=>setTitle(e.target.value)} style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
            <textarea required placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} rows={6} style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
            <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
            <button className="btn" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post Notice'}
            </button>
            {error && <div style={{color:'crimson'}}>{error}</div>}
          </form>
        </div>
      </section>
    </main>
  )
}

