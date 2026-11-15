const API_CONFIG = { baseUrl: 'http://localhost:5000/api' };
const getLocationBtn = document.getElementById('getLocationBtn');
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const statusElement = document.getElementById('locationStatus');
const errorSection = document.getElementById('errorSection');

function updateStatus(message, isError = false) {
    statusElement.textContent = message;
    statusElement.classList.toggle('error', isError);
}

function showError(message) {
    errorSection.textContent = message;
    errorSection.style.display = 'block';
}

function hideError() {
    errorSection.style.display = 'none';
    errorSection.textContent = '';
}

function getAqiColor(aqiStatus) {
    const colors = {
        'Buena': '#2ecc71',
        'Aceptable': '#f1c40f',
        'Moderada': '#f39c12',
        'Pobre': '#e67e22',
        'Muy pobre': '#e74c3c',
        'Desconocido': '#95a5a6'
    };

    return colors[aqiStatus] || '#95a5a6';
}

document.addEventListener('DOMContentLoaded', () => {
    getLocationBtn.addEventListener('click', getClientLocation);
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (!city) {
            showError('Ingresa el nombre de una ciudad.');
            return;
        }

        hideError();
        fetchWeatherByCity(city);
    });
});

function getClientLocation() {
    hideError();

    if (!navigator.geolocation) {
        updateStatus('Tu navegador no admite geolocalización.', true);
        return;
    }

    updateStatus('Obteniendo tu ubicación...');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            updateStatus('Ubicación detectada. Consultando clima...');
            fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
        },
        () => {
            updateStatus('No se pudo acceder a tu ubicación. Intenta buscar una ciudad.', true);
        }
    );
}

async function fetchWeatherByCoordinates(latitude, longitude) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/weather?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'No se pudo consultar el clima.');
        }

        displayWeather(data);
    } catch (error) {
        updateStatus(error.message, true);
        showError(error.message);
    }
}

async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'No se pudo consultar el clima.');
        }

        displayWeather(data);
    } catch (error) {
        updateStatus(error.message, true);
        showError(error.message);
    }
}

function displayWeather(data) {
    const aqi = data.air_quality || null;
    const aqiLabel = aqi ? aqi.label : 'Desconocido';
    const badge = document.getElementById('airQualityBadge');

    document.getElementById('cityName').textContent = data.city;
    document.getElementById('temperature').textContent = `${Math.round(data.temperature)}°C`;
    document.getElementById('description').textContent = data.description;
    document.getElementById('feelsLike').textContent = `${Math.round(data.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('pressure').textContent = `${data.pressure} hPa`;
    document.getElementById('windSpeed').textContent = `${data.wind_speed} km/h`;

    const uvValue = data.uv_index && data.uv_index.value !== undefined ? Number(data.uv_index.value).toFixed(1) : '--';
    document.getElementById('uvIndex').textContent = uvValue;

    if (aqi && aqi.index) {
        badge.textContent = `${aqi.index} AQI`;
        badge.style.backgroundColor = getAqiColor(aqiLabel);
        document.getElementById('airQualityDescription').textContent = aqi.description;
        document.getElementById('pm25').textContent = aqi.components?.pm2_5 ? `${aqi.components.pm2_5} µg/m³` : '--';
        document.getElementById('pm10').textContent = aqi.components?.pm10 ? `${aqi.components.pm10} µg/m³` : '--';
        document.getElementById('o3').textContent = aqi.components?.o3 ? `${aqi.components.o3} µg/m³` : '--';
        document.getElementById('no2').textContent = aqi.components?.no2 ? `${aqi.components.no2} µg/m³` : '--';
    } else {
        badge.textContent = 'N/D';
        badge.style.backgroundColor = '#95a5a6';
        document.getElementById('airQualityDescription').textContent = 'La información del aire no está disponible para esta ubicación.';
        document.getElementById('pm25').textContent = '--';
        document.getElementById('pm10').textContent = '--';
        document.getElementById('o3').textContent = '--';
        document.getElementById('no2').textContent = '--';
    }

    updateStatus('Datos actualizados correctamente.');
    hideError();
    document.getElementById('weatherSection').style.display = 'block';
}