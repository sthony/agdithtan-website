import express from 'express';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM projects WHERE is_active = TRUE ORDER BY display_order'
    );
    res.json(results);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get projects by category
router.get('/category/:category', async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM projects WHERE category = ? AND is_active = TRUE ORDER BY display_order',
      [req.params.category]
    );
    res.json(results);
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM projects WHERE id = ?',
      [req.params.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project (admin only)
router.post('/', authenticate, authorize(['admin']), upload.single('image'), async (req, res) => {
  const { title, description, category, display_order = 0 } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    await query(
      'INSERT INTO projects (title, description, category, image_url, display_order) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, imageUrl, display_order]
    );
    res.status(201).json({ message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (admin only)
router.put('/:id', authenticate, authorize(['admin']), upload.single('image'), async (req, res) => {
  const { title, description, category, display_order, is_active } = req.body;

  try {
    let updateQuery = 'UPDATE projects SET title = ?, description = ?, category = ?, display_order = ?, is_active = ?';
    let params = [title, description, category, display_order, is_active !== undefined ? is_active : 1];

    if (req.file) {
      updateQuery += ', image_url = ?';
      params.push(`/uploads/${req.file.filename}`);
    }

    updateQuery += ' WHERE id = ?';
    params.push(req.params.id);

    await query(updateQuery, params);
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
