# Kent 11+ Grammar Schools Hub - Product Requirements Document

## Original Problem Statement
Build a Kent 11+ Grammar Schools Hub application that displays comprehensive information about all 32 Kent grammar schools. Data scraped from 11plusguide.com. Features include: searchable/filterable school list, individual school detail pages, comparison feature, and exam preparation resources.

## Architecture
- **Frontend**: React 19 with Tailwind CSS, React Router for navigation
- **Backend**: FastAPI (Python) with MongoDB database
- **Database**: MongoDB with auto-seeding on startup

## User Personas
1. **Primary**: Parents researching grammar schools for their Year 5/6 children
2. **Secondary**: Students preparing for 11+ exams
3. **Tertiary**: Tutors/educators advising families on school selection

## Core Requirements (Static)
1. Display all 32 Kent grammar schools with key information
2. Search and filter schools by name, location, gender
3. Sort schools by various criteria (name, size, competition)
4. Individual school detail pages with comprehensive info
5. School comparison tool (2-4 schools)
6. Kent 11+ exam information page
7. Responsive design for mobile/tablet/desktop

## What's Been Implemented (Jan 2026)
- [x] Homepage with hero section and live statistics from database
- [x] Schools list page with search, filters, and sorting
- [x] School cards with key metrics (pupils, places, competition ratio)
- [x] School detail pages with full information and exam format
- [x] Compare page with multi-school selection and comparison table
- [x] Exam Info page with format details and preparation options
- [x] Navigation and footer with external resource links
- [x] Database seeded with all 32 Kent grammar schools
- [x] API endpoints for schools CRUD and statistics
- [x] Responsive design optimized for all devices

## API Endpoints
- GET /api/schools - List all schools with optional filters
- GET /api/schools/{slug} - Get single school details
- GET /api/schools/stats/summary - Get aggregate statistics
- POST /api/schools/compare - Compare multiple schools
- POST /api/seed-schools - Re-seed database

## Prioritized Backlog

### P0 (Critical) - DONE
- Basic school listing and details ✓
- Search and filter functionality ✓
- Database with all 32 schools ✓

### P1 (High Priority) - Future
- Interactive school map with locations
- User reviews/testimonials section
- School match quiz/recommendation engine
- Bookmark/save favorite schools

### P2 (Medium Priority) - Future
- Exam date countdown/reminders
- Historical admission data visualization
- Integration with Kent County Council data
- Push notifications for application deadlines

### P3 (Nice to Have) - Future
- Parent community forum
- Tutor directory integration
- Practice test resources
- School event calendar

## Next Tasks
1. Add interactive map showing school locations
2. Implement school match quiz feature
3. Add user accounts for saving favorites
4. Integrate real-time admission statistics
