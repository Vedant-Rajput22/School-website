import PageHeader from '../shared/PageHeader'

export default function About(){
  return (
    <main>
      <PageHeader title="About Us" image="https://images.unsplash.com/photo-1520975601573-8b456906c813?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <h2>Our Approach</h2>
          <p>
            We craft a values-driven, inquiry-led education grounded in the British curriculum. Learning connects across disciplines and into the community through purposeful projects in science, design, arts and ecology. Our educators model curiosity, compassion and professionalism.
          </p>
        </div>
      </section>
    </main>
  )
}

