# Kent 11+ Grammar Schools Hub - PRD

## Original Problem Statement
Build a website for Kent 11+ admissions that includes:
1. A searchable list of Kent grammar schools with detailed information
2. Key dates timeline that highlights upcoming events based on current date
3. School comparison feature with authentic academic performance data
4. Practice papers tab for Kent Test (GL Assessment)
5. Independent Schools practice papers tab
6. Unique school-specific information on detail pages

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
   - Updated backend models (School, SchoolCreate, SchoolResponse) with new fields
   - Comparison table now organized in sections: Basic Info, Academic Performance, Admissions, Programs, Location
   - Key metrics highlighted with star indicator
   - Data sourced from GOV.UK school performance data 2024/25

2. **Local PDF Hosting for Practice Papers**
   - Downloaded 130 practice paper PDFs from 11plusguide.com
   - Created `/api/papers` endpoint to serve PDFs locally
   - Updated PracticePapersPage with `getLocalPaperUrl()` helper
   - Updated IndependentSchoolsPage with `getLocalPaperUrl()` helper
   - Papers stored at `/app/backend/static/papers/`

3. **School Detail Page Enhancement**
   - Added Academic Performance sidebar section (Ofsted, Attainment 8, Grade 5+, EBacc)
   - Color-coded Ofsted badges (Outstanding = green, Good = amber)

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, react-router-dom, axios, lucide-react
- **Backend**: Python 3, FastAPI, pymongo, Motor (async MongoDB)
- **Database**: MongoDB
- **Data**: Static seeded data from web scraping

## Key Files
- `/app/backend/server.py` - FastAPI server, all routes, models, data seeding
- `/app/frontend/src/App.js` - All React components and routing
- `/app/backend/static/papers/` - 130 practice paper PDFs

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/schools` | GET | List all schools with filtering |
| `/api/schools/{slug}` | GET | Get single school by slug |
| `/api/schools/compare` | POST | Compare multiple schools |
| `/api/dates` | GET | Get key dates |
| `/api/papers` | GET | List all available papers |
| `/api/papers/{filename}` | GET | Download specific paper PDF |
| `/api/stats` | GET | Get statistics |
| `/api/seed-schools` | POST | Re-seed database |

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
  "ofsted": "Outstanding | Good | Requires Improvement",
  "attainment_8": "float",
  "grade_5_english_maths": "float",
  "ebacc_entry": "float",
  "post_16_destination": "int",
  "admissions_criteria": "string",
  "catchment_distance": "string"
}
```

## Prioritized Backlog

### P0 (Completed)
- [x] Enhanced school comparison with academic data
- [x] Local PDF hosting

### P1 (Nice to Have)
- [ ] Source detailed catchment area postcodes for all schools
- [ ] Add more detailed Ofsted report links
- [ ] Source subjects offered by each school
- [ ] Add awards/achievements section

### P2 (Future Enhancements)
- [ ] Live data feeds (currently static seeded data)
- [ ] User accounts and favorites
- [ ] Bookmark/save schools feature
- [ ] Email notifications for key dates
- [ ] Mobile app version

## Testing
- Backend: 18 pytest tests passing (100%)
- Frontend: All flows verified working
- Test file: `/app/backend/tests/test_kent_schools.py`

## Known Limitations
- Data is static (seeded once, not live)
- Cut-off scores not publicly available for all schools
- Some academic data may be from different years

## Deployment
- Preview URL: https://school-picker.preview.emergentagent.com
- Deployment health check: Passed
- GitHub: Code pushed to user repository
