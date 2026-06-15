import React, { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import './App.css';

export default function App() {
  const [responded, setResponded] = useState(false);
  const [noClicked, setNoClicked] = useState(false);
  const [yesPosition, setYesPosition] = useState({ x: 0, y: 0 });

  const handleNoClick = () => {
    setNoClicked(true);
    setResponded(true);
  };

  const handleYesHover = () => {
    const newX = Math.random() * 300 - 150;
    const newY = Math.random() * 300 - 150;
    setYesPosition({ x: newX, y: newY });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-red-100 to-pink-300 flex items-center justify-center overflow-hidden">
      
      {/* Background Heart - Broken or Healed */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        {noClicked ? (
          <div className="text-9xl animate-bounce">💚</div>
        ) : (
          <div className="text-9xl animate-pulse">💔</div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        
        {/* Main Question */}
        <h1 className="text-6xl font-bold text-red-600 mb-8 animate-fade-in">
          Ammu, will you not talk to me from now? 😢
        </h1>

        {/* Message after response */}
        {responded && noClicked && (
          <div className="text-4xl font-bold text-green-600 mb-8 animate-bounce">
            I'll talk, Ronaldo! 💚✨
          </div>
        )}

        {/* Buttons Container */}
        <div className="flex gap-8 justify-center items-center relative h-24">
          
          {/* YES Button - Always Escaping */}
          <button
            onMouseEnter={handleYesHover}
            className="relative px-8 py-4 text-2xl font-bold text-white bg-red-500 rounded-full cursor-not-allowed opacity-75 hover:opacity-75 transition-all duration-100"
            style={{
              transform: `translate(${yesPosition.x}px, ${yesPosition.y}px)`,
              pointerEvents: responded ? 'none' : 'auto'
            }}
            disabled
          >
            [Yes 💔]
          </button>

          {/* NO Button - Clickable */}
          <button
            onClick={handleNoClick}
            className={`px-8 py-4 text-2xl font-bold text-white rounded-full transition-all duration-300 ${
              noClicked
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-110'
            }`}
          >
            No {noClicked ? '💚' : '💔'}
          </button>
        </div>

        {/* Footer Message */}
        {noClicked && (
          <div className="mt-12 text-2xl text-red-600 font-semibold animate-fade-in">
            You're the best! 🥰❤️
          </div>
        )}
      </div>
    </div>
  );
}
