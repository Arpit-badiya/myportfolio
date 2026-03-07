import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Github, Linkedin, Twitter, Mail, ArrowRight, Download } from 'lucide-react';

/* ─── Text Scramble Utility ──────────────────────────────── */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>/|\\[]{}';

const scrambleText = (element, finalText, { delay = 0, duration = 1400 } = {}) => {
  if (!element) return;
  const totalFrames = Math.ceil((duration / 1000) * 60);
  let frame = 0;
  let rafId;

  const animate = () => {
    const progress = frame / totalFrames;
    const revealed  = Math.floor(progress * finalText.length);

    element.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < revealed)  return char;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      })
      .join('');

    frame++;
    if (frame <= totalFrames) rafId = requestAnimationFrame(animate);
    else element.textContent = finalText;
  };

  const timer = setTimeout(animate, delay);
  return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
};

/* ─── Typewriter Hook ────────────────────────────────────── */
const useTypewriter = (words, { speed = 80, deleteSpeed = 40, pauseMs = 2200 } = {}) => {
  const [text,     setText]     = useState('');
  const [wIdx,     setWIdx]     = useState(0);
  const [deleting, setDeleting] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    if (paused.current) return;
    const word = words[wIdx % words.length];

    const id = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) {
          paused.current = true;
          setTimeout(() => { paused.current = false; setDeleting(true); }, pauseMs);
        }
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === '') {
          setDeleting(false);
          setWIdx(i => (i + 1) % words.length);
        }
      }
    }, deleting ? deleteSpeed : speed);

    return () => clearTimeout(id);
  }, [text, deleting, wIdx, words, speed, deleteSpeed, pauseMs]);

  return text;
};

/* ─── Terminal Window Component ──────────────────────────── */
const TERMINAL_LINES = [
  { type: 'cmd', text: 'whoami'                                             },
  { type: 'out', text: 'arpit-patidar',                    color: 'text'   },
  { type: 'gap'                                                              },
  { type: 'cmd', text: 'cat skills.json'                                    },
  { type: 'out', text: '["React","Node.js","TypeScript","AWS"]', color: 'muted' },
  { type: 'gap'                                                              },
  { type: 'cmd', text: 'status --check'                                     },
  { type: 'out', text: '✓ Open to opportunities',           color: 'green'  },
  { type: 'gap'                                                              },
  { type: 'prompt'                                                           },
];

const TerminalWindow = () => {
  const lineRefs  = useRef([]);
  const wrapRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(wrapRef.current, {
        opacity: 0, x: 60, y: 20,
        duration: 0.9,
        ease: 'power3.out',
        delay: 1.2,
      });

      gsap.set(lineRefs.current, { opacity: 0 });
      gsap.to(lineRefs.current, {
        opacity: 1,
        duration: 0.01,
        stagger: 0.38,
        delay: 1.6,
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  let idx = -1;
  return (
    <div ref={wrapRef} className="relative w-full max-w-md mx-auto">
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-xl bg-linear-to-br from-accent/20 via-accent-2/10 to-transparent pointer-events-none" />

      <div className="glass rounded-xl overflow-hidden border border-white/8 shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-elevated/60 border-b border-white/5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"   />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/80"  />
          </div>
          <span className="font-mono text-xs text-muted ml-2">arpit@dev  ~</span>
        </div>

        {/* Body */}
        <div className="p-5 font-mono text-sm space-y-1.5 min-h-[230px]">
          {TERMINAL_LINES.map((line) => {
            if (line.type === 'gap') {
              idx++;
              return (
                <div
                  key={`gap-${idx}`}
                  ref={(el) => (lineRefs.current[idx] = el)}
                  className="h-2"
                />
              );
            }

            idx++;
            const liIdx = idx;

            if (line.type === 'prompt') {
              return (
                <div
                  key="prompt"
                  ref={(el) => (lineRefs.current[liIdx] = el)}
                  className="flex items-center gap-2"
                >
                  <span className="text-accent-3">$</span>
                  <span className="w-2 h-4 bg-accent opacity-80 cursor-blink" />
                </div>
              );
            }

            if (line.type === 'cmd') {
              return (
                <div
                  key={line.text}
                  ref={(el) => (lineRefs.current[liIdx] = el)}
                  className="flex items-center gap-2"
                >
                  <span className="text-accent-3 select-none">$</span>
                  <span className="text-text">{line.text}</span>
                </div>
              );
            }

            const colorMap = { text: 'text-text', muted: 'text-muted', green: 'text-accent-3' };
            return (
              <div
                key={line.text}
                ref={(el) => (lineRefs.current[liIdx] = el)}
                className={`pl-5 ${colorMap[line.color] ?? 'text-muted'}`}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── Social Link ────────────────────────────────────────── */
const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    data-magnetic
    className="w-10 h-10 rounded-full border border-border flex items-center justify-center
      text-muted hover:text-accent hover:border-accent/40 transition-all duration-300"
  >
    <Icon size={16} />
  </a>
);

/* ─── Hero ───────────────────────────────────────────────── */
const ROLES = [
  'Senior Full Stack Engineer',
  'Cloud & DevOps Architect',
  'React Specialist',
  'Node.js & API Expert',
];

const Hero = () => {
  const heroRef    = useRef(null);
  const gridRef    = useRef(null);
  const nameRef    = useRef(null);
  const badgeRef   = useRef(null);
  const roleRef    = useRef(null);
  const bioRef     = useRef(null);
  const ctaRef     = useRef(null);
  const socialsRef = useRef(null);
  const orb1Ref    = useRef(null);
  const orb2Ref    = useRef(null);
  const scrollRef  = useRef(null);

  const currentRole = useTypewriter(ROLES, { speed: 70, deleteSpeed: 35, pauseMs: 2000 });

  /* ── Entrance GSAP timeline ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Grid drift */
      gsap.to(gridRef.current, {
        backgroundPosition: '50px 50px',
        duration: 30,
        repeat: -1,
        ease: 'none',
      });

      /* Floating orbs */
      gsap.to(orb1Ref.current, {
        y: -35, x: 20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(orb2Ref.current, {
        y: 25, x: -30,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5,
      });

      /* Staggered text entrance */
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from(badgeRef.current,   { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' })
        .from(nameRef.current,    { opacity: 0, y: 40, duration: 0.01 }, '-=0.3')
        .from(roleRef.current,    { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, '-=0.3')
        .from(bioRef.current,     { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .from(ctaRef.current,     { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .from(socialsRef.current, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .from(scrollRef.current,  { opacity: 0,         duration: 0.5                     }, '-=0.2');
    }, heroRef);

    /* Name scramble starts after badge entrance */
    const cleanup = scrambleText(nameRef.current, 'ARPIT PATIDAR', { delay: 500, duration: 1300 });

    return () => {
      ctx.revert();
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-primary"
    >
      {/* ── Dot Grid ── */}
      <div
        ref={gridRef}
        className="hero-grid absolute inset-0 opacity-70"
        aria-hidden
      />

      {/* ── Gradient orbs ── */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 -left-20 w-[480px] h-[480px] rounded-full bg-accent/6 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-accent-2/6 blur-3xl pointer-events-none"
        aria-hidden
      />

      {/* ── Content ── */}
      <div className="section-container relative z-10 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div className="space-y-8">
          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-3/30 bg-accent-3/5">
            <span className="w-2 h-2 rounded-full bg-accent-3 animate-pulse" />
            <span className="font-mono text-xs text-accent-3 font-medium tracking-wide">
              Available for Work • IT Engineer
            </span>
          </div>

          {/* Name — scramble effect fills this */}
          <h1
            ref={nameRef}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl leading-none tracking-tight gradient-text"
            style={{ letterSpacing: '-0.03em' }}
          >
            ARPIT PATIDAR
          </h1>

          {/* Typewriter role */}
          <div ref={roleRef} className="flex items-center gap-2 h-8">
            <span className="text-lg md:text-xl font-mono text-accent">{currentRole}</span>
            <span className="w-0.5 h-5 bg-accent cursor-blink" />
          </div>

          {/* Bio */}
          <p ref={bioRef} className="text-muted text-base md:text-lg leading-relaxed max-w-xl">
            Crafting{' '}
            <span className="text-text font-medium">scalable cloud-native systems</span> and
            immersive frontend experiences. 5+ years shipping production-grade software that
            balances technical depth with exceptional UX.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              data-magnetic
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 px-7 py-3.5 bg-accent text-primary font-bold text-sm
                rounded-full shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:bg-white
                transition-all duration-300 hover:-translate-y-0.5"
            >
              View Projects
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            <a
              href="#"
              data-magnetic
              className="flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold text-sm
                rounded-full hover:border-accent/40 hover:text-accent transition-all duration-300
                hover:-translate-y-0.5"
            >
              <Download size={15} />
              Download CV
            </a>
          </div>

          {/* Socials */}
          <div ref={socialsRef} className="flex items-center gap-3">
            <SocialLink href="https://github.com"    icon={Github}   label="GitHub"    />
            <SocialLink href="https://linkedin.com"  icon={Linkedin} label="LinkedIn"  />
            <SocialLink href="https://twitter.com"   icon={Twitter}  label="Twitter/X" />
            <SocialLink href="mailto:arpit@mail.com" icon={Mail}     label="Email"     />
          </div>
        </div>

        {/* Right — Terminal */}
        <TerminalWindow />
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        aria-hidden
      >
        <span className="font-mono text-xs text-muted tracking-widest uppercase">scroll</span>
        <div className="w-px h-10 bg-linear-to-b from-transparent via-accent to-transparent scroll-dot" />
      </div>
    </section>
  );
};

export default Hero;
