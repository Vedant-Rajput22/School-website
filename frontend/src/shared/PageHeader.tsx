export default function PageHeader({title, image}:{title:string,image:string}){
  return (
    <section className="hero" style={{marginTop:-30}}>
      <div className="hero-slide" style={{backgroundImage:`url(${image})`, height:'42vh', minHeight:280}}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1 style={{marginBottom:0}}>{title}</h1>
        </div>
      </div>
    </section>
  )
}

