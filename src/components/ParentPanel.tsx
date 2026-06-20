import React, { useState } from 'react';
import { Mission, MissionType } from '../types';
import { 
  ShieldAlert, Plus, Trash2, RotateCcw, Check, Sparkles, BookOpen, Clock, Flame,
  CloudRain, Sun, CloudSnow, Globe
} from 'lucide-react';
import { audioEngine } from '../AudioEngine';
import PasscodeGate from './PasscodeGate';

interface ParentPanelProps {
  missions: Mission[];
  onAddMission: (title: string, type: MissionType, xpReward: number, iconName: string) => void;
  onDeleteMission: (id: string) => void;
  onResetToDefaults: () => void;
  simulatedWeather: 'live' | 'sunny' | 'rainy' | 'snowy';
  onChangeSimulatedWeather: (type: 'live' | 'sunny' | 'rainy' | 'snowy') => void;
}

export default function ParentPanel({
  missions,
  onAddMission,
  onDeleteMission,
  onResetToDefaults,
  simulatedWeather,
  onChangeSimulatedWeather,
}: ParentPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MissionType>('morning');
  const [newXp, setNewXp] = useState<number>(15);
  const [newIcon, setNewIcon] = useState<string>('Compass');

  // Passcode security states
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateCallback, setGateCallback] = useState<(() => void) | null>(null);
  const [gateTitle, setGateTitle] = useState('학부모 전용 인증');
  const [gateDesc, setGateDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    audioEngine.playBeep(900, 0.1, 0.15);
    onAddMission(newTitle.trim(), newType, newXp, newIcon);
    setNewTitle('');
  };

  const handleDelete = (id: string) => {
    setGateTitle('🗑️ 특수 미션 삭제 인증');
    setGateDesc('미션을 활성 리스트에서 영구 제거하기 위해 학부모 4자리 비밀번호를 입력해주세요.');
    setGateCallback(() => () => {
      audioEngine.playBeep(400, 0.12, 0.1);
      onDeleteMission(id);
    });
    setIsGateOpen(true);
  };

  const handleReset = () => {
    setGateTitle('🔄 공장 초기 기본값 리셋');
    setGateDesc('모든 등록된 퀘스트를 지우고 순수 기초 수치로 팩토리 리필하기 위해 비밀번호를 입력해주세요.');
    setGateCallback(() => () => {
      if (window.confirm('모든 미션 목록을 기본 고유 목록으로 리셋하시겠습니까? (이전 추가 미션은 삭제됩니다)')) {
        audioEngine.playLaserUnlock();
        onResetToDefaults();
      }
    });
    setIsGateOpen(true);
  };

  const togglePanel = () => {
    if (isOpen) {
      audioEngine.playBeep(500, 0.08, 0.08);
      setIsOpen(false);
    } else {
      setGateTitle('🔑 학부모 관리 콘솔 진입');
      setGateDesc('보안 설정을 수정하고 특수 맞춤형 미션을 장착하기 위해 4자리 암호를 입력해주세요.');
      setGateCallback(() => () => {
        setIsOpen(true);
      });
      setIsGateOpen(true);
    }
  };

  const iconOptions = [
    { name: 'Compass', label: '🧭 방향성' },
    { name: 'Sparkles', label: '🦷 보글청결' },
    { name: 'Shield', label: '👕 자진의복' },
    { name: 'Flame', label: '🥘 튼튼식품' },
    { name: 'Rocket', label: '🎒 가방출격' },
    { name: 'Notebook', label: '✍️ 지식습득' },
    { name: 'BookOpen', label: '📚 무한도서' },
    { name: 'Activity', label: '🥋 체력연마' },
    { name: 'Smile', label: '📖 사랑소통' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border-4 border-slate-700/60 bg-gradient-to-br from-slate-900 via-[#1d232c] to-[#12161b] shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_10px_25px_rgba(0,0,0,0.5)] p-6 z-10">
      
      {/* 4 Corner Screws */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 rotate-90" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 rotate-0" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 -rotate-45" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[8px] h-[1.5px] bg-slate-800 rotate-45" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
          <h3 className="font-sans font-bold text-slate-200 tracking-wide">
            🛠️ 학부모 커맨더 모니터링 <span className="text-slate-500 text-xs font-mono">PARENTS HUB</span>
          </h3>
        </div>
        
        <button
          onClick={togglePanel}
          id="toggle-parents-panel"
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wider transition-all cursor-pointer ${
            isOpen 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' 
              : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          {isOpen ? 'CLOSE CONSOLE' : 'OPEN CONSOLE [ADMIN]'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 border-t border-slate-800/80 pt-6 space-y-6">
          
          {/* Form to Add New Habit */}
          <div>
            <h4 className="font-sans font-semibold text-sm text-slate-300 mb-3 flex items-center gap-1.5">
              🚀 특수 개별 퀘스트 설계기
            </h4>
            
            <form onSubmit={handleAdd} className="space-y-4 bg-slate-950/50 rounded-xl p-4 border border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                
                {/* Task Title Input */}
                <div className="md:col-span-6">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">퀘스트 미션 명칭 (제목)</label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg py-2 px-3 text-sm text-slate-100 placeholder-slate-600 font-sans focus:outline-none focus:border-cyan-500/50"
                    placeholder="예: 📚 수학 학습지 2페이지 정독 후 풀이"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                {/* Task Category selection */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">수행 시점</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg py-2 px-2.5 text-sm text-slate-100 font-sans focus:outline-none"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MissionType)}
                  >
                    <option value="morning">⚡ 트레이닝 미션</option>
                  </select>
                </div>

                {/* Point weight */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">클리어 보상</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg py-2 px-2.5 text-sm text-amber-400 font-mono font-bold focus:outline-none"
                    value={newXp}
                    onChange={(e) => setNewXp(Number(e.target.value))}
                  >
                    <option value={10}>+10 XP (기본)</option>
                    <option value={15}>+15 XP (보통)</option>
                    <option value={20}>+20 XP (대형)</option>
                    <option value={30}>+30 XP (초거대)</option>
                  </select>
                </div>

              </div>

              {/* Icon Match Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <div className="w-full">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">정비 도구 (아이콘)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {iconOptions.map((opt) => (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => {
                          audioEngine.playBeep(1000, 0.04, 0.05);
                          setNewIcon(opt.name);
                        }}
                        className={`px-2 py-1 text-xs rounded border cursor-pointer transition-all ${
                          newIcon === opt.name
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  id="add-custom-mission"
                  className="w-full sm:w-auto h-10 px-6 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-[0_4px_12px_rgba(245,158,11,0.25)] flex items-center justify-center gap-1.5 shrink-0 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                  보드에 탑재
                </button>
              </div>

            </form>
          </div>

          {/* Active Mission Registry for Editing / Deletion */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="font-sans font-semibold text-sm text-slate-300 flex items-center gap-1.5">
                📁 실시간 활성 퀘스트 등록 레코드 ({missions.length}개)
              </h4>
              <button
                onClick={handleReset}
                id="reset-to-defaults"
                className="text-[10px] bg-slate-950 text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-950/40 font-mono transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                FACTORY RESET
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto bg-slate-950/30 rounded-xl border border-slate-800/80 p-2.5 space-y-2">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-center justify-between p-2.5 bg-[#12161f]/70 border border-slate-800 hover:border-slate-700/80 rounded-lg transition-all"
                >
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400">
                      TRAINING
                    </span>
                    <span className="text-xs text-slate-200 truncate font-sans">{mission.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-500 pr-1">+{mission.xpReward}xp</span>
                    <button
                      onClick={() => handleDelete(mission.id)}
                      id={`delete-mission-${mission.id}`}
                      className="p-1 px-2 text-xs rounded bg-slate-900 border border-slate-800 text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-colors cursor-pointer"
                      title="이 미션 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {missions.length === 0 && (
                <div className="text-center py-8 text-slate-600 font-mono text-xs">
                  NO ACTIVE MISSION REGISTRY.
                </div>
              )}
            </div>
          </div>

          {/* Weather Simulation Coils */}
          <div className="space-y-3 bg-[#131924]/60 border border-slate-800 rounded-xl p-4">
            <h4 className="font-sans font-bold text-xs text-slate-200 flex items-center gap-1.5 uppercase">
              🌍 지구 가상 기상 통제 코일 (Weather Simulation Coils)
            </h4>
            <p className="text-[10px] text-slate-400 font-sans leading-normal">
              이 가상 환경 조정판을 사용하면 기상의 비/눈/맑음을 인위적으로 인가할 수 있습니다. 각 기상 등급 상태에 맞춰 자비스 브리핑, wakeup 오디오 경고, 우산 챙기기 가상 미션 하달을 즉각적으로 검증할 수 있습니다.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  audioEngine.playBeep(800, 0.05, 0.08);
                  onChangeSimulatedWeather('live');
                }}
                className={`py-2 px-2.5 rounded-lg border text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  simulatedWeather === 'live'
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.15)] font-black'
                    : 'bg-slate-900 border-[#1e293b] text-slate-500 hover:text-slate-300'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                라이브 날씨 (Live API)
              </button>

              <button
                type="button"
                onClick={() => {
                  audioEngine.playBeep(800, 0.05, 0.08);
                  onChangeSimulatedWeather('sunny');
                }}
                className={`py-2 px-2.5 rounded-lg border text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  simulatedWeather === 'sunny'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.15)] font-black'
                    : 'bg-slate-900 border-[#1e293b] text-slate-500 hover:text-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                맑음 강제 통제 ☀️
              </button>

              <button
                type="button"
                onClick={() => {
                  audioEngine.playBeep(800, 0.05, 0.08);
                  onChangeSimulatedWeather('rainy');
                }}
                className={`py-2 px-2.5 rounded-lg border text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  simulatedWeather === 'rainy'
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.15)] font-black'
                    : 'bg-slate-900 border-[#1e293b] text-slate-500 hover:text-slate-300'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                비옴 강제 통제 ☔
              </button>

              <button
                type="button"
                onClick={() => {
                  audioEngine.playBeep(800, 0.05, 0.08);
                  onChangeSimulatedWeather('snowy');
                }}
                className={`py-2 px-2.5 rounded-lg border text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  simulatedWeather === 'snowy'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.15)] font-black'
                    : 'bg-slate-900 border-[#1e293b] text-slate-500 hover:text-slate-300'
                }`}
              >
                <CloudSnow className="w-3.5 h-3.5" />
                눈옴 강제 통제 ❄️
              </button>
            </div>
          </div>

          {/* Quick instructions for parents */}
          <div className="bg-[#10141d] rounded-xl p-4 border border-slate-800/70 text-slate-400 text-xs leading-relaxed space-y-1">
            <p className="font-semibold text-slate-300">💡 학부모 가이드라인:</p>
            <p>1. 아이가 아침 세수나 옷 입기를 완료하면 스스로 체크하여 가상 XP를 획득하게 교육해주세요.</p>
            <p>2. 과도한 XP 남용을 줄이고 건강한 보상이 매치되도록 퀘스트 XP를 10~30 사이로 알맞게 유지해주세요.</p>
            <p>3. 연속 3일, 연속 5일 완료 시 우주선 배지가 자동 해제되어 아이의 소장 욕구를 자극합니다!</p>
          </div>

        </div>
      )}

      {/* Passcode Security Gate System */}
      <PasscodeGate
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        onSuccess={() => {
          if (gateCallback) gateCallback();
          setGateCallback(null);
        }}
        title={gateTitle}
        description={gateDesc}
      />

    </div>
  );
}
