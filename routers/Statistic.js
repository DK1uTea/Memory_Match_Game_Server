import express from 'express';
import { getGamingPerformance, getPlayedTimesOverTime } from '../controllers/Statistic.js';

const router = express.Router();

router.get('/stats/performance/:playerId', getGamingPerformance);

router.get('/stats/play-count/:playerId', getPlayedTimesOverTime);

export default router;