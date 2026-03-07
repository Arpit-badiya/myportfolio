import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Calendar, Code2, Users } from 'lucide-react';

/* ─── Animated Counter ───────────────────────────────────── */
const AnimatedCounter = ({ end, suffix = '', prefix = '' }) => {
  const ref = useRef(null);
  const obj = useRef({ val: 0 });

  useEffect(() => {
    const el = ref.current;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(obj.current, {
          val: end,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            if (el) el.textContent = prefix + Math.round(obj.current.val) + suffix;
          },
        });
      },
    });
    return () => trigger.kill();
  }, [end, suffix, prefix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
};

/* ─── Stat Card ──────────────────────────────────────────── */
const StatCard = ({ icon: Icon, end, suffix, prefix, label, color }) => (
  <div className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/20 transition-all duration-300 group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-10`}>
      <Icon size={18} className="text-inherit opacity-80" />
    </div>
    <div className="font-display font-black text-4xl text-text mb-1">
      <AnimatedCounter end={end} suffix={suffix} prefix={prefix} />
    </div>
    <p className="text-muted text-sm font-medium">{label}</p>
  </div>
);

/* ─── Experience Timeline ────────────────────────────────── */
const EXPERIENCE = [
  {
    
    role: 'Software Engineer',
    desc: 'Developing and maintaining web applications using React, Node.js, and MongoDB.',
    accent: 'accent',
  },
  {
    role: 'Full Stack Developer',
    desc: 'Built high-performance React + Node.js web apps from scratch. Reduced initial load time by 62% via code-splitting and CDN optimisation.',
    accent: 'accent-2',
  },
  {
    role: 'Mobile App Developer',
    desc: 'Developing and maintaining mobile applications using React Native and Expo.',
    accent: 'accent-3',
  },
];

/* ─── About ──────────────────────────────────────────────── */
const About = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const bioRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Title */
      gsap.from('.about-title', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      /* Stat cards stagger */
      gsap.from(statsRef.current?.children, {
        scrollTrigger: { trigger: statsRef.current, start: 'top 82%' },
        y: 40, opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.4)',
      });

      /* Bio */
      gsap.from(bioRef.current, {
        scrollTrigger: { trigger: bioRef.current, start: 'top 82%' },
        x: -40, opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      /* Timeline scrub line */
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleY: 0,
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: 1.2,
          },
        });
      }

      /* Timeline items */
      gsap.from('.timeline-item', {
        scrollTrigger: { trigger: timelineRef.current, start: 'top 78%' },
        x: 30, opacity: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-28 bg-primary">
      <div className="section-container">

        {/* ── Heading ── */}
        <div className="about-title mb-16 text-center">
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">01 / About</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-text" style={{ letterSpacing: '-0.02em' }}>
            The Engineer{' '}
            <span className="gradient-text-accent">Behind the Code</span>
          </h2>
        </div>

        {/* ── Stat Cards ── */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <StatCard icon={Briefcase} end={5} suffix="+" label="Years of Experience" color="text-accent" />
          <StatCard icon={Code2} end={50} suffix="+" label="Projects Delivered" color="text-accent-2" />
          <StatCard icon={Calendar} end={15} suffix="+" label="Technologies Used" color="text-accent-3" />
          <StatCard icon={Users} end={100} suffix="+" label="Clients Worldwide" color="text-accent" />
        </div>

        {/* ── Two-column ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Bio */}
          <div ref={bioRef}>
            <h3 className="font-display font-bold text-2xl text-text mb-6">
              Hello, World{' '}
              <span className="text-accent-3 font-mono">👋</span>
            </h3>

            <div className="space-y-5 text-muted leading-relaxed text-[15px]">
              <p>
                I'm <span className="text-text font-semibold">Arpit Patidar</span>, a
                <span className="text-text font-semibold"> B.Tech IT student </span>
                passionate about building modern and interactive digital experiences. I have a
                strong foundation in web development and enjoy turning ideas into responsive
                and user-friendly applications.
              </p>

              <p>
                My expertise lies mainly in
                <span className="text-text font-semibold"> Frontend Development</span>, where I
                work with modern technologies to create fast, scalable, and visually engaging
                interfaces. Along with frontend, I also have a good understanding of
                <span className="text-text font-semibold"> Backend Development</span> and
                full-stack application architecture.
              </p>

              <p>
                Currently, I am expanding my skills in
                <span className="text-text font-semibold"> Mobile App Development</span>. I enjoy
                learning new technologies, building real-world projects, and continuously
                improving my development skills while exploring modern tools and frameworks.
              </p>
            </div>

            {/* Tech highlights */}
            <div className="mt-8 flex flex-wrap gap-2">
              {['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'Next.js'].map(t => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border">
              <div ref={lineRef} className="w-full h-full bg-linear-to-b from-accent via-accent-2 to-accent-3 timeline-line-track" />
            </div>

            <div className="space-y-10">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="timeline-item relative">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 bg-primary ${exp.accent === 'accent' ? 'border-accent' :
                        exp.accent === 'accent-2' ? 'border-accent-2' : 'border-accent-3'
                      }`}
                    style={{ transform: 'translateX(-50%)' }}
                  />

                  <span className="font-mono text-xs text-muted tracking-wide">{exp.year}</span>
                  <h4 className="font-display font-bold text-text text-lg mt-1 mb-0.5">{exp.role}</h4>
                  <p className={`text-sm font-semibold mb-2 ${exp.accent === 'accent' ? 'text-accent' :
                      exp.accent === 'accent-2' ? 'text-accent-2' : 'text-accent-3'
                    }`}>
                  </p>
                  <p className="text-muted text-sm leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
