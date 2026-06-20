import { Sticker, Mission } from './types';

export const INITIAL_STICKERS: Sticker[] = [
  {
    id: 'st_flying_hero',
    name: '스카이 워커 (Sky Flyer)',
    description: '아침 영웅 미션을 모두 해내어 상쾌한 은하 비행 능력을 잠금 해제했습니다!',
    iconType: 'flying_hero',
    unlockedAt: null,
    unlockCondition: '아침 미션 전체 성공 1회 달성',
  },
  {
    id: 'st_power_fist',
    name: '정의의 일격 (Power Fist)',
    description: '하루의 주요 일과를 씩씩하게 완료하여 강력한 파워 건틀렛을 획득했습니다!',
    iconType: 'power_fist',
    unlockedAt: null,
    unlockCondition: '하루(Daily) 미션 전체 성공 1회 달성',
  },
  {
    id: 'st_rocket_boots',
    name: '퀀텀 부스터 (Rocket Boots)',
    description: '연속 3일 동안 미션 수행을 이어가며 초고속 비행 로켓부츠를 활성화했습니다!',
    iconType: 'rocket_boots',
    unlockedAt: null,
    unlockCondition: '연속 Streak 3일 돌파하기',
  },
  {
    id: 'st_arc_core',
    name: '아이언 코어 (Arc Reactor)',
    description: '오늘 할 일을 100% 돌파하여 무한 동력 아크 리액터 엔진을 점화했습니다!',
    iconType: 'arc_core',
    unlockedAt: null,
    unlockCondition: '하루 10개 이상의 미션 100% 정복',
  },
  {
    id: 'st_thunder_helmet',
    name: '마하 일렉트론 (Speed Helmet)',
    description: '총 15개 이상의 일과를 돌파하여 음속을 돌파하는 슈퍼 히어로 헬멧을 썼습니다!',
    iconType: 'thunder_helmet',
    unlockedAt: null,
    unlockCondition: '누적 완료 미션 개수 15개 도달',
  },
  {
    id: 'st_satellite',
    name: '패스파인더 위성 (Explorer Satellite)',
    description: '지속적인 자기 관리를 통해 행성 궤도를 관측하는 위성 네트워크를 장악했습니다!',
    iconType: 'satellite',
    unlockedAt: null,
    unlockCondition: '누적 완료 미션 개수 30개 도달',
  },
  {
    id: 'st_constellation',
    name: '외우주 성도 (Deep Constellations)',
    description: '완벽한 밤의 수면 미션을 완료하며 밤하늘의 은하 성도를 수수께끼처럼 이어냈습니다!',
    iconType: 'constellation',
    unlockedAt: null,
    unlockCondition: '저녁(Night) 미션 전체 성공 1회 달성',
  },
  {
    id: 'st_laser_shield',
    name: '안드로메다 바리어 (Plasma Shield)',
    description: '스스로 만든 특별 커스텀 퀘스트를 완성하며 고강도 레이저 실드를 작동했습니다!',
    iconType: 'laser_shield',
    unlockedAt: null,
    unlockCondition: '나만의 커스텀 미션 등록하여 완료하기',
  },
  {
    id: 'st_martial_art',
    name: '코스믹 시노비 (Cosmic Shinobi)',
    description: '체력 단련과 독서 퀘스트를 수행하여 심신을 연마한 초인 전사로 인정받았습니다!',
    iconType: 'martial_art',
    unlockedAt: null,
    unlockCondition: '연속 Streak 5일 완벽 돌파하기',
  },
];

export const DEFAULT_MISSIONS: Mission[] = [
  // Morning Routines (등교전 아이가 스스로 챙겨야 할 집중 아침 미션 완료 리스트)
  { id: 'm1', title: '☀️ 스스로 상쾌하게 기상하고 이불 예쁘게 정리하기', type: 'morning', xpReward: 15, completed: false, iconName: 'Compass' },
  { id: 'm2', title: '🦷 깨끗하게 양치질하고 세수하기 (구석구석 어푸어푸)', type: 'morning', xpReward: 10, completed: false, iconName: 'Sparkles' },
  { id: 'm3', title: '👕 오늘 입을 깔끔한 등교 옷차림 멋지게 챙겨 입기', type: 'morning', xpReward: 10, completed: false, iconName: 'Shield' },
  { id: 'm4', title: '🍲 튼튼한 히어로 힘을 위한 아침 영양식 남김없이 먹기', type: 'morning', xpReward: 15, completed: false, iconName: 'Flame' },
  { id: 'm5', title: '🎒 [필수 등교 준비] 오늘 알림장, 교과서, 필통 가방에 제대로 챙겼는지 최종 점검하기', type: 'morning', xpReward: 20, completed: false, iconName: 'Notebook' },
  { id: 'm6', title: '💧 [수분 충전] 시원한 학교용 개인 물통 물 가득 채워서 가방에 넣기', type: 'morning', xpReward: 15, completed: false, iconName: 'Rocket' },
  { id: 'm7', title: '🧻 [위생/날씨 대비] 주머니에 휴대용 물티슈 챙기고 오늘의 일기예보 대비하기', type: 'morning', xpReward: 15, completed: false, iconName: 'Activity' },

];
