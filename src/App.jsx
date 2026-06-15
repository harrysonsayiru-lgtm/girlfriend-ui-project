import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Lightweight loader that injects canvas-confetti from CDN and triggers bursts
function loadAndRunConfetti() {
  if (typeof window === 'undefined') return;
  if (window.__confettiLoaded) {
    if (window.confetti) {
      window.confetti({ particleCount: 160, spread: 80, origin: { y: 0.35 } });
      window.confetti({ particleCount: 120, spread: 120, origin: { y: 0.6 } });
    }
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
  s.async = true;
  s.onload = () => {
    window.__confettiLoaded = true;
    if (window.confetti) {
      window.confetti({ particleCount: 160, spread: 80, origin: { y: 0.35 } });
      window.confetti({ particleCount: 120, spread: 120, origin: { y: 0.6 } });
    }
  };
  document.body.appendChild(s);
}

export default function App() {
  const [heartPatched, setHeartPatched] = useState(false);
  const [message, setMessage] = useState('');
  const [notTalkPos, setNotTalkPos] = useState({ top: '55%', left: '60%' });
  const [notTalkMoving, setNotTalkMoving] = useState(false);
  const [notTalkHidden, setNotTalkHidden] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    // place a few floating small hearts for visual richness
    const container = containerRef.current;
    if (!container) return;
    const particleCount = 8;
    const nodes = [];
    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement('span');
      el.style.left = Math.random() * 100 + '%';
      el.style.top = (60 + Math.random() * 30) + '%';
      el.style.animation = `floatUp ${6 + Math.random() * 6}s linear forwards`;
      el.style.opacity = String(0.7 + Math.random() * 0.3);
      el.style.fontSize = `${12 + Math.floor(Math.random() * 14)}px`;
      el.className = 'heart-particle';
      container.appendChild(el);
      nodes.push(el);
    }

    return () => {
      nodes.forEach(n => n.remove());
      if (intervalRef.current) clearInterval(intervalRef.current);
      // clear timeouts
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  const randomPos = () => {
    const container = containerRef.current;
    if (!container) return { top: '55%', left: '60%' };
    const rect = container.getBoundingClientRect();
    const padding = 36; // keep buttons inside
    const top = Math.random() * (rect.height - padding * 2) + padding;
    const left = Math.random() * (rect.width - padding * 2) + padding;
    return { top: `${top}px`, left: `${left}px` };
  };

  const handleNotTalkEnter = () => {
    // quick dodge on hover / pointer enter / touch
    if (notTalkMoving) return;
    // small smooth dodge: hide briefly then show at new pos
    setNotTalkHidden(true);
    const t1 = setTimeout(() => {
      setNotTalkPos(randomPos());
      setNotTalkHidden(false);
    }, 140);
    timeoutsRef.current.push(t1);
  };

  const handleNotTalkClick = () => {
    // Hide-and-seek style jumping: smooth hide, relocate, reveal repeatedly
    if (notTalkMoving) return; // already running
    setNotTalkMoving(true);

    const cycles = 10; // number of hide-seek cycles
    const hideDuration = 140; // ms hidden
    const gap = 180; // ms between reveals (controls smoothness)

    let i = 0;

    const runCycle = () => {
      if (i >= cycles) {
        setNotTalkMoving(false);
        setNotTalkHidden(false);
        return;
      }

      // hide
      setNotTalkHidden(true);
      const tHide = setTimeout(() => {
        // move while hidden
        setNotTalkPos(randomPos());
        // reveal
        setNotTalkHidden(false);
        i += 1;
        // schedule next cycle
        const tNext = setTimeout(runCycle, gap);
        timeoutsRef.current.push(tNext);
      }, hideDuration);

      timeoutsRef.current.push(tHide);
    };

    runCycle();
  };

  const handleWillTalk = () => {
    setHeartPatched(true);
    setMessage("Thank you! I'll talk to you 💖");
    setFireworks(true);

    // run canvas confetti for richer fireworks (loaded from CDN)
    loadAndRunConfetti();

    // stop CSS fireworks after 3s
    const t = setTimeout(() => setFireworks(false), 3000);
    timeoutsRef.current.push(t);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setNotTalkMoving(false);
    }
  };

  return (
    <div className="app-root">
      {/* decorative small hearts container */}
      <div className="heart-particles" aria-hidden />

      {/* Background animated big heart (broken / patched) */}
      <div className={`bg-heart ${heartPatched ? 'patched' : 'broken'}`}>
        <div className="heart-wrap" />
      </div>

      <div className="content" ref={containerRef}>
        <h1 className="title">Ammu, will you not talk to me from now?</h1>

        <div className="buttons-area">
          <button className="btn will-talk" onClick={handleWillTalk}>
            Will talk
          </button>

          <button
            className={`btn not-talk ${notTalkMoving ? 'moving' : ''} ${notTalkHidden ? 'hidden' : ''}`}
            style={{ position: 'absolute', top: notTalkPos.top, left: notTalkPos.left }}
            onMouseEnter={handleNotTalkEnter}
            onPointerEnter={handleNotTalkEnter}
            onTouchStart={handleNotTalkEnter}
            onClick={handleNotTalkClick}
          >
            Not talk
          </button>
        </div>

        {message && <div className="message">{message}</div>}

        {fireworks && (
          <div className="fireworks" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`spark spark-${i}`} style={{ '--dx': `${(Math.random() - 0.5) * 300}px`, '--dy': `${-120 - Math.random() * 260}px` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
