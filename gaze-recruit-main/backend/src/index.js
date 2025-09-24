import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import questionsRoutes from './routes/questions.js';
import interviewsRoutes from './routes/interviews.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/uploads.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static file serving for uploads
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/interviews', interviewsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', uploadRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
