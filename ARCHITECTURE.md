# Kent 11+ Schools Hub - Architecture & Infrastructure

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                 │
│                   (Parents, Students)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React SPA)                       │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  - React 18 with React Router                       │   │
│   │  - Tailwind CSS for styling                         │   │
│   │  - Axios for API calls                              │   │
│   │  - Lucide React for icons                           │   │
│   │  - Static build size: ~2MB                          │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (/api/*)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  - Python 3.11+ with FastAPI                        │   │
│   │  - Motor (async MongoDB driver)                     │   │
│   │  - Pydantic for data validation                     │   │
│   │  - Static file serving for PDFs                     │   │
│   │  - PDF storage: ~80MB (130 practice papers)         │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ MongoDB Protocol
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                         │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  - Schools collection (31 records)                  │   │
│   │  - Key dates collection                             │   │
│   │  - Total data size: ~1MB                            │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 | Single Page Application |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Icons | Lucide React | SVG icon library |
| UI Components | Shadcn/UI | Reusable component library |
| Backend | FastAPI | High-performance Python API |
| Database | MongoDB | Document database |
| DB Driver | Motor | Async MongoDB driver |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/schools` | GET | List all schools (with filtering & sorting) |
| `/api/schools/{slug}` | GET | Get single school by slug |
| `/api/schools/compare` | POST | Compare multiple schools |
| `/api/dates` | GET | Get key admission dates |
| `/api/papers` | GET | List all available practice papers |
| `/api/papers/{filename}` | GET | Download specific PDF paper |
| `/api/stats` | GET | Get aggregate statistics |
| `/api/seed-schools` | POST | Re-seed database with school data |

## Data Models

### School Schema
```json
{
  "id": "uuid",
  "name": "Dartford Grammar School",
  "slug": "dartford-grammar-school",
  "county": "Kent",
  "address": "West Hill, Dartford, DA1 2HW",
  "type": "Boys Grammar",
  "gender": "boys",
  "pupils": 1200,
  "places_year7": 180,
  "competition": "6:1",
  "competition_ratio": 6.0,
  "exam_format": "Kent 11 Plus Test",
  "website": "https://...",
  "description": "...",
  "specialist_status": "Science College",
  "sixth_form": "Co-educational",
  "highlights": ["Award 1", "Achievement 2"],
  "founded": "1576",
  "ofsted": "Outstanding",
  "attainment_8": 79.9,
  "grade_5_english_maths": 98.9,
  "ebacc_entry": 95.0,
  "post_16_destination": 99,
  "admissions_criteria": "Kent Test score",
  "catchment_distance": "No catchment limit"
}
```

---

## Hosting Options & Costs

### Option 1: Budget-Friendly (~$5-15/month)
**Best for:** Low traffic, personal/small community use

| Service | Provider | Cost |
|---------|----------|------|
| Frontend + Backend | Railway or Render | $5-7/mo |
| Database | MongoDB Atlas (Free tier M0) | $0 |
| **Total** | | **~$5-7/mo** |

**Pros:** Simple setup, single deployment
**Cons:** Limited resources, shared infrastructure

---

### Option 2: Balanced (~$20-40/month)
**Best for:** Moderate traffic (1,000-10,000 users/month)

| Service | Provider | Cost |
|---------|----------|------|
| Frontend | Vercel or Netlify (Free tier) | $0 |
| Backend | Railway / Render / DigitalOcean | $7-20/mo |
| Database | MongoDB Atlas (M0/M2) | $0-9/mo |
| PDF Storage | Cloudflare R2 or AWS S3 | $1-5/mo |
| **Total** | | **~$20-35/mo** |

**Pros:** Scalable, CDN for frontend, separated concerns
**Cons:** More complex setup

---

### Option 3: Production-Ready (~$50-100/month)
**Best for:** High traffic, reliability requirements

| Service | Provider | Cost |
|---------|----------|------|
| Frontend | Vercel Pro or Cloudflare Pages | $0-20/mo |
| Backend | AWS ECS / Google Cloud Run | $20-40/mo |
| Database | MongoDB Atlas M10 | $30-50/mo |
| CDN | Cloudflare (Free/Pro) | $0-20/mo |
| **Total** | | **~$50-100/mo** |

**Pros:** High availability, auto-scaling, dedicated resources
**Cons:** Higher cost, requires DevOps knowledge

---

## Recommended Setup

For this application (informational site with static data), I recommend:

```
┌──────────────────────────────────────────────────────────┐
│                    Vercel (FREE)                          │
│                    - React Frontend                       │
│                    - Global CDN (Edge Network)            │
│                    - Automatic HTTPS                      │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│               Railway ($7/mo)                             │
│               - FastAPI Backend                           │
│               - PDF file serving                          │
│               - Auto-deploy from GitHub                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│            MongoDB Atlas (FREE - M0)                      │
│            - 512MB storage                                │
│            - Shared cluster                               │
│            - Automatic backups                            │
└──────────────────────────────────────────────────────────┘

💰 Estimated Monthly Cost: ~$7/month
```

---

## Cost Optimization Tips

1. **Use CDN for PDFs**
   - Move PDFs to Cloudflare R2 ($0.015/GB/month) instead of serving from backend
   - Reduces backend load and improves download speeds

2. **Cache API Responses**
   - School data rarely changes - cache for 24 hours
   - Add `Cache-Control` headers to API responses

3. **Use Serverless for Low Traffic**
   - If traffic is sporadic, use Vercel/Netlify serverless functions
   - Pay only for actual usage

4. **Optimize Images**
   - Compress any images used in the frontend
   - Use WebP format where possible

5. **Monitor Usage**
   - Set up alerts for unusual traffic spikes
   - Use free tiers wisely (stay within limits)

---

## Scaling Considerations

### When to Scale Up

| Metric | Threshold | Action |
|--------|-----------|--------|
| Monthly users | > 10,000 | Move to dedicated backend |
| API response time | > 500ms | Add caching layer |
| PDF downloads | > 1GB/day | Move PDFs to CDN |
| Database size | > 400MB | Upgrade MongoDB tier |

### Horizontal Scaling

```
                    Load Balancer
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
      Backend 1     Backend 2     Backend 3
           │             │             │
           └─────────────┼─────────────┘
                         ▼
                    MongoDB
                  (Replica Set)
```

---

## Security Considerations

1. **HTTPS Only** - All traffic encrypted
2. **CORS Configuration** - Restrict API access to frontend domain
3. **Rate Limiting** - Prevent API abuse
4. **Input Validation** - Pydantic models validate all inputs
5. **No Sensitive Data** - App contains only public school information

---

## Monitoring Recommendations

| Tool | Purpose | Cost |
|------|---------|------|
| Vercel Analytics | Frontend performance | Free |
| Railway Metrics | Backend monitoring | Included |
| MongoDB Atlas Metrics | Database monitoring | Included |
| UptimeRobot | Uptime monitoring | Free |
| Sentry | Error tracking | Free tier |
