import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { listNotices, type Notice } from '../api'

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop',
    title: 'Where will curiosity take me today?',
    text: 'A learning journey that connects minds with the natural world.'
  },
  {
    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop',
    title: 'Learning that lives outdoors and in',
    text: 'Studios, labs and gardens become places to discover and grow.'
  },
  {
    img: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop',
    title: 'An eco-conscious British curriculum',
    text: 'Academic excellence with character, creativity and care.'
  }
]

function FeatureCard({title, img, to}:{title:string,img:string,to:string}){
  return (
    <NavLink to={to} className="feature-card">
      <img src={img} alt={title} />
      <div className="label">{title}</div>
    </NavLink>
  )
}

function NoticeCarousel(){
  const [items,setItems] = useState<Notice[]>([])
  useEffect(()=>{ listNotices().then(ns=>setItems(ns.slice(0,8))).catch(()=>{}) },[])
  if(items.length===0) return null
  return (
    <section className="section" style={{paddingTop:'2.5rem'}}>
      <div className="container">
        <h2>Notice Board</h2>
        <Swiper modules={[Autoplay, Pagination]} autoplay={{delay:4000}} pagination={{clickable:true}} loop slidesPerView={1} breakpoints={{640:{slidesPerView:2}, 1024:{slidesPerView:3}}}>
          {items.map(n => (
            <SwiperSlide key={n.id}>
              <div style={{border:'1px solid #eee',borderRadius:8,padding:16,background:'#fff',height:'100%'}}>
                <h3 style={{marginTop:0}}>{n.title}</h3>
                <p style={{marginBottom:0}}>{n.description.length>140? n.description.slice(0,140)+'…': n.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div style={{textAlign:'center',marginTop:16}}>
          <NavLink to="/notice-board" className="btn">View all notices</NavLink>
        </div>
      </div>
    </section>
  )
}

export default function Home(){
  return (
    <main>
      <section className="hero">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000 }}
          navigation
          pagination={{ clickable: true }}
          loop
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <div className="hero-slide" style={{backgroundImage:`url(${s.img})`}}>
                <div className="hero-overlay" />
                <div className="container hero-content">
                  <h1>{s.title}</h1>
                  <p>{s.text}</p>
                  <NavLink to="/admissions" className="btn">Book a Tour</NavLink>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="container">
        <div className="feature-grid">
          <FeatureCard title="Tours" to="/admissions" img="https://images.unsplash.com/photo-1514512364185-4c2b3e52f8db?q=80&w=1200&auto=format&fit=crop" />
          <FeatureCard title="Learning" to="/learning" img="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop" />
          <FeatureCard title="Our Approach" to="/about" img="https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1200&auto=format&fit=crop" />
          <FeatureCard title="Wellbeing" to="/wellbeing" img="https://images.unsplash.com/photo-1520975922284-7b9a1b5b2dae?q=80&w=1200&auto=format&fit=crop" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2>Welcome from the Principal</h2>
          <div className="split">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop" alt="Principal" />
            <p>
              Welcome to Baby Stars, a warm and vibrant community where learning feels alive. We believe in the transformative power of education that nurtures both mind and spirit. Our curriculum blends academic challenge with meaningful experiences in nature, design and the arts, helping young people grow in curiosity, capability and character.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'#faf7f2'}}>
        <div className="container">
          <h2>Our Mission & Vision</h2>
          <p className="testimonial">Our mission is to provide a British education that connects our community with the natural world and inspires us to imagine and build a future in which all may flourish.</p>
        </div>
      </section>

      <NoticeCarousel />

      <section className="section">
        <div className="container">
          <h2>What parents and students say</h2>
          <p className="testimonial">“Baby Stars is a gem. The school’s unique approach balances academic excellence with ecology and wellbeing. Our child loves attending every day and is constantly talking about what they’ve discovered.”</p>
          <div className="logos">
            <img src="https://dummyimage.com/180x60/ddd/222&text=Alliance" alt="Alliance" />
            <img src="https://dummyimage.com/160x60/ddd/222&text=BSME" alt="BSME" />
            <img src="https://dummyimage.com/180x60/ddd/222&text=Top+Schools" alt="Top Schools" />
            <img src="https://dummyimage.com/210x60/ddd/222&text=International+Award" alt="DoE" />
          </div>
        </div>
      </section>
    </main>
  )
}

