import { useEffect, useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { listArticles, type ArticleSummary } from '../api'
import { NavLink } from 'react-router-dom'

export default function News(){
  const [items, setItems] = useState<ArticleSummary[]>([])
  useEffect(()=>{ listArticles().then(setItems) }, [])
  return (
    <main>
      <PageHeader title="News" image="https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <ul style={{listStyle:'none',padding:0,display:'grid',gap:16}}>
            {items.map(a => (
              <li key={a.id} style={{border:'1px solid #eee',borderRadius:8,overflow:'hidden',display:'grid',gridTemplateColumns:'160px 1fr'}}>
                <div style={{background:'#f3f4f6'}}>
                  {a.hero_image_url && <img src={a.hero_image_url} alt="cover" style={{width:'100%',height:'100%',objectFit:'cover'}} />}
                </div>
                <div style={{padding:14}}>
                  <h3 style={{marginTop:0}}><NavLink to={`/news/${a.id}`}>{a.title}</NavLink></h3>
                  <div style={{color:'#6b7280',fontSize:12}}>{new Date(a.publish_date).toLocaleDateString()} {a.author? `· ${a.author}`:''}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

