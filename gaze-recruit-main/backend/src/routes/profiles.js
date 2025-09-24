import { Router } from 'express';
import { prisma } from '../index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/me', authRequired, async (req, res) => {
  const profile = await prisma.profile.findFirst({ where: { user_id: req.user.id } });
  res.json(profile || null);
});

router.patch('/me', authRequired, async (req, res) => {
  const { position_applied } = req.body;
  const profile = await prisma.profile.findFirst({ where: { user_id: req.user.id } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const updated = await prisma.profile.update({ where: { id: profile.id }, data: { position_applied } });
  res.json(updated);
});

export default router;
