import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Delete, X, Lock, Check, RefreshCw } from 'lucide-react';
import { audioEngine } from '../AudioEngine';

interface PasscodeGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export default function PasscodeGate({
  isOpen,
  onClose,
  onSuccess,
  title = '학부모 전용 모니터링 인증',
  description = '승인되지 않은 기상 제어를 제어하기 위해 4자리 암호를 입력해주세요.',
}: PasscodeGateProps) {
  const [passcode, setPasscode] = useState<string>('');
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMode, setSuccessMode] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const pin = localStorage.getItem('parent_passcode');
      setSavedPin(pin);
      if (!pin) {
        setIsRegistering(true);
      } else {
        setIsRegistering(false);
      }
      setPasscode('');
      setConfirmPin('');
      setErrorMessage('');
      setSuccessMode(false);
    }
  }, [isOpen]);

  // Handle number click or keyboard input
  const handleNumClick = (num: string) => {
    audioEngine.playBeep(800 + passcode.length * 100, 0.05, 0.08);
    setErrorMessage('');
    
    if (isRegistering) {
      if (passcode.length < 4) {
        setPasscode(prev => prev + num);
      } else if (confirmPin.length < 4) {
        setConfirmPin(prev => prev + num);
      }
    } else {
      if (passcode.length < 4) {
        const nextValue = passcode + num;
        setPasscode(nextValue);
        
        // Auto check if fits 4 length
        if (nextValue.length === 4) {
          const pin = localStorage.getItem('parent_passcode') || '0000';
          if (nextValue === pin) {
            setSuccessMode(true);
            audioEngine.playLaserUnlock();
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 550);
          } else {
            setTimeout(() => {
              audioEngine.playBeep(260, 0.2, 0.25);
              setErrorMessage('비밀번호가 일치하지 않습니다. 다시 시도해 주세요.');
              setPasscode('');
            }, 250);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    audioEngine.playBeep(500, 0.05, 0.05);
    if (isRegistering) {
      if (confirmPin.length > 0) {
        setConfirmPin(prev => prev.slice(0, -1));
      } else if (passcode.length > 0) {
        setPasscode(prev => prev.slice(0, -1));
      }
    } else {
      setPasscode(prev => prev.slice(0, -1));
    }
  };

  const handleRegisterSubmit = () => {
    if (passcode.length !== 4) {
      setErrorMessage('첫 번째 비밀번호 4자리를 모두 입력해주세요.');
      return;
    }
    if (confirmPin.length !== 4) {
      setErrorMessage('확인 비밀번호 4자리를 모두 입력해주세요.');
      return;
    }
    if (passcode !== confirmPin) {
      audioEngine.playBeep(260, 0.2, 0.2);
      setErrorMessage('비밀번호가 서로 다릅니다! 다시 일치하게 넣어주세요.');
      setConfirmPin('');
      return;
    }

    // Save passcode
    localStorage.setItem('parent_passcode', passcode);
    setSavedPin(passcode);
    setIsRegistering(false);
    setSuccessMode(true);
    audioEngine.playPowerIgnition();
    
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 700);
  };

  // Listen to physical keyboard events
  useEffect(() => {
    if (!isOpen || successMode) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumClick(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && isRegistering) {
        handleRegisterSubmit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, passcode, confirmPin, isRegistering, successMode]);

  if (!isOpen) return null;

  const currentDisplayVal = isRegistering && passcode.length === 4 ? confirmPin : passcode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        className="relative w-full max-w-sm rounded-3xl border-2 border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 text-center shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.playBeep(500, 0.08, 0.08);
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock/Unlock Icon indicator */}
        <div className="mx-auto w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900 mb-4">
          {successMode ? (
            <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />
          ) : (
            <Lock className="w-5 h-5 text-amber-500 animate-pulse" />
          )}
        </div>

        <h3 className="font-sans font-bold text-base text-slate-200">
          {isRegistering ? '🆕 학부모 비밀번호 생성' : title}
        </h3>
        <p className="text-slate-400 text-xs font-mono mt-1.5 px-3">
          {isRegistering 
            ? '처음 사용을 위해 보안 4자리 암호를 생성하고 소중히 기록해두세요.'
            : description
          }
        </p>

        {/* Secret dots display overlay */}
        <div className="my-5 flex justify-center gap-4">
          {[0, 1, 2, 3].map((index) => {
            const hasValue = currentDisplayVal.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  successMode 
                    ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : hasValue 
                      ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' 
                      : 'bg-slate-900 border-slate-800'
                }`}
              />
            );
          })}
        </div>

        {isRegistering && (
          <div className="text-left bg-slate-900/60 rounded-xl p-3 border border-slate-850 mb-4 space-y-1">
            <div className="text-[10px] font-semibold text-slate-500 font-mono tracking-widest uppercase">생성 진행 현황</div>
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>Step 1: 비밀번호 입력 (4자리)</span>
              <span className="font-bold">{passcode.length === 4 ? '✅ 완료' : `${passcode.length}/4`}</span>
            </div>
            {passcode.length === 4 && (
              <div className="flex justify-between items-center text-xs text-slate-300 pt-1 border-t border-slate-800/50">
                <span>Step 2: 비밀번호 한 번 더 입력</span>
                <span className="font-bold text-cyan-400">{confirmPin.length === 4 ? '✅ 최종완료' : `${confirmPin.length}/4`}</span>
              </div>
            )}
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-red-400 font-medium mb-3 bg-red-950/20 py-1.5 px-2.5 rounded border border-red-900/30 animate-pulse">
            🚨 {errorMessage}
          </p>
        )}

        {/* 0-9 Keypad Grid */}
        <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumClick(String(num))}
              className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono font-bold hover:bg-slate-850 hover:border-slate-700 hover:text-slate-100 active:scale-95 transition-all text-sm cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => {
              if (isRegistering) {
                setPasscode('');
                setConfirmPin('');
                setIsRegistering(true);
                audioEngine.playBeep(400, 0.1, 0.1);
              } else {
                // Allow resetting code if they want, wait, security constraints
                // Let's make it just clear inputs
                setPasscode('');
                audioEngine.playBeep(400, 0.1, 0.1);
              }
            }}
            className="py-2.5 rounded-xl bg-[#111622] border border-cyan-950 text-cyan-500 font-mono hover:bg-cyan-500/10 transition-all text-[11px] cursor-pointer"
            title="지우기"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleNumClick('0')}
            className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono font-bold hover:bg-slate-850 hover:text-slate-100 active:scale-95 transition-all text-sm cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-2.5 rounded-xl bg-[#221111] border border-red-950 text-red-400 font-mono flex items-center justify-center hover:bg-red-500/10 transition-all cursor-pointer"
            title="백스페이스"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {isRegistering && (passcode.length === 4 && confirmPin.length === 4) && (
          <button
            onClick={handleRegisterSubmit}
            className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.3)] animate-bounce"
          >
            <Check className="w-3.5 h-3.5" />
            최종 암호 생성 및 저장
          </button>
        )}
      </motion.div>
    </div>
  );
}
