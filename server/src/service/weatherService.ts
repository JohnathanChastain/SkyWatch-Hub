import dotenv from 'dotenv';
dotenv.config();

// interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Define a class for the Weather object
class Weather {
  temperature: number = 0;
  description: string = '';
  windSpeed: number = 0;
}

// Complete the WeatherService class
class WeatherService {
  // baseURL, API key, and city name properties
  private baseURL: string = process.env.BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';
  private cityName: string = '';

  // fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/geocode?address=${query}&key=${this.apiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return response.json();
  }
  // destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lng } = locationData.results[0].geometry.location;
    return { latitude: lat, longitude: lng };
  }
  // buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return encodeURIComponent(this.cityName);
  }
  // buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }
  // fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(`${this.baseURL}/weather?${query}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }
  // parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { main, weather, wind } = response;
    const currentWeather = new Weather();
    // Use the destructured elements to populate the Weather object
    currentWeather.temperature = main.temp;
    currentWeather.description = weather[0].description;
    currentWeather.windSpeed = wind.speed;
    return currentWeather;
  }
  // buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    // Example usage of currentWeather and weatherData
    console.log(currentWeather);
    console.log(weatherData);
  }

  // getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.daily);
  }

  // getWeatherByCityName method
  async getWeatherByCityName(cityName: string) {
    return this.getWeatherForCity(cityName);
  }
}

export default new WeatherService();
