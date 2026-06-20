export type MissionType = 'morning' | 'daily' | 'night';

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  xpReward: number;
  completed: boolean;
  iconName: string; // Lucide icon reference
}

export type AvatarType = 'astro' | 'cybernight' | 'shadowninja' | 'ththebolt';

export interface HeroProfile {
  name: string;
  avatar: AvatarType;
  xp: number;
  level: number;
  streak: number;
}

export interface Sticker {
  id: string;
  name: string;
  description: string;
  iconType: 'flying_hero' | 'power_fist' | 'rocket_boots' | 'arc_core' | 'thunder_helmet' | 'satellite' | 'constellation' | 'laser_shield' | 'martial_art';
  unlockedAt: string | null; // Date ISO string or null
  unlockCondition: string;
}

export interface ActivityHistory {
  date: string; // YYYY-MM-DD
  completedCount: number;
  totalCount: number;
  earnedXp: number;
}

export interface SelfieSnap {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  image: string; // data URL or mock image string
  filter?: string; // 'ironman' | 'astro' | 'cyber' | 'none'
  comment?: string;
}

// Scoped individual kid data structure
export interface KidProfileData {
  id: string; // Unique profile identifier
  profile: HeroProfile;
  missions: Mission[];
  unlockedStickersIds: string[];
  history: ActivityHistory[];
  lastActiveDate: string; // YYYY-MM-DD
  claimedTabBonuses?: MissionType[]; // Per-profile claim state for checklist clearances
  selfieSnaps?: SelfieSnap[]; // Beautiful calendar visual proofs
}

export interface AppState {
  profiles: KidProfileData[];
  activeProfileId: string | null; // Current selected kid profile (e.g. Netflix profile loader)
  soundEffects: boolean;
  notificationEnabled?: boolean;
  wakeupTime?: string; // HH:MM
  bedtime?: string; // HH:MM
  lastNotifiedWakeupDate?: string | null;
  lastNotifiedBedtimeDate?: string | null;
}
