import { useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { login } from '../api'
import { saveToken, isLoggedIn, logout } from '../auth'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Admin(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    setError(null)
    try{
      const token = await login(username, password)
      saveToken(token)
      navigate('/notice-board')
    }catch(err){
      setError(String(err))
    }finally{
      setLoading(false)
    }
  }

  const logged = isLoggedIn()
  return (
    <main>
      <PageHeader title="Admin" image="https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          {logged ? (
            <div>
              <p>You are logged in as admin.</p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <NavLink className="btn" to="/notice-board/new">Post a Notice</NavLink>
                <button className="btn" onClick={()=>{ logout(); navigate('/admin') }}>Logout</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} style={{display:'grid',gap:12,maxWidth:420}}>
              <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
              <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
              <button className="btn" disabled={loading}>{loading? 'Signing in…' : 'Sign in'}</button>
              {error && <div style={{color:'crimson'}}>{error}</div>}
              <p style={{color:'#6b7280'}}>Default credentials: admin / password123 (change in backend .env)</p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

