import { useEffect, useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { listStaff, type Staff } from '../api'

export default function Team(){
  const [staff, setStaff] = useState<Staff[]>([])
  useEffect(()=>{ listStaff().then(setStaff) },[])
  return (
    <main>
      <PageHeader title="Our Team" image="https://images.unsplash.com/photo-1520975922284-7b9a1b5b2dae?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <div className="feature-grid" style={{marginTop:0}}>
            {staff.map(s => (
              <div key={s.id} className="feature-card" style={{boxShadow:'none'}}>
                <img src={s.image_url || 'https://dummyimage.com/600x400/e5e5e5/555&text=Staff'} alt={s.name} />
                <div className="label" style={{background:'rgba(0,0,0,.7)'}}>
                  <div style={{color:'#fff'}}>{s.name}</div>
                  <div style={{color:'#ffc573',fontWeight:700}}>{s.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

