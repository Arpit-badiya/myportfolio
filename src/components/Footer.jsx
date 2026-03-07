import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';

const SOCIALS = [
  { icon: Github,   href: 'https://github.com',   label: 'GitHub'    },
  { icon: Linkedin, href: 'https://linkedin.com',  label: 'LinkedIn'  },
  { icon: Twitter,  href: 'https://twitter.com',   label: 'Twitter/X' },
  { icon: Mail,     href: 'mailto:arpit@patidar.dev', label: 'Email' },
];

const Footer = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-primary py-10">
      <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <a href="#" onClick={scrollToTop} className="font-display font-bold text-text text-xl tracking-tight">
            AP<span className="text-accent">.</span>
          </a>
          <p className="text-muted text-xs font-mono">
            © {new Date().getFullYear()} Arpit Patidar. All rights reserved.
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center
                text-muted hover:text-accent hover:border-accent/30 transition-all duration-300"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-accent
            transition-colors duration-300 group"
        >
          Back to top
          <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
