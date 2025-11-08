import { useEffect, useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { getNotice, updateNotice } from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import { getToken } from '../auth'

export default function NoticeEdit(){
  const { id } = useParams()
  const noticeId = Number(id)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(()=>{
    getNotice(noticeId).then(n=>{ setTitle(n.title); setDescription(n.description) }).catch(e=>setError(String(e))).finally(()=>setLoading(false))
  },[noticeId])

  async function submit(e: React.FormEvent){
    e.preventDefault()
    const token = getToken()!
    await updateNotice(noticeId, { title, description, file }, token)
    navigate('/admin/notices')
  }

  return (
    <main>
      <PageHeader title="Edit Notice" image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          {loading ? <p>Loading…</p> : (
            <form onSubmit={submit} style={{display:'grid',gap:12,maxWidth:700}}>
              <input required placeholder="Title / Subject" value={title} onChange={e=>setTitle(e.target.value)} style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
              <textarea required placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} rows={6} style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
              <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
              <button className="btn">Save changes</button>
              {error && <div style={{color:'crimson'}}>{error}</div>}
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

