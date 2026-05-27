# Agdith Company Profile - Complete Setup & Deployment Guide

## Project Structure

```
agdith-website/
├── backend/
│   ├── config/
│   │   ├── database.js
│   ├── middleware/
│   │   ├── auth.js
│   ├── routes/
│   │   ├── pageRoutes.js
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── uploadRoutes.js
│   ├── database/
│   │   └── agdith.db (created automatically)
│   ├── uploads/
│   │   └── images/
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.vue
│   │   │   ├── Hero.vue
│   │   │   ├── About.vue
│   │   │   ├── Services.vue
│   │   │   ├── Portfolio.vue
│   │   │   ├── Team.vue
│   │   │   ├── Testimonials.vue
│   │   │   └── Footer.vue
│   │   ├── api/
│   │   │   └── pages.js
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Basic knowledge of Node.js and Vue.js

## Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Initialize database
npm run db:init

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Initial Setup

### 1. Create Admin Account

Make a POST request to create your first admin user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password",
    "email": "admin@agdith.com"
  }'
```

### 2. Login to Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password"
  }'
```

You'll receive a JWT token to use for admin endpoints.

### 3. Add Content via Admin Routes

Use the token from login to add content:

```bash
curl -X POST http://localhost:5000/api/admin/header \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "company_name": "Agdith",
    "phone": "+62 812-3456-7890",
    "email": "info@agdith.com",
    "website": "https://agdith.com"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create admin user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/verify` - Verify token (requires auth)

### Public Page Content
- `GET /api/pages/all` - Get all page content
- `GET /api/pages/header` - Get header
- `GET /api/pages/hero` - Get hero section
- `GET /api/pages/about` - Get about section
- `GET /api/pages/services` - Get services
- `GET /api/pages/portfolio` - Get portfolio items
- `GET /api/pages/team` - Get team members
- `GET /api/pages/testimonials` - Get testimonials
- `GET /api/pages/footer` - Get footer

### Admin Management (requires JWT token)
- `POST /api/admin/header` - Create/update header
- `POST /api/admin/hero` - Create/update hero
- `POST /api/admin/about` - Create/update about
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service
- `POST /api/admin/portfolio` - Create portfolio item
- `PUT /api/admin/portfolio/:id` - Update portfolio item
- `DELETE /api/admin/portfolio/:id` - Delete portfolio item
- `POST /api/admin/team` - Create team member
- `PUT /api/admin/team/:id` - Update team member
- `DELETE /api/admin/team/:id` - Delete team member
- `POST /api/admin/testimonials` - Create testimonial
- `PUT /api/admin/testimonials/:id` - Update testimonial
- `DELETE /api/admin/testimonials/:id` - Delete testimonial
- `POST /api/admin/footer` - Create/update footer

### File Upload (requires JWT token)
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## Build for Production

### Frontend Build
```bash
cd frontend
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Backend for Production

Update `.env`:
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-very-secure-secret-key-change-this
```

Start with:
```bash
npm start
```

## Deployment Guide

### Option 1: Traditional VPS (Recommended for Indonesia Hosting)

1. **SSH into your server**
```bash
ssh user@your-server-ip
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone your repository**
```bash
cd /var/www
git clone your-repo-url agdith
cd agdith
```

4. **Setup backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with production values
npm run db:init
```

5. **Build frontend**
```bash
cd ../frontend
npm install
npm run build
```

6. **Copy frontend dist to backend**
```bash
cp -r dist/* ../backend/public/
```

7. **Start with PM2 (process manager)**
```bash
npm install -g pm2
cd backend
pm2 start server.js --name "agdith-api"
pm2 save
```

### Option 2: Docker Deployment

Create `Dockerfile` in root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy backend and frontend
COPY backend ./backend
COPY frontend ./frontend

# Build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Start backend
WORKDIR /app/backend
EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t agdith .
docker run -p 5000:5000 -v agdith-db:/app/backend/database agdith
```

## Admin Dashboard Setup

For a simple admin dashboard using AdminLTE, create `backend/public/admin/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Agdith Admin Dashboard</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.1/dist/css/adminlte.min.css">
</head>
<body class="hold-transition login-page">
  <div class="login-box">
    <h2>Agdith Admin</h2>
    <input type="text" id="username" placeholder="Username">
    <input type="password" id="password" placeholder="Password">
    <button onclick="login()">Login</button>
  </div>
  
  <script>
    async function login() {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/admin/dashboard.html';
      }
    }
  </script>
</body>
</html>
```

## Database

SQLite database is automatically created with these tables:
- `admins` - Admin users
- `header_content` - Header/navigation
- `hero_section` - Hero banner
- `about_section` - About page
- `services` - Services list
- `portfolio` - Portfolio/projects
- `team` - Team members
- `testimonials` - Client testimonials
- `footer_content` - Footer info

## Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
JWT_SECRET=change-this-in-production
FRONTEND_URL=http://localhost:5173
DATABASE_PATH=./database/agdith.db
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Database Lock Error
Delete `database/agdith.db` and reinitialize:
```bash
rm backend/database/agdith.db
npm run db:init
```

### CORS Issues
Update backend server.js CORS origins:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));
```

## Performance Tips

1. **Image Optimization**: Compress images before uploading
2. **Database**: Regular backups of `database/agdith.db`
3. **CDN**: Serve images from CDN in production
4. **Caching**: Add caching headers for static assets
5. **Monitoring**: Use PM2 monitoring or similar

## Support & Maintenance

- Regular database backups
- Monitor JWT token expiration
- Keep Node.js updated
- Update dependencies monthly

---

For questions or issues, refer to the API endpoints documentation above.
