# Kent 11+ Grammar Schools Hub - PRD

## Original Problem Statement
Build a website for Kent 11+ admissions that includes:
1. A searchable list of Kent grammar schools with detailed information
2. Key dates timeline that highlights upcoming events based on current date
3. School comparison feature with authentic academic performance data
4. Practice papers tab for Kent Test (GL Assessment)
5. Independent Schools practice papers tab
6. Unique school-specific information on detail pages
7. Open Events feature with hybrid approach (manual + scraping assistance)
8. Cut-off scores display for schools

## User Personas
- Parents researching Kent grammar schools for their children
- Students preparing for the Kent 11+ Test
- Families comparing schools to make informed decisions

## Core Requirements
| Requirement | Status | Date Completed |
|-------------|--------|----------------|
| Clone GitHub repo | Skipped (auth issues) | - |
| Scrape Kent grammar schools data | Done | Session 1 |
| Dynamic Key Dates timeline | Done | Session 1 |
| Unique school-specific content | Done | Session 1 |
| Practice Papers tab (Kent Test) | Done | Session 1 |
| Independent Schools papers tab | Done | Session 1 |
| Enhanced school comparison with academic data | Done | March 5, 2026 |
| Local PDF hosting for practice papers | Done | March 5, 2026 |
| Open Events feature (Hybrid approach) | Done | March 5, 2026 |
| Cut-off Scores feature | Done | March 5, 2026 |
| Admin interface for data management | Done | March 5, 2026 |

## What's Been Implemented

### Session 1 (Previous Fork)
- Full-stack app: React + FastAPI + MongoDB
- 31 Kent grammar schools with searchable/filterable list
- Dynamic Key Dates timeline with date-aware highlighting
- School detail pages with unique highlights
- Practice Papers page (Kent 11+ GL Assessment)
- Independent Schools papers page
- School comparison tool (basic version)
- GitHub push completed

### March 5, 2026 (Current Session)
1. **Enhanced School Comparison with Academic Performance Data**
   - Added Ofsted rating, Attainment 8 score, Grade 5+ English & Maths %, EBacc entry %, Post-16 destination %
   - Updated backend models with new fields
   - Comparison table organized in sections with key metrics highlighted

2. **Local PDF Hosting for Practice Papers**
   - Downloaded 130 practice paper PDFs
   - Created `/api/papers` endpoint to serve PDFs locally

3. **Open Events Feature (NEW)**
   - New MongoDB collection: `open_events`
   - API endpoints: GET/POST/PUT/DELETE `/api/open-events`
   - OpenEventsPage component showing events grouped by month
   - Filter by school, event type badges, "No booking required" indicators
   - Links to school websites

4. **Cut-off Scores Feature (NEW)**
   - New MongoDB collection: `cut_off_scores`
   - API endpoints: GET/POST/PUT/DELETE `/api/cut-off-scores`
   - CutOffScoresPage with year filtering (2026, 2025, 2024)
   - Score cards showing Inner/Outer Area cut-offs, Governors' places, distances, mean scores
   - Notes and source URL references

5. **Admin Page with Scrape Helper (NEW)**
   - Three tabs: Open Events, Cut-off Scores, Scrape Helper
   - Forms for adding new events and scores
   - Scrape Helper extracts dates, times, and scores from school websites
   - List of existing data with delete functionality

6. **Initial Data Seeded**
   - 7 Open Events from TWGGS, The Judd School, The Skinners' School
   - 2 Cut-off Scores for 2026 entry (Judd: 389/403, Skinners: 372/384)

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, react-router-dom, axios, lucide-react
- **Backend**: Python 3, FastAPI, pymongo, Motor (async MongoDB), httpx, BeautifulSoup4
- **Database**: MongoDB

## Key Files
- `/app/backend/server.py` - FastAPI server, all routes, models, data seeding
- `/app/frontend/src/App.js` - All React components and routing (2800+ lines)
- `/app/backend/static/papers/` - 130 practice paper PDFs

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/schools` | GET | List all schools with filtering |
| `/api/schools/{slug}` | GET | Get single school by slug |
| `/api/schools/compare` | POST | Compare multiple schools |
| `/api/key-dates` | GET | Get key dates |
| `/api/papers` | GET | List all available papers |
| `/api/papers/{filename}` | GET | Download specific paper PDF |
| `/api/open-events` | GET | List all open events |
| `/api/open-events` | POST | Create new open event |
| `/api/open-events/{id}` | PUT | Update open event |
| `/api/open-events/{id}` | DELETE | Delete open event |
| `/api/cut-off-scores` | GET | List all cut-off scores |
| `/api/cut-off-scores` | POST | Create new cut-off score |
| `/api/cut-off-scores/{id}` | PUT | Update cut-off score |
| `/api/cut-off-scores/{id}` | DELETE | Delete cut-off score |
| `/api/scrape-school-page` | POST | Extract data from school URL |
| `/api/seed-open-events` | POST | Seed initial events data |
| `/api/seed-cut-off-scores` | POST | Seed initial scores data |
| `/api/health` | GET | Health check endpoint |

## Database Schema

### schools collection
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "county": "Kent",
  "address": "string",
  "type": "Boys Grammar | Girls Grammar | Co-educational",
  "gender": "boys | girls | mixed",
  "pupils": "int",
  "places_year7": "int",
  "competition": "string",
  "competition_ratio": "float",
  "exam_format": "Kent 11 Plus Test",
  "website": "string",
  "description": "string",
  "specialist_status": "string",
  "sixth_form": "string",
  "highlights": ["string"],
  "founded": "string",
  "ofsted": "Outstanding | Good",
  "attainment_8": "float",
  "grade_5_english_maths": "float",
  "ebacc_entry": "float",
  "post_16_destination": "int",
  "admissions_criteria": "string",
  "catchment_distance": "string"
}
```

### open_events collection (NEW)
```json
{
  "id": "uuid",
  "school_slug": "string",
  "school_name": "string",
  "event_type": "Open Evening | Open Morning | Year 5 Open Morning | Sixth Form Options Evening",
  "event_date": "24 September 2025",
  "event_time": "4:30pm to 7:30pm",
  "headteacher_speaks": "5:30pm and 6:30pm",
  "booking_required": "boolean",
  "booking_url": "string",
  "notes": "string",
  "source_url": "string",
  "last_updated": "datetime",
  "created_at": "datetime"
}
```

### cut_off_scores collection (NEW)
```json
{
  "id": "uuid",
  "school_slug": "string",
  "school_name": "string",
  "entry_year": "2026",
  "inner_area_score": "int",
  "outer_area_score": "int",
  "governors_score": "int",
  "pupil_premium_score": "int",
  "furthest_distance_inner": "5.474 miles",
  "furthest_distance_outer": "13.921 miles",
  "total_offers": "int",
  "inner_area_places": "int",
  "outer_area_places": "int",
  "mean_score_inner": "float",
  "mean_score_outer": "float",
  "notes": "string",
  "source_url": "string",
  "last_updated": "datetime",
  "created_at": "datetime"
}
```

## Prioritized Backlog

### P0 (Completed)
- [x] Enhanced school comparison with academic data
- [x] Local PDF hosting
- [x] Open Events feature (Hybrid approach)
- [x] Cut-off Scores feature
- [x] Admin interface for data management

### P1 (Recommended Next)
- [ ] **Frontend Refactoring** - Break down App.js (2800+ lines) into separate components and pages
- [ ] Add more school open events data (currently only 3 schools have events)
- [ ] Add more cut-off scores data (currently only 2 schools have scores)
- [ ] Source subjects offered by each school

### P2 (Future Enhancements)
- [ ] Source detailed catchment area postcodes for all schools
- [ ] Add more detailed Ofsted report links
- [ ] Add awards/achievements section
- [ ] Live data feeds (currently static seeded data)
- [ ] User accounts and favorites
- [ ] Bookmark/save schools feature
- [ ] Email notifications for key dates
- [ ] Mobile app version

## Testing
- Backend: 31 pytest tests passing (100%)
  - 18 original tests
  - 13 new tests for open events and cut-off scores
- Frontend: All flows verified working
- Test files:
  - `/app/backend/tests/test_kent_schools.py`
  - `/app/backend/tests/test_open_events_cutoff.py`

## Known Limitations
- Data is static (seeded once, not live)
- Cut-off scores only available for 2 schools currently
- Open events only available for 3 schools currently
- Frontend is a monolithic App.js file (needs refactoring)

## Deployment
- Preview URL: https://kent-11-plus-hub.preview.emergentagent.com
- Deployment health check: Passed
- GitHub: Code pushed to user repository
- Deployment documentation: `/app/DEPLOYMENT.md`

## Update Strategy for Open Events
The hybrid approach allows:
1. **Manual entry**: Use Admin page to add events directly
2. **Scrape assistance**: Use Scrape Helper to extract dates/times from school websites
3. **Regular updates**: Check school websites monthly during key periods (June-October)
4. **Source tracking**: Every event links to its source URL for verification
