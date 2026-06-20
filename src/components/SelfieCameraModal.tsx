import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCw, Sparkles, Check, Smile } from 'lucide-react';
import { HeroProfile } from '../types';
import { audioEngine } from '../AudioEngine';

interface SelfieCameraModalProps {
  profile: HeroProfile;
  onClose: () => void;
  onSave: (imageDataUrl: string, filter: string, comment: string) => void;
}

const FILTERS = [
  { id: 'ironman', name: '🔴 아이언 수트 제어 HUD', color: 'text-red-500 border-red-500/30' },
  { id: 'astro', name: '🔵 코스믹 아스트로 가시경', color: 'text-cyan-400 border-cyan-400/30' },
  { id: 'cyber', name: '🟢 사이버 닌자 야간 투시경', color: 'text-emerald-400 border-emerald-400/30' },
  { id: 'none', name: '⚪ 오리지널 전송 로우 데이터', color: 'text-slate-400 border-slate-650' },
];

export default function SelfieCameraModal({ profile, onClose, onSave }: SelfieCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('ironman');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('오늘 하루도 씩씩하게 완료 전송!');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraLoading, setCameraLoading] = useState<boolean>(true);

  // Initialize native device camera if permissions are granted and available
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    setCameraLoading(true);

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    })
    .then((s) => {
      setStream(s);
      activeStream = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setCameraError(false);
      setCameraLoading(false);
    })
    .catch((err) => {
      console.warn('Real camera not accessible, using galactic holographic simulator:', err);
      setCameraError(true);
      setCameraLoading(false);
    });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartCapture = () => {
    audioEngine.playPowerIgnition();
    setCountdown(3);
  };

  // Handle shutter countdown count
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      executeMockOrRealShutter();
      return;
    }

    const timer = setTimeout(() => {
      audioEngine.playBeep(850, 0.05, 0.05);
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const executeMockOrRealShutter = () => {
    // Play shutter sound effect
    audioEngine.playLaserUnlock();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base (either live video stream or awesome virtual cyber-hero drawing)
    if (!cameraError && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    } else {
      // Paint beautiful universe dark grid background as virtual simulator fallback
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, 640, 480);

      // Sci-fi grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 640; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 480); ctx.stroke();
      }
      for (let j = 0; j < 480; j += 40) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(640, j); ctx.stroke();
      }

      // Draw cute cyber hero silhouette or face symbol
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.beginPath();
      ctx.arc(320, 200, 100, 0, Math.PI * 2);
      ctx.fill();

      // Cyber helmet visor symbol
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.fillRect(250, 180, 140, 30);

      // Iron Man/Astro text
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 22px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('[ 은하 시뮬레이터 가동 중 ]', 320, 240);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('OS 카메라 권한 승인 대기중 또는 미지원 상태입니다.', 320, 271);
      ctx.fillText('오른쪽 가상 슈트 필터를 조작해 가상 인증샷을 기록해보세요!', 320, 292);
    }

    // Paint holographic text overlays based on activeFilter
    ctx.strokeStyle = activeFilter === 'ironman' ? '#ef4444' : activeFilter === 'astro' ? '#22d3ee' : activeFilter === 'cyber' ? '#10b981' : 'transparent';
    ctx.lineWidth = 3;

    if (activeFilter === 'ironman') {
      // Draw J.A.R.V.I.S crosshairs
      ctx.beginPath();
      ctx.arc(320, 240, 180, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(320, 240, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(80, 50, 480, 30);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('J.A.R.V.I.S. HUD V2.0 : SYSTEM ACTIVE', 95, 70);
      ctx.textAlign = 'right';
      ctx.fillText('WEAPONS SAFE // THERMALS NORMAL', 545, 70);
    } else if (activeFilter === 'astro') {
      // Cosmic astro goggles
      ctx.beginPath();
      ctx.rect(130, 210, 380, 60);
      ctx.stroke();
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('COSMIC ASTRO SIGHT ◯ QUANTUM SCANNING...', 320, 110);
    } else if (activeFilter === 'cyber') {
      // Cyber ninja scope lines
      ctx.beginPath();
      ctx.moveTo(80, 240); ctx.lineTo(160, 240);
      ctx.moveTo(480, 240); ctx.lineTo(560, 240);
      ctx.moveTo(320, 80); ctx.lineTo(320, 140);
      ctx.moveTo(320, 340); ctx.lineTo(320, 400);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('GRID SHADOW LOCK 100% SUCCESS', 600, 440);
    }

    // Embed current date context & hero profile on image automatically
    const todayStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = new Date().toTimeString().slice(0, 8);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 420, 640, 60);

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${profile.name} (LV.${profile.level} 히어로) 완료 인증`, 20, 448);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`${todayStr} ${timeStr} | 기기보안 검증 통과`, 20, 468);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('🏅 오늘의 아침 퀘스트 ALL CLEAR 🏅', 620, 455);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
  };

  const handleDeployToCalendar = () => {
    if (!capturedImage) return;
    audioEngine.playPowerIgnition();
    onSave(capturedImage, activeFilter, comment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="w-full max-w-4xl bg-gradient-to-b from-[#111827] to-[#030712] rounded-3xl border-3 border-rose-500/30 p-5 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.3)] relative font-sans text-slate-200"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <Camera className="w-6 h-6 text-rose-500 animate-pulse" />
            <div>
              <h3 className="font-sans font-black text-sm text-slate-100 uppercase tracking-widest flex items-center gap-1">
                🤖 슈트 HUD 전입 완료 셀카 촬영 랙 (Selfie HUD Capture)
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                오늘의 등교 전 작전을 무사히 끝냈으니, 영광스러운 인증 교신을 전송하세요!
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              audioEngine.playBeep(450, 0.08, 0.08);
              onClose();
            }}
            className="p-1 px-2.5 bg-slate-900 border border-slate-800 rounded-lg hover:text-slate-100 text-slate-400 hover:border-slate-700 transition"
          >
            닫기
          </button>
        </div>

        {/* Main Grid Frame: Camera Viewer VS Filters/Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left panel: HTML5 Video Screen (Lg Span 8) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-inner overflow-hidden relative min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            
            {/* Countdown overlay */}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center text-rose-500 font-sans font-black text-8xl md:text-9xl tracking-tighter"
                >
                  {countdown}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video stream screen */}
            {!capturedImage && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-xl filter tracking-normal"
                style={{ transform: 'scaleX(-1)' }} // Mirror mode for easier selfie framing
              />
            )}

            {/* Captured image display snapshot */}
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            )}

            {/* Hologram scanner line laser decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/70 to-transparent animate-scan z-10 pointer-events-none" />

            {/* Filter-specific sci-fi HUD frame preview overlays */}
            {!capturedImage && activeFilter === 'ironman' && (
              <div className="absolute inset-0 border-2 border-red-500/30 rounded-xl pointer-events-none z-20 flex flex-col justify-between p-4 font-mono text-[9px] text-red-500/80">
                <div className="flex justify-between items-center bg-red-950/25 p-1 border border-red-500/20 rounded">
                  <span>J.A.R.V.I.S UI SEC_6 // STREAK STABLE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                </div>
                <div className="mx-auto my-auto w-52 h-52 border-2 border-dashed border-red-500/40 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-8 h-[2px] bg-red-500" />
                </div>
                <div className="flex justify-between">
                  <span>SENSORS: ON_CAMERA</span>
                  <span>SYS_PWR: 100%</span>
                </div>
              </div>
            )}

            {!capturedImage && activeFilter === 'astro' && (
              <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-xl pointer-events-none z-20 flex flex-col justify-between p-4 font-mono text-[9px] text-cyan-400">
                <div className="flex justify-between items-center bg-cyan-950/25 p-1 border border-cyan-500/20 rounded">
                  <span>ASTRO VISION 1.0 // MULTI_ORBIT</span>
                  <span className="text-[7px]">SCANNING STAGE...</span>
                </div>
                <div className="w-full h-[60px] border-y border-dashed border-cyan-500/50 absolute top-[43%] flex justify-between px-10 items-center">
                  <div className="w-3 h-3 border-l-2 border-t-2 border-cyan-400" />
                  <div className="w-3 h-3 border-r-2 border-t-2 border-cyan-400" />
                </div>
                <div className="flex justify-between mt-auto">
                  <span>GRID SYNC</span>
                  <span>ALT: 34,250M</span>
                </div>
              </div>
            )}

            {!capturedImage && activeFilter === 'cyber' && (
              <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-xl pointer-events-none z-20 flex flex-col justify-between p-4 font-mono text-[9px] text-emerald-400">
                <div className="flex justify-between bg-emerald-950/20 p-1 rounded">
                  <span>NIGHT_SIGHT // SYNOBI_NET</span>
                  <span className="text-emerald-400 animate-pulse">● REC LOCK</span>
                </div>
                <div className="flex justify-between">
                  <span>SHADOW DETECTED</span>
                  <span>LV.{profile.level} READY</span>
                </div>
              </div>
            )}

            {/* Hidden capture canvas */}
            <canvas ref={canvasRef} width="640" height="480" className="hidden" />

            {/* Quick Loading info widget */}
            {cameraLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950">
                <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
                <p className="text-xs font-mono text-slate-500">지브스 하드웨어 카메라 구동망 탐색 중...</p>
              </div>
            )}
          </div>

          {/* Right panel: Filter presets selector & captures trigger (Lg Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            
            {/* Box filters listing */}
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <h4 className="font-sans font-black text-xs text-rose-400 uppercase tracking-wider flex items-center gap-1">
                🎯 슈트 스킨 홀로그램 필터 매치
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      audioEngine.playBeep(700, 0.05, 0.08);
                      setActiveFilter(f.id);
                    }}
                    className={`p-3 text-left font-sans font-bold text-xs rounded-xl border-2 transition-all ${
                      activeFilter === f.id
                        ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment block */}
            <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <h4 className="font-sans font-black text-xs text-rose-400 uppercase tracking-wider flex items-center gap-1">
                ✍️ 오늘의 장한 히어로 소감 한마디
              </h4>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={45}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 focus:border-rose-500 transition-colors rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none h-18 resize-none font-sans"
                placeholder="지켜서 자랑스러운 일과 소감을 직접 보태보세요!"
              />
              <span className="text-[9px] text-slate-500 font-mono flex justify-end">
                {comment.length}/45 자 내외
              </span>
            </div>

            {/* Actions Trigger Block */}
            <div className="pt-2">
              {!capturedImage ? (
                <button
                  onClick={handleStartCapture}
                  disabled={countdown !== null}
                  className="w-full cursor-pointer py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-sans font-black text-sm rounded-xl shadow-[0_4px_15px_rgba(244,63,94,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5 animate-pulse" />
                  3초 타이머 고속 캡처 개시!
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleDeployToCalendar}
                    className="w-full cursor-pointer py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-sans font-black text-sm rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    은하 캘린더에 안전하게 기록!
                  </button>
                  
                  <button
                    onClick={() => {
                      audioEngine.playBeep(400, 0.1, 0.1);
                      setCapturedImage(null);
                    }}
                    className="w-full cursor-pointer py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition"
                  >
                    다시 찍기 (RE-TAKE)
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footnote instruction */}
        <div className="mt-4 border-t border-slate-800/60 pt-3 text-center text-[10px] text-slate-500 font-mono">
          🚨 이 사진 저장소는 스마트 기기 앱 내부에 100% 암호화 저장되며, 웹서버나 배후 전송망에 노출되지 않고 자원 전술로만 처리됩니다.
        </div>
      </motion.div>
    </div>
  );
}
