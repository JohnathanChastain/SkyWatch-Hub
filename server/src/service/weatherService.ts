import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

interface WeatherResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    weather: Array<{
      icon: string;
      description: string;
      main: string;
    }>;
    dt_txt: string;
  }>;
}

class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private city = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'default_base_url';
    this.apiKey = process.env.API_KEY || 'default_api_key';
  }

  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error('API base URL or API key not found');
      }

      const response: Coordinates[] = await fetch(query).then((res) =>
        res.json() as Promise<Coordinates[]>
      );
      return response[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      throw new Error('City not found');
    }

    const { name, lat, lon, country, state } = locationData;

    const coordinates: Coordinates = {
      name,
      lat,
      lon,
      country,
      state,
    };

    return coordinates;
  }

  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const data = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(data);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather[]> {
    try {
      const response: WeatherResponse = await fetch(this.buildWeatherQuery(coordinates)).then(
        (res) => res.json()
      );
      if (!response || !response.list || response.list.length === 0) {
        throw new Error('Weather data not found');
      }

      const currentWeather: Weather = this.parseCurrentWeather(response.list[0]);

      const forecast: Weather[] = this.buildForecastArray(currentWeather, response.list);
      return forecast;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  private parseCurrentWeather(response: WeatherResponse['list'][0]): Weather {
    const parsedDate = dayjs.unix(response.dt).format('M/D/YYYY');

    const currentWeather = new Weather(
      this.city,
      parsedDate,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main
    );

    return currentWeather;
  }

  private buildForecastArray(currentWeather: Weather, weatherData: WeatherResponse['list']): Weather[] {
    const weatherForecast: Weather[] = [currentWeather];

    const filteredWeatherData = weatherData.filter((data) => {
      return data.dt_txt.includes('12:00:00');
    });

    for (const day of filteredWeatherData) {
      weatherForecast.push(
        new Weather(
          this.city,
          dayjs.unix(day.dt).format('M/D/YYYY'),
          day.main.temp,
          day.wind.speed,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description || day.weather[0].main
        )
      );
    }

    return weatherForecast;
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      if (coordinates) {
        const weather = await this.fetchWeatherData(coordinates);
        return weather;
      }

      throw new Error('Weather data not found');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new WeatherService();