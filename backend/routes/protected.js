import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
 
 
 
const router = express.Router();
 
router.get('/dashboard-data', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Secure dashboard content', userId: req.user.id });
});
 
 
 
export default router;