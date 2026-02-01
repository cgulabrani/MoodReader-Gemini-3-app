
import React from 'react';
import { Mood } from '../types';

interface MoodCardProps {
  mood: Mood;
  isSelected: boolean;
  onSelect: (mood: Mood) => void;
}

const MoodCard: React.FC<MoodCardProps> = ({ mood, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(mood)}
      className={`
        relative overflow-hidden group p-6 rounded-[2rem] transition-all duration-500
        flex flex-col items-center text-center gap-4
        bg-white border border-gray-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.01)]
        hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 active:scale-95
      `}
    >
      <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
        transition-all duration-700 group-hover:scale-105 group-hover:rotate-2
        ${mood.color}
      `}>
        {mood.emoji}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight transition-colors duration-300">
          {mood.label}
        </h3>
        <p className="text-[10px] text-gray-400 font-light leading-snug max-w-[140px]">
          {mood.description}
        </p>
      </div>
      <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-1 group-hover:translate-y-0">
        <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Explore</span>
      </div>
    </button>
  );
};

export default MoodCard;
