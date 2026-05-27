import express from 'express';
import nodemailer from 'nodemailer';
import { run } from '../config/database.js';

const router = express.Router();

// POST /api/contact — public, no auth required
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, message } = req.body;

    if (!first_name || !email) {
      return res.status(400).json({ error: 'First name and email are required.' });
    }

    // 1. Save to database
    await run(
      'INSERT INTO contact_submissions (first_name, last_name, email, message) VALUES ($1, $2, $3, $4)',
      [first_name, last_name || '', email, message || '']
    );

    // 2. Send email notification (only if SMTP is configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Agdith Website" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || 'agdithtan@gmail.com',
        subject: `New Contact: ${first_name} ${last_name || ''}`,
        html: `
          <h2 style="font-family:sans-serif">New Contact Form Submission</h2>
          <table style="font-family:sans-serif;border-collapse:collapse;width:100%;max-width:560px">
            <tr><td style="padding:8px 0;color:#555;width:120px"><strong>Name</strong></td>
                <td style="padding:8px 0">${first_name} ${last_name || ''}</td></tr>
            <tr><td style="padding:8px 0;color:#555"><strong>Email</strong></td>
                <td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#555;vertical-align:top"><strong>Message</strong></td>
                <td style="padding:8px 0;white-space:pre-wrap">${message || '—'}</td></tr>
          </table>
        `,
      });
    } else {
      console.warn('SMTP not configured — email not sent. Set SMTP_USER and SMTP_PASS in .env');
    }

    res.json({ success: true, message: 'Your message has been sent!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
