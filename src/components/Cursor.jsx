import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;

    let mouseX = -100, mouseY = -100;

    /* ── Track raw mouse position (dot follows instantly) ── */
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX, y: mouseY,
        duration: 0.08,
        ease: 'none',
      });

      gsap.to(ring, {
        x: mouseX, y: mouseY,
        duration: 0.45,
        ease: 'power2.out',
      });
    };

    /* ── Hover state: expand ring & change color ── */
    const onEnterInteractive = () => {
      gsap.to(ring, {
        scale: 2,
        borderColor: 'rgba(167, 139, 250, 0.7)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };

    const onLeaveInteractive = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(34, 211, 238, 0.6)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    /* ── Magnetic pull on data-magnetic elements ── */
    const initMagnetic = () => {
      const magnetEls = document.querySelectorAll('[data-magnetic]');
      magnetEls.forEach((el) => {
        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const cx   = rect.left + rect.width  / 2;
          const cy   = rect.top  + rect.height / 2;
          const dx   = (e.clientX - cx) * 0.38;
          const dy   = (e.clientY - cy) * 0.38;

          gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
        };

        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
        };

        el.addEventListener('mousemove',  onMove);
        el.addEventListener('mouseleave', onLeave);

        /* store handlers for cleanup */
        el._magnetMove  = onMove;
        el._magnetLeave = onLeave;
      });
    };

    /* ── Click ripple ── */
    const onClick = () => {
      gsap.to(ring, {
        scale: 2.5,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => gsap.set(ring, { scale: 1, opacity: 1 }),
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click',     onClick);

    /* delegate interactive hover */
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, [data-hover]')) onEnterInteractive();
      else onLeaveInteractive();
    });

    /* init magnetic after a tick */
    const timer = setTimeout(initMagnetic, 300);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click',     onClick);
      clearTimeout(timer);

      /* cleanup magnetic listeners */
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        if (el._magnetMove)  el.removeEventListener('mousemove',  el._magnetMove);
        if (el._magnetLeave) el.removeEventListener('mouseleave', el._magnetLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
      <div ref={ringRef} className="cursor-ring"  aria-hidden />
    </>
  );
};

export default Cursor;
