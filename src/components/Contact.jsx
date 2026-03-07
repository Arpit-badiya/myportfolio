import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Twitter, Mail, MapPin, Clock, Send } from 'lucide-react';

/* ─── Contact Info ───────────────────────────────────────── */
const INFO = [
  { icon: Mail,    label: 'Email',     value: 'arpit@patidar.dev',        href: 'mailto:arpit@patidar.dev'    },
  { icon: Github,  label: 'GitHub',    value: 'github.com/arpit-patidar', href: 'https://github.com'          },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/arpit',    href: 'https://linkedin.com'        },
  { icon: Twitter, label: 'Twitter/X', value: '@arpit_dev',               href: 'https://twitter.com'         },
  { icon: MapPin,  label: 'Location',  value: 'India — Remote Worldwide',  href: null                         },
  { icon: Clock,   label: 'Timezone',  value: 'IST (UTC +5:30)',           href: null                         },
];

/* ─── Form Field ─────────────────────────────────────────── */
const Field = ({ label, type, placeholder, textarea }) => (
  <div className="space-y-1.5">
    <label className="font-mono text-xs text-muted tracking-wide uppercase">{label}</label>
    {textarea ? (
      <textarea
        placeholder={placeholder}
        rows={5}
        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text text-sm
          placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:bg-elevated
          transition-all duration-300 resize-none font-sans"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text text-sm
          placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:bg-elevated
          transition-all duration-300 font-sans"
      />
    )}
  </div>
);

/* ─── Contact ────────────────────────────────────────────── */
const Contact = () => {
  const sectionRef = useRef(null);
  const leftRef    = useRef(null);
  const rightRef   = useRef(null);
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-title', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.from(leftRef.current, {
        scrollTrigger: { trigger: leftRef.current, start: 'top 82%' },
        x: -40, opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.from(rightRef.current, {
        scrollTrigger: { trigger: rightRef.current, start: 'top 82%' },
        x: 40, opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.1,
      });

      gsap.from('.contact-info-item', {
        scrollTrigger: { trigger: leftRef.current, start: 'top 80%' },
        y: 20, opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 2000);
  };

  return (
    <section ref={sectionRef} id="contact" className="py-28 bg-surface/30">
      <div className="section-container">

        {/* Heading */}
        <div className="contact-title text-center mb-16">
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">04 / Contact</p>
          <h2
            className="font-display font-black text-4xl md:text-5xl text-text"
            style={{ letterSpacing: '-0.02em' }}
          >
            Let's{' '}
            <span className="gradient-text-accent">Build Together</span>
          </h2>
          <p className="text-muted text-sm mt-4 max-w-md mx-auto">
            Have a project in mind or looking for a senior engineer to join your team?
            I'd love to hear from you.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* ── Left: Info ── */}
          <div
            ref={leftRef}
            className="p-8 rounded-2xl border relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.04), rgba(167,139,250,0.04))',
              borderColor: 'rgba(34,211,238,0.15)',
            }}
          >
            {/* Background gradient orb */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent-2/5 blur-3xl pointer-events-none" />

            <div className="relative">
              <h3 className="font-display font-bold text-xl text-text mb-2">Get In Touch</h3>
              <p className="text-muted text-sm leading-relaxed mb-8">
                Open to full-time opportunities, contract projects, consulting,
                and exciting open-source collaborations.
              </p>

              <div className="space-y-4">
                {INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="contact-info-item flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center shrink-0 group-hover:border-accent/30 transition-colors duration-300">
                      <Icon size={15} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted tracking-wide">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text text-sm font-medium hover:text-accent transition-colors duration-300"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-text text-sm font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Availability badge */}
              <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-3/8 border border-accent-3/20">
                <span className="w-2 h-2 rounded-full bg-accent-3 animate-pulse" />
                <span className="font-mono text-xs text-accent-3">Available for new projects</span>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div
            ref={rightRef}
            className="p-8 rounded-2xl bg-surface border border-border"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-10">
                <div className="w-16 h-16 rounded-full bg-accent-3/10 border border-accent-3/20 flex items-center justify-center">
                  <span className="text-accent-3 text-2xl">✓</span>
                </div>
                <h3 className="font-display font-bold text-xl text-text">Message Sent!</h3>
                <p className="text-muted text-sm max-w-xs">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 text-xs font-mono text-accent hover:underline"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Name"  type="text"  placeholder="Arpit Patidar"    />
                  <Field label="Email" type="email" placeholder="you@example.com"  />
                </div>
                <Field label="Subject"  type="text" placeholder="Project discussion..." />
                <Field label="Message" textarea placeholder="Tell me about your project, timeline, and budget..." />

                <button
                  type="submit"
                  data-magnetic
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-primary
                    font-bold text-sm rounded-xl hover:bg-white transition-all duration-300
                    shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
