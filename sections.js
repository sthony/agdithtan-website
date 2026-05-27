import express from 'express';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all sections
router.get('/', async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM sections WHERE is_active = TRUE ORDER BY display_order'
    );
    res.json(results);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

// Get section by slug
router.get('/:slug', async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM sections WHERE slug = ?',
      [req.params.slug]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({ error: 'Failed to fetch section' });
  }
});

// Create section (admin only)
router.post('/', authenticate, authorize(['admin']), upload.single('image'), async (req, res) => {
  const { slug, title, subtitle, description, display_order = 0 } = req.body;

  if (!slug || !title) {
    return res.status(400).json({ error: 'Slug and title are required' });
  }

  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    await query(
      'INSERT INTO sections (slug, title, subtitle, description, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [slug, title, subtitle, description, imageUrl, display_order]
    );
    res.status(201).json({ message: 'Section created successfully' });
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ error: 'Failed to create section' });
  }
});

// Update section (admin only)
router.put('/:id', authenticate, authorize(['admin']), upload.single('image'), async (req, res) => {
  const { title, subtitle, description, display_order, is_active } = req.body;

  try {
    let updateQuery = 'UPDATE sections SET title = ?, subtitle = ?, description = ?, display_order = ?, is_active = ?';
    let params = [title, subtitle, description, display_order, is_active !== undefined ? is_active : 1];

    if (req.file) {
      updateQuery += ', image_url = ?';
      params.push(`/uploads/${req.file.filename}`);
    }

    updateQuery += ' WHERE id = ?';
    params.push(req.params.id);

    await query(updateQuery, params);
    res.json({ message: 'Section updated successfully' });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// Delete section (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await query('DELETE FROM sections WHERE id = ?', [req.params.id]);
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

export default router;
