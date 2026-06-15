import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import brokenHeart from './assets/heart-broken.gif';
import patchedHeart from './assets/heart-patched.gif';

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
  const [willTalkPos, setWillTalkPos] = useState(null);
  const [willTalkHighlight, setWillTalkHighlight] = useState(false);
  const [notTalkMoving, setNotTalkMoving] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const notTalkPosRef = useRef(notTalkPos);
  const highlightTimeoutRef = useRef(null);

  useEffect(() => {
    notTalkPosRef.current = notTalkPos;
  }, [notTalkPos]);

  useEffect(() => {
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
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    };
  }, []);

  const randomPos = () => {
    const container = containerRef.current;
    if (!container) return { top: '55%', left: '60%' };
    const rect = container.getBoundingClientRect();
    const padding = 36;
    const top = Math.random() * (rect.height - padding * 2) + padding;
    const left = Math.random() * (rect.width - padding * 2) + padding;
    return { top: `${top}px`, left: `${left}px` };
  };

  const showWillTalkAt = (pos) => {
    setWillTalkPos(pos);
    setWillTalkHighlight(true);
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(() => setWillTalkHighlight(false), 700);
  };

  const handleNotTalkEnter = () => {
    if (notTalkMoving) return;
    const prev = notTalkPosRef.current;
    const next = randomPos();
    showWillTalkAt(prev);
    setNotTalkPos(next);
  };

  const handleNotTalkClick = () => {
    if (notTalkMoving) return;
    setNotTalkMoving(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const prev = notTalkPosRef.current;
      const next = randomPos();
      showWillTalkAt(prev);
      setNotTalkPos(next);
    }, 350);
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setNotTalkMoving(false);
    }, 350 * 14);
  };

  const handleWillTalk = () => {
    setHeartPatched(true);
    setMessage("Thank you! I'll talk to you 💖");
    setFireworks(true);
    loadAndRunConfetti();
    setTimeout(() => setFireworks(false), 3000);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setNotTalkMoving(false);
    }
  };

  const defaultWillTalkStyle = {
    position: 'absolute',
    left: '50%',
    bottom: '5.5rem',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    background: 'linear-gradient(90deg,#ff416c,#ffaf7b)',
    color: '#fff',
    padding: '14px 26px',
    borderRadius: '999px',
    boxShadow: '0 22px 48px rgba(255,80,140,0.18)'
  };

  const willTalkStyle = willTalkPos
    ? { position: 'absolute', top: willTalkPos.top, left: willTalkPos.left, transform: 'translate(-50%, -50%)', zIndex: 9999, background: 'linear-gradient(90deg,#ff416c,#ffaf7b)', color: '#fff', padding: '14px 26px', borderRadius: '999px', boxShadow: '0 22px 48px rgba(255,80,140,0.18)' }
    : defaultWillTalkStyle;

  return (
    <div className="app-root">
      <div className="heart-particles" aria-hidden />
      <div className={`bg-heart ${heartPatched ? 'patched' : 'broken'}`}>
        <div className="heart-wrap">
          <img src={heartPatched ? patchedHeart : brokenHeart} alt="heart" className="heart-img" />
        </div>
      </div>

      <div className="content" ref={containerRef}>
        <h1 className="title">Ammu, will you not talk to me from now?</h1>

        <div className="buttons-area">
          <button
            className={`btn will-talk ${willTalkHighlight ? 'highlight' : ''}`}
            onClick={handleWillTalk}
            style={willTalkStyle}
          >
            Will talk
          </button>

          <button
            className={`btn not-talk ${notTalkMoving ? 'moving' : ''}`}
            style={{ position: 'absolute', top: notTalkPos.top, left: notTalkPos.left, transform: 'translate(-50%, -50%)', zIndex: 50 }}
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
