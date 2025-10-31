import PageHeader from '../shared/PageHeader'

export default function Admissions(){
  return (
    <main>
      <PageHeader title="Admissions" image="https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <h2>Join Our Community</h2>
          <p>We welcome applications year-round. Book a tour to explore our campus, meet our teachers and see learning in action. Our team will guide you through the process and answer any questions.</p>
          <ul>
            <li>Step 1 — Enquiry and tour</li>
            <li>Step 2 — Application and documents</li>
            <li>Step 3 — Assessment and placement</li>
            <li>Step 4 — Offer and enrolment</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

