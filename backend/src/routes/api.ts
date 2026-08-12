import { Router } from 'express';
import { addToPin, getInstruments } from '../controllers/instrumentController';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Express TypeScript PostgreSQL API',
  });
});

// GET instruments route
router.get('/instruments', getInstruments);
router.post('/instrument/:id/pin',addToPin);

export default router;
