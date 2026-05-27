import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { testConnection } from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import sectionsRoutes from './routes/sections.js';
import projectsRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files (uploads and frontend build)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve frontend (SPA fallback)
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('Cannot start server without database connection');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     Agdith Website Backend Server      ║
╚════════════════════════════════════════╝

Server running on: http://localhost:${PORT}
Frontend: http://localhost:5173
Admin Dashboard: http://localhost:5173/admin

API Documentation:
  POST   /api/auth/login          - Login
  POST   /api/auth/register       - Register (admin only)
  GET    /api/settings            - Get all settings
  GET    /api/sections            - Get all sections
  POST   /api/sections            - Create section (admin)
  PUT    /api/sections/:id        - Update section (admin)
  GET    /api/projects            - Get all projects
  POST   /api/projects            - Create project (admin)
  PUT    /api/projects/:id        - Update project (admin)
  POST   /api/contact             - Submit contact form
  GET    /api/contact             - Get submissions (admin)

Environment: ${process.env.NODE_ENV || 'development'}
    `);
  });
}

start();
