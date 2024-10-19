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
  tempF: any;
  iconDescription: any;
  icon: any;
  date: any;
  city: any;
  humidity: any;
}

// Complete the WeatherService class
class WeatherService {
  // baseURL, API key, and city name properties
  private baseURL: string = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';
  private cityName: string = '';

  // fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    // console.log(`${this.baseURL}/geo/1.0/direct?q=${query},us&appid=${this.apiKey}`)
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query},us&appid=${this.apiKey}`);
    if (!response.ok) {
      // console.log(response)
      throw new Error('Failed to fetch location data');
    }
    return response.json();
  }
  // destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    // console.log(locationData[0])
    return { latitude: lat, longitude: lon };
  }
  // buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return encodeURIComponent(this.cityName);
  }
 
  // fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    // const query = this.buildWeatherQuery(coordinates);
    // console.log(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`)
    const response = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }
  // parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    // GET FROM RESPONSE AND ADD TO CURRENT WEATHER OBJECT
    // city, date, icon, iconDescription, tempF, windSpeed, humidity
    console.log('WEATHER RESPONSE', response);
    console.log('TODAYS WEATHER', response.list[0]);
    const { main, weather, wind } = response.list[0];
    // console.log(response.list[0])
    const currentWeather = new Weather();
    // Use the destructured elements to populate the Weather object
    currentWeather.city = response.city.name;
    currentWeather.date = response.list[0].dt_txt;
    currentWeather.icon = weather[0].icon;
    currentWeather.iconDescription = weather[0].description;
    currentWeather.tempF = main.temp;
    currentWeather.windSpeed = wind.speed;
    currentWeather.humidity = main.humidity;

    return currentWeather;
  }
  // buildForecastArray method
  private buildForecastArray(currentWeather: Weather): Weather[] {
    console.log(currentWeather)
    const forecastArray = [];
    for (let i = 0; i < 5; i+8) {
      forecastArray.push({...currentWeather});
    };
    return forecastArray
  }


  // getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    
    const weatherData = await this.fetchWeatherData(coordinates);
    // console.log(weatherData ,'Help!')
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather);
  }

  // getWeatherByCityName method
  async getWeatherByCityName(cityName: string) {
    return this.getWeatherForCity(cityName);
  }
}

export default new WeatherService();
