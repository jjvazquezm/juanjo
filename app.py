from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

CONFIG_FILE = 'config.json'

def load_config():
    try:
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}

config = load_config()
API_KEY = config.get('weather_api_key', '')
WEATHER_API_BASE_URL = config.get('weather_api_url', 'https://api.openweathermap.org/data/2.5')

def get_weather_data(params):
    if not API_KEY:
        return None
    
    try:
        params['appid'] = API_KEY
        params['units'] = 'metric'
        params['lang'] = 'es'
        
        url = f'{WEATHER_API_BASE_URL}/weather'
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        return response.json()
    except:
        return None

def format_weather_response(weather_data):
    if not weather_data:
        return None
    
    try:
        return {
            'city': f"{weather_data['name']}, {weather_data['sys']['country']}",
            'temperature': weather_data['main']['temp'],
            'description': weather_data['weather'][0]['description'],
            'feels_like': weather_data['main']['feels_like'],
            'humidity': weather_data['main']['humidity'],
            'pressure': weather_data['main']['pressure'],
            'wind_speed': weather_data['wind']['speed'],
            'timestamp': datetime.now().isoformat()
        }
    except:
        return None

@app.route('/api/weather', methods=['GET'])
def get_weather():
    try:
        city = request.args.get('city')
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        
        params = {}
        
        if city:
            params['q'] = city
        elif lat and lon:
            params['lat'] = lat
            params['lon'] = lon
        else:
            return jsonify({'error': 'Ciudad o coordenadas requeridas'}), 400
        
        weather_data = get_weather_data(params)
        
        if not weather_data:
            return jsonify({'error': 'No se pudo obtener clima'}), 500
        
        formatted_data = format_weather_response(weather_data)
        
        if not formatted_data:
            return jsonify({'error': 'Error al procesar datos'}), 500
        
        return jsonify(formatted_data), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("Servidor iniciado en http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)