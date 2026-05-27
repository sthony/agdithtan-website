import express from 'express';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Submit contact form (public)
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    await query(
      'INSERT INTO contact_submissions (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || null, message]
    );
    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

// Get all submissions (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(results);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get submission by id (admin only)
router.get('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM contact_submissions WHERE id = ?',
      [req.params.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Mark as read
    await query(
      'UPDATE contact_submissions SET status = ? WHERE id = ? AND status = ?',
      ['read', req.params.id, 'unread']
    );

    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Update submission status (admin only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { status } = req.body;

  if (!['unread', 'read', 'replied'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await query(
      'UPDATE contact_submissions SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// Delete submission (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await query(
      'DELETE FROM contact_submissions WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

export default router;
