import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sticker } from '../types';
import { Sparkles, Trophy, Award, Lock, ExternalLink } from 'lucide-react';
import { audioEngine } from '../AudioEngine';

interface StickerBoardProps {
  stickers: Sticker[];
  unlockedIds: string[];
}

export default function StickerBoard({ stickers, unlockedIds }: StickerBoardProps) {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);

  const handleStickerClick = (sticker: Sticker, isUnlocked: boolean) => {
    if (isUnlocked) {
      audioEngine.playBeep(880, 0.1, 0.12);
      setSelectedSticker(sticker);
    } else {
      audioEngine.playBeep(330, 0.18, 0.1);
    }
  };

  // Dedicated custom high-tech SVG representations matching the user's uploaded images
  const renderEngagedSVG = (type: string, isUnlocked: boolean) => {
    const color = isUnlocked ? 'stroke-cyan-400' : 'stroke-slate-700 opacity-40';
    const fill = isUnlocked ? 'fill-cyan-500/20' : 'fill-transparent';
    const shadowClass = isUnlocked ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]' : '';

    switch (type) {
      case 'flying_hero':
        // Superman style flying figure with cape
        return (
          <svg className={`w-14 h-14 ${color} ${fill} ${shadowClass} transition-all duration-500`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Cape */}
            <path d="M12 40 L4 28 C2 24, 6 22, 10 24 L24 28 L20 44 Z" />
            {/* Flying Body */}
            <path d="M24 28 L48 8 C52 4, 58 10, 54 14 L34 34 L26 40 L16 48 L14 42 L24 28 Z" />
            {/* Action Lines */}
            <path d="M4 14 C12 8, 20 6, 20 6" strokeDasharray="3 3" />
            <path d="M8 44 L3 48" />
            <path d="M14 54 L10 56" />
            {/* Fist outstretched */}
            <circle cx="56" cy="7" r="1.5" className={isUnlocked ? 'fill-cyan-400' : 'fill-transparent'} />
          </svg>
        );

      case 'power_fist':
        // Armored mechanical fist punching up
        return (
          <svg className={`w-14 h-14 ${isUnlocked ? 'stroke-amber-400 fill-amber-500/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]' : 'stroke-slate-700 opacity-40 fill-transparent'} transition-all duration-500`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Forearm plate */}
            <path d="M22 45 L42 45 L38 60 L26 60 Z" />
            <line x1="32" y1="45" x2="32" y2="60" />
            {/* Main fist block */}
            <path d="M18 28 C18 20, 46 20, 46 28 L42 45 L22 45 Z" />
            {/* Finger plates */}
            <path d="M21 21 C21 16, 25 16, 25 21 L25 28" />
            <path d="M27 19 C27 14, 31 14, 31 19 L31 28" />
            <path d="M33 19 C33 14, 37 14, 37 19 L37 28" />
            <path d="M39 22 C39 18, 43 18, 43 22 L43 28" />
            {/* Wrapped Thumb */}
            <path d="M16 32 C12 32, 14 38, 22 38 L22 32" />
          </svg>
        );

      case 'rocket_boots':
        // Rocket metal boots bursting thrusters
        return (
          <svg className={`w-14 h-14 ${color} ${fill} ${shadowClass} transition-all duration-500`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Left Boot */}
            <path d="M12 18 L24 18 L22 38 L14 38 Z" />
            <path d="M14 38 L8 46 L18 46 L22 38" />
            {/* Right Boot */}
            <path d="M36 18 L48 18 L46 38 L38 38 Z" />
            <path d="M38 38 L32 46 L42 46 L46 38" />
            {/* Rocket exhaust sparks */}
            <path d="M11 48 L8 56 L13 52 L15 58 L16 48" className={isUnlocked ? 'stroke-orange-400 fill-orange-500/10' : ''} />
            <path d="M35 48 L32 56 L37 52 L39 58 L40 48" className={isUnlocked ? 'stroke-orange-400 fill-orange-500/10' : ''} />
            {/* Technology dials */}
            <circle cx="18" cy="28" r="2" />
            <circle cx="42" cy="28" r="2" />
          </svg>
        );

      case 'arc_core':
        // Glowing double ring science reactor
        return (
          <svg className={`w-14 h-14 ${isUnlocked ? 'stroke-sky-400 fill-sky-200/20 drop-shadow-[0_0_10px_rgba(56,189,248,0.95)]' : 'stroke-slate-700 opacity-40 fill-transparent'} transition-all duration-500`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer Hex */}
            <polygon points="32,6 54,19 54,45 32,58 10,45 10,19" />
            {/* Outer Circle */}
            <circle cx="32" cy="32" r="18" strokeDasharray="4 2" />
            {/* Inner Triangle reactor components */}
            <polygon points="32,22 41,37 23,37" />
            <circle cx="32" cy="32" r="6" />
            {/* Radiating beams */}
            <line x1="32" y1="6" x2="32" y2="14" />
            <line x1="32" y1="50" x2="32" y2="58" />
            <line x1="10" y1="32" x2="18" y2="32" />
            <line x1="46" y1="32" x2="54" y2="32" />
          </svg>
        );

      case 'thunder_helmet':
        // Speed helmet with lightning ears
        return (
          <svg className={`w-14 h-14 ${isUnlocked ? 'stroke-rose-400 fill-rose-500/20 drop-shadow-[0_0_8px_rgba(251,113,133,0.7)]' : 'stroke-slate-700 opacity-40 fill-transparent'}`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Main dome helmet */}
            <path d="M16 32 C16 16, 48 16, 48 32 C48 44, 46 48, 44 50 L32 54 L20 50 C18 48, 16 44, 16 32 Z" />
            {/* Visor plate */}
            <path d="M20 28 Q32 20 44 28 L42 38 Q32 30 22 38 Z" />
            {/* Lightning bolt left ears */}
            <path d="M16 28 L8 32 L14 34 L6 42 L16 38" />
            {/* Lightning bolt right ears */}
            <path d="M48 28 L56 32 L50 34 L58 42 L48 38" />
          </svg>
        );

      case 'satellite':
        // High gain communication satellite
        return (
          <svg className={`w-14 h-14 ${color} ${fill} ${shadowClass}`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Satellite central body */}
            <rect x="26" y="22" width="12" height="20" rx="3" />
            <circle cx="32" cy="16" r="3" />
            {/* Left Solar Panel */}
            <path d="M10 24 L22 26 L22 38 L10 40 Z" />
            <line x1="16" y1="25" x2="16" y2="39" />
            {/* Right Solar Panel */}
            <path d="M54 24 L42 26 L42 38 L54 40 Z" />
            <line x1="48" y1="25" x2="48" y2="39" />
            {/* Transmission waves */}
            <path d="M26 49 C28 52, 36 52, 38 49" />
            <path d="M21 54 C26 59, 38 59, 43 54" strokeDasharray="2 2" />
            {/* Transmitter horn */}
            <line x1="32" y1="42" x2="32" y2="47" />
          </svg>
        );

      case 'constellation':
        // Star graph with nodes and constellations
        return (
          <svg className={`w-14 h-14 ${isUnlocked ? 'stroke-indigo-400 fill-indigo-500/20 drop-shadow-[0_0_8px_rgba(129,140,248,0.7)]' : 'stroke-slate-700 opacity-40 fill-transparent'}`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Connecting lines */}
            <line x1="14" y1="18" x2="32" y2="12" />
            <line x1="32" y1="12" x2="50" y2="24" />
            <line x1="50" y1="24" x2="40" y2="48" />
            <line x1="40" y1="48" x2="22" y2="52" />
            <line x1="22" y1="52" x2="14" y2="18" />
            <line x1="14" y1="18" x2="34" y2="34" />
            <line x1="40" y1="48" x2="34" y2="34" />
            {/* Glowing stars */}
            <circle cx="14" cy="18" r="3" className="fill-indigo-400" />
            <circle cx="32" cy="12" r="4.5" className="fill-white animate-pulse" />
            <circle cx="50" cy="24" r="3" className="fill-indigo-400" />
            <circle cx="40" cy="48" r="4" className="fill-indigo-400" />
            <circle cx="22" cy="52" r="3" className="fill-indigo-400" />
            <circle cx="34" cy="34" r="3.5" className="fill-pink-400 animate-ping-slow" />
          </svg>
        );

      case 'laser_shield':
        // Target shields being targeted by warning laser deflection
        return (
          <svg className={`w-14 h-14 ${isUnlocked ? 'stroke-teal-400 fill-teal-500/20 drop-shadow-[0_0_8px_rgba(45,212,191,0.7)]' : 'stroke-slate-700 opacity-40 fill-transparent'}`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Concentric targets */}
            <circle cx="32" cy="32" r="24" strokeDasharray="6 3" />
            <circle cx="32" cy="32" r="16" />
            <circle cx="32" cy="32" r="8" className="fill-teal-400/30" />
            {/* Shield quadrants */}
            <path d="M32 4 L32 14" />
            <path d="M32 50 L32 60" />
            <path d="M4 32 L14 32" />
            <path d="M50 32 L60 32" />
            {/* Laser hits */}
            <path d="M8 8 L22 22" className="stroke-red-400" />
            <polygon points="22,22 17,21 21,17" className="fill-red-400" />
          </svg>
        );

      case 'martial_art':
        // Kid superhero doing a sidekick
        return (
          <svg className={`w-14 h-14 ${isUnlocked ? 'stroke-orange-400 fill-orange-500/20 drop-shadow-[0_0_8px_rgba(251,146,60,0.7)]' : 'stroke-slate-700 opacity-40 fill-transparent'}`} viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Head */}
            <circle cx="24" cy="14" r="5" />
            {/* Torso */}
            <path d="M22 19 L26 35 L12 36" />
            {/* High Side Kick leg */}
            <path d="M26 32 L48 24 L56 22" />
            {/* Stand leg */}
            <path d="M23 35 L18 48 L26 54" />
            {/* Arm punch */}
            <path d="M24 22 L38 22 L46 20" />
            {/* Combat wind speed lines */}
            <line x1="48" y1="14" x2="56" y2="14" strokeDasharray="2 2" />
            <line x1="44" y1="36" x2="52" y2="36" strokeDasharray="3 3" />
          </svg>
        );

      default:
        return <Trophy className={`w-12 h-12 ${color}`} />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-4 border-slate-700/60 bg-gradient-to-br from-slate-900 via-[#1f2631] to-[#141820] shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_10px_25px_rgba(0,0,0,0.5)] p-6 group">
      {/* Milled Brushed Metal Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* 4 Corner Screws for high-tech realistic armor plating */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 rotate-45" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 -rotate-45" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 -rotate-12" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 stroke-2 rotate-75" />
      </div>

      {/* Header section with orange/cyan LEDs */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Glowing Red power status LED in plate margin */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <h3 className="font-sans font-bold text-lg text-slate-100 tracking-wide flex items-center gap-2">
            🛡️ 히어로 명예의 전당 <span className="text-slate-400 text-xs font-mono font-normal">STEEL DECALS</span>
          </h3>
        </div>
        <span className="text-xs bg-slate-950/60 font-mono text-cyan-400 px-3 py-1 rounded-full border border-cyan-900/40 mt-2 sm:mt-0">
          획득 배지: {unlockedIds.length} / {stickers.length}
        </span>
      </div>

      {/* Stickers Board Plate */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 bg-slate-950/40 rounded-xl p-4 md:p-6 border border-slate-800/80 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)]">
        {stickers.map((sticker) => {
          const isUnlocked = unlockedIds.includes(sticker.id);

          return (
            <div
              key={sticker.id}
              className="flex flex-col items-center justify-between"
            >
              <button
                onClick={() => handleStickerClick(sticker, isUnlocked)}
                id={`sticker-${sticker.id}`}
                className={`relative group/badge w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-slate-800/80 to-slate-900/90 border-2 border-cyan-500/50 hover:border-cyan-400 shadow-[0_5px_15px_rgba(34,211,238,0.25)] cursor-pointer hover:-translate-y-1'
                    : 'bg-slate-900/20 border-2 border-slate-800/80 cursor-not-allowed shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'
                }`}
              >
                {/* Physical Engraved Inset Look under Lock */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-[#0f1217] rounded-lg opacity-40 mix-blend-overlay pointer-events-none" />
                )}

                {/* Lock icon overlay for locked items */}
                {!isUnlocked && (
                  <div className="absolute top-1 right-1 bg-slate-950/80 border border-slate-800/80 rounded-full p-0.5 text-slate-500">
                    <Lock className="w-3 h-3" />
                  </div>
                )}

                {/* SVG Emblem Component */}
                <div className="relative z-10 p-1">
                  {renderEngagedSVG(sticker.iconType, isUnlocked)}
                </div>

                {/* Glow ring under sticker */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-lg bg-cyan-400/5 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300 blur-md" />
                )}
              </button>

              <span className={`text-[11px] sm:text-xs font-sans mt-2 text-center truncate w-full px-1 font-medium ${
                isUnlocked ? 'text-slate-200' : 'text-slate-600 font-mono'
              }`}>
                {isUnlocked ? sticker.name.split(' (')[0] : '기밀 (Locked)'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Description helper message */}
      <p className="text-center text-slate-500 text-[11px] sm:text-xs font-mono mt-4 leading-relaxed">
        ※ 퀘스트를 완료해 나가면, 잠겨 있던 물리 배지 구동기가 <span className="text-cyan-400">네온 에너지</span>로 각성하면서 가동됩니다!
      </p>

      {/* Detail Showcase Dialog with Framer Motion */}
      <AnimatePresence>
        {selectedSticker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border-2 border-cyan-400 bg-gradient-to-b from-slate-900 to-[#121620] p-6 shadow-[0_15px_40px_rgba(34,211,238,0.25)]"
            >
              {/* Sparkles Particle Glow */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Laser Line Overlay */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

              <div className="flex flex-col items-center text-center mt-2">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-cyan-550 shadow-inner mb-4 relative">
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  {renderEngagedSVG(selectedSticker.iconType, true)}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-2">
                  <Award className="w-3.5 h-3.5" />
                  UNLOCKED MEDAL
                </div>

                <h4 className="font-sans font-bold text-xl text-slate-100 tracking-wide">
                  {selectedSticker.name}
                </h4>

                <p className="text-slate-400 text-xs mt-3 leading-relaxed bg-[#0b0e14] px-4 py-3 rounded-lg border border-slate-800/80 font-serif">
                  &ldquo;{selectedSticker.description}&rdquo;
                </p>

                <div className="w-full border-t border-slate-800 my-4" />

                <div className="text-left w-full text-xs font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">지정 챌린지:</span>
                    <span className="text-slate-300">{selectedSticker.unlockCondition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">프로젝트 해제일:</span>
                    <span className="text-amber-400 font-semibold">
                      {selectedSticker.unlockedAt ? new Date(selectedSticker.unlockedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    audioEngine.playBeep(600, 0.08, 0.1);
                    setSelectedSticker(null);
                  }}
                  id="close-sticker-showcase"
                  className="mt-6 w-full py-2.5 rounded-xl font-semibold bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_4px_12px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  명예의 전당으로 복귀
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
