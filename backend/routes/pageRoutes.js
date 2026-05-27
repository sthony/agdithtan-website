import express from 'express';
import { get, all } from '../config/database.js';

const router = express.Router();

// Get header/navigation info
router.get('/header', async (req, res) => {
  try {
    const header = await get('SELECT * FROM header_content LIMIT 1');
    res.json(header || {});
  } catch (error) {
    console.error('Error fetching header:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get hero section
router.get('/hero', async (req, res) => {
  try {
    const hero = await get('SELECT * FROM hero_section LIMIT 1');
    res.json(hero || {});
  } catch (error) {
    console.error('Error fetching hero:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get about section
router.get('/about', async (req, res) => {
  try {
    const about = await get('SELECT * FROM about_section LIMIT 1');
    res.json(about || {});
  } catch (error) {
    console.error('Error fetching about:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get services
router.get('/services', async (req, res) => {
  try {
    const services = await all('SELECT * FROM services ORDER BY order_index ASC');
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio
router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await all('SELECT * FROM portfolio ORDER BY order_index ASC');
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get team
router.get('/team', async (req, res) => {
  try {
    const team = await all('SELECT * FROM team ORDER BY order_index ASC');
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await all('SELECT * FROM testimonials ORDER BY order_index ASC');
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get footer
router.get('/footer', async (req, res) => {
  try {
    const footer = await get('SELECT * FROM footer_content LIMIT 1');
    res.json(footer || {});
  } catch (error) {
    console.error('Error fetching footer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all content (for frontend initial load)
router.get('/all', async (req, res) => {
  try {
    const [header, hero, ticker, about, servicesSection, services, heroProject, portfolioSection, portfolio, teamSection, team, testimonialsSection, testimonials, banner, footer] = await Promise.all([
      get('SELECT * FROM header_content LIMIT 1'),
      get('SELECT * FROM hero_section LIMIT 1'),
      get('SELECT * FROM ticker_section LIMIT 1'),
      get('SELECT * FROM about_section LIMIT 1'),
      get('SELECT * FROM services_section LIMIT 1'),
      all('SELECT * FROM services ORDER BY order_index ASC'),
      get('SELECT * FROM hero_project LIMIT 1'),
      get('SELECT * FROM portfolio_section LIMIT 1'),
      all('SELECT * FROM portfolio ORDER BY order_index ASC'),
      get('SELECT * FROM team_section LIMIT 1'),
      all('SELECT * FROM team ORDER BY order_index ASC'),
      get('SELECT * FROM testimonials_section LIMIT 1'),
      all('SELECT * FROM testimonials ORDER BY order_index ASC'),
      get('SELECT * FROM banner_section LIMIT 1'),
      get('SELECT * FROM footer_content LIMIT 1')
    ]);

    res.json({
      header,
      hero,
      ticker,
      about,
      servicesSection,
      services,
      heroProject,
      portfolioSection,
      portfolio,
      teamSection,
      team,
      testimonialsSection,
      testimonials,
      banner,
      footer
    });
  } catch (error) {
    console.error('Error fetching all content:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
