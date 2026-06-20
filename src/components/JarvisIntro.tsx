/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeatherData } from '../utils/weather';
import { audioEngine } from '../AudioEngine';
import { 
  Shield, Zap, Terminal, Cpu, CloudRain, Sun, 
  Sparkles, Fingerprint, RefreshCw, Layers 
} from 'lucide-react';

// @ts-ignore
import jarvisHudImage from '../assets/images/jarvis_hud_overlay_1781921897783.jpg';

interface JarvisIntroProps {
  weather: WeatherData | null;
  onEnter: () => void;
}

export default function JarvisIntro({ weather, onEnter }: JarvisIntroProps) {
  const [bootStep, setBootStep] = useState<number>(0);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);

  const telemetryLogs = [
    '⚡ INTRODUCING J.A.R.V.I.S ON-BOARD CORE v9.2...',
    '⚙️ CALIBRATING COGNITIVE HYPER-ENGINE MODULES...',
    '👁️ HOVER DETECTOR AT 50%... 100% SUCCESS',
    '🧪 BIOMETRIC RECOGNITION INTERFACE RE-ROUTING...',
    '🛰️ CONNECTING TO GLOBAL SPACE WEATHER SENSOR BLOCK...'
  ];

  // Slow typing log emulator
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < telemetryLogs.length) {
        setTypedLogs(prev => [...prev, telemetryLogs[index]]);
        audioEngine.playBeep(900 + index * 100, 0.05, 0.05);
        index++;
      } else {
        clearInterval(interval);
        setBootStep(1); // Set boot step to ready for scan
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Biometric Scan Execution
  const triggerBiometricScan = () => {
    if (isScanning || scanComplete) return;
    setIsScanning(true);
    audioEngine.playBeep(1100, 0.2, 0.1);

    // Dynamic scanning sweep sound ticks
    const tickRef = setInterval(() => {
      audioEngine.playBeep(1400, 0.04, 0.06);
    }, 300);

    setTimeout(() => {
      clearInterval(tickRef);
      setIsScanning(false);
      setScanComplete(true);
      setBootStep(2); // Set boot status to authorized briefing
      audioEngine.playLaserUnlock();
    }, 2400);
  };

  // Skip custom intro
  const skipIntro = () => {
    audioEngine.playPowerIgnition();
    onEnter();
  };

  // Custom J.A.R.V.I.S vocalized style message based on weather conditions
  const getJarvisBriefing = () => {
    if (!weather) {
      return '연결 감지 오류: 외부 은하 센서 동기화 지연 중. 하지만 오늘 히어로의 일과 미션은 뜨거운 각오로 가득합니다! 바로 출격하세요!';
    }

    const { temp, isRaining, description, customTip } = weather;
    if (isRaining) {
      return `[기상 특별 작전 브리핑] 현재 기지 밖 날씨는 ${temp}°C 이며 ${description} 상태입니다. 오늘은 비가 오니 우산을 꼭 챙겨야해 우산 챙기기 미션! ☔ 수트가 빗물에 젖지 않도록 외출 체크리스트에 특별 방습 기능을 가동해 우산을 비치해두었습니다.`;
    } else if (description.includes('눈')) {
      return `[기상 특별 작전 브리핑] 외부 기온 ${temp}°C, 고도 적설이 예견된 ${description} 상태입니다. ❄️ 미끄러질 우려가 있으니 수트에 마찰 부스터 패드를 충전하고, 두터운 귀마개와 벙어리장갑 장비 장착 미션을 잊지 마세요!`;
    } else {
      return `[기상 일반 브리핑] 기지 부근 기온 ${temp}°C, 아주 완벽하고 청명한 ${description} 날씨입니다. ☀️ 태양열 에너지 코어가 100% 충전되었습니다. 상쾌하게 아침 세수를 완료하고 활력 가득 찬 작전을 시작하세요!`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 font-mono select-none overflow-hidden">
      
      {/* Sci-fi Scanlines filter HUD layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,24,38,0.2)_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] z-50" />
      <div className="absolute inset-0 bg-radial-gradient(inset_center,rgba(6,182,212,0.15),rgba(2,6,23,1)) pointer-events-none" />

      {/* Futuristic Background Suit POV Helmet Image */}
      <div className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none">
        <img 
          src={jarvisHudImage} 
          alt="Advanced Helmet POV HUD" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/40 backdrop-blur-md rounded-3xl border-3 border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col justify-between min-h-[500px]">
        {/* Helmet Top Header bar */}
        <div className="flex items-center justify-between border-b border-cyan-900/40 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">
              J.A.R.V.I.S INTERNAL HELMET HUD SYSTEM v9.2
            </span>
          </div>
          <button 
            onClick={skipIntro}
            className="text-[10px] px-2.5 py-1 rounded bg-slate-950 border border-cyan-800/40 text-cyan-500 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            SKIP HELMET POVs [X]
          </button>
        </div>

        {/* Central HUD screen content stack */}
        <div className="flex-1 flex flex-col justify-center space-y-6 py-4">
          
          <AnimatePresence mode="wait">
            {bootStep === 0 && (
              <motion.div 
                key="telemetry-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-cyan-900/20 text-[11px] text-cyan-300 leading-relaxed font-mono min-h-[140px]"
              >
                <div className="text-xs font-bold text-cyan-400 mb-1.5 flex items-center gap-1.5 border-b border-cyan-900/30 pb-1.5 text-center">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  JARVIS AI DIAGNOSTIC BOOT SEQ IN PROGRESS...
                </div>
                {typedLogs.map((log, i) => (
                  <div key={i} className="animate-fade-in pl-1.5 border-l-2 border-cyan-500">
                    {log}
                  </div>
                ))}
                <div className="text-cyan-400/60 animate-pulse text-[10px] pt-1">
                  &gt; RE-ACTIVATING INTRA-NET HELMET CONSOLE...
                </div>
              </motion.div>
            )}

            {bootStep === 1 && (
              <motion.div 
                key="biometric-trigger"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-5"
              >
                <div className="space-y-2">
                  <div className="inline-flex gap-1.5 items-center bg-cyan-950/40 border border-cyan-800/60 rounded-full py-1 px-3 text-[10px] text-cyan-400 font-semibold tracking-wide uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    AUTHORIZATION REQUIRED
                  </div>
                  <h1 className="font-sans font-black text-2xl text-slate-100 tracking-tight leading-normal">
                    안녕하세요 슈퍼히어로 트레이닝 센터에 오신걸 환영합니다
                  </h1>
                  <p className="text-slate-400 text-xs font-sans max-w-md mx-auto">
                    체크리스트 명령 수트와 교신하고, 안전 장갑 압력을 동기화하기위해 생체 스캔 로그라이터를 인가해주세요.
                  </p>
                </div>

                {/* Scannable Fingerprint core */}
                <div className="flex justify-center">
                  <button
                    onClick={triggerBiometricScan}
                    className={`relative w-28 h-28 rounded-full border-3 flex flex-col items-center justify-center gap-1 transition-all ${
                      isScanning 
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(34,211,238,0.4)] animate-pulse' 
                        : 'border-slate-700 bg-slate-950 hover:border-cyan-500/50 hover:bg-cyan-950/20 shadow-[inner_0_4px_10px_rgba(0,0,0,0.8)]'
                    } cursor-pointer group`}
                  >
                    {isScanning && (
                      <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400 animate-spin" />
                    )}
                    <Fingerprint className={`w-10 h-10 ${isScanning ? 'text-cyan-400 animate-bounce' : 'text-slate-500 group-hover:text-cyan-400'} transition-colors`} />
                    <span className="text-[9px] text-slate-400 font-bold tracking-widest">
                      {isScanning ? '지문 심사 중' : '생체 인식 [터치]'}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {bootStep === 2 && (
              <motion.div 
                key="briefing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="inline-flex gap-1 items-center bg-emerald-950/40 border border-emerald-800/60 rounded-full py-1 px-3 text-[10px] text-emerald-400 font-black tracking-wide uppercase mb-2">
                    ✓ ACCESS PERMISSION GRANTED
                  </div>
                  <h2 className="font-sans font-black text-xl text-slate-100 tracking-tight leading-normal">
                    J.A.R.V.I.S 음성 비서 브리핑 완료
                  </h2>
                </div>

                {/* Tactical Briefing Box */}
                <div className="bg-[#0b132b]/80 border-2 border-cyan-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                  {/* Decorative corner grid marks */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-cyan-500/15 border border-cyan-400/30 rounded-xl text-cyan-400 shrink-0">
                      {weather?.isRaining ? (
                        <CloudRain className="w-6 h-6 animate-bounce" />
                      ) : (
                        <Sun className="w-6 h-6 animate-spin-slow" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] text-cyan-400 font-bold tracking-wider font-sans uppercase">
                        🛰️ 지구 기상 탐지국 [{weather ? weather.locationName : '서울 기지'}]
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans text-justify">
                        {getJarvisBriefing()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Digital atmospheric attributes */}
                  <div className="mt-4 pt-3.5 border-t border-cyan-900/30 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
                    <div>
                      <span className="block text-slate-500">기온 (TEMP)</span>
                      <span className="font-bold text-slate-200 text-xs">{weather ? `${weather.temp}°C` : '20°C'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">대기질 (AQI)</span>
                      <span className="font-bold text-emerald-400 text-xs">최적 (GOOD)</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">수트 충전 (CHARGE)</span>
                      <span className="font-bold text-cyan-400 text-xs">100% ONLINE</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Loading Trigger button */}
                <button
                  onClick={skipIntro}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-sans font-black tracking-wider text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-[1.02] transform transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  전체 슈트 잠금 해제 및 탑승 (LAUNCH SYSTEM)
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Diagnostic footer specs lines */}
        <div className="border-t border-cyan-900/40 pt-3 text-[9px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-1">
          <span>SECURE PROTOCOL INTERLOCKS: ARMORED_CORES [STABLE]</span>
          <span className="hidden sm:inline">|</span>
          <span>SYSTEM CHASSIS: EXTREME_LEVEL_V2.0</span>
        </div>

      </div>
    </div>
  );
}
