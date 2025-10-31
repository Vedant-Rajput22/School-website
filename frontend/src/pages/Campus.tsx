import PageHeader from '../shared/PageHeader'

export default function Campus(){
  return (
    <main>
      <PageHeader title="The Campus" image="https://images.unsplash.com/photo-1537202407580-7a9a3d7df2a2?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <h2>Spaces that Inspire</h2>
          <p>Specialist studios, maker spaces, laboratories, libraries and biodiverse gardens invite hands-on exploration. Children learn with materials and ideas, moving fluidly between indoors and outdoors.</p>
        </div>
      </section>
    </main>
  )
}

