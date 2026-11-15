# Consulta del clima

Este proyecto es una aplicación web para consultar el clima actual de una ciudad o de la ubicación del usuario. Además, muestra información adicional útil para evaluar condiciones ambientales, como la calidad del aire y el índice ultravioleta (UV).

## Funcionalidades

- Búsqueda del clima por ciudad
- Consulta del clima según la geolocalización del usuario
- Temperatura actual y sensación térmica
- Humedad, presión atmosférica y velocidad del viento
- Calidad del aire (AQI y componentes principales)
- Índice ultravioleta (UV)

## Requisitos

- Python 3
- Flask
- Flask-CORS
- Requests

## Instalación

1. Instala las dependencias:

   pip install -r requirements.txt

2. Configura la API key de OpenWeather en `config.json`.

3. Ejecuta la aplicación:

   python app.py

4. Abre el navegador en:

   http://localhost:5000

## Endpoints principales

- `GET /api/weather?city=bogota`
- `GET /api/weather?lat=4.71&lon=-74.07`
- `GET /api/health`

## Estructura del proyecto

- `index.html`: interfaz principal
- `styles.css`: estilos de la aplicación
- `script.js`: lógica del cliente y consumo del backend
- `app.py`: API del servidor y conexión con OpenWeather
- `config.json`: configuración de la API y puerto


