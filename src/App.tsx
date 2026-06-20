/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Mission, HeroProfile, MissionType, Sticker, ActivityHistory, KidProfileData, AvatarType } from './types';
import { INITIAL_STICKERS, DEFAULT_MISSIONS } from './badgePresets';
import { audioEngine } from './AudioEngine';

// Components
import HeroHeader from './components/HeroHeader';
import MissionPanel from './components/MissionPanel';
import StickerBoard from './components/StickerBoard';
import ParentPanel from './components/ParentPanel';
import ProfileSelector from './components/ProfileSelector';
import JarvisIntro from './components/JarvisIntro';
import SelfieCameraModal from './components/SelfieCameraModal';
import HeroCalendar from './components/HeroCalendar';
import { fetchWeather, WeatherData } from './utils/weather';

// Icons
import { 
  Flame, Volume2, VolumeX, Shield, Sparkles, Clock, 
  Calendar, Trophy, Activity, RefreshCw, Star, Info,
  Heart, Zap, Key, Bell, BellRing, X, User
} from 'lucide-react';

/**
 * Forgiving Streak Forgiveness Policy for Young Kids
 * If they complete at least 3 tasks, keep the streak going! If they do all, add +1.
 * This runs when a profile loads on a new calendar date.
 */
const rollProfileIfNeeded = (kid: KidProfileData, today: string): KidProfileData => {
  if (kid.lastActiveDate !== today) {
    const yesterdayMissions = kid.missions;
    const totalTasks = yesterdayMissions.length;
    const completedTasks = yesterdayMissions.filter(m => m.completed).length;
    const bonusXp = kid.unlockedStickersIds.length * 5; // Extra boost for milestones!

    let newStreak = kid.profile.streak;
    if (completedTasks >= 3) {
      if (completedTasks === totalTasks && totalTasks > 0) {
        newStreak += 1;
      }
    } else {
      newStreak = 1; // Resets back to 1
    }

    // Record performance log in history array
    const dailyLog: ActivityHistory = {
      date: kid.lastActiveDate,
      completedCount: completedTasks,
      totalCount: totalTasks,
      earnedXp: completedTasks * 15 + bonusXp,
    };

    const updatedHistory = [dailyLog, ...kid.history].slice(0, 30); // Keep last 30 logs

    // Reset checklists for a fresh start key
    const resetMissions = kid.missions.map((m) => ({
      ...m,
      completed: false,
    }));

    return {
      ...kid,
      profile: {
        ...kid.profile,
        streak: newStreak,
      },
      missions: resetMissions,
      history: updatedHistory,
      lastActiveDate: today,
      claimedTabBonuses: [],
    };
  }
  return kid;
};

const migrateAvatarType = (avatar: string): AvatarType => {
  if (avatar === 'astro' || avatar === 'cyber_boy') return 'astro';
  if (avatar === 'knight' || avatar === 'cybernight' || avatar === 'cyber_samurai') return 'cybernight';
  if (avatar === 'shadow' || avatar === 'shadowninja' || avatar === 'cyber_ninja') return 'shadowninja';
  if (avatar === 'thunder' || avatar === 'ththebolt' || avatar === 'lightning_helmet') return 'ththebolt';
  return 'astro';
};

export default function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<MissionType>('morning');
  const [showLevelUpAlert, setShowLevelUpAlert] = useState<string | null>(null);
  const [unlockedStickerAlert, setUnlockedStickerAlert] = useState<Sticker | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [inAppNotification, setInAppNotification] = useState<{ title: string; body: string } | null>(null);

  // Jarvis & Dynamic Atmospheric Weather States
  const [showJarvisIntro, setShowJarvisIntro] = useState<boolean>(true);
  const [simulatedWeather, setSimulatedWeather] = useState<'live' | 'sunny' | 'rainy' | 'snowy'>('live');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [showStickerModal, setShowStickerModal] = useState<boolean>(false);
  const [showSelfieModal, setShowSelfieModal] = useState<boolean>(false);

  // 1. Setup initial state and handle daily date rolling for multiple profiles
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('hero_quest_app_state');

    // Update digital clock every second
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    }, 1000);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // check if old single-child profile format exists and automatically migrate
        if (parsed && !parsed.profiles) {
          const oldProfile = parsed.profile || { name: '용감한 어린이 히어로', avatar: 'astro', xp: 0, level: 1, streak: 1 };
          oldProfile.avatar = migrateAvatarType(oldProfile.avatar || 'astro');
          const oldMissions = parsed.missions || DEFAULT_MISSIONS;
          const oldUnlockedStickersIds = parsed.unlockedStickersIds || [];
          const oldHistory = parsed.history || [];
          const oldLastActiveDate = parsed.lastActiveDate || today;

          const initialKid: KidProfileData = {
            id: `kid_${Date.now()}`,
            profile: oldProfile,
            missions: oldMissions,
            unlockedStickersIds: oldUnlockedStickersIds,
            history: oldHistory,
            lastActiveDate: oldLastActiveDate,
            claimedTabBonuses: [],
          };

          const migrated: AppState = {
            profiles: [initialKid],
            activeProfileId: initialKid.id,
            soundEffects: parsed.soundEffects !== undefined ? parsed.soundEffects : true,
            notificationEnabled: parsed.notificationEnabled !== undefined ? parsed.notificationEnabled : false,
            wakeupTime: parsed.wakeupTime || '08:00',
            bedtime: parsed.bedtime || '21:30',
            lastNotifiedWakeupDate: parsed.lastNotifiedWakeupDate || null,
            lastNotifiedBedtimeDate: parsed.lastNotifiedBedtimeDate || null,
          };

          setState(migrated);
          localStorage.setItem('hero_quest_app_state', JSON.stringify(migrated));
          audioEngine.enabled = migrated.soundEffects;
        } else {
          // Normal load: roll all profiles if they belong to a past calendar date
          const rolledProfiles = parsed.profiles.map((kid: KidProfileData) => {
            const rolled = rollProfileIfNeeded(kid, today);
            rolled.profile.avatar = migrateAvatarType(rolled.profile?.avatar || 'astro');
            return rolled;
          });

          const updatedState = {
            ...parsed,
            profiles: rolledProfiles,
          };

          setState(updatedState);
          audioEngine.enabled = parsed.soundEffects !== undefined ? parsed.soundEffects : true;
          localStorage.setItem('hero_quest_app_state', JSON.stringify(updatedState));
        }
      } catch (err) {
        setupDefaultState(today);
      }
    } else {
      setupDefaultState(today);
    }

    return () => clearInterval(timer);
  }, []);

  // Sync atmospheric weather with active simulation or live GPS sensors
  useEffect(() => {
    if (simulatedWeather === 'live') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const data = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
            setWeather(data);
          },
          async (err) => {
            console.warn('Geolocation denied, calling default coordinates:', err);
            const data = await fetchWeather();
            setWeather(data);
          }
        );
      } else {
        fetchWeather().then(setWeather);
      }
    } else if (simulatedWeather === 'sunny') {
      setWeather({
        temp: 26,
        weatherCode: 0,
        isRaining: false,
        description: '쾌청하고 맑음 ☀️',
        customTip: '오늘 날씨는 아주 맑아요! 힘찬 하루 기지개를 켜볼까요? ☀️',
        locationName: '은하 시뮬레이터 (맑음)',
      });
    } else if (simulatedWeather === 'rainy') {
      setWeather({
        temp: 14,
        weatherCode: 61,
        isRaining: true,
        description: '비가 옵니다 ☔',
        customTip: '오늘은 비가 오니 우산을 꼭 챙겨야해 우산 챙기기 미션! ☔',
        locationName: '은하 시뮬레이터 (비 시뮬레이션)',
      });
    } else if (simulatedWeather === 'snowy') {
      setWeather({
        temp: -3,
        weatherCode: 73,
        isRaining: false,
        description: '송이눈 내림 ❄️',
        customTip: '눈이 내려서 길이 미끄러워요! 밖으로 나갈 때에는 따뜻하고 두터운 장갑을 챙기세요! ❄️',
        locationName: '은하 시뮬레이터 (눈 시뮬레이션)',
      });
    }
  }, [simulatedWeather]);

  // Contextual weather-sensitive dynamic mission injections
  useEffect(() => {
    if (!state || !state.activeProfileId || !weather) return;

    const currentKid = state.profiles.find((p) => p.id === state.activeProfileId);
    if (!currentKid) return;

    let updatedMissions = [...currentKid.missions];
    let changed = false;

    if (weather.isRaining) {
      const hasRainTask = updatedMissions.some(m => m.id === 'rain_umbrella_dynamic');
      if (!hasRainTask) {
        updatedMissions.push({
          id: 'rain_umbrella_dynamic',
          title: '☔ [기상 특별] 오늘은 비가 오니 우산을 꼭 챙겨야해 우산 챙기기 미션!',
          type: 'morning',
          xpReward: 15,
          completed: false,
          iconName: 'CloudRain'
        });
        changed = true;
      }
    } else {
      const idx = updatedMissions.findIndex(m => m.id === 'rain_umbrella_dynamic');
      if (idx !== -1 && !updatedMissions[idx].completed) {
        updatedMissions.splice(idx, 1);
        changed = true;
      }
    }

    if (weather.weatherCode >= 71 && weather.weatherCode <= 86) {
      const hasSnowTask = updatedMissions.some(m => m.id === 'snow_dynamic');
      if (!hasSnowTask) {
        updatedMissions.push({
          id: 'snow_dynamic',
          title: '❄️ [기상 특별] 오늘은 눈이 내리니 보온 점퍼와 귀마개 완비하기!',
          type: 'morning',
          xpReward: 15,
          completed: false,
          iconName: 'CloudSnow'
        });
        changed = true;
      }
    } else {
      const idx = updatedMissions.findIndex(m => m.id === 'snow_dynamic');
      if (idx !== -1 && !updatedMissions[idx].completed) {
        updatedMissions.splice(idx, 1);
        changed = true;
      }
    }

    if (changed) {
      const updatedProfiles = state.profiles.map((kid) => {
        if (kid.id === state.activeProfileId) {
          return { ...kid, missions: updatedMissions };
        }
        return kid;
      });
      // Synchronize in local variables & state gracefully without cascade loops
      const nextState = { ...state, profiles: updatedProfiles };
      setState(nextState);
      localStorage.setItem('hero_quest_app_state', JSON.stringify(nextState));
    }
  }, [state?.activeProfileId, weather, state]);

  const setupDefaultState = (today: string) => {
    const defaultKid: KidProfileData = {
      id: `kid_${Date.now()}`,
      profile: {
        name: '꼬마 히어로',
        avatar: 'astro',
        xp: 0,
        level: 1,
        streak: 1,
      },
      missions: DEFAULT_MISSIONS,
      unlockedStickersIds: [],
      history: [],
      lastActiveDate: today,
      claimedTabBonuses: [],
      selfieSnaps: [],
    };

    const defaultState: AppState = {
      profiles: [defaultKid],
      activeProfileId: defaultKid.id,
      soundEffects: true,
      notificationEnabled: false,
      wakeupTime: '08:00',
      bedtime: '21:30',
      lastNotifiedWakeupDate: null,
      lastNotifiedBedtimeDate: null,
    };
    setState(defaultState);
    localStorage.setItem('hero_quest_app_state', JSON.stringify(defaultState));
    audioEngine.enabled = true;
  };

  // State modifiers and localStorage syncer
  const saveGlobalState = (updated: Partial<AppState>) => {
    if (!state) return;
    const newState = { ...state, ...updated } as AppState;
    setState(newState);
    localStorage.setItem('hero_quest_app_state', JSON.stringify(newState));
  };

  // Safe variables retrieval for initial rendering before state is parsed
  const profiles = state?.profiles || [];
  const activeProfileId = state?.activeProfileId || null;
  const soundEffects = state?.soundEffects !== undefined ? state?.soundEffects : true;
  const notificationEnabled = state?.notificationEnabled || false;
  const wakeupTime = state?.wakeupTime || '08:00';
  const bedtime = state?.bedtime || '21:30';
  const lastNotifiedWakeupDate = state?.lastNotifiedWakeupDate || null;
  const lastNotifiedBedtimeDate = state?.lastNotifiedBedtimeDate || null;

  // Retrieve matching active kid data
  const activeKid = profiles.find((p) => p.id === activeProfileId);
  const profile = activeKid?.profile;
  const missions = activeKid?.missions || [];
  const unlockedStickersIds = activeKid?.unlockedStickersIds || [];
  const claimedTabBonuses = activeKid?.claimedTabBonuses || [];

  const triggerNotification = (title: string, body: string, alarmType?: 'wakeup' | 'bedtime', todayString?: string) => {
    audioEngine.playPowerIgnition();

    // Browser native Push Notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: '/favicon.ico' });
        } catch (err) {
          console.warn('Native notification issue:', err);
        }
      }
    }

    // Cockpit toast local popup
    setInAppNotification({ title, body });

    // Save alarm notified status to save redundant pings
    if (alarmType && todayString) {
      if (alarmType === 'wakeup') {
        saveGlobalState({ lastNotifiedWakeupDate: todayString });
      } else if (alarmType === 'bedtime') {
        saveGlobalState({ lastNotifiedBedtimeDate: todayString });
      }
    }
  };

  const handleToggleNotifications = async () => {
    const nextVal = !notificationEnabled;
    
    if (nextVal) {
      if ('Notification' in window) {
        audioEngine.playBeep(900, 0.08, 0.1);
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          triggerNotification('🔔 우주 교신 안테나 연결 완료!', '테스트 메시지입니다. 이제 정해진 아침/저녁 시간에 작전 명령을 무사히 받게 됩니다.');
        } else {
          alert('브라우저 푸시 알림 권한이 거부되었습니다. 기기 작동을 위해 인앱 가상 무전(Local Popups) 알림으로 안전하게 제공됩니다!');
          triggerNotification('🔔 우주 가상 무전 연결 완료 (인앱)', '알림 권한 제약으로 인해 인앱 전용 무전 채널로 알림이 제공됩니다!');
        }
      } else {
        alert('이 기기는 브라우저 푸시 알림을 지원하지 않습니다. 인앱 무전 환경으로 알림이 가동됩니다!');
        triggerNotification('🔔 우주 가상 무전 연결 완료 (인앱)', '알림 권한 제약으로 인해 인앱 전용 무전 채널로 알림이 제공됩니다!');
      }
    } else {
      audioEngine.playBeep(500, 0.08, 0.08);
    }
    
    saveGlobalState({ notificationEnabled: nextVal });
  };

  // Background push notification checker
  useEffect(() => {
    if (!state || !notificationEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHHMM = now.toTimeString().slice(0, 5); // 'HH:MM'
      const today = now.toISOString().split('T')[0];

      // Check Wakeup Alarm
      if (currentHHMM === wakeupTime && lastNotifiedWakeupDate !== today) {
        let alarmBodyMsg = '안녕 히어로! 기지개를 켜고 상쾌하게 세수하기 등 오늘의 아침 활성 퀘스트를 체크하세요!';
        if (weather?.isRaining) {
          alarmBodyMsg = '☔ 오늘은 비가 오니 우산을 꼭 챙겨야해 우산 챙기기 미션! ' + alarmBodyMsg;
        } else if (weather?.description?.includes('눈')) {
          alarmBodyMsg = '❄️ 오늘은 눈이 내리니 보온 무장을 철저히 하고 등교하세요! ' + alarmBodyMsg;
        }
        triggerNotification(
          '☀️ 스스로 일어날 시간! 아침 미션 가동!',
          alarmBodyMsg,
          'wakeup',
          today
        );
      }

      // Check Bedtime Alarm
      if (currentHHMM === bedtime && lastNotifiedBedtimeDate !== today) {
        triggerNotification(
          '🌌 튼튼한 충전을 위한 취침 준비 시간!',
          '기지로 들어갈 시간입니다! 이를 깨끗이 닦고 취침 미션을 체크하여 우주 배지를 획득하세요.',
          'bedtime',
          today
        );
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [notificationEnabled, wakeupTime, bedtime, lastNotifiedWakeupDate, lastNotifiedBedtimeDate, state, weather]);

  // Early return if state is not initialized or loaded yet
  if (!state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono">
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
          <p>INITIALIZING HERO HABIT CORE SYSTEM...</p>
        </div>
      </div>
    );
  }

  const saveActiveKidState = (updatedKidFields: Partial<KidProfileData>) => {
    if (!activeProfileId) return;
    const updatedProfiles = profiles.map((kid) => {
      if (kid.id === activeProfileId) {
        return {
          ...kid,
          ...updatedKidFields,
        };
      }
      return kid;
    });

    saveGlobalState({ profiles: updatedProfiles });
  };

  // Sound toggler
  const handleToggleSound = () => {
    const newVal = !soundEffects;
    audioEngine.enabled = newVal;
    saveGlobalState({ soundEffects: newVal });
    audioEngine.playBeep(800, 0.08, 0.15);
  };

  // Toggle mission checked
  const handleToggleMission = (id: string) => {
    if (!profile) return;

    let earnedXp = 0;
    const updatedMissions = missions.map((m) => {
      if (m.id === id) {
        const nextCompleted = !m.completed;
        earnedXp = nextCompleted ? m.xpReward : -m.xpReward;
        return { ...m, completed: nextCompleted };
      }
      return m;
    });

    // Apply XP to Profile
    let currentXp = profile.xp + earnedXp;
    let currentLevel = profile.level;
    let xpMax = currentLevel * 100 + 150;
    let leveledUp = false;

    // Handle leveling up
    while (currentXp >= xpMax) {
      currentXp -= xpMax;
      currentLevel += 1;
      xpMax = currentLevel * 100 + 150;
      leveledUp = true;
    }

    if (currentXp < 0) {
      currentXp = 0;
    }

    const updatedProfile: HeroProfile = {
      ...profile,
      xp: currentXp,
      level: currentLevel,
    };

    const nextKidFields: Partial<KidProfileData> = {
      profile: updatedProfile,
      missions: updatedMissions,
    };

    // Calculate decaling sticker check triggers (unlock badges if credentials met)
    checkAndUnlockDecals(nextKidFields, updatedProfile, updatedMissions);

    if (leveledUp) {
      setTimeout(() => {
        audioEngine.playLaserUnlock();
        setShowLevelUpAlert(`LEVEL UP! 특별 레벨 ${currentLevel} 달성을 축하합니다!`);
      }, 400);
    }
  };

  // Add custom parent/child mission
  const handleAddMission = (title: string, type: MissionType, xpReward: number, iconName: string) => {
    const newMission: Mission = {
      id: `custom_${Date.now()}`,
      title,
      type,
      xpReward,
      completed: false,
      iconName,
    };

    saveActiveKidState({
      missions: [...missions, newMission],
    });
  };

  // Delete mission
  const handleDeleteMission = (id: string) => {
    saveActiveKidState({
      missions: missions.filter((m) => m.id !== id),
    });
  };

  // Reset factory presets
  const handleResetToDefaults = () => {
    saveActiveKidState({
      missions: DEFAULT_MISSIONS,
    });
  };

  // Claim Tab All Clear Bonus Points (+50 XP)
  const handleClaimAllClearBonus = (type: MissionType) => {
    if (!profile || claimedTabBonuses.includes(type)) return;

    let currentXp = profile.xp + 50;
    let currentLevel = profile.level;
    let xpMax = currentLevel * 100 + 150;
    let leveledUp = false;

    while (currentXp >= xpMax) {
      currentXp -= xpMax;
      currentLevel += 1;
      xpMax = currentLevel * 100 + 150;
      leveledUp = true;
    }

    const updatedProfile = {
      ...profile,
      xp: currentXp,
      level: currentLevel,
    };

    const updatedClaimed = [...claimedTabBonuses, type];

    const nextKidFields: Partial<KidProfileData> = {
      profile: updatedProfile,
      claimedTabBonuses: updatedClaimed,
    };

    // Recalculate stickers validation
    checkAndUnlockDecals(nextKidFields, updatedProfile, missions);

    if (leveledUp) {
      setTimeout(() => {
        audioEngine.playLaserUnlock();
        setShowLevelUpAlert(`LEVEL UP! 특별 레벨 ${currentLevel} 달성을 축하합니다!`);
      }, 450);
    }
  };

  // Dynamic metallic sticker criteria validator
  const checkAndUnlockDecals = (
    nextKidFields: Partial<KidProfileData>, 
    currProfile: HeroProfile, 
    currMissions: Mission[]
  ) => {
    const unlockedNow = [...unlockedStickersIds];
    let newlyUnlockedSticker: Sticker | null = null;

    const totalMorning = currMissions.filter(m => m.type === 'morning').length;
    const completedMorning = currMissions.filter(m => m.type === 'morning' && m.completed).length;
    const totalDaily = currMissions.filter(m => m.type === 'daily').length;
    const completedDaily = currMissions.filter(m => m.type === 'daily' && m.completed).length;
    const totalNight = currMissions.filter(m => m.type === 'night').length;
    const completedNight = currMissions.filter(m => m.type === 'night' && m.completed).length;

    const totalCompletedCount = currMissions.filter(m => m.completed).length;
    const hasCustomMissionCompleted = currMissions.some(m => m.id.startsWith('custom_') && m.completed);

    INITIAL_STICKERS.forEach((preset) => {
      if (unlockedNow.includes(preset.id)) return;

      let pass = false;
      switch (preset.id) {
        case 'st_flying_hero':
          pass = totalMorning > 0 && completedMorning === totalMorning;
          break;
        case 'st_power_fist':
          pass = totalDaily > 0 && completedDaily === totalDaily;
          break;
        case 'st_rocket_boots':
          pass = currProfile.streak >= 3;
          break;
        case 'st_arc_core':
          pass = totalCompletedCount >= 10;
          break;
        case 'st_thunder_helmet':
          pass = totalCompletedCount >= 15;
          break;
        case 'st_satellite':
          pass = totalCompletedCount >= 30;
          break;
        case 'st_constellation':
          pass = totalNight > 0 && completedNight === totalNight;
          break;
        case 'st_laser_shield':
          pass = hasCustomMissionCompleted;
          break;
        case 'st_martial_art':
          pass = currProfile.streak >= 5;
          break;
      }

      if (pass) {
        unlockedNow.push(preset.id);
        newlyUnlockedSticker = {
          ...preset,
          unlockedAt: new Date().toISOString()
        };
      }
    });

    nextKidFields.unlockedStickersIds = unlockedNow;
    saveActiveKidState(nextKidFields);

    if (newlyUnlockedSticker) {
      const stickerToNotify = newlyUnlockedSticker;
      setTimeout(() => {
        audioEngine.playLaserUnlock();
        setUnlockedStickerAlert(stickerToNotify);
      }, 800);
    }
  };

  const handleManualResetDay = () => {
    audioEngine.playPowerIgnition();
    const resetMissions = missions.map((m) => ({ ...m, completed: false }));
    saveActiveKidState({
      missions: resetMissions,
      claimedTabBonuses: [],
    });
    triggerNotification('🔄 미션 리필 가동!', '오늘의 퀘스트 리필 장치가 정상 가동되었습니다. 체크박스 슬롯이 모두 비워졌습니다!');
  };

  const handleSaveSelfie = (imageDataUrl: string, filter: string, comment: string) => {
    if (!activeKid) return;
    const newSnap = {
      id: `snap_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 8),
      image: imageDataUrl,
      filter,
      comment,
    };
    const currentSnaps = activeKid.selfieSnaps || [];
    saveActiveKidState({
      selfieSnaps: [newSnap, ...currentSnaps]
    });
    setShowSelfieModal(false);
    triggerNotification('📸 은하 인증 파일 전송 성공!', '오늘의 인증샷이 캘린더 보안 저장소에 박제되어 기록되었습니다. 내일도 씩씩하게 도전하세요!');
  };

  const handleDeleteSelfie = (id: string) => {
    if (!activeKid) return;
    const currentSnaps = activeKid.selfieSnaps || [];
    const updated = currentSnaps.filter(s => s.id !== id);
    saveActiveKidState({
      selfieSnaps: updated
    });
    triggerNotification('🗑️ 인증 메모리 소거 완료', '해당 날짜의 인증샷 이미지가 은하 기계 장치에서 해제 소거되었습니다.');
  };

  // Render J.A.R.V.I.S Cinematic Boot POV Helmet overlay first
  if (showJarvisIntro) {
    return (
      <JarvisIntro
        weather={weather}
        onEnter={() => {
          setShowJarvisIntro(false);
        }}
      />
    );
  }

  // Render Netflix-style multi-profile selection screen if no kids are logged in
  if (!activeProfileId || !activeKid || !profile) {
    return (
      <ProfileSelector
        profiles={profiles}
        onSelectProfile={(id) => {
          saveGlobalState({ activeProfileId: id });
        }}
        onCreateProfile={(name, avatar) => {
          const newKid: KidProfileData = {
            id: `kid_${Date.now()}`,
            profile: {
              name,
              avatar,
              xp: 0,
              level: 1,
              streak: 1,
            },
            missions: DEFAULT_MISSIONS,
            unlockedStickersIds: [],
            history: [],
            lastActiveDate: new Date().toISOString().split('T')[0],
            claimedTabBonuses: [],
            selfieSnaps: [],
          };
          saveGlobalState({
            profiles: [...profiles, newKid],
            activeProfileId: newKid.id,
          });
        }}
        onDeleteProfile={(id, name) => {
          if (window.confirm(`정말로 '${name}' 탐사대원의 전체 기록을 스마트 기기에서 삭제하시겠습니까?`)) {
            const updated = profiles.filter((p) => p.id !== id);
            saveGlobalState({
              profiles: updated,
              activeProfileId: null, // Reset choice
            });
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,23,42,0.65),rgba(2,6,23,1))] py-8 px-4 sm:px-6 lg:px-8 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Scroll scanline details filter */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,24,38,0.2)_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] z-50" />
      
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Control Rail / Title bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/40 backdrop-blur rounded-2xl border-2 border-slate-800 p-4 shadow-lg gap-4">
          {/* Left Side: Large Realtime Galactic Clock */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold leading-none mb-1">SYSTEM TIME</div>
              <div className="font-mono font-black text-2xl sm:text-3xl text-cyan-400 tracking-wider">
                {currentTime || '--:--:--'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0 font-mono text-xs">
            {/* Profile Swapper Trigger button (NETFLIX style switch) */}
            <button
              onClick={() => {
                audioEngine.playBeep(400, 0.08, 0.08);
                saveGlobalState({ activeProfileId: null }); // Exit back to profile selector
              }}
              className="p-2 sm:py-2.5 sm:px-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100 hover:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97]"
              title="다른 꼬마 히어로 프로필로 변경"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-sans font-bold">대원 전환</span>
            </button>

            {/* Notification config button */}
            <button
              onClick={() => {
                audioEngine.playBeep(600, 0.05, 0.08);
                setShowNotificationCenter(!showNotificationCenter);
              }}
              id="toggle-notification-center"
              className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97] ${
                showNotificationCenter 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
              title="알림 설정 및 테스트"
            >
              <Bell className="w-4 h-4 animate-pulse" />
            </button>

            {/* Sound master toggle clicker */}
            <button
              onClick={handleToggleSound}
              id="toggle-audio-effects"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
                soundEffects 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.2)]' 
                  : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400'
              }`}
              title={soundEffects ? '사운드 켜짐' : '사운드 꺼짐'}
            >
              {soundEffects ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 1. Hero Identity Header cockpit (XP, Rank, level) */}
        <HeroHeader 
          profile={profile} 
          onChangeProfile={(updated) => saveActiveKidState({ profile: { ...profile, ...updated } as HeroProfile })} 
          weather={weather}
          onReplayIntro={() => setShowJarvisIntro(true)}
        />

        {/* 1.5. Collapsible Notification Settings Control Center */}
        <AnimatePresence>
          {showNotificationCenter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-2xl border-2 border-slate-800 p-5 shadow-lg space-y-4 font-mono select-none"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span className="font-sans font-black text-sm text-slate-200 tracking-wider">🔔 우주 미션 독려 알림 제어 패널 (Alert Station)</span>
                </div>
                <button 
                  onClick={() => setShowNotificationCenter(false)} 
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  숨기기 [X]
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left controls: Push alarm state toggle */}
                <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200">정시 브라우저 푸시 알림</div>
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">정해진 특정 시간에 미션 완수를 부추깁니다.</div>
                    </div>
                    
                    <button
                      onClick={handleToggleNotifications}
                      id="toggle-push-notifications"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notificationEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          notificationEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-normal bg-slate-900/45 p-2 rounded border border-slate-800 space-y-1 font-sans">
                    <p className="font-mono text-cyan-400 font-bold">ℹ️ 최적의 우주 무전 환경 설정:</p>
                    <p>1. "ON" 활성화 시, 브라우저가 푸신 수신 권한을 요청합니다.</p>
                    <p>2. 보안 제약(iFrame 등)에 의해 OS 푸시가 차단되어도 은하 인앱 무전망(Fallback Popups)이 안전하게 가동되니 안심하고 사용하세요!</p>
                  </div>
                </div>

                {/* Right controls: Time pickers and preset buttons */}
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Morning Wake Up Time */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold text-center">☀️ 기상 독려 시간</label>
                      <input
                        type="time"
                        value={wakeupTime}
                        onChange={(e) => {
                          audioEngine.playBeep(700, 0.05, 0.05);
                          saveGlobalState({ wakeupTime: e.target.value, lastNotifiedWakeupDate: null });
                        }}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 font-mono text-center focus:outline-none focus:border-cyan-500"
                      />
                      <div className="flex gap-1 justify-center">
                        {['07:30', '08:00', '08:30'].map((time) => (
                          <button
                            key={time}
                            onClick={() => {
                              audioEngine.playBeep(750, 0.05, 0.05);
                              saveGlobalState({ wakeupTime: time, lastNotifiedWakeupDate: null });
                            }}
                            className={`text-[9px] px-1 py-0.5 rounded border transition-all cursor-pointer ${
                              wakeupTime === time 
                                ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-400 font-semibold' 
                                : 'bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Evening Bedtime */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold text-center">🌌 취침 독려 시간</label>
                      <input
                        type="time"
                        value={bedtime}
                        onChange={(e) => {
                          audioEngine.playBeep(700, 0.05, 0.05);
                          saveGlobalState({ bedtime: e.target.value, lastNotifiedBedtimeDate: null });
                        }}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 font-mono text-center focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex gap-1 justify-center">
                        {['21:00', '21:30', '22:00'].map((time) => (
                          <button
                            key={time}
                            onClick={() => {
                              audioEngine.playBeep(750, 0.05, 0.05);
                              saveGlobalState({ bedtime: time, lastNotifiedBedtimeDate: null });
                            }}
                            className={`text-[9px] px-1 py-0.5 rounded border transition-all cursor-pointer ${
                              bedtime === time 
                                ? 'bg-indigo-500/15 border-indigo-500/60 text-indigo-400 font-semibold' 
                                : 'bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Immediate Test trigger button */}
                  <div className="pt-1.5 flex gap-2">
                    <button
                      onClick={() => {
                        audioEngine.playBeep(1100, 0.08, 0.1);
                        triggerNotification(
                          '☀️ 아침 기상 알림 예행 테스트 (성공)',
                          '상쾌하고 멋진 하루 기상의 문이 열렸습니다! 세수하고 옷을 깔끔히 챙겨 입으세요!'
                        );
                      }}
                      className="flex-1 py-2 rounded-lg bg-cyan-950/30 border border-cyan-800 hover:bg-cyan-950/60 text-cyan-400 font-bold text-[10px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      AM 기상 테스트
                    </button>
                    <button
                      onClick={() => {
                        audioEngine.playBeep(1100, 0.08, 0.1);
                        triggerNotification(
                          '🌌 취침 준비 알림 예행 테스트 (성공)',
                          '밤하늘 우주선 침대가 완충 모드에 진입했습니다! 깨끗히 이 닦고 누워 우주를 꿈꾸세요!'
                        );
                      }}
                      className="flex-1 py-2 rounded-lg bg-indigo-950/30 border border-indigo-800 hover:bg-indigo-950/60 text-indigo-400 font-bold text-[10px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      PM 취침 테스트
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simple single-column sequence layout ("단순한 배열") */}
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Elegant gold-brass interactive card to open the metal Sticker Board on click */}
          <button
            onClick={() => {
              audioEngine.playPowerIgnition();
              setShowStickerModal(true);
            }}
            id="view-hologram-stickers"
            className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-amber-600/15 via-yellow-600/5 to-slate-950/20 border-2 border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300 cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-sans font-black text-xs text-amber-400 tracking-wide uppercase flex items-center gap-1">
                  🏅 금고 스티커 배지 판 도전 (Stickers Board Vault)
                </h4>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  총 {INITIAL_STICKERS.length}개 배지 중 <span className="text-amber-300 font-bold">{unlockedStickersIds.length}개</span>를 수락 자물쇠 헤제했습니다! (클릭하여 열기)
                </p>
              </div>
            </div>
            <div className="text-[11px] text-amber-500 font-bold shrink-0 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
              스티커 열기 ➔
            </div>
          </button>

          {/* Simple centralized checklist missions board */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-sans font-bold text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded bg-cyan-400" /> TRAINING MISSION
              </h3>
              
              <button
                onClick={handleManualResetDay}
                id="manually-reset-day"
                className="text-[10px] font-mono text-slate-500 hover:text-cyan-400 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
                title="일일 수동 초기화"
              >
                <RefreshCw className="w-3 h-3 animate-spin-slow text-cyan-400" />
                퀘스트 리필
              </button>
            </div>

            <MissionPanel 
              missions={missions}
              activeTab={activeTab}
              onActiveTabChange={setActiveTab}
              onToggleMission={handleToggleMission}
              onClaimAllClearBonus={handleClaimAllClearBonus}
              claimedTabBonuses={claimedTabBonuses}
              onStartSelfie={() => setShowSelfieModal(true)}
            />
          </div>

          {/* Interactive Galactic Selfie Log Calendar */}
          <HeroCalendar 
            selfieSnaps={activeKid?.selfieSnaps || []} 
            onDeleteSnap={handleDeleteSelfie} 
          />

        </div>

        {/* Floating Holographic steel sticker board modal overlay */}
        <AnimatePresence>
          {showStickerModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="w-full max-w-2xl bg-gradient-to-b from-[#131a2e] to-[#040814] rounded-3xl border-3 border-amber-500/30 p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative font-sans text-slate-200"
              >
                {/* Neon-lit laser close handle top header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                    <div>
                      <h3 className="font-sans font-black text-sm text-slate-100 uppercase tracking-wider">
                        🏅 금고 배지 스티커 판 (Hologram Steel Plates)
                      </h3>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">완성된 스티커를 클릭해 보상을 확인하세요!</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      audioEngine.playBeep(450, 0.08, 0.08);
                      setShowStickerModal(false);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-900 border border-slate-800 cursor-pointer transition-all duration-205"
                    title="닫기 [ESC]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main scrollable board chassis content */}
                <div className="max-h-[70vh] overflow-y-auto pr-1">
                  <StickerBoard stickers={INITIAL_STICKERS} unlockedIds={unlockedStickersIds} />
                </div>

                {/* Footer close dialog action */}
                <div className="mt-5 pt-4 border-t border-slate-800/60 flex justify-end">
                  <button
                    onClick={() => {
                      audioEngine.playBeep(450, 0.08, 0.08);
                      setShowStickerModal(false);
                    }}
                    className="py-2.5 px-6 bg-amber-600 hover:bg-amber-500 text-white font-sans font-black text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)] transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    확인 후 기지 복귀
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating Holographic Selfie Camera HUD overlay */}
        <AnimatePresence>
          {showSelfieModal && (
            <SelfieCameraModal
              profile={profile}
              onClose={() => setShowSelfieModal(false)}
              onSave={handleSaveSelfie}
            />
          )}
        </AnimatePresence>

        {/* 3. Expandable command cockpit console for Parents (PARENTS ADMIN CONSOLE) */}
        <ParentPanel 
          missions={missions}
          onAddMission={handleAddMission}
          onDeleteMission={handleDeleteMission}
          onResetToDefaults={handleResetToDefaults}
          simulatedWeather={simulatedWeather}
          onChangeSimulatedWeather={setSimulatedWeather}
        />

        {/* Responsive footer banner */}
        <div className="text-center py-4 border-t border-slate-900 text-[10px] font-mono text-slate-600 space-y-1">
          <p>HERO HABITS MISSION PLATFORM IS PROTECTED BY THE INTERSTELLAR SPACE ALLIANCE.</p>
          <div className="flex justify-center items-center gap-3">
            <span className="flex items-center gap-0.5"><Shield className="w-3 h-3 text-cyan-500" /> 가상 안심 쉴드 운행 중</span>
            <span>✦</span>
            <span>현지시간: {new Date().toLocaleDateString('ko-KR', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

      </div>

      {/* 4. Global Overlay Alert: Level Up celebratory modal */}
      <AnimatePresence>
        {showLevelUpAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border-4 border-cyan-400 bg-gradient-to-b from-[#131f2b] to-[#0c1218] p-8 text-center shadow-[0_20px_50px_rgba(6,182,212,0.4)]"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_100%)]" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-400 mx-auto flex items-center justify-center text-4xl animate-bounce mb-4">
                  👑
                </div>
                
                <h3 className="font-sans font-black text-2xl text-cyan-400 tracking-wider">
                  HERO LEVEL UP!
                </h3>
                <p className="text-slate-200 font-sans font-bold text-sm mt-3">
                  레벨 {profile.level} 달성! 우주 기지가 한 층 업그레이드 되었습니다.
                </p>
                <p className="text-slate-400 text-xs font-mono mt-2 leading-relaxed">
                  스탯 포인트가 훈련 센터에 분배되었습니다. 더 어려운 궤도 퀘스트도 해낼 준비가 되었습니다!
                </p>

                <button
                  onClick={() => {
                    audioEngine.playBeep(600, 0.08, 0.08);
                    setShowLevelUpAlert(null);
                  }}
                  id="dismiss-levelup-alert"
                  className="mt-6 w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-[0_4px_12px_rgba(6,182,212,0.3)] hover:scale-103 transition-transform cursor-pointer"
                >
                  기지로 복귀 [수락]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Global Overlay Alert: Decal Badge Unlock celebratory modal */}
      <AnimatePresence>
        {unlockedStickerAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-[#2b1f13] to-[#120e0a] p-8 text-center shadow-[0_20px_50px_rgba(245,158,11,0.4)]"
            >
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-400 mx-auto flex items-center justify-center text-4xl animate-pulse mb-4">
                🏅
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">
                New Steel Stamp Installed
              </div>

              <h3 className="font-sans font-black text-2xl text-amber-300 tracking-wider">
                철배지 장착 성공!
              </h3>
              
              <div className="bg-[#1c140d] border border-amber-900/40 rounded-xl p-3 my-4">
                <span className="font-bold text-slate-100 text-sm block">
                  {unlockedStickerAlert.name}
                </span>
                <span className="text-slate-400 text-xs block leading-relaxed mt-1 font-serif">
                  &ldquo;{unlockedStickerAlert.description}&rdquo;
                </span>
              </div>

              <button
                onClick={() => {
                  audioEngine.playBeep(600, 0.08, 0.08);
                  setUnlockedStickerAlert(null);
                }}
                id="dismiss-sticker-alert"
                className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-[0_4px_12px_rgba(245,158,11,0.4)] hover:scale-103 transition-transform cursor-pointer"
              >
                배지 도감 확인하기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Global Overlay Alert: Interactive Cockpit Backup Notification Toast */}
      <AnimatePresence>
        {inAppNotification && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0a0f1d] border-2 border-amber-400 shadow-[0_10px_35px_rgba(245,158,11,0.5)] p-4 rounded-2xl flex gap-3.5 items-start">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-sans font-black text-xs text-amber-300">
                {inAppNotification.title}
              </h4>
              <p className="text-[11px] font-sans text-slate-300 leading-normal">
                {inAppNotification.body}
              </p>
              <div className="pt-2 text-[9px] font-mono text-slate-500">
                Fallback Local Comm-link Active
              </div>
            </div>
            <button
              onClick={() => {
                audioEngine.playBeep(500, 0.08, 0.08);
                setInAppNotification(null);
              }}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
