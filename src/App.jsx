import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Cursor  from './components/Cursor';
import Navbar  from './components/Navbar';
import Hero    from './components/Hero';
import About   from './components/About';
import Projects from './components/Projects';
import Skills  from './components/Skills';
import Contact from './components/Contact';
import Footer  from './components/Footer';

// Register GSAP plugins once globally
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Refresh ScrollTrigger calculations after layout is settled
    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-primary min-h-screen text-text overflow-x-hidden">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
