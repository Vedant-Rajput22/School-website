import PageHeader from '../shared/PageHeader'

const faqs = [
  {q:'What curriculum do you follow?', a:'We follow the National Curriculum for England, enriched with interdisciplinary projects and sustainability themes.'},
  {q:'How do I apply?', a:'Book a tour, submit your application online, and our admissions team will guide you through assessment and enrolment.'},
  {q:'Do you offer transport?', a:'We work with trusted partners to provide safe, reliable bus routes depending on demand.'},
]

export default function FAQ(){
  return (
    <main>
      <PageHeader title="Frequently Asked Questions" image="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <h2>Good to know</h2>
          {faqs.map((f, i) => (
            <details key={i} style={{marginBottom:12}}>
              <summary style={{cursor:'pointer',fontWeight:700}}>{f.q}</summary>
              <p style={{margin:'8px 0 0 0'}}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}

