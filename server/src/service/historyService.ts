import fs from 'fs';

// TODO: Define a City class with name and id properties
class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

class HistoryService {
  // a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.promises.readFile('searchHistory.json', 'utf-8');
    return JSON.parse(data) as City[];
  }
  
  private async write(cities: City[]) {
    const data = JSON.stringify(cities, null, 2);
    await fs.promises.writeFile('searchHistory.json', data, 'utf-8');
  }

  // a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data = await this.read();
    return data;
  }

  // an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.getCities();
    const newCity = { id: cities.length + 1, name: city };
    cities.push(newCity);
    await this.write(cities);
  }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: number) {
    const cities = await this.getCities();
    const newCities = cities.filter((city) => city.id !== id);
    await this.write(newCities);
  }

  // saveHistory method that saves the current state of the cities to the searchHistory.json file
  async saveHistory(cities: City[]) {
    await this.write(cities);
  }
}

export default new HistoryService();
