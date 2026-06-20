import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeroProfile, AvatarType } from '../types';
import { Shield, Flame, Award, Edit2, Check, User, Sparkles, CloudRain, Sun, CloudSnow } from 'lucide-react';
import { audioEngine } from '../AudioEngine';
import { WeatherData } from '../utils/weather';

// Custom cybernetic avatar images
// @ts-ignore
import cyberBoyImage from '../assets/images/avatar_cyber_boy_1781928939903.jpg';
// @ts-ignore
import cyberSamuraiImage from '../assets/images/avatar_cyber_samurai_1781928954120.jpg';
// @ts-ignore
import cyberNinjaImage from '../assets/images/avatar_cyber_ninja_1781928966686.jpg';
// @ts-ignore
import lightningHelmetImage from '../assets/images/avatar_lightning_helmet_1781928978832.jpg';

interface HeroHeaderProps {
  profile: HeroProfile;
  onChangeProfile: (updated: Partial<HeroProfile>) => void;
  weather: WeatherData | null;
  onReplayIntro?: () => void;
}

export default function HeroHeader({ profile, onChangeProfile, weather, onReplayIntro }: HeroHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);

  const xpMax = profile.level * 100 + 150; // XP target increases each level
  const percentXp = Math.min(100, Math.floor((profile.xp / xpMax) * 100));

  // Determine Rank Name based on Level
  const getRankName = (lv: number) => {
    if (lv === 1) return '🌌 우주 훈련생 (Space Cadet)';
    if (lv === 2) return '🚀 은하 탐사대원 (Galaxy Explorer)';
    if (lv === 3) return '⚡ 플라즈마 레인저 (Plasma Ranger)';
    if (lv === 4) return '🛡️ 성간 수호자 (Interstellar Guardian)';
    if (lv === 5) return '👑 타이탄 캡틴 (Titan Giga Captain)';
    return '🌟 코스믹 전설 (Cosmic Legend)';
  };

  const handleAvatarChange = (avatar: AvatarType) => {
    audioEngine.playBeep(700, 0.08, 0.12);
    onChangeProfile({ avatar });
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onChangeProfile({ name: tempName.trim() });
      setIsEditingName(false);
      audioEngine.playBeep(900, 0.1, 0.15);
    }
  };

  const avatars: { id: AvatarType; label: string; icon: string; desc: string; color: string; image?: string }[] = [
    { id: 'astro', label: '아스트로', icon: '👦', desc: '지혜로운 전용 스마트 고글 슈트', color: 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300 font-sans', image: cyberBoyImage },
    { id: 'cybernight', label: '사이버 나이트', icon: '⚔️', desc: '정의의 플라즈마 방패 전사', color: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300 font-sans', image: cyberSamuraiImage },
    { id: 'shadowninja', label: '쉐도우닌자', icon: '🥷', desc: '특수 은신 닌자수트', color: 'bg-blue-500/15 border-blue-400/50 text-blue-300', image: cyberNinjaImage },
    { id: 'ththebolt', label: '썬더볼트', icon: '🪖', desc: '정전기 하이바 탑재', color: 'bg-amber-500/15 border-yellow-400/50 text-yellow-300', image: lightningHelmetImage },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border-4 border-slate-700/60 bg-gradient-to-br from-slate-900 via-[#1f2631] to-[#141820] shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_10px_25px_rgba(0,0,0,0.5)] p-6">
      {/* 4 Corner Screws for industrial sci-fi panel realism */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 rotate-12" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 -rotate-12" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 rotate-45" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 -rotate-45" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Avatar Display & Selector */}
        <div className="md:col-span-4 flex flex-col items-center justify-center border-r-0 md:border-r-2 border-slate-800/80 pr-0 md:pr-6">
          <div className="relative">
            {/* Holographic Glowing Ring representation */}
            <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400 opacity-60 blur-sm animate-spin-slow`} />
            
            <div className="relative w-24 h-24 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center text-5xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] overflow-hidden">
              {(() => {
                const ava = avatars.find((a) => a.id === profile.avatar);
                return ava?.image ? (
                  <img
                    src={ava.image}
                    alt={ava.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  ava?.icon || '🚀'
                );
              })()}
            </div>
            
            {/* Level Badge */}
            <span className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-sans font-black text-sm px-2.5 py-0.5 rounded-full border border-cyan-300 shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
              LV.{profile.level}
            </span>
          </div>

          <div className="mt-4 text-center">
            {isEditingName ? (
              <div className="flex items-center gap-1 bg-slate-950/80 border border-cyan-500/50 rounded-lg p-1">
                <input
                  type="text"
                  maxLength={12}
                  className="bg-transparent text-slate-100 px-2 py-0.5 font-bold focus:outline-none w-28 text-center"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                />
                <button
                  onClick={handleSaveName}
                  id="save-hero-name"
                  className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 p-1 rounded cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h2 className="font-sans font-black text-xl text-slate-100 tracking-wide">
                  {profile.name}
                </h2>
                <button
                  onClick={() => {
                    audioEngine.playBeep(500, 0.05, 0.05);
                    setIsEditingName(true);
                  }}
                  id="edit-hero-name"
                  className="text-slate-500 hover:text-cyan-400 transition-colors p-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-xs text-slate-400 tracking-wider font-mono mt-1">
              {getRankName(profile.level)}
            </p>
          </div>
        </div>

        {/* Right Side: Level Stats XP Progress bar & Streaks */}
        <div className="md:col-span-8 flex flex-col justify-between h-full pt-1">
          {/* Level Progress Stats */}
          <div className="flex justify-between items-end font-mono text-xs text-slate-400 mb-1.5 px-1">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> EXP BOOST
            </span>
            <span>
              {profile.xp} / {xpMax} XP <span className="text-slate-600 font-normal">({percentXp}%)</span>
            </span>
          </div>

          {/* Epic Cyberpunk Level Bar */}
          <div className="h-6 w-full rounded-lg bg-slate-950 border border-slate-800 p-1 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative">
            <div 
              className="h-full rounded bg-gradient-to-r from-cyan-600 via-cyan-400 to-sky-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-700 relative"
              style={{ width: `${percentXp}%` }}
            >
              {/* Animated scanline gloss on core */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shine" />
            </div>
          </div>

          {/* Triple Stats Footer: Streak, Status, and Earth Weather */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {/* Streak Counter Box with burning flame glow */}
            <div className="flex items-center gap-3 bg-slate-950/45 rounded-xl p-3 border border-slate-800/80 shadow-inner">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/30">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-mono text-slate-500">트레이닝 연속기록</div>
                <div className="font-sans font-black text-sm text-slate-100 flex items-baseline gap-1">
                  트레이닝 {profile.streak} 일 연속
                </div>
              </div>
            </div>

            {/* Complete Performance rate */}
            <div className="flex items-center gap-3 bg-slate-950/45 rounded-xl p-3 border border-slate-800/80 shadow-inner">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-mono text-slate-500">히어로 에너지</div>
                <div className="font-sans font-black text-sm text-amber-400 flex items-baseline gap-1">
                  {Math.min(100, Math.floor(profile.level * 18 + profile.streak * 4))}% <span className="text-slate-400 text-[9px] font-mono">PWR</span>
                </div>
              </div>
            </div>

            {/* Live Atmospheric Weather Card */}
            <div 
              onClick={() => {
                if (onReplayIntro) {
                  audioEngine.playPowerIgnition();
                  onReplayIntro();
                }
              }}
              className="flex items-center gap-3 bg-slate-950/45 hover:bg-slate-900/60 rounded-xl p-3 border border-slate-850 hover:border-cyan-500/40 shadow-inner group/weather cursor-pointer transition-all duration-350"
              title="자비스 슈트 홀로그램 수동 점화 (RE-BOOT HUD)"
            >
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover/weather:border-cyan-400 group-hover/weather:scale-105 transition-all duration-300">
                {weather?.isRaining ? (
                  <CloudRain className="w-5 h-5 animate-bounce" />
                ) : weather?.description.includes('눈') ? (
                  <CloudSnow className="w-5 h-5 animate-pulse" />
                ) : (
                  <Sun className="w-5 h-5 animate-spin-slow" />
                )}
              </div>
              <div className="relative flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest font-mono text-slate-500 flex items-center justify-between">
                  <span>자비스 센서</span>
                  <span className="text-[8px] bg-cyan-950 text-cyan-400 px-1 rounded hover:bg-cyan-900 transition-colors">HUD 시동</span>
                </div>
                <div className="font-sans font-black text-sm text-cyan-400 truncate leading-snug">
                  {weather ? `${weather.temp}°C ${weather.description.split(' ')[0]}` : '지구날씨 수신중'}
                </div>
              </div>
            </div>
          </div>

          {/* Mini Avatar Switcher Row */}
          <div className="mt-4 border-t border-slate-800 pt-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-2 px-1">
              ⚡ 인시그니아 캐릭터 슈트 장착 (Super Suits)
            </span>
            <div className="grid grid-cols-4 gap-2">
              {avatars.map((ava) => (
                <button
                  key={ava.id}
                  onClick={() => handleAvatarChange(ava.id)}
                  id={`avatar-select-${ava.id}`}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer text-center group flex items-center justify-center gap-1.5 ${
                    profile.avatar === ava.id
                      ? 'bg-gradient-to-r from-cyan-900/40 via-cyan-950/50 path-to-cyan-900/40 text-cyan-300 border-cyan-400/85 shadow-[0_2px_8px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-950/40 text-slate-400 border-slate-800/85 hover:border-slate-700/80 hover:text-slate-300'
                  }`}
                  title={ava.desc}
                >
                  {ava.image ? (
                    <img
                      src={ava.image}
                      alt={ava.label}
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">{ava.icon}</span>
                  )}
                  <span className="hidden sm:inline text-[11px]">{ava.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
