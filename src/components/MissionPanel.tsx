import React from 'react';
import { Mission, MissionType } from '../types';
import { Check, Compass, Sparkles, Shield, Flame, Rocket, Notebook, BookOpen, Activity, Trophy, Smile, Moon, AlertCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioEngine } from '../AudioEngine';

interface MissionPanelProps {
  missions: Mission[];
  activeTab: MissionType;
  onActiveTabChange: (tab: MissionType) => void;
  onToggleMission: (id: string) => void;
  onClaimAllClearBonus: (type: MissionType) => void;
  claimedTabBonuses: MissionType[];
  onStartSelfie?: () => void;
}

export default function MissionPanel({
  missions,
  activeTab,
  onActiveTabChange,
  onToggleMission,
  onClaimAllClearBonus,
  claimedTabBonuses,
  onStartSelfie,
}: MissionPanelProps) {
  
  const handleTabChange = (tab: MissionType) => {
    audioEngine.playPowerIgnition();
    onActiveTabChange(tab);
  };

  const currentMissions = missions.filter((m) => m.type === 'morning');
  const totalCount = currentMissions.length;
  const completedCount = currentMissions.filter((m) => m.completed).length;
  const isAllClear = totalCount > 0 && completedCount === totalCount;
  const hasClaimed = claimedTabBonuses.includes('morning');

  // Dynamic Lucide helper to map static string to actual react component
  const renderMissionIcon = (name: string, isCompleted: boolean) => {
    const iconClass = `w-5 h-5 transition-transform duration-300 ${
      isCompleted 
        ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.7)]' 
        : 'text-slate-400 group-hover:scale-110'
    }`;

    switch (name) {
      case 'Compass': return <Compass className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Shield': return <Shield className={iconClass} />;
      case 'Flame': return <Flame className={iconClass} />;
      case 'Rocket': return <Rocket className={iconClass} />;
      case 'Notebook': return <Notebook className={iconClass} />;
      case 'BookOpen': return <BookOpen className={iconClass} />;
      case 'Activity': return <Activity className={iconClass} />;
      case 'Trophy': return <Trophy className={iconClass} />;
      case 'Smile': return <Smile className={iconClass} />;
      case 'Moon': return <Moon className={iconClass} />;
      default: return <Compass className={iconClass} />;
    }
  };

  const getTabLabel = (type: MissionType) => {
    return '⚡ TRAINING MISSION';
  };

  const getTabColors = (type: MissionType, isActive: boolean) => {
    return 'border-cyan-400 text-cyan-300 bg-gradient-to-b from-[#0e2a35] to-[#0d1c25]';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-4 border-slate-700/60 bg-gradient-to-br from-slate-900 via-[#1f2631] to-[#141820] shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_10px_25px_rgba(0,0,0,0.5)] p-4 sm:p-6">
      
      {/* Milled Plate Grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
      
      {/* 4 Corner tech screws */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 rotate-45" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 -rotate-12" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 -rotate-45" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 rotate-12" />
      </div>

      {/* TRAINING MISSION Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
        <h3 className="font-sans font-black text-sm text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          ⚡ TRAINING MISSION
        </h3>
        <span className="font-mono text-xs text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-850">
          {completedCount} / {totalCount} CLEAR
        </span>
      </div>

      {/* Progress HUD bar for current open Tab */}
      <div className="bg-slate-950/65 rounded-xl p-3 border border-slate-800/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-mono text-slate-400 space-y-0.5 w-full sm:w-auto">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">수행도 보고서</div>
          <div className="text-slate-200">
            현재 스테이지 명세: <span className="text-cyan-400 font-semibold">{completedCount}</span> / {totalCount} 완료
          </div>
        </div>

        {/* Level bar */}
        <div className="w-full sm:w-44 h-2.5 rounded bg-slate-900 border border-slate-800 p-0.5 overflow-hidden">
          <div 
            className="h-full rounded bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500 filter drop-shadow-[0_0_2pxs_rgba(34,211,238,0.5)]"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Habits List Panel */}
      <div className="space-y-3.5">
        {currentMissions.map((mission) => (
          <button
            key={mission.id}
            onClick={() => {
              audioEngine.playClank();
              onToggleMission(mission.id);
            }}
            id={`toggle-habit-${mission.id}`}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group flex items-start gap-4 shadow-sm relative ${
              mission.completed
                ? 'bg-gradient-to-r from-[#17272c]/50 to-[#0e1620]/30 border-cyan-500/50 hover:border-cyan-400/70 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]'
                : 'bg-gradient-to-r from-slate-900 via-[#19202a] to-[#12161f] border-slate-800 hover:border-slate-700/60 shadow-[0_4px_6px_rgba(0,0,0,0.15)]'
            }`}
          >
            {/* Custom glowing bracket left border for checked items */}
            {mission.completed && (
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-400 rounded-l" />
            )}

            {/* Futuristic cyber checkbox box element */}
            <div className="pt-0.5">
              <div className={`w-6 h-6 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                mission.completed 
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' 
                  : 'border-slate-700 group-hover:border-slate-500 bg-slate-950/80'
              }`}>
                {mission.completed && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Habit Information & title */}
            <div className="flex-1 min-w-0">
              <p className={`font-sans font-bold text-xs sm:text-sm tracking-wide leading-relaxed transition-all duration-300 break-words ${
                mission.completed 
                  ? 'text-slate-400 line-through decoration-slate-600/70' 
                  : 'text-slate-100'
              }`}>
                {mission.title}
              </p>
              
              <div className="flex items-center gap-1.5 mt-1.5">
                {/* Visual Category Label */}
                <div className="p-0.5 rounded-md bg-slate-950/60 border border-slate-800 inline-flex items-center justify-center">
                  {renderMissionIcon(mission.iconName, mission.completed)}
                </div>
                
                {/* Reward Point Tag */}
                <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  mission.completed 
                    ? 'bg-slate-950/40 text-slate-500 border border-slate-900' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-950/40'
                }`}>
                  +{mission.xpReward} XP
                </span>
              </div>
            </div>

          </button>
        ))}

        {currentMissions.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/30">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-mono text-xs text-slate-500">지정된 퀘스트 카드가 존재하지 않습니다.</p>
            <p className="font-mono text-[10px] text-slate-600 mt-1">학부모 제어판에서 새로운 퀘스트 칩을 장착해주세요!</p>
          </div>
        )}
      </div>

      {/* Bonus Celebration Action Layer for completing all missions */}
      <AnimatePresence>
        {isAllClear && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6 p-5 sm:p-6 rounded-xl border-2 border-dashed border-cyan-400 bg-cyan-950/20 text-center relative overflow-hidden"
          >
            {/* Sparkles visual */}
            <div className="absolute top-2 left-2 animate-ping text-cyan-300 w-4 h-4 opacity-70">✦</div>
            <div className="absolute bottom-2 right-2 animate-ping text-cyan-300 w-4 h-4 delay-75 opacity-70">✦</div>

            <h4 className="font-sans font-black text-sm uppercase text-cyan-400 tracking-widest flex items-center justify-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 animate-spin-slow" /> STAGE ALL CLEAR!! <span className="animate-pulse">🏆</span>
            </h4>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              모든 전술 일과 전송이 완료되었습니다! 아래 버튼을 눌러 오늘 하루의 은하계 인증샷을 남겨 캘린더에 저장하고, 추가 에너지를 회수하세요!
            </p>

            {onStartSelfie && (
              <button
                onClick={() => {
                  audioEngine.playPowerIgnition();
                  onStartSelfie();
                }}
                id="take-hero-selfie-today"
                className="mt-3 cursor-pointer py-2.5 px-6 rounded-xl text-white font-sans font-black text-xs tracking-wider bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 border border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_22px_rgba(244,63,94,0.5)] transition-all transform hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 mx-auto"
              >
                <Camera className="w-4 h-4 text-white animate-pulse" />
                📸 오늘의 히어로 인증샷 찍기 (은하 캘린더 자동등록)
              </button>
            )}

            {hasClaimed ? (
              <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                보너스 50XP 획득 완료!
              </div>
            ) : (
              <button
                onClick={() => {
                  audioEngine.playLaserUnlock();
                  onClaimAllClearBonus(activeTab);
                }}
                id={`claim-bonus-${activeTab}`}
                className="mt-4 cursor-pointer px-6 py-2 rounded-xl text-white font-sans font-extrabold text-xs tracking-wider bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 border border-cyan-300/60 shadow-[0_4px_12px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
              >
                올 클리어 보너스 에너지 수령 (+50 XP)
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
