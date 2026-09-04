const API_CONFIG = { baseUrl: 'http://localhost:5000/api' };
const getLocationBtn = document.getElementById('getLocationBtn');
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

document.addEventListener('DOMContentLoaded', () => {
    getLocationBtn.addEventListener('click', getClientLocation);
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) fetchWeatherByCity(city);
    });
});

function getClientLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
        },
        (error) => { console.error(error); }
    );
}

async function fetchWeatherByCoordinates(latitude, longitude) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/weather?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) { console.error(error); }
}

async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) { console.error(error); }
}

function displayWeather(data) {
    document.getElementById('cityName').textContent = data.city;
    document.getElementById('temperature').textContent = Math.round(data.temperature) + 'C';
    document.getElementById('description').textContent = data.description;
    document.getElementById('feelsLike').textContent = Math.round(data.feels_like) + 'C';
    document.getElementById('humidity').textContent = data.humidity + '%';
    document.getElementById('pressure').textContent = data.pressure + ' hPa';
    document.getElementById('windSpeed').textContent = data.wind_speed + ' m/s';
    document.getElementById('weatherSection').style.display = 'block';
}