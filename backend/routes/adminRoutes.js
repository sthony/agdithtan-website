import express from 'express';
import { run, get, all } from '../config/database.js';

const router = express.Router();

// ============== HEADER ==============

router.get('/header', async (req, res) => {
  try {
    const header = await get('SELECT * FROM header_content LIMIT 1');
    res.json(header || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/header', async (req, res) => {
  try {
    const { company_name, logo_url, phone, email, website } = req.body;
    const existing = await get('SELECT * FROM header_content LIMIT 1');

    if (existing) {
      await run(
        'UPDATE header_content SET company_name = $1, logo_url = $2, phone = $3, email = $4, website = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
        [company_name, logo_url, phone, email, website, existing.id]
      );
    } else {
      await run(
        'INSERT INTO header_content (company_name, logo_url, phone, email, website) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [company_name, logo_url, phone, email, website]
      );
    }

    res.json({ message: 'Header updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/header', async (req, res) => {
  try {
    await run('DELETE FROM header_content');
    res.json({ message: 'Header deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== HERO SECTION ==============

router.get('/hero', async (req, res) => {
  try {
    const hero = await get('SELECT * FROM hero_section LIMIT 1');
    res.json(hero || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hero', async (req, res) => {
  try {
    const { title, subtitle, description, cta_text, cta_link, background_image_url } = req.body;
    const existing = await get('SELECT * FROM hero_section LIMIT 1');

    if (existing) {
      await run(
        'UPDATE hero_section SET title = $1, subtitle = $2, description = $3, cta_text = $4, cta_link = $5, background_image_url = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7',
        [title, subtitle, description, cta_text, cta_link, background_image_url, existing.id]
      );
    } else {
      await run(
        'INSERT INTO hero_section (title, subtitle, description, cta_text, cta_link, background_image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [title, subtitle, description, cta_text, cta_link, background_image_url]
      );
    }

    res.json({ message: 'Hero section updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/hero', async (req, res) => {
  try {
    await run('DELETE FROM hero_section');
    res.json({ message: 'Hero deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== ABOUT SECTION ==============

router.get('/about', async (req, res) => {
  try {
    const about = await get('SELECT * FROM about_section LIMIT 1');
    res.json(about || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/about', async (req, res) => {
  try {
    const { title, description, image_url } = req.body;
    const existing = await get('SELECT * FROM about_section LIMIT 1');

    if (existing) {
      await run(
        'UPDATE about_section SET title = $1, description = $2, image_url = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
        [title, description, image_url, existing.id]
      );
    } else {
      await run(
        'INSERT INTO about_section (title, description, image_url) VALUES ($1, $2, $3) RETURNING id',
        [title, description, image_url]
      );
    }

    res.json({ message: 'About section updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/about', async (req, res) => {
  try {
    await run('DELETE FROM about_section');
    res.json({ message: 'About deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== SERVICES SECTION (title + description) ==============

router.get('/services-section', async (req, res) => {
  try {
    const section = await get('SELECT * FROM services_section LIMIT 1');
    res.json(section || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/services-section', async (req, res) => {
  try {
    const { title, description } = req.body;
    const existing = await get('SELECT * FROM services_section LIMIT 1');
    if (existing) {
      await run(
        'UPDATE services_section SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [title, description, existing.id]
      );
    } else {
      await run(
        'INSERT INTO services_section (title, description) VALUES ($1, $2) RETURNING id',
        [title, description]
      );
    }
    res.json({ message: 'Services section updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== SERVICES ==============

router.get('/services', async (req, res) => {
  try {
    const services = await all('SELECT * FROM services ORDER BY order_index ASC');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const { title, description, icon_url, image_url, order_index } = req.body;
    const result = await run(
      'INSERT INTO services (title, description, icon_url, image_url, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, description, icon_url, image_url, order_index || 0]
    );
    res.json({ message: 'Service created', id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const { title, description, icon_url, image_url, order_index } = req.body;
    await run(
      'UPDATE services SET title = $1, description = $2, icon_url = $3, image_url = $4, order_index = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
      [title, description, icon_url, image_url, order_index || 0, req.params.id]
    );
    res.json({ message: 'Service updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await run('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== PORTFOLIO SECTION (title + description) ==============

router.get('/portfolio-section', async (req, res) => {
  try {
    const section = await get('SELECT * FROM portfolio_section LIMIT 1');
    res.json(section || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/portfolio-section', async (req, res) => {
  try {
    const { title, description } = req.body;
    const existing = await get('SELECT * FROM portfolio_section LIMIT 1');
    if (existing) {
      await run(
        'UPDATE portfolio_section SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [title, description, existing.id]
      );
    } else {
      await run(
        'INSERT INTO portfolio_section (title, description) VALUES ($1, $2) RETURNING id',
        [title, description]
      );
    }
    res.json({ message: 'Portfolio section updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== PORTFOLIO ==============

router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await all('SELECT * FROM portfolio ORDER BY order_index ASC');
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/portfolio', async (req, res) => {
  try {
    const { title, description, image_url, category, order_index } = req.body;
    const result = await run(
      'INSERT INTO portfolio (title, description, image_url, category, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, description, image_url, category, order_index || 0]
    );
    res.json({ message: 'Portfolio item created', id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/portfolio/:id', async (req, res) => {
  try {
    const { title, description, image_url, category, order_index } = req.body;
    await run(
      'UPDATE portfolio SET title = $1, description = $2, image_url = $3, category = $4, order_index = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
      [title, description, image_url, category, order_index || 0, req.params.id]
    );
    res.json({ message: 'Portfolio item updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/portfolio/:id', async (req, res) => {
  try {
    await run('DELETE FROM portfolio WHERE id = $1', [req.params.id]);
    res.json({ message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== TEAM ==============

router.get('/team-section', async (req, res) => {
  try {
    const section = await get('SELECT * FROM team_section LIMIT 1');
    res.json(section || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team-section', async (req, res) => {
  try {
    const { title, description } = req.body;
    const existing = await get('SELECT * FROM team_section LIMIT 1');
    if (existing) {
      await run(
        'UPDATE team_section SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [title, description, existing.id]
      );
    } else {
      await run('INSERT INTO team_section (title, description) VALUES ($1, $2)', [title, description]);
    }
    res.json({ message: 'Team section updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/team-section', async (req, res) => {
  try {
    await run('DELETE FROM team_section');
    res.json({ message: 'Team section deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/team', async (req, res) => {
  try {
    const team = await all('SELECT * FROM team ORDER BY order_index ASC');
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team', async (req, res) => {
  try {
    const { name, position, bio, image_url, email, phone, order_index } = req.body;
    const result = await run(
      'INSERT INTO team (name, position, bio, image_url, email, phone, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, position, bio, image_url, email, phone, order_index || 0]
    );
    res.json({ message: 'Team member created', id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/team/:id', async (req, res) => {
  try {
    const { name, position, bio, image_url, email, phone, order_index } = req.body;
    await run(
      'UPDATE team SET name = $1, position = $2, bio = $3, image_url = $4, email = $5, phone = $6, order_index = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8',
      [name, position, bio, image_url, email, phone, order_index || 0, req.params.id]
    );
    res.json({ message: 'Team member updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    await run('DELETE FROM team WHERE id = $1', [req.params.id]);
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== TESTIMONIALS ==============

router.get('/testimonials-section', async (req, res) => {
  try {
    const section = await get('SELECT * FROM testimonials_section LIMIT 1');
    res.json(section || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/testimonials-section', async (req, res) => {
  try {
    const { title, description } = req.body;
    const existing = await get('SELECT * FROM testimonials_section LIMIT 1');
    if (existing) {
      await run(
        'UPDATE testimonials_section SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [title, description, existing.id]
      );
    } else {
      await run('INSERT INTO testimonials_section (title, description) VALUES ($1, $2)', [title, description]);
    }
    res.json({ message: 'Testimonials section updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/testimonials-section', async (req, res) => {
  try {
    await run('DELETE FROM testimonials_section');
    res.json({ message: 'Testimonials section deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await all('SELECT * FROM testimonials ORDER BY order_index ASC');
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const { name, company, message, rating, image_url, order_index } = req.body;
    const result = await run(
      'INSERT INTO testimonials (name, company, message, rating, image_url, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, company, message, rating || 5, image_url, order_index || 0]
    );
    res.json({ message: 'Testimonial created', id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const { name, company, message, rating, image_url, order_index } = req.body;
    await run(
      'UPDATE testimonials SET name = $1, company = $2, message = $3, rating = $4, image_url = $5, order_index = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7',
      [name, company, message, rating || 5, image_url, order_index || 0, req.params.id]
    );
    res.json({ message: 'Testimonial updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await run('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== FOOTER ==============

router.get('/footer', async (req, res) => {
  try {
    const footer = await get('SELECT * FROM footer_content LIMIT 1');
    res.json(footer || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/footer', async (req, res) => {
  try {
    const { address, phone, email, social_media, copyright_text } = req.body;
    const existing = await get('SELECT * FROM footer_content LIMIT 1');

    if (existing) {
      await run(
        'UPDATE footer_content SET address = $1, phone = $2, email = $3, social_media = $4, copyright_text = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
        [address, phone, email, social_media, copyright_text, existing.id]
      );
    } else {
      await run(
        'INSERT INTO footer_content (address, phone, email, social_media, copyright_text) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [address, phone, email, social_media, copyright_text]
      );
    }

    res.json({ message: 'Footer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/footer', async (req, res) => {
  try {
    await run('DELETE FROM footer_content');
    res.json({ message: 'Footer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== HERO PROJECT ==============

router.get('/hero-project', async (req, res) => {
  try {
    const heroProject = await get('SELECT * FROM hero_project LIMIT 1');
    res.json(heroProject || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hero-project', async (req, res) => {
  try {
    const { title, description, image_url_left, image_url_right } = req.body;
    const existing = await get('SELECT * FROM hero_project LIMIT 1');

    if (existing) {
      await run(
        'UPDATE hero_project SET title = $1, description = $2, image_url_left = $3, image_url_right = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
        [title, description, image_url_left, image_url_right, existing.id]
      );
    } else {
      await run(
        'INSERT INTO hero_project (title, description, image_url_left, image_url_right) VALUES ($1, $2, $3, $4) RETURNING id',
        [title, description, image_url_left, image_url_right]
      );
    }

    res.json({ message: 'Hero Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/hero-project', async (req, res) => {
  try {
    await run('DELETE FROM hero_project');
    res.json({ message: 'Hero Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== BANNER ==============

router.get('/banner', async (req, res) => {
  try {
    const banner = await get('SELECT * FROM banner_section LIMIT 1');
    res.json(banner || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/banner', async (req, res) => {
  try {
    const { image_url } = req.body;
    const existing = await get('SELECT * FROM banner_section LIMIT 1');
    if (existing) {
      await run('UPDATE banner_section SET image_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [image_url, existing.id]);
    } else {
      await run('INSERT INTO banner_section (image_url) VALUES ($1)', [image_url]);
    }
    res.json({ message: 'Banner updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/banner', async (req, res) => {
  try {
    await run('DELETE FROM banner_section');
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== TICKER ==============

router.get('/ticker', async (req, res) => {
  try {
    const ticker = await get('SELECT * FROM ticker_section LIMIT 1');
    res.json(ticker || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ticker', async (req, res) => {
  try {
    const { items } = req.body;
    const existing = await get('SELECT * FROM ticker_section LIMIT 1');
    if (existing) {
      await run(
        'UPDATE ticker_section SET items = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [items, existing.id]
      );
    } else {
      await run('INSERT INTO ticker_section (items) VALUES ($1)', [items]);
    }
    res.json({ message: 'Ticker updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/ticker', async (req, res) => {
  try {
    await run('DELETE FROM ticker_section');
    res.json({ message: 'Ticker deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== CONTACT SUBMISSIONS ==============

router.get('/contact', async (req, res) => {
  try {
    const submissions = await all(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/contact/:id', async (req, res) => {
  try {
    await run('DELETE FROM contact_submissions WHERE id = $1', [req.params.id]);
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
