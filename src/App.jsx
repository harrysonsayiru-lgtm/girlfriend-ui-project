import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [heartPatched, setHeartPatched] = useState(false);
  const [message, setMessage] = useState('');
  const [notTalkPos, setNotTalkPos] = useState({ top: '50%', left: '60%' });
  const [notTalkMoving, setNotTalkMoving] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const randomPos = () => {
    const container = containerRef.current;
    if (!container) return { top: '50%', left: '60%' };
    const rect = container.getBoundingClientRect();
    const padding = 40; // keep buttons inside
    const top = Math.random() * (rect.height - padding * 2) + padding;
    const left = Math.random() * (rect.width - padding * 2) + padding;
    return { top: `${top}px`, left: `${left}px` };
  };

  const handleNotTalkEnter = () => {
    // move on hover
    if (notTalkMoving) return;
    setNotTalkPos(randomPos());
  };

  const handleNotTalkClick = () => {
    // start continuous jumping
    setNotTalkMoving(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNotTalkPos(randomPos());
    }, 700);
    // stop after 8 jumps to avoid runaway
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setNotTalkMoving(false);
    }, 700 * 8);
  };

  const handleWillTalk = () => {
    // only this should be clickable to accept
    setHeartPatched(true);
    setMessage("Thank you! I'll talk to you 💖");
    setFireworks(true);
    // stop fireworks after a while
    setTimeout(() => setFireworks(false), 3000);
    // also stop notTalk movement if running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setNotTalkMoving(false);
    }
  };

  return (
    <div className="app-root">
      {/* Background animated big heart (acts like a GIF) */}
      <div className={`bg-heart ${heartPatched ? 'patched' : 'broken'}`} />

      <div className="content" ref={containerRef}>
        <h1 className="title">Ammu, will you not talk to me from now?</h1>

        <div className="buttons-area">
          <button
            className="btn will-talk"
            onClick={handleWillTalk}
          >
            Will talk
          </button>

          <button
            className={`btn not-talk ${notTalkMoving ? 'moving' : ''}`}
            style={{ position: 'absolute', top: notTalkPos.top, left: notTalkPos.left }}
            onMouseEnter={handleNotTalkEnter}
            onClick={handleNotTalkClick}
          >
            Not talk
          </button>
        </div>

        {/* Message area */}
        {message && (
          <div className="message">{message}</div>
        )}

        {/* Fireworks */}
        {fireworks && (
          <div className="fireworks" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`spark spark-${i}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
