<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App</title>
</head>
<body>
    <h1>Weather Information</h1>
    <div id="weather-info"></div>

    <script>
        const apiKey = 'b5ead205705615c795e89f9b46a8c62c'; // 高德 API Key

        /**
         * 获取高德地理位置信息
         * @returns {Promise<string|null>} 返回城市编码（adcode）
         */
        const getAdcode = async () => {
            try {
                const response = await fetch(`https://restapi.amap.com/v3/ip?key=${apiKey}`);
                const data = await response.json();

                if (data && data.adcode) {
                    return data.adcode; // 返回城市编码
                } else {
                    throw new Error('Adcode not found in the response.');
                }
            } catch (error) {
                console.error('Error fetching Adcode:', error);
                return null;
            }
        };

        /**
         * 获取指定城市的天气信息
         * @param {string} city - 城市编码
         * @returns {Promise<Object|null>} 返回天气信息
         */
        const getWeather = async (city) => {
            try {
                const response = await fetch(
                    `https://restapi.amap.com/v3/weather/weatherInfo?key=${apiKey}&city=${city}`
                );
                const data = await response.json();

                if (data.status === '1' && data.lives && data.lives.length > 0) {
                    // 返回天气信息
                    return {
                        city: data.lives[0].city,
                        weather: data.lives[0].weather,
                        temperature: data.lives[0].temperature,
                        humidity: data.lives[0].humidity,
                        wind: data.lives[0].winddirection + ' ' + data.lives[0].windspeed + 'km/h',
                    };
                } else {
                    throw new Error('Weather data not found or API call failed.');
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
                return null;
            }
        };

        /**
         * 更新页面上的天气信息
         */
        const updateWeatherInfo = async () => {
            const adcode = await getAdcode();
            if (adcode) {
                const weather = await getWeather(adcode);
                if (weather) {
                    document.getElementById('weather-info').innerHTML = `
                        <p>City: ${weather.city}</p>
                        <p>Weather: ${weather.weather}</p>
                        <p>Temperature: ${weather.temperature}°C</p>
                        <p>Humidity: ${weather.humidity}%</p>
                        <p>Wind: ${weather.wind}</p>
                    `;
                } else {
                    document.getElementById('weather-info').innerHTML = 'Failed to retrieve weather information.';
                }
            } else {
                document.getElementById('weather-info').innerHTML = 'Failed to retrieve Adcode.';
            }
        };

        // 执行更新天气信息的函数
        updateWeatherInfo();
    </script>
</body>
</html>
