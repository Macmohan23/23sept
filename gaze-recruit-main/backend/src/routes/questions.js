import { Router } from 'express';
import { prisma } from '../index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const { job_role } = req.query;
  const questions = await prisma.question.findMany({
    where: job_role ? { job_role } : {},
    orderBy: { question_order: 'asc' }
  });
  res.json(questions);
});

export default router;
