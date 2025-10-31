import PageHeader from '../shared/PageHeader'
import { useState } from 'react'

export default function Contact(){
  const [sent, setSent] = useState(false)
  function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setSent(true)
  }
  return (
    <main>
      <PageHeader title="Contact Us" image="https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <h2>We’d love to hear from you</h2>
          <div className="split">
            <div>
              <p>
                Reach out to book a tour, ask questions, or speak with our admissions team.
              </p>
              <p><strong>Email:</strong> info@babystars.school<br/>
              <strong>Phone:</strong> +971 55 000 0000</p>
              <p>Dubai, UAE</p>
            </div>
            <form onSubmit={handleSubmit} style={{display:'grid',gap:12}}>
              <input required placeholder="Your name" style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
              <input required type="email" placeholder="Email" style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
              <textarea required placeholder="Message" rows={5} style={{padding:'12px 14px',border:'1px solid #ddd',borderRadius:6}} />
              <button className="btn" style={{width:'fit-content'}}>Send message</button>
              {sent && <div>Thanks — we’ll be in touch soon.</div>}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

