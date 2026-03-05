# Kent 11+ Schools Hub

A comprehensive web application for parents and students preparing for Kent Grammar School admissions. Features school information, comparison tools, key dates, and practice papers.

## Features

- **31 Kent Grammar Schools** - Detailed information including academic performance data
- **School Comparison** - Compare schools side-by-side with Ofsted ratings, Attainment 8 scores, and more
- **Key Dates Timeline** - Dynamic calendar highlighting upcoming admission events
- **Practice Papers** - 130 downloadable PDF practice papers for Kent Test preparation
- **Independent School Papers** - Additional papers from leading independent schools

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router, Axios
- **Backend**: Python 3.11+, FastAPI, Motor (async MongoDB)
- **Database**: MongoDB

---

## Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Python 3.11+
- MongoDB (local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/kent-11plus-hub.git
cd kent-11plus-hub
```

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=kent_schools
```

### 3. Set Up Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
yarn install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

### 5. Seed the Database

Open your browser and visit:
```
http://localhost:3000
```

Or seed via API:
```bash
curl -X POST http://localhost:8001/api/seed-schools
```

---

## Project Structure

```
kent-11plus-hub/
├── backend/
│   ├── server.py           # FastAPI application & routes
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   └── static/
│       └── papers/        # Practice paper PDFs (130 files)
│
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React application
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utility functions
│   ├── package.json       # Node dependencies
│   └── .env              # Environment variables
│
├── memory/
│   └── PRD.md            # Product requirements document
│
├── README.md             # This file
└── ARCHITECTURE.md       # Infrastructure & hosting guide
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `kent_schools` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:8001` |

---

## API Reference

### Schools

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/schools` | GET | List all schools |
| `/api/schools?gender=boys` | GET | Filter by gender |
| `/api/schools?sort_by=attainment_8` | GET | Sort by field |
| `/api/schools/{slug}` | GET | Get school by slug |
| `/api/schools/compare` | POST | Compare schools |

### Papers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/papers` | GET | List all papers |
| `/api/papers/{filename}` | GET | Download PDF |

### Other

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dates` | GET | Get key dates |
| `/api/stats` | GET | Get statistics |
| `/api/seed-schools` | POST | Seed database |

---

## Deployment

### Option 1: Vercel + Railway (Recommended - ~$7/month)

**Frontend (Vercel):**
1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set environment variable: `REACT_APP_BACKEND_URL=https://your-backend.railway.app`
4. Deploy

**Backend (Railway):**
1. Connect repo to [Railway](https://railway.app)
2. Set environment variables:
   - `MONGO_URL=mongodb+srv://...`
   - `DB_NAME=kent_schools`
3. Deploy

**Database (MongoDB Atlas):**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Update `MONGO_URL` in Railway

### Option 2: DigitalOcean App Platform (~$12/month)

1. Create new App in [DigitalOcean](https://www.digitalocean.com/products/app-platform)
2. Connect GitHub repo
3. Configure:
   - Frontend: Static Site component
   - Backend: Web Service component
4. Add MongoDB managed database or use Atlas

### Option 3: Render (Free tier available)

1. Create account at [Render](https://render.com)
2. Create Web Service for backend
3. Create Static Site for frontend
4. Use MongoDB Atlas for database

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed hosting options and costs.

---

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
yarn test
```

### Linting

```bash
# Backend
cd backend
ruff check .

# Frontend
cd frontend
yarn lint
```

### Adding New Schools

1. Edit `KENT_GRAMMAR_SCHOOLS` array in `backend/server.py`
2. Run seed endpoint: `POST /api/seed-schools`

### Adding New Papers

1. Add PDF files to `backend/static/papers/`
2. Update paper arrays in `frontend/src/App.js`

---

## Troubleshooting

### Backend won't start

```bash
# Check if port is in use
lsof -i :8001

# Check MongoDB connection
mongosh "your-connection-string"
```

### Frontend API errors

```bash
# Verify backend is running
curl http://localhost:8001/api/health

# Check CORS settings in server.py
```

### Database connection issues

```bash
# Test MongoDB connection
python -c "from pymongo import MongoClient; print(MongoClient('your-url').admin.command('ping'))"
```

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit Pull Request

---

## License

MIT License - see LICENSE file for details.

---

## Support

For questions or issues:
- Open a GitHub issue
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for infrastructure details

---

## Acknowledgments

- School data sourced from official Kent County Council and GOV.UK
- Academic performance data from DfE school performance tables
- Practice papers from various educational publishers
