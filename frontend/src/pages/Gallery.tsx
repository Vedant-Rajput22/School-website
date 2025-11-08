import { useEffect, useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { listGallery, type GalleryItem } from '../api'

export default function Gallery(){
  const [items, setItems] = useState<GalleryItem[]>([])
  const [view, setView] = useState<GalleryItem | null>(null)
  useEffect(()=>{ listGallery().then(setItems) },[])
  return (
    <main>
      <PageHeader title="Gallery" image="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop" />
      <section className="section">
        <div className="container">
          <div className="feature-grid" style={{marginTop:0}}>
            {items.map(i => (
              <div key={i.id} className="feature-card" onClick={()=>setView(i)} style={{cursor:'pointer'}}>
                {i.type==='video' ? (
                  <video src={i.file_url} style={{width:'100%',height:260,objectFit:'cover'}} />
                ) : (
                  <img src={i.file_url} alt={i.title} />
                )}
                <div className="label">{i.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {view && (
        <div onClick={()=>setView(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',display:'grid',placeItems:'center',zIndex:100}}>
          <div style={{maxWidth:'90vw',maxHeight:'90vh'}}>
            {view.type==='video' ? (
              <video src={view.file_url} controls style={{maxWidth:'100%',maxHeight:'90vh'}} />
            ) : (
              <img src={view.file_url} style={{maxWidth:'100%',maxHeight:'90vh'}} />
            )}
          </div>
        </div>
      )}
    </main>
  )
}

