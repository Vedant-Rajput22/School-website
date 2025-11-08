import { useEffect, useState } from 'react'
import PageHeader from '../shared/PageHeader'
import { getArticle, type Article } from '../api'
import { useParams } from 'react-router-dom'

export default function ArticleView(){
  const { id } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  useEffect(()=>{ if(id) getArticle(Number(id)).then(setArticle) },[id])
  if(!article) return <main><PageHeader title="Loading…" image="https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1600&auto=format&fit=crop" /></main>
  return (
    <main>
      <PageHeader title={article.title} image={article.hero_image_url || 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1600&auto=format&fit=crop'} />
      <section className="section">
        <div className="container">
          <div style={{color:'#6b7280',fontSize:12,marginBottom:12}}>
            {new Date(article.publish_date).toLocaleDateString()} {article.author? `· ${article.author}`:''}
          </div>
          <article>
            <p style={{whiteSpace:'pre-wrap'}}>{article.content}</p>
          </article>
        </div>
      </section>
    </main>
  )
}

