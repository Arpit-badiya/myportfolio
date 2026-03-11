import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

/* ─── Project Data ───────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    num: '01',
    title: 'E-Commerce Platform',
    desc:  'Full-featured shopping platform with real-time inventory, Stripe payments & AI-powered recommendations. Microservices architecture on AWS ECS.',
    tags:  ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis', 'AWS'],
    from:  '#06b6d4', to: '#3b82f6',
    live:  '#',
    code:  '#',
  },
  {
    id: 2,
    num: '02',
    title: 'AI Analytics Dashboard',
    desc:  'Real-time analytics with ML predictions & interactive D3 visualisations. Processes 1M+ data points daily with sub-200ms query latency.',
    tags:  ['Python', 'React', 'TensorFlow', 'D3.js', 'AWS', 'FastAPI'],
    from:  '#a855f7', to: '#ec4899',
    live:  '#',
    code:  '#',
  },
  {
    id: 3,
    num: '03',
    title: 'Social Media App',
    desc:  'Scalable social network with real-time messaging, media sharing & live streaming. Supports 100k+ concurrent users via WebSocket clustering.',
    tags:  ['Next.js', 'GraphQL', 'PostgreSQL', 'AWS', 'WebSockets'],
    from:  '#10b981', to: '#06b6d4',
    live:  '#',
    code:  '#',
  },
  {
    id: 4,
    num: '04',
    title: 'Employee Management System',
    desc:  'Frontend-based employee management system to manage employees, assign tasks and track their status. Built with React & Tailwind CSS and uses browser localStorage to store all data.',
    tags:  ['React', 'Tailwind CSS', 'JavaScript'],
    from:  '#f59e0b', to: '#ef4444',
    live:  'https://arpit-badiya.github.io/E.M.System/',
    code:  '#',
  },
  {
    id: 5,
    num: '05',
    title: 'Crypto Trading Bot',
    desc:  'Automated trading bot with ML-driven signal detection, real-time market feeds & secure wallet integration. 34% better return than baseline strategy.',
    tags:  ['TypeScript', 'Node.js', 'WebSockets', 'Redis', 'Docker'],
    from:  '#eab308', to: '#f97316',
    live:  '#',
    code:  '#',
  },
  {
    id: 6,
    num: '06',
    title: 'Educational LMS',
    desc:  'Learning management system with adaptive video streaming, AI-generated quizzes, progress analytics & live Zoom integration.',
    tags:  ['MERN Stack', 'AWS S3', 'Zoom API', 'Stripe', 'Socket.io'],
    from:  '#6366f1', to: '#a855f7',
    live:  '#',
    code:  '#',
  },
];

/* ─── 3D Tilt Card ───────────────────────────────────────── */
const TiltCard = ({ project }) => {
  const cardRef  = useRef(null);
  const shineRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const cx      = rect.width  / 2;
    const cy      = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -7;
    const rotateY = ((x - cx) / cx) *  7;

    gsap.to(card, {
      rotateX, rotateY,
      transformPerspective: 1200,
      duration: 0.4,
      ease: 'power2.out',
    });

    /* Moving shine */
    if (shineRef.current) {
      const px = (x / rect.width)  * 100;
      const py = (y / rect.height) * 100;
      gsap.to(shineRef.current, {
        opacity: 0.07,
        background: `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.45) 0%, transparent 65%)`,
        duration: 0.3,
      });
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      rotateX: 0, rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.25)',
    });
    if (shineRef.current) gsap.to(shineRef.current, { opacity: 0, duration: 0.4 });
  }, []);

  const handleClick = () => {
    if (project.live && project.live !== '#') {
      window.open(project.live, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      ref={cardRef}
      className="project-card group relative bg-surface border border-border rounded-2xl overflow-hidden
        hover:border-white/12 transition-colors duration-500 cursor-pointer"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Gradient header */}
      <div
        className="relative h-44 flex items-end p-5 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${project.from}22, ${project.to}44)` }}
      >
        {/* Large number */}
        <span
          className="absolute top-4 right-5 font-display font-black text-6xl leading-none opacity-10 text-white select-none"
        >
          {project.num}
        </span>

        {/* Gradient bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-60"
          style={{ background: `linear-gradient(90deg, ${project.from}, ${project.to})` }}
        />

        {/* Links — appear on hover */}
        <div className="absolute top-4 left-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={project.live}
            aria-label="Live site"
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center
              hover:bg-white/25 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={13} className="text-white" />
          </a>
          <a
            href={project.code}
            aria-label="Source code"
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center
              hover:bg-white/25 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={13} className="text-white" />
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="p-6" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display font-bold text-text text-lg leading-tight">{project.title}</h3>
          <ArrowUpRight
            size={16}
            className="text-muted group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5
              transition-all duration-300 shrink-0 ml-2 mt-0.5"
          />
        </div>
        <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-3">{project.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      </div>

      {/* Shine overlay */}
      <div ref={shineRef} className="absolute inset-0 rounded-2xl pointer-events-none opacity-0" />
    </div>
  );
};

/* ─── Projects Section ───────────────────────────────────── */
const Projects = () => {
  const sectionRef = useRef(null);
  const gridRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.projects-title', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.from('.project-card', {
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        y: 60, opacity: 0,
        duration: 0.8,
        stagger: { amount: 0.6, grid: [2, 3], from: 'start' },
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-28 bg-surface/30">
      <div className="section-container">

        {/* Heading */}
        <div className="projects-title flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">02 / Projects</p>
            <h2
              className="font-display font-black text-4xl md:text-5xl text-text"
              style={{ letterSpacing: '-0.02em' }}
            >
              Featured{' '}
              <span className="gradient-text-accent">Work</span>
            </h2>
          </div>
          <a
            href="#"
            className="group flex items-center gap-2 text-sm font-medium text-muted hover:text-accent
              transition-colors duration-300 shrink-0 pb-2"
          >
            View all projects
            <ArrowUpRight size={15} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {PROJECTS.map(p => <TiltCard key={p.id} project={p} />)}
        </div>
      </div>
    </section>
  );
};

export default Projects;
