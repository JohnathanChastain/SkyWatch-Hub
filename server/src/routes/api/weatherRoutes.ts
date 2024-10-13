import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // GET weather data from city name
  const cityName = req.body.city;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Assuming WeatherService has a method getWeatherByCityName
    const weatherData = await WeatherService.getWeatherByCityName(cityName);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
  // save city to search history
  // Assuming HistoryService has a method saveHistory
  await HistoryService.saveHistory(cityName);
  return res.status(200).json({message: 'Success'})
});



// GET search history
router.get('/history', async (_req: Request, _res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {});

export default router;
