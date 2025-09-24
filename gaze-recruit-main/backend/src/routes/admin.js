import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Simple admin endpoint without auth gate for now (front-end uses localStorage token)
router.get('/interviews', async (req, res) => {
  const data = await prisma.interview.findMany({
    where: { status: 'completed' },
    orderBy: { completed_at: 'desc' },
    include: { candidate: true }
  });
  const formatted = data.map(i => ({
    id: i.id,
    score: i.score,
    gaze_warnings: i.gaze_warnings,
    completed_at: i.completed_at,
    video_recording_url: i.video_recording_url,
    profiles: {
      full_name: i.candidate?.full_name || null,
      position_applied: i.candidate?.position_applied || null
    }
  }));
  res.json(formatted);
});

export default router;
