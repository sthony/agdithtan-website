import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const schema = `
-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Website Settings (Header, Footer, etc.)
CREATE TABLE IF NOT EXISTS website_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value LONGTEXT,
  section VARCHAR(100) COMMENT 'header, footer, hero, about, etc',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services/Sections content
CREATE TABLE IF NOT EXISTS sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description LONGTEXT,
  image_url VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Portfolio/Projects
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  image_url VARCHAR(255),
  category VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  description LONGTEXT,
  image_url VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message LONGTEXT NOT NULL,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media/Images management
CREATE TABLE IF NOT EXISTS media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path VARCHAR(255) NOT NULL,
  file_size INT,
  mime_type VARCHAR(50),
  alt_text VARCHAR(255),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_slug ON sections(slug);
CREATE INDEX idx_category ON projects(category);
CREATE INDEX idx_status ON contact_submissions(status);
CREATE INDEX idx_created ON contact_submissions(created_at);
`;

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  });

  try {
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'agdith_db'}`);
    console.log('✓ Database created or already exists');

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'agdith_db'}`);

    // Execute schema
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    console.log('✓ Database tables created');

    // Create default admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    try {
      await connection.query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [process.env.ADMIN_EMAIL || 'admin@agdith.com', hashedPassword, 'admin']
      );
      console.log('✓ Default admin user created');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('✓ Admin user already exists');
      } else {
        throw error;
      }
    }

    // Insert default settings
    const defaultSettings = [
      { key: 'company_name', value: 'Agdith', section: 'header' },
      { key: 'company_logo', value: '/images/logo.png', section: 'header' },
      { key: 'company_phone', value: '+1234567890', section: 'header' },
      { key: 'company_email', value: 'info@agdith.com', section: 'header' },
      { key: 'hero_title', value: 'Welcome to Agdith', section: 'hero' },
      { key: 'hero_subtitle', value: 'Professional Services for Your Business', section: 'hero' },
      { key: 'hero_image', value: '/images/hero.jpg', section: 'hero' },
      { key: 'footer_text', value: '© 2024 Agdith. All rights reserved.', section: 'footer' },
      { key: 'footer_address', value: 'Your Address Here', section: 'footer' },
      { key: 'social_facebook', value: 'https://facebook.com', section: 'social' },
      { key: 'social_instagram', value: 'https://instagram.com', section: 'social' },
      { key: 'social_linkedin', value: 'https://linkedin.com', section: 'social' }
    ];

    for (const setting of defaultSettings) {
      try {
        await connection.query(
          'INSERT INTO website_settings (setting_key, setting_value, section) VALUES (?, ?, ?)',
          [setting.key, setting.value, setting.section]
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log('✓ Default settings created');

    console.log('\n✓ Database setup completed successfully!');
    console.log(`Default Admin Email: ${process.env.ADMIN_EMAIL || 'admin@agdith.com'}`);
    console.log(`Default Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n⚠️  Make sure to change the default password after first login!');

  } catch (error) {
    console.error('✗ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
