import { useEffect, useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { listEvents, type EventItem } from '../api'

export default function Events(){
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ listEvents().then(setEvents).finally(()=>setLoading(false)) },[])
  return (
    <main>
      <PageHeader title="Events" image="https://images.unsplash.com/photo-1520975601573-8b456906c813?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <h2>Upcoming</h2>
          {loading && <p>Loading…</p>}
          <ul style={{listStyle:'none',padding:0,display:'grid',gap:12}}>
            {events.map(ev => (
              <li key={ev.id} style={{border:'1px solid #eee',borderRadius:8,padding:14}}>
                <strong>{ev.title}</strong>
                <div style={{color:'#6b7280',fontSize:12}}>
                  {new Date(ev.start_date).toLocaleDateString()} {ev.end_date ? '– ' + new Date(ev.end_date).toLocaleDateString(): ''}
                  {ev.category ? ` · ${ev.category}` : ''}
                </div>
                {ev.description && <p style={{marginTop:8}}>{ev.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

