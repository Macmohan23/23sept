import { Router } from 'express';
import { prisma } from '../index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const list = await prisma.interview.findMany({
    where: { candidate: { user_id: req.user.id } },
    orderBy: { created_at: 'desc' }
  });
  res.json(list);
});

router.post('/', authRequired, async (req, res) => {
  try {
    const { score, gaze_warnings, completion_time, job_role, video_recording_url, status, started_at, completed_at } = req.body;
    const profile = await prisma.profile.findFirst({ where: { user_id: req.user.id } });
    if (!profile) return res.status(400).json({ error: 'Profile not found' });

    const created = await prisma.interview.create({
      data: {
        candidate_id: profile.id,
        score: score ?? 0,
        gaze_warnings: gaze_warnings ?? 0,
        completion_time: completion_time ?? 0,
        job_role: job_role || profile.position_applied || 'unknown',
        video_recording_url: video_recording_url || null,
        status: status || 'completed',
        started_at: started_at ? new Date(started_at) : new Date(),
        completed_at: completed_at ? new Date(completed_at) : new Date()
      }
    });
    res.json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create interview' });
  }
});

router.post('/:id/answers', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const answers = Array.isArray(req.body) ? req.body : [];
    if (!answers.length) return res.json({ inserted: 0 });
    await prisma.answer.createMany({ data: answers.map(a => ({
      interview_id: Number(id),
      question_id: a.question_id,
      answer_text: a.answer_text,
      ai_score: a.ai_score ?? null,
      ai_feedback: a.ai_feedback ?? null
    }))});
    res.json({ inserted: answers.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save answers' });
  }
});

export default router;
