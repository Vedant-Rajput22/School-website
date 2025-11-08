import { Routes, Route, NavLink } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Admissions from './pages/Admissions'
import Campus from './pages/Campus'
import Learning from './pages/Learning'
import Wellbeing from './pages/Wellbeing'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import NoticeBoard from './pages/NoticeBoard'
import NoticeNew from './pages/NoticeNew'
import Admin from './pages/Admin'
import ProtectedRoute from './ProtectedRoute'
import AdminNotices from './pages/AdminNotices'
import NoticeEdit from './pages/NoticeEdit'
import Events from './pages/Events'
import Team from './pages/Team'
import Gallery from './pages/Gallery'
import News from './pages/News'
import ArticleView from './pages/ArticleView'
import { useEffect } from 'react'
import { API_BASE } from './api'

function Header(){
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="topbar">AN ECO-CONSCIOUS SCHOOL FOR CURIOUS, CONFIDENT LEARNERS</div>
      <header className="navbar">
        <div className="container nav-inner">
          <a className="brand" href="/">
            <span className="brand-mark" />
            <span>Baby Stars</span>
          </a>
          <button aria-label="Menu" className="menu-toggle" onClick={()=>setOpen(v=>!v)}>☰</button>
          <nav className={"nav-links" + (open ? " open" : "")} onClick={()=>setOpen(false)}>
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About Us</NavLink>
            <NavLink to="/admissions" className="nav-link">Admissions</NavLink>
            <NavLink to="/campus" className="nav-link">The Campus</NavLink>
            <NavLink to="/learning" className="nav-link">Learning</NavLink>
            <NavLink to="/wellbeing" className="nav-link">Wellbeing</NavLink>
            <NavLink to="/notice-board" className="nav-link">Notice Board</NavLink>
            <NavLink to="/events" className="nav-link">Events</NavLink>
            <NavLink to="/team" className="nav-link">Team</NavLink>
            <NavLink to="/gallery" className="nav-link">Gallery</NavLink>
            <NavLink to="/news" className="nav-link">News</NavLink>
            <NavLink to="/admin" className="nav-link">Admin</NavLink>
            <NavLink to="/contact" className="nav-link cta">Contact Us</NavLink>
          </nav>
        </div>
      </header>
    </>
  )
}

function Footer(){
  return (
    <footer>
      <div className="container section">
        <div className="cols">
          <div>
            <div className="brand"><span className="brand-mark" /><span>Baby Stars</span></div>
            <p style={{maxWidth:500}}>We’re a creative, sustainable learning community. We blend high academic standards with real-world experiences that spark curiosity, character and stewardship.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <p><NavLink to="/about">About</NavLink></p>
            <p><NavLink to="/admissions">Admissions</NavLink></p>
            <p><NavLink to="/campus">Campus</NavLink></p>
          </div>
          <div>
            <h4>Learning</h4>
            <p><NavLink to="/learning">Curriculum</NavLink></p>
            <p><NavLink to="/wellbeing">Student Wellbeing</NavLink></p>
            <p><NavLink to="/faq">FAQ</NavLink></p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>info@babystars.school</p>
            <p>+971 55 000 0000</p>
            <p>Dubai, UAE</p>
          </div>
        </div>
        <div className="bottom">© {new Date().getFullYear()} Baby Stars — All rights reserved.</div>
      </div>
    </footer>
  )
}

export default function App(){
  useEffect(()=>{
    fetch(`${API_BASE}/api/health`).then(r=>r.json()).then(x=>console.log('Backend OK:', x)).catch(e=>console.warn('Backend not reachable', e))
  },[])
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/campus" element={<Campus />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/wellbeing" element={<Wellbeing />} />
        <Route path="/notice-board" element={<NoticeBoard />} />
        <Route path="/notice-board/new" element={<ProtectedRoute><NoticeNew /></ProtectedRoute>} />
        <Route path="/notice-board/edit/:id" element={<ProtectedRoute><NoticeEdit /></ProtectedRoute>} />
        <Route path="/admin/notices" element={<ProtectedRoute><AdminNotices /></ProtectedRoute>} />
        <Route path="/events" element={<Events />} />
        <Route path="/team" element={<Team />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<ArticleView />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <Footer />
    </>
  )
}
