import { Router, type Request, type Response } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // GET weather data from city name
  // console.log(req)
  const cityName = req.body.cityName;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Assuming WeatherService has a method getWeatherByCityName
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    // await HistoryService.saveHistory(cityName);
    return res.json(weatherData);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting weather data:', error.message);
     return res.status(500).json({ error: error.message });
    } else {
      console.error('Unexpected error:', error);
     return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// GET search history
router.get('/history', async (_req: Request, _res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {});

export default router;
