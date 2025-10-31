import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Admissions from './pages/Admissions'
import Campus from './pages/Campus'
import Learning from './pages/Learning'
import Wellbeing from './pages/Wellbeing'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'

function Header(){
  return (
    <>
      <div className="topbar">AN ECO-CONSCIOUS SCHOOL EXPERIENCE FOR CURIOUS MINDS</div>
      <header className="navbar">
        <div className="container nav-inner">
          <a className="brand" href="/">
            <span className="brand-mark" />
            <span>Baby Stars</span>
          </a>
          <nav className="nav-links">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About Us</NavLink>
            <NavLink to="/admissions" className="nav-link">Admissions</NavLink>
            <NavLink to="/campus" className="nav-link">The Campus</NavLink>
            <NavLink to="/learning" className="nav-link">Learning</NavLink>
            <NavLink to="/wellbeing" className="nav-link">Wellbeing</NavLink>
            <NavLink to="/careers" className="nav-link">Careers</NavLink>
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
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <Footer />
    </>
  )
}

