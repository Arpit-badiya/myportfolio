import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#about',    label: 'About'    },
  { href: '#projects', label: 'Projects' },
  { href: '#skills',   label: 'Skills'   },
  { href: '#contact',  label: 'Contact'  },
];

const Navbar = () => {
  const navRef          = useRef(null);
  const linksRef        = useRef(null);
  const indicatorRef    = useRef(null);
  const linkEls         = useRef([]);
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeLink,  setActiveLink]  = useState('');

  /* ── Initial entrance animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -80, opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4,
      });
    });

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* ── Slide indicator to clicked link ── */
  const moveIndicator = useCallback((index) => {
    const link = linkEls.current[index];
    const container = linksRef.current;
    if (!link || !container || !indicatorRef.current) return;

    const linkRect      = link.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const left = linkRect.left - containerRect.left;

    gsap.to(indicatorRef.current, {
      left,
      width: linkRect.width,
      opacity: 1,
      duration: 0.35,
      ease: 'power2.inOut',
    });
  }, []);

  const handleLinkClick = (e, href, index) => {
    e.preventDefault();
    setActiveLink(href);
    moveIndicator(index);
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Hover indicator ── */
  const handleLinkHover = (index) => moveIndicator(index);
  const handleLinksLeave = () => {
    if (!activeLink) {
      gsap.to(indicatorRef.current, { opacity: 0, duration: 0.2 });
    } else {
      const i = NAV_LINKS.findIndex(l => l.href === activeLink);
      if (i > -1) moveIndicator(i);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="section-container flex items-center justify-between py-4">

        {/* ── Logo ── */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-1.5 group"
        >
          <span
            className="font-display font-bold text-xl text-text tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            AP
          </span>
          <span className="text-accent text-2xl leading-none" style={{ marginTop: '-2px' }}>.</span>
        </a>

        {/* ── Desktop Links ── */}
        <div
          ref={linksRef}
          onMouseLeave={handleLinksLeave}
          className="hidden md:flex items-center gap-0.5 relative"
        >
          {/* Sliding indicator */}
          <span
            ref={indicatorRef}
            className="absolute bottom-0 h-px bg-accent rounded-full opacity-0"
            style={{ left: 0, width: 0 }}
            aria-hidden
          />

          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              ref={(el) => (linkEls.current[i] = el)}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href, i)}
              onMouseEnter={() => handleLinkHover(i)}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                activeLink === link.href ? 'text-accent' : 'text-muted hover:text-text'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="hidden md:block">
          <a
            href="#contact"
            data-magnetic
            onClick={(e) => handleLinkClick(e, '#contact', 3)}
            className="px-5 py-2 text-sm font-semibold text-accent border border-accent/30 rounded-full
              hover:bg-accent hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
          >
            Hire Me
          </a>
        </div>

        {/* ── Mobile burger ── */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden p-2 rounded-md text-muted hover:text-text transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden glass border-t border-white/5 px-6 overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-80 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-muted hover:text-text transition-colors text-base font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-1 px-5 py-2.5 bg-accent text-primary text-sm font-bold rounded-full text-center"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
