// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      title: v.name || v.title,
      artist: v.artist || v.author,
      src: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      pic: v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      title: v.name || v.title,
      artist: v.artist || v.author,
      src: v.url,
      pic: v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  try {
    const res = await fetch("https://v1.hitokoto.cn");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching hitokoto data:", error);
    return null;
  }
};

/**
 * 天气
 */

const apiKey = 'b5ead205705615c795e89f9b46a8c62c';

// 获取高德地理位置信息
export const getAdcode = async () => {
  try {
    const res = await fetch(`https://restapi.amap.com/v3/ip?key=${apiKey}`);
    const data = await res.json();
    if (data && data.adcode) {
      return data.adcode;
    } else {
      throw new Error('Adcode not found in the response.');
    }
  } catch (error) {
    console.error('Error fetching Adcode:', error);
    return null;
  }
};

// 获取高德地理天气信息
export const getWeather = async (city) => {
  try {
    const res = await fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${apiKey}&city=${city}`
    );
    const data = await res.json();
    if (data && data.status === "1") {
      return data;
    } else {
      throw new Error('Weather data not found or API call failed.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// 获取教书先生天气 API
export const getOtherWeather = async () => {
  try {
    const res = await fetch("https://api.oioweb.cn/api/weather/GetWeather");
    const data = await res.json();
    if (data && data.success) {
      return data;
    } else {
      throw new Error('Other weather data not found or API call failed.');
    }
  } catch (error) {
    console.error('Error fetching other weather data:', error);
    return null;
  }
};

// 示例使用
(async () => {
  const adcode = await getAdcode();
  console.log('Adcode:', adcode);

  if (adcode) {
    const weather = await getWeather(adcode);
    console.log('Weather:', weather);
  } else {
    console.log('Failed to get Adcode, cannot fetch weather data.');
  }

  const otherWeather = await getOtherWeather();
  console.log('Other Weather:', otherWeather);
})();
