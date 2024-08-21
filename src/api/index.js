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
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};

/**
 * 天气
 */

const fetch = require('node-fetch');

// 获取高德地理位置信息
const getAdcode = async (b5ead205705615c795e89f9b46a8c62c) => {
  try {
    const res = await fetch(`https://restapi.amap.com/v3/ip?key=${b5ead205705615c795e89f9b46a8c62c}`);
    const data = await res.json();
    return data.adcode;  // 返回城市编码
  } catch (error) {
    console.error('Error fetching Adcode:', error);
  }
};

// 获取高德地理天气信息
const getWeather = async (b5ead205705615c795e89f9b46a8c62c) => {
  try {
    const res = await fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${b5ead205705615c795e89f9b46a8c62c}&city=${city}`
    );
    const data = await res.json();
    return data;  // 返回天气信息
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

// 获取教书先生天气 API
const getOtherWeather = async () => {
  try {
    const res = await fetch("https://api.oioweb.cn/api/weather/GetWeather");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching other weather data:', error);
  }
};

// 示例使用
const apiKey = 'b5ead205705615c795e89f9b46a8c62c';  // 替换为有效的 API Key

(async () => {
  const adcode = await getAdcode(b5ead205705615c795e89f9b46a8c62c);
  console.log('Adcode:', adcode);

  const weather = await getWeather(apiKey, adcode);
  console.log('Weather:', weather);

  const otherWeather = await getOtherWeather();
  console.log('Other Weather:', otherWeather);
})();
