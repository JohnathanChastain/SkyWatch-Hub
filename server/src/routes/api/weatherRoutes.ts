import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', async (req: Request, res: Response) => {
  try {
    const cityName = req.body.cityName;

    const data = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const data = await HistoryService.getCities();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ error: 'City ID is required' });
      return;
    }

    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'Removed city from search history' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;