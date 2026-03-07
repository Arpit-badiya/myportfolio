import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ─── Skills Data ────────────────────────────────────────── */
const CATEGORIES = {
  'Frontend': [
    { name: 'React',         level: 95 },
    { name: 'React-Native',  level: 75 },
    { name: 'Next.js',       level: 90 },
    { name: 'TypeScript',    level: 88 },
    { name: 'Tailwind CSS',  level: 95 },
    { name: 'GSAP',          level: 82 },
    { name: 'Vue.js',        level: 75 },
    { name: 'Redux',         level: 85 },
    { name: 'Vite',          level: 90 },
    
  ],
  'Backend': [
    { name: 'Node.js',       level: 92 },
    { name: 'Express',       level: 90 },
    { name: 'Python',        level: 82 },
    { name: 'FastAPI',       level: 78 },
    { name: 'REST APIs',     level: 95 },
    { name: 'PostgreSQL',    level: 88 },
    { name: 'MongoDB',       level: 85 },
  ],
  // 'Cloud & DevOps': [
  //   { name: 'AWS (EC2, S3, Lambda)', level: 85 },
  //   { name: 'Docker',        level: 88 },
  //   { name: 'Kubernetes',    level: 75 },
  //   { name: 'CI/CD (GitHub Actions)', level: 90 },
  //   { name: 'Terraform',     level: 72 },
  //   { name: 'Nginx',         level: 82 },
  //   { name: 'Linux',         level: 88 },
  //   { name: 'Cloudflare',    level: 80 },
  // ],
  'Tools': [
    { name: 'Git',           level: 95 },
    { name: 'Figma',         level: 78 },
    { name: 'VS Code',       level: 95 },
    { name: 'Postman',       level: 90 },
    // { name: 'Jest',          level: 82 },
    // { name: 'Cypress',       level: 75 },
    { name: 'Jira',          level: 85 },
    { name: 'Notion',        level: 88 },
  ],
};

const TABS = Object.keys(CATEGORIES);

/* ─── Level to color ─────────────────────────────────────── */
const levelColor = (lvl) => {
  if (lvl >= 90) return { bg: 'bg-accent/10',   border: 'border-accent/25',   text: 'text-accent'   };
  if (lvl >= 80) return { bg: 'bg-accent-2/10', border: 'border-accent-2/25', text: 'text-accent-2' };
  return               { bg: 'bg-surface',       border: 'border-border',      text: 'text-muted'    };
};

/* ─── Skill Chip ─────────────────────────────────────────── */
const SkillChip = ({ name, level }) => {
  const { bg, border, text } = levelColor(level);
  return (
    <div
      className={`skill-chip px-4 py-2.5 rounded-xl border ${bg} ${border}
        flex items-center justify-between gap-4 group transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/30`}
    >
      <span className="text-text text-sm font-medium font-display">{name}</span>
      <span className={`font-mono text-xs font-semibold ${text}`}>{level}%</span>
    </div>
  );
};

/* ─── Skills ─────────────────────────────────────────────── */
const Skills = () => {
  const sectionRef  = useRef(null);
  const tabsRef     = useRef(null);
  const indicatorRef = useRef(null);
  const tabEls      = useRef([]);
  const gridRef     = useRef(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const isFirstRender = useRef(true);

  /* ── Slide tab indicator ── */
  const moveTabIndicator = useCallback((index) => {
    const tab = tabEls.current[index];
    const container = tabsRef.current;
    if (!tab || !container || !indicatorRef.current) return;

    const tabRect  = tab.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const left = tabRect.left - contRect.left;

    gsap.to(indicatorRef.current, {
      left,
      width: tabRect.width,
      duration: 0.35,
      ease: 'power2.inOut',
    });
  }, []);

  /* ── Switch tab with chip animation ── */
  const switchTab = useCallback((tab, index) => {
    if (tab === activeTab) return;
    moveTabIndicator(index);

    gsap.to('.skill-chip', {
      opacity: 0,
      y: 8,
      duration: 0.18,
      stagger: 0.02,
      onComplete: () => {
        setActiveTab(tab);
      },
    });
  }, [activeTab, moveTabIndicator]);

  /* ── Animate chips in when tab changes ── */
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    gsap.fromTo('.skill-chip',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'back.out(1.5)', delay: 0.05 }
    );
  }, [activeTab]);

  /* ── Section entrance & initial indicator position ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-title', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.from('.skills-tabs', {
        scrollTrigger: { trigger: tabsRef.current, start: 'top 85%' },
        y: 20, opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });

      gsap.from('.skill-chip', {
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
        opacity: 0, y: 20,
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out(1.5)',
      });
    }, sectionRef);

    /* Init indicator position after a tick */
    const timer = setTimeout(() => moveTabIndicator(0), 120);

    return () => { ctx.revert(); clearTimeout(timer); };
  }, [moveTabIndicator]);

  const skills = CATEGORIES[activeTab];

  return (
    <section ref={sectionRef} id="skills" className="py-28 bg-primary">
      <div className="section-container">

        {/* Heading */}
        <div className="skills-title text-center mb-14">
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">03 / Skills</p>
          <h2
            className="font-display font-black text-4xl md:text-5xl text-text"
            style={{ letterSpacing: '-0.02em' }}
          >
            Technical{' '}
            <span className="gradient-text-accent">Arsenal</span>
          </h2>
          <p className="text-muted text-sm mt-4 max-w-md mx-auto">
            A continuously evolving toolkit — proficiency levels reflect production experience.
          </p>
        </div>

        {/* Tabs */}
        <div className="skills-tabs flex justify-center mb-10">
          <div
            ref={tabsRef}
            className="relative inline-flex gap-1 p-1.5 bg-surface border border-border rounded-2xl"
          >
            {/* Sliding pill */}
            <div
              ref={indicatorRef}
              className="absolute top-1.5 bottom-1.5 bg-elevated rounded-xl transition-none"
              style={{ left: 0, width: 0 }}
              aria-hidden
            />

            {TABS.map((tab, i) => (
              <button
                key={tab}
                ref={(el) => (tabEls.current[i] = el)}
                onClick={() => switchTab(tab, i)}
                className={`relative z-10 px-5 py-2 rounded-xl text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                  activeTab === tab ? 'text-text' : 'text-muted hover:text-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Chip Grid */}
        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-5xl mx-auto"
        >
          {skills.map((s) => (
            <SkillChip key={s.name} name={s.name} level={s.level} />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {[
            { color: 'bg-accent',   label: 'Expert (90%+)'   },
            { color: 'bg-accent-2', label: 'Advanced (80%+)' },
            { color: 'bg-muted',    label: 'Proficient'      },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${color} opacity-60`} />
              <span className="text-muted text-xs font-mono">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
