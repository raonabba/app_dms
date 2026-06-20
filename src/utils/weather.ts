/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeatherData {
  temp: number;
  weatherCode: number;
  isRaining: boolean;
  description: string;
  customTip: string;
  locationName: string;
}

// Maps WMO Weather Code to Friendly Korean Names & Icon
export const getKoreanWeatherDesc = (code: number): { text: string; isRaining: boolean; tip: string } => {
  const rainCodes = [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const snowCodes = [71, 73, 75, 77, 85, 86];

  let text = '맑음 ☀️';
  let isRaining = false;
  let tip = '오늘 날씨는 아주 맑아요! 힘찬 하루 기지개를 켜볼까요? ☀️';

  if (rainCodes.includes(code)) {
    text = '비가 옵니다 ☔';
    isRaining = true;
    tip = '오늘은 비가 오니 우산을 꼭 챙겨야해 우산 챙기기 미션! ☔';
  } else if (snowCodes.includes(code)) {
    text = '송이눈 내림 ❄️';
    tip = '눈이 내려서 길이 미끄러워요! 밖으로 나갈 때에는 따뜻하고 두터운 장갑을 챙기세요! ❄️';
  } else if (code >= 1 && code <= 3) {
    text = '구름 약간 / 흐림 ☁️';
    tip = '구름이 해를 포근히 감싼 날이에요! 시원한 은하 바람을 맞으며 상쾌하게 등교해봐요! ☁️';
  } else if (code === 45 || code === 48) {
    text = '안개 자욱 🌫️';
    tip = '기지 밖에 안개가 가득하네요! 이동할 때 차를 조심하고 눈을 동그랗게 떠보세요! 🌫️';
  }

  return { text, isRaining, tip };
};

export const fetchWeather = async (latitude?: number, longitude?: number): Promise<WeatherData> => {
  // Default coordinates: Seoul, Korea if none provided
  const lat = latitude ?? 37.5665;
  const lon = longitude ?? 126.9780;
  const locName = latitude ? '지상 탐사 좌표계' : '지상 임시 본부 (서울)';

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    
    const cw = data.current_weather;
    const temp = Math.round(cw.temperature);
    const code = cw.weathercode;
    const info = getKoreanWeatherDesc(code);

    return {
      temp,
      weatherCode: code,
      isRaining: info.isRaining,
      description: info.text,
      customTip: info.tip,
      locationName: locName,
    };
  } catch (error) {
    console.warn('Weather API failed, fallback to clear default:', error);
    // Simple mock fallback
    return {
      temp: 22,
      weatherCode: 0,
      isRaining: false,
      description: '쾌적한 맑음 ☀️',
      customTip: '오늘 날씨는 아주 맑아요! 힘찬 하루 기지개를 켜볼까요? ☀️',
      locationName: '은하 연합 기상 관측소 (Fallback)',
    };
  }
};
