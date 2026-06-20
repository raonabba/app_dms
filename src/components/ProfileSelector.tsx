import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KidProfileData, AvatarType } from '../types';
import { Sparkles, Trophy, Flame, Plus, ArrowRight, UserPlus, Trash2, ShieldAlert } from 'lucide-react';
import { audioEngine } from '../AudioEngine';

// Custom cybernetic avatar images
// @ts-ignore
import cyberBoyImage from '../assets/images/avatar_cyber_boy_1781928939903.jpg';
// @ts-ignore
import cyberSamuraiImage from '../assets/images/avatar_cyber_samurai_1781928954120.jpg';
// @ts-ignore
import cyberNinjaImage from '../assets/images/avatar_cyber_ninja_1781928966686.jpg';
// @ts-ignore
import lightningHelmetImage from '../assets/images/avatar_lightning_helmet_1781928978832.jpg';

interface ProfileSelectorProps {
  profiles: KidProfileData[];
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, avatar: AvatarType) => void;
  onDeleteProfile?: (id: string, name: string) => void; // Optional secure delete
}

export default function ProfileSelector({
  profiles,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
}: ProfileSelectorProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('astro');

  const availableAvatars: { id: AvatarType; icon: string; name: string; desc: string; bg: string; image?: string }[] = [
    { id: 'astro', icon: '👦', name: '아스트로 (Astro)', desc: '지혜로운 전용 스마트 고글 슈트', bg: 'from-cyan-500/25 to-indigo-500/15 border-cyan-400/50', image: cyberBoyImage },
    { id: 'cybernight', icon: '⚔️', name: '사이버 나이트 (Cyber Knight)', desc: '정의의 플라즈마 방패 전사', bg: 'from-emerald-500/25 to-lime-500/15 border-emerald-400/50', image: cyberSamuraiImage },
    { id: 'shadowninja', icon: '🥷', name: '쉐도우닌자 (Shadow Ninja)', desc: '특수 은신 닌자수트', bg: 'from-blue-500/25 to-slate-500/15 border-blue-400/50', image: cyberNinjaImage },
    { id: 'ththebolt', icon: '🪖', name: '썬더볼트 (Thunderbolt)', desc: '정전기 하이바 탑재', bg: 'from-amber-500/25 to-yellow-500/15 border-yellow-400/50', image: lightningHelmetImage },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    audioEngine.playPowerIgnition();
    onCreateProfile(newName.trim(), selectedAvatar);
    
    // Reset state
    setNewName('');
    setSelectedAvatar('astro');
    setIsAddingNew(false);
  };

  const handleSelect = (id: string) => {
    audioEngine.playLaserUnlock();
    onSelectProfile(id);
  };

  // Helper avatar display icon lookup
  const getAvatarIcon = (id: AvatarType) => {
    return availableAvatars.find(a => a.id === id)?.icon || '🚀';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,41,59,0.7),rgba(2,6,23,1))] relative overflow-hidden font-mono text-slate-100 select-none">
      
      {/* Absolute Space Grid & Background Details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Decorative Planet & nebula shapes */}
      <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative w-full max-w-4xl z-10 space-y-12 text-center py-6">
        
        <AnimatePresence mode="wait">
          {!isAddingNew ? (
            <motion.div
              key="selector-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-10"
            >
              {/* Cockpit Subtitle Banner */}
              <div className="space-y-3">
                <div className="inline-flex gap-2 items-center bg-cyan-950/40 border border-cyan-800/60 rounded-full py-1.5 px-4 text-xs text-cyan-400 font-semibold tracking-wide uppercase">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  COSMIC HERO HABIT STATION
                </div>
                <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-100 tracking-tight leading-none bg-clip-text">
                  오늘 은하 퀘스트를 수행할 히어로는 누구인가요?
                </h1>
                <p className="text-slate-400 text-sm max-w-lg mx-auto font-sans leading-relaxed">
                  자신의 프로필 슈트를 선택하여 오늘의 아침, 저녁 체크리스트 작전을 체크하고 멋진 우주스티커 배지를 획득하세요!
                </p>
              </div>

              {/* Profiles Netflix Grid */}
              <div className="flex flex-wrap justify-center gap-6 pt-4 max-w-3xl mx-auto">
                {profiles.map((kid) => {
                  const avatarInfo = availableAvatars.find(a => a.id === kid.profile.avatar);
                  return (
                    <motion.div
                      key={kid.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative flex flex-col items-center w-40 p-4 border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl cursor-pointer hover:border-cyan-500/50 shadow-lg hover:shadow-[0_8px_30px_rgb(6,182,212,0.15)] transition-all duration-300"
                    >
                      {/* Avatar Shield frame */}
                      <div 
                        onClick={() => handleSelect(kid.id)}
                        className="relative w-24 h-24 rounded-full bg-slate-950 flex items-center justify-center text-5xl border-3 border-slate-700 group-hover:border-cyan-400 transition-colors shadow-[inner_0_4px_8px_rgba(0,0,0,0.8)] overflow-hidden"
                      >
                        {/* Avatar Pulsar Glow on active hover */}
                        <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-cyan-400 to-indigo-500 blur-sm -z-10 transition-opacity duration-300" />
                        {avatarInfo?.image ? (
                          <img
                            src={avatarInfo.image}
                            alt={avatarInfo.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span>{avatarInfo?.icon || '🚀'}</span>
                        )}
                        
                        {/* Profile level badge */}
                        <span className="absolute bottom-[-4px] right-[-4px] bg-cyan-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full border border-cyan-200">
                          LV.{kid.profile.level}
                        </span>
                      </div>

                      {/* Info & stats stack */}
                      <div onClick={() => handleSelect(kid.id)} className="mt-4 text-center space-y-1 w-full">
                        <div className="font-sans font-black text-slate-200 group-hover:text-cyan-300 text-sm tracking-wide truncate px-1">
                          {kid.profile.name}
                        </div>
                        
                        <div className="flex items-center justify-center gap-2.5 text-[10px] text-slate-400 font-mono pt-1">
                          <span className="flex items-center gap-0.5 text-orange-400 font-bold">
                            <Flame className="w-3 h-3 fill-orange-500/20" /> {kid.profile.streak}일 연속
                          </span>
                          <span className="text-slate-600">|</span>
                          <span className="text-cyan-400 font-bold">
                            {kid.profile.xp} XP
                          </span>
                        </div>
                      </div>

                      {/* Delete profile option inside choice selector (For Parents, or free) */}
                      {onDeleteProfile && profiles.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProfile(kid.id, kid.profile.name);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-lg bg-slate-950 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                          title="프로필 영구 삭선"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}

                {/* Create profile netflix card placeholder */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    audioEngine.playBeep(800, 0.08, 0.1);
                    setIsAddingNew(true);
                  }}
                  className="w-40 p-4 border border-dashed border-slate-800 hover:border-cyan-500/50 bg-[#0a0e1a]/40 hover:bg-[#0c1428]/60 rounded-2xl cursor-pointer flex flex-col items-center justify-center gap-3 group text-slate-400 hover:text-cyan-300 transition-all shadow-md min-h-[174px]"
                >
                  <div className="w-16 h-16 rounded-full border border-dashed border-slate-700 flex items-center justify-center bg-slate-950/60 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-colors">
                    <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="font-sans font-bold text-xs tracking-wide">
                    대원 프로필 추가
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="creator-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto bg-[#0a0f1d] border-2 border-slate-850 p-6 sm:p-8 rounded-3xl shadow-2xl relative"
            >
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  onClick={() => {
                    audioEngine.playBeep(400, 0.05, 0.05);
                    setIsAddingNew(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-850 cursor-pointer"
                >
                  돌아가기 [X]
                </button>
              </div>

              <div className="text-left space-y-1.5 border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase">
                  <UserPlus className="w-4 h-4" /> NEW HERO REGISTRY
                </div>
                <h2 className="font-sans font-bold text-xl text-slate-100">새로운 꼬마 대원 프로필 생성</h2>
                <p className="font-sans text-xs text-slate-400">자신만의 고유한 작전 닉네임과 스페이스 슈트를 장착하여 탐사선에 등록해보세요.</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-6 text-left">
                {/* 1. Name Input Box */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">1. 대원의 작전 닉네임 (멋진 이름)</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="예: 민우 히어로, 우주전사 지효 등..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-800 focus:border-cyan-500 p-3 rounded-xl font-sans text-sm text-slate-100 select-all outline-none transition-all placeholder:text-slate-600 font-bold"
                  />
                  <span className="block text-[10px] text-slate-500 font-sans mt-1">※ 한글, 영문, 숫자로 최대 10자 입력 가능합니다.</span>
                </div>

                {/* 2. Custom Character Suits Selector Row */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">2. 전용 스페이스 슈트 장착</label>
                  
                  {/* Grid of options with detailed descriptions */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {availableAvatars.map((ava) => {
                      const isSelected = selectedAvatar === ava.id;
                      return (
                        <div
                          key={ava.id}
                          onClick={() => {
                            audioEngine.playBeep(700, 0.05, 0.1);
                            setSelectedAvatar(ava.id);
                          }}
                          className={`p-3 border-2 cursor-pointer transition-all duration-300 text-center flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? `bg-gradient-to-b ${ava.bg} text-white scale-[1.02] shadow-[0_4px_15px_rgba(6,182,212,0.15)]`
                              : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          {ava.image ? (
                            <img
                              src={ava.image}
                              alt={ava.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-full object-cover border border-slate-700"
                            />
                          ) : (
                            <span className="text-3xl">{ava.icon}</span>
                          )}
                          <span className="font-sans font-bold text-[10px] text-slate-200 leading-tight">
                            {ava.name.split(' ')[0]}
                          </span>
                          <span className="text-[9px] text-slate-500 line-clamp-1">
                            {ava.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Creator Form */}
                <div className="pt-4 border-t border-slate-850 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playBeep(500, 0.05, 0.05);
                      setIsAddingNew(false);
                    }}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 font-bold text-xs font-sans transition-all cursor-pointer text-center"
                  >
                    취소하기
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold text-xs font-sans flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.3)] hover:from-cyan-500 hover:to-cyan-400 transition-all"
                  >
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                    새로운 탐사대원 대시보드 탑승
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
