import { useEffect, useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { listNotices, type Notice, deleteNotice } from '../api'
import { NavLink } from 'react-router-dom'
import { getToken } from '../auth'

export default function AdminNotices(){
  const [notices, setNotices] = useState<Notice[]>([])
  const [error, setError] = useState<string | null>(null)
  async function refresh(){
    try{ setNotices(await listNotices()) }catch(e:any){ setError(String(e)) }
  }
  useEffect(()=>{ refresh() },[])
  async function onDelete(id:number){
    if(!confirm('Delete this notice?')) return
    const token = getToken()!
    await deleteNotice(id, token)
    refresh()
  }
  return (
    <main>
      <PageHeader title="Manage Notices" image="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{margin:0}}>All Notices</h2>
            <NavLink to="/notice-board/new" className="btn">New Notice</NavLink>
          </div>
          {error && <div style={{color:'crimson'}}>{error}</div>}
          <ul style={{listStyle:'none',padding:0,display:'grid',gap:12,marginTop:16}}>
            {notices.map(n => (
              <li key={n.id} style={{border:'1px solid #eee',borderRadius:8,padding:12,display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                <div>
                  <strong>{n.title}</strong>
                  <div style={{color:'#6b7280',fontSize:12}}>{new Date(n.created_at).toLocaleString()}</div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <NavLink className="btn" to={`/notice-board/edit/${n.id}`}>Edit</NavLink>
                  <button className="btn" onClick={()=>onDelete(n.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

