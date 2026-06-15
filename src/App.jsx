import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Lightweight loader that injects canvas-confetti from CDN and triggers bursts
function loadAndRunConfetti() {
  if (typeof window === 'undefined') return;
  if (window.__confettiLoaded) {
    if (window.confetti) {
      // two layered bursts for a nicer effect
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
  const [fireworks, setFireworks] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

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
    // jump twice rapidly to make it feel faster
    setNotTalkPos(randomPos());
    setTimeout(() => setNotTalkPos(randomPos()), 120);
  };

  const handleNotTalkClick = () => {
    // continuous faster jumping for a short burst
    setNotTalkMoving(true);
    // immediate move
    setNotTalkPos(randomPos());
    if (intervalRef.current) clearInterval(intervalRef.current);
    // faster interval (200ms) for rapid jumps
    intervalRef.current = setInterval(() => {
      setNotTalkPos(randomPos());
    }, 200);

    // stop after a limited number of jumps (12 jumps -> ~2.4s)
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setNotTalkMoving(false);
    }, 200 * 12);
  };

  const handleWillTalk = () => {
    setHeartPatched(true);
    setMessage("Thank you! I'll talk to you 💖");
    setFireworks(true);

    // run canvas confetti for richer fireworks (loaded from CDN)
    loadAndRunConfetti();

    // stop CSS fireworks after 3s
    setTimeout(() => setFireworks(false), 3000);

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
            className={`btn not-talk ${notTalkMoving ? 'moving' : ''}`}
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
