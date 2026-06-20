import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Camera, X, Award, Trash2 } from 'lucide-react';
import { SelfieSnap } from '../types';
import { audioEngine } from '../AudioEngine';

interface HeroCalendarProps {
  selfieSnaps: SelfieSnap[];
  onDeleteSnap?: (id: string) => void;
}

export default function HeroCalendar({ selfieSnaps, onDeleteSnap }: HeroCalendarProps) {
  const now = new Date();
  
  // Set current view focus (default to June 2026 or real current year/month)
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth()); // 0-indexed (0 is Jan, 5 is June)
  const [selectedSnap, setSelectedSnap] = useState<SelfieSnap | null>(null);

  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const MONTHS_KO = [
    '1월 (January)', '2월 (February)', '3월 (March)', '4월 (April)', 
    '5월 (May)', '6월 (June)', '7월 (July)', '8월 (August)', 
    '9월 (September)', '10월 (October)', '11월 (November)', '12월 (December)'
  ];

  const handlePrevMonth = () => {
    audioEngine.playPowerIgnition();
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    audioEngine.playPowerIgnition();
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Days layout computations
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create empty offset arrays
  const blanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const totalCells = [...blanks, ...days];

  const doubleDigit = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div className="relative overflow-hidden rounded-2xl border-4 border-slate-700 bg-gradient-to-br from-slate-900 via-[#1e2330] to-[#12151e] shadow-lg p-5 sm:p-6 font-sans text-slate-200">
      {/* Decorative milled lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
      
      {/* Corner screws */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-800" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-800" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-800" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-800" />

      {/* Header Month Swapper */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="font-sans font-black text-sm text-slate-100 tracking-wider">
            📅 앱 로그인 히어로 완수 인증 캘린더 (Selfie Log Calendar)
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 px-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-100 rounded cursor-pointer transition.all"
            title="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="font-mono text-xs text-cyan-400 font-bold px-3 py-1 bg-slate-950 border border-slate-850 rounded">
            {currentYear}년 {MONTHS_KO[currentMonth]}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-1 px-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-100 rounded cursor-pointer transition.all"
            title="다음 달"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mb-4 font-sans leading-relaxed">
        아침 퀘스트를 완료하고 촬영한 셀카가 날짜별 기록보관소에 박제되어 저장되어 있습니다. 각 배지 아이콘을 클릭하여 추억 홀로그램을 전송하세요!
      </p>

      {/* Calendar Grid Chassis */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
        {/* Days Header */}
        {WEEKDAYS.map((day, idx) => (
          <div 
            key={idx} 
            className={`py-1.5 font-bold font-sans ${
              idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            {day}
          </div>
        ))}

        {/* Days Content Cells */}
        {totalCells.map((cellDay, idx) => {
          if (cellDay === null) {
            return <div key={`empty-${idx}`} className="aspect-square bg-slate-950/10 rounded-lg" />;
          }

          // Format check Date string 'YYYY-MM-DD'
          const dateStr = `${currentYear}-${doubleDigit(currentMonth + 1)}-${doubleDigit(cellDay)}`;
          const daySnaps = selfieSnaps.filter((s) => s.date === dateStr);
          const hasSnap = daySnaps.length > 0;

          const isToday = cellDay === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();

          return (
            <div
              key={`day-${cellDay}`}
              className={`aspect-square p-1 rounded-xl flex flex-col justify-between relative transition-all border group ${
                isToday
                  ? 'bg-slate-950/50 border-cyan-400 shadow-[inset_0_0_8px_rgba(34,211,238,0.2)]'
                  : 'bg-slate-950/20 border-slate-850/80 hover:bg-slate-900/30 hover:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black font-mono leading-none ${
                  isToday 
                    ? 'text-cyan-400 font-extrabold font-sans scale-105' 
                    : (idx % 7 === 0) ? 'text-red-600/80' : (idx % 7 === 6) ? 'text-blue-500/80' : 'text-slate-500'
                }`}>
                  {cellDay}
                </span>

                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="오늘" />
                )}
              </div>

              {/* Display glowing indicator if captured snap exists */}
              {hasSnap ? (
                <button
                  onClick={() => {
                    audioEngine.playLaserUnlock();
                    setSelectedSnap(daySnaps[0]); // Select first snapshot taken on that day
                  }}
                  id={`view-selfie-${dateStr}`}
                  className="w-full h-[65%] mt-1 cursor-pointer overflow-hidden rounded-lg border-2 border-rose-500/50 hover:border-rose-400 relative flex items-center justify-center bg-rose-950/30 transition-all hover:scale-105 shadow-[0_0_10px_rgba(244,63,94,0.15)] group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  title={`${daySnaps.length}개의 인증 메모리가 있습니다. 클릭하여 원격 뷰어 실행`}
                >
                  <img
                    src={daySnaps[0].image}
                    alt="Selfie miniature"
                    className="w-full h-full object-cover rounded filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-rose-500/10 pointer-events-none group-hover:bg-transparent" />
                  <div className="absolute bottom-0 right-0 p-0.5 bg-rose-600 rounded-tl">
                    <Camera className="w-[8px] h-[8px] text-white" />
                  </div>
                </button>
              ) : (
                <div className="h-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Pop up view of hologram snaps date details details */}
      <AnimatePresence>
        {selectedSnap && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-lg bg-gradient-to-b from-[#181125] to-[#040209] rounded-3xl border-3 border-rose-500/40 p-5 shadow-[0_0_40px_rgba(244,63,94,0.3)] relative font-sans text-slate-200"
            >
              {/* Close handles */}
              <button
                onClick={() => {
                  audioEngine.playBeep(450, 0.08, 0.08);
                  setSelectedSnap(null);
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:bg-slate-900 transition"
                title="확인 후 닫기"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-rose-500 animate-pulse" />
                <div>
                  <h4 className="font-sans font-black text-xs text-rose-400 tracking-wider">
                    🛰️ 은하 인증샷 홀로그램 복원 전송
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    전송 일자: {selectedSnap.date} {selectedSnap.time}
                  </p>
                </div>
              </div>

              {/* Holographic display shield */}
              <div className="relative rounded-2xl border-2 border-rose-500/25 overflow-hidden shadow-inner aspect-[4/3] bg-purple-950/20 mb-4 flex items-center justify-center">
                <img
                  src={selectedSnap.image}
                  alt="Holographic memory frame"
                  className="w-full h-full object-cover"
                />
                
                {/* Visual filter badge name tag */}
                <div className="absolute top-3 left-3 bg-slate-950/80 border border-rose-500/30 px-2.5 py-1 rounded text-[9px] font-mono font-bold text-rose-400 flex items-center gap-1">
                  FILTER: {selectedSnap.filter?.toUpperCase() || 'NONE'}
                </div>
              </div>

              {/* Memo textbox container */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 relative">
                <span className="text-[8px] font-mono text-slate-500 absolute top-1 right-2 uppercase">아이 한마디</span>
                <p className="text-xs text-slate-200 mt-1 font-sans font-extrabold leading-relaxed text-center italic">
                  "{selectedSnap.comment || '보내온 소감이 기록되지 않았습니다.'}"
                </p>
              </div>

              {/* Parent delete snaps if needed */}
              <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
                {onDeleteSnap && (
                  <button
                    onClick={() => {
                      if (window.confirm('정말로 이 날짜의 소중한 등교 인증샷을 기기 캘린더 메모리에서 영구히 삭제할까요?')) {
                        audioEngine.playBeep(300, 0.15, 0.1);
                        onDeleteSnap(selectedSnap.id);
                        setSelectedSnap(null);
                      }
                    }}
                    className="p-2 bg-slate-950 hover:bg-red-950/15 text-slate-500 hover:text-red-400 border border-slate-850 hover:border-red-500/20 rounded-lg cursor-pointer transition flex items-center gap-1.5 text-[10px] font-bold"
                    title="인증샷 파일 영구 지우기"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    인증샷 삭제
                  </button>
                )}

                <button
                  onClick={() => {
                    audioEngine.playBeep(450, 0.08, 0.08);
                    setSelectedSnap(null);
                  }}
                  className="ml-auto py-2 px-5 bg-rose-600 hover:bg-rose-500 text-white font-sans font-extrabold text-[11px] rounded-lg cursor-pointer transition transform active:scale-95"
                >
                  홀로그램 닫기
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
