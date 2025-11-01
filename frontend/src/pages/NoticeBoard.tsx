import { useEffect, useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { listNotices, type Notice, API_BASE } from '../api'
import { NavLink } from 'react-router-dom'
import { isLoggedIn } from '../auth'

export default function NoticeBoard(){
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listNotices().then(setNotices).catch(e => setError(String(e))).finally(()=>setLoading(false))
  }, [])

  return (
    <main>
      <PageHeader title="Notice Board" image="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{margin:0}}>Latest Notices</h2>
            {isLoggedIn() ? (
              <NavLink to="/notice-board/new" className="btn">Post a Notice</NavLink>
            ) : (
              <NavLink to="/admin" className="btn">Admin Login</NavLink>
            )}
          </div>
          {loading && <p>Loading…</p>}
          {error && <p style={{color:'crimson'}}>{error}</p>}
          <ul style={{listStyle:'none',padding:0,marginTop:20,display:'grid',gap:16}}>
            {notices.map(n => (
              <li key={n.id} style={{border:'1px solid #eee',borderRadius:8,padding:16}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                  <div>
                    <h3 style={{margin:'0 0 6px 0'}}>{n.title}</h3>
                    <div style={{color:'#6b7280',fontSize:14}}>{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  {n.file_url && <a className="btn" style={{padding:'6px 10px'}} href={n.file_url.startsWith('http')? n.file_url : `${API_BASE}${n.file_url}`} target="_blank" rel="noreferrer">Download</a>}
                </div>
                <p style={{marginTop:10}}>{n.description}</p>
              </li>
            ))}
          </ul>
          {!loading && notices.length === 0 && <p>No notices yet.</p>}
        </div>
      </section>
    </main>
  )
}

