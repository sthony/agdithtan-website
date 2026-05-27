import express from 'express';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const results = await query('SELECT * FROM website_settings ORDER BY section, setting_key');
    const settings = {};
    results.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get settings by section
router.get('/section/:section', async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM website_settings WHERE section = ? ORDER BY setting_key',
      [req.params.section]
    );
    const settings = {};
    results.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching section settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get single setting
router.get('/:key', async (req, res) => {
  try {
    const results = await query(
      'SELECT setting_value FROM website_settings WHERE setting_key = ?',
      [req.params.key]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ [req.params.key]: results[0].setting_value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// Update settings (admin only)
router.put('/:key', authenticate, authorize(['admin']), async (req, res) => {
  const { value, section } = req.body;

  try {
    const results = await query(
      'SELECT id FROM website_settings WHERE setting_key = ?',
      [req.params.key]
    );

    if (results.length === 0) {
      // Insert new setting
      await query(
        'INSERT INTO website_settings (setting_key, setting_value, section) VALUES (?, ?, ?)',
        [req.params.key, value, section || 'general']
      );
    } else {
      // Update existing setting
      await query(
        'UPDATE website_settings SET setting_value = ?, section = ? WHERE setting_key = ?',
        [value, section, req.params.key]
      );
    }

    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

export default router;
