from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class School(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    county: str = "Kent"
    address: str
    type: str  # Boys Grammar, Girls Grammar, Co-educational
    gender: str  # boys, girls, mixed
    pupils: int
    places_year7: int
    open_days: str
    competition: str  # e.g., "6 applicants for every place"
    competition_ratio: float  # numeric value for filtering
    exam_format: str = "Kent 11 Plus Test"
    website: str
    description: str
    paper1_info: str = "50 minute Reasoning paper with Verbal, Spatial and Non-Verbal Reasoning sections"
    paper2_info: str = "60 minute English and Mathematics paper"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SchoolCreate(BaseModel):
    name: str
    slug: str
    county: str = "Kent"
    address: str
    type: str
    gender: str
    pupils: int
    places_year7: int
    open_days: str
    competition: str
    competition_ratio: float
    exam_format: str = "Kent 11 Plus Test"
    website: str
    description: str
    paper1_info: str = "50 minute Reasoning paper with Verbal, Spatial and Non-Verbal Reasoning sections"
    paper2_info: str = "60 minute English and Mathematics paper"

class SchoolResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    slug: str
    county: str
    address: str
    type: str
    gender: str
    pupils: int
    places_year7: int
    open_days: str
    competition: str
    competition_ratio: float
    exam_format: str
    website: str
    description: str
    paper1_info: str
    paper2_info: str

class CompareRequest(BaseModel):
    school_ids: List[str]

# Seed data for all 32 Kent Grammar Schools
KENT_GRAMMAR_SCHOOLS = [
    {
        "name": "Dartford Grammar School",
        "slug": "dartford-grammar-school",
        "address": "West Hill, Dartford DA1 2HW",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 1203,
        "places_year7": 150,
        "open_days": "June",
        "competition": "6 applicants for every place",
        "competition_ratio": 6.0,
        "website": "http://www.dartfordgrammarschool.org.uk",
        "description": "Dartford Grammar School is an oversubscribed school with a co-educational sixth form. The school offers AS, A-level courses and the International Baccalaureate (IB) programme. It has been an International Language College since 1995."
    },
    {
        "name": "Dartford Grammar School for Girls",
        "slug": "dartford-grammar-school-girls",
        "address": "Shepherds Lane, Dartford DA1 2NT",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1150,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "5 applicants for every place",
        "competition_ratio": 5.0,
        "website": "http://www.dartfordgrammargirls.kent.sch.uk",
        "description": "Dartford Grammar School for Girls is a selective girls' grammar school with an excellent academic record. The school offers a wide range of A-level subjects and has strong pastoral care."
    },
    {
        "name": "The Judd School",
        "slug": "judd-school",
        "address": "Brook Street, Tonbridge TN9 2PN",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 957,
        "places_year7": 125,
        "open_days": "July/October",
        "competition": "4-5 applicants for every place",
        "competition_ratio": 4.5,
        "website": "http://www.judd.online",
        "description": "The Judd School is a selective school with specialist status in music and mathematics. Girls are admitted in Year 12. Almost all students go on to higher education."
    },
    {
        "name": "Barton Court Grammar School",
        "slug": "barton-court-grammar-school",
        "address": "Longport, Canterbury CT1 1PH",
        "type": "Co-educational Grammar",
        "gender": "mixed",
        "pupils": 1100,
        "places_year7": 180,
        "open_days": "October",
        "competition": "3 applicants for every place",
        "competition_ratio": 3.0,
        "website": "http://www.bartoncourt.org",
        "description": "Barton Court Grammar School is a fully co-educational grammar school in Canterbury. It has a strong tradition of academic excellence and extra-curricular activities."
    },
    {
        "name": "Borden Grammar School",
        "slug": "borden-grammar-school",
        "address": "Avenue of Remembrance, Sittingbourne ME10 4DB",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 900,
        "places_year7": 120,
        "open_days": "October",
        "competition": "3 applicants for every place",
        "competition_ratio": 3.0,
        "website": "http://www.bordengrammar.kent.sch.uk",
        "description": "Borden Grammar School is a selective boys' grammar school in Sittingbourne with a co-educational sixth form. The school has specialist status in Science and Mathematics."
    },
    {
        "name": "Chatham House Grammar School",
        "slug": "chatham-house-grammar-school",
        "address": "Chatham Street, Ramsgate CT11 7PS",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 820,
        "places_year7": 120,
        "open_days": "October",
        "competition": "2 applicants for every place",
        "competition_ratio": 2.0,
        "website": "http://www.chathamhousegrammar.co.uk",
        "description": "Chatham House Grammar School is a selective boys' grammar school with a mixed sixth form. The school has a strong academic tradition and excellent sports facilities."
    },
    {
        "name": "Clarendon House Grammar School",
        "slug": "clarendon-house-grammar-school",
        "address": "Clarendon Street, Ramsgate CT11 9BA",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 780,
        "places_year7": 120,
        "open_days": "October",
        "competition": "2 applicants for every place",
        "competition_ratio": 2.0,
        "website": "http://www.clarendonhouseschool.co.uk",
        "description": "Clarendon House Grammar School is a selective girls' grammar school with a mixed sixth form in Ramsgate. The school is known for its excellent pastoral care."
    },
    {
        "name": "Dane Court Grammar School",
        "slug": "dane-court-grammar-school",
        "address": "Broadstairs Road, Broadstairs CT10 2RT",
        "type": "Co-educational Grammar",
        "gender": "mixed",
        "pupils": 1200,
        "places_year7": 180,
        "open_days": "October",
        "competition": "2.5 applicants for every place",
        "competition_ratio": 2.5,
        "website": "http://www.danecourt.kent.sch.uk",
        "description": "Dane Court Grammar School is a fully co-educational grammar school in Broadstairs. It offers a broad curriculum and has excellent facilities for science and the arts."
    },
    {
        "name": "Dover Grammar School for Boys",
        "slug": "dover-grammar-school-boys",
        "address": "Astor Avenue, Dover CT17 0DQ",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 880,
        "places_year7": 120,
        "open_days": "September/October",
        "competition": "2 applicants for every place",
        "competition_ratio": 2.0,
        "website": "http://www.dgsb.co.uk",
        "description": "Dover Grammar School for Boys is a selective boys' grammar school with a strong tradition of academic achievement. The school has a mixed sixth form."
    },
    {
        "name": "Dover Grammar School for Girls",
        "slug": "dover-grammar-school-girls",
        "address": "Frith Road, Dover CT16 2PZ",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 860,
        "places_year7": 120,
        "open_days": "September/October",
        "competition": "2 applicants for every place",
        "competition_ratio": 2.0,
        "website": "http://www.dggs.kent.sch.uk",
        "description": "Dover Grammar School for Girls is a selective girls' grammar school with excellent academic results. The school offers a wide range of extra-curricular activities."
    },
    {
        "name": "Gravesend Grammar School",
        "slug": "gravesend-grammar-school",
        "address": "Church Walk, Gravesend DA12 2PR",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 1050,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.gravesendgrammar.com",
        "description": "Gravesend Grammar School is one of the oldest grammar schools in Kent. It has a strong academic tradition and excellent facilities for sport and music."
    },
    {
        "name": "Highsted Grammar School",
        "slug": "highsted-grammar-school",
        "address": "Highsted Road, Sittingbourne ME10 4PT",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1100,
        "places_year7": 150,
        "open_days": "October",
        "competition": "3 applicants for every place",
        "competition_ratio": 3.0,
        "website": "http://www.highsted.kent.sch.uk",
        "description": "Highsted Grammar School is a selective girls' grammar school in Sittingbourne. The school has specialist status in Science and is known for its strong STEM programs."
    },
    {
        "name": "Highworth Grammar School",
        "slug": "highworth-grammar-school",
        "address": "Maidstone Road, Ashford TN24 8UD",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1000,
        "places_year7": 150,
        "open_days": "September",
        "competition": "3 applicants for every place",
        "competition_ratio": 3.0,
        "website": "http://www.highworth.kent.sch.uk",
        "description": "Highworth Grammar School is a selective girls' grammar school in Ashford with a mixed sixth form. The school has strong links with local businesses and universities."
    },
    {
        "name": "Invicta Grammar School",
        "slug": "invicta-grammar-school",
        "address": "Huntsman Lane, Maidstone ME14 5DS",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1150,
        "places_year7": 180,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.invicta.kent.sch.uk",
        "description": "Invicta Grammar School is a selective girls' grammar school in Maidstone. The school is known for its excellent academic results and strong performing arts program."
    },
    {
        "name": "Maidstone Grammar School",
        "slug": "maidstone-grammar-school",
        "address": "Barton Road, Maidstone ME15 7BT",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 1100,
        "places_year7": 180,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.mgs.kent.sch.uk",
        "description": "Maidstone Grammar School is one of the oldest grammar schools in England, founded in 1549. It has a strong academic tradition and excellent sports facilities."
    },
    {
        "name": "Maidstone Grammar School for Girls",
        "slug": "maidstone-grammar-school-girls",
        "address": "Buckland Road, Maidstone ME16 0SF",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1200,
        "places_year7": 180,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.mggs.org",
        "description": "Maidstone Grammar School for Girls is a highly successful selective school with outstanding academic results. The school offers a wide range of A-level subjects."
    },
    {
        "name": "Mayfield Grammar School",
        "slug": "mayfield-grammar-school",
        "address": "Pelham Road, Gravesend DA11 0JE",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1080,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.mayfield.kent.sch.uk",
        "description": "Mayfield Grammar School is a selective girls' grammar school in Gravesend with a mixed sixth form. The school has strong academic results and excellent pastoral support."
    },
    {
        "name": "Oakwood Park Grammar School",
        "slug": "oakwood-park-grammar-school",
        "address": "Oakwood Park, Maidstone ME16 8AH",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 950,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "3 applicants for every place",
        "competition_ratio": 3.0,
        "website": "http://www.opgs.org",
        "description": "Oakwood Park Grammar School is a selective boys' grammar school in Maidstone with a co-educational sixth form. The school has specialist status in Science."
    },
    {
        "name": "Queen Elizabeth's Grammar School",
        "slug": "queen-elizabeths-grammar-school",
        "address": "Abbey Place, Faversham ME13 7BQ",
        "type": "Co-educational Grammar",
        "gender": "mixed",
        "pupils": 1000,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "3 applicants for every place",
        "competition_ratio": 3.0,
        "website": "http://www.qes.kent.sch.uk",
        "description": "Queen Elizabeth's Grammar School in Faversham is a fully co-educational grammar school founded in 1527. It has a rich history and strong academic tradition."
    },
    {
        "name": "Simon Langton Grammar School for Boys",
        "slug": "simon-langton-grammar-school-boys",
        "address": "Langton Lane, Canterbury CT4 7AS",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 1100,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.langton.kent.sch.uk",
        "description": "Simon Langton Grammar School for Boys is a highly selective grammar school in Canterbury. The school has excellent academic results and strong science programs."
    },
    {
        "name": "Simon Langton Girls' Grammar School",
        "slug": "simon-langton-girls-grammar-school",
        "address": "Old Dover Road, Canterbury CT1 3EW",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1150,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.langton.kent.sch.uk",
        "description": "Simon Langton Girls' Grammar School is a selective girls' grammar school in Canterbury with a mixed sixth form. The school has outstanding academic results."
    },
    {
        "name": "Sir Roger Manwood's School",
        "slug": "sir-roger-manwoods-school",
        "address": "Manwood Road, Sandwich CT13 9JX",
        "type": "Co-educational Grammar",
        "gender": "mixed",
        "pupils": 1050,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "2 applicants for every place",
        "competition_ratio": 2.0,
        "website": "http://www.srms.kent.sch.uk",
        "description": "Sir Roger Manwood's School is a fully co-educational grammar school in Sandwich, founded in 1563. The school has a strong tradition of academic excellence."
    },
    {
        "name": "The Folkestone School for Girls",
        "slug": "folkestone-school-girls",
        "address": "Coolinge Lane, Folkestone CT20 3RB",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 900,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "2 applicants for every place",
        "competition_ratio": 2.0,
        "website": "http://www.folkestonegirls.kent.sch.uk",
        "description": "The Folkestone School for Girls is a selective girls' grammar school with a mixed sixth form. The school has strong academic results and excellent pastoral care."
    },
    {
        "name": "The Harvey Grammar School",
        "slug": "harvey-grammar-school",
        "address": "Cheriton Road, Folkestone CT19 5JY",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 880,
        "places_year7": 120,
        "open_days": "September/October",
        "competition": "2 applicants for every place",
        "competition_ratio": 2.0,
        "website": "http://www.harveygs.kent.sch.uk",
        "description": "The Harvey Grammar School is a selective boys' grammar school in Folkestone with a mixed sixth form. The school has strong links with local businesses."
    },
    {
        "name": "The Norton Knatchbull School",
        "slug": "norton-knatchbull-school",
        "address": "Hythe Road, Ashford TN24 0QJ",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 1000,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "3 applicants for every place",
        "competition_ratio": 3.0,
        "website": "http://www.nks.kent.sch.uk",
        "description": "The Norton Knatchbull School is a selective boys' grammar school in Ashford with a mixed sixth form. The school has specialist status in Mathematics and Computing."
    },
    {
        "name": "The Skinners' School",
        "slug": "skinners-school",
        "address": "St Johns Road, Tunbridge Wells TN4 9PG",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 1050,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "5 applicants for every place",
        "competition_ratio": 5.0,
        "website": "http://www.skinners-school.co.uk",
        "description": "The Skinners' School is a highly selective boys' grammar school in Tunbridge Wells. The school has excellent academic results and strong sporting traditions."
    },
    {
        "name": "Tonbridge Grammar School",
        "slug": "tonbridge-grammar-school",
        "address": "Deakin Leas, Tonbridge TN9 2JR",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1100,
        "places_year7": 180,
        "open_days": "September/October",
        "competition": "5 applicants for every place",
        "competition_ratio": 5.0,
        "website": "http://www.tgs.kent.sch.uk",
        "description": "Tonbridge Grammar School is a selective girls' grammar school in Tonbridge. The school has outstanding academic results and a strong focus on student wellbeing."
    },
    {
        "name": "Tunbridge Wells Girls' Grammar School",
        "slug": "tunbridge-wells-girls-grammar-school",
        "address": "Southfield Road, Tunbridge Wells TN4 9UJ",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1050,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "5 applicants for every place",
        "competition_ratio": 5.0,
        "website": "http://www.twggs.kent.sch.uk",
        "description": "Tunbridge Wells Girls' Grammar School is a highly selective girls' grammar school. The school has excellent academic results and strong music and drama programs."
    },
    {
        "name": "Tunbridge Wells Grammar School for Boys",
        "slug": "tunbridge-wells-grammar-school-boys",
        "address": "St Johns Road, Tunbridge Wells TN4 9XB",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 980,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "5 applicants for every place",
        "competition_ratio": 5.0,
        "website": "http://www.twgsb.org.uk",
        "description": "Tunbridge Wells Grammar School for Boys is a selective boys' grammar school with a mixed sixth form. The school has strong academic and sporting traditions."
    },
    {
        "name": "Weald of Kent Grammar School",
        "slug": "weald-kent-grammar-school",
        "address": "Tudeley Lane, Tonbridge TN11 0NJ",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1400,
        "places_year7": 210,
        "open_days": "September/October",
        "competition": "5 applicants for every place",
        "competition_ratio": 5.0,
        "website": "http://www.wealdofkent.kent.sch.uk",
        "description": "Weald of Kent Grammar School is a selective girls' grammar school with annexes in Tonbridge and Sevenoaks. It is one of the largest grammar schools in Kent."
    },
    {
        "name": "Wilmington Grammar School for Boys",
        "slug": "wilmington-grammar-school-boys",
        "address": "Common Lane, Wilmington DA2 7DA",
        "type": "Boys Grammar",
        "gender": "boys",
        "pupils": 1000,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.wgsb.kent.sch.uk",
        "description": "Wilmington Grammar School for Boys is a selective boys' grammar school with a mixed sixth form. The school has specialist status in Mathematics and ICT."
    },
    {
        "name": "Wilmington Grammar School for Girls",
        "slug": "wilmington-grammar-school-girls",
        "address": "Parsons Lane, Wilmington DA2 7BB",
        "type": "Girls Grammar",
        "gender": "girls",
        "pupils": 1050,
        "places_year7": 150,
        "open_days": "September/October",
        "competition": "4 applicants for every place",
        "competition_ratio": 4.0,
        "website": "http://www.wgsg.co.uk",
        "description": "Wilmington Grammar School for Girls is a selective girls' grammar school with a mixed sixth form. The school has strong academic results and excellent facilities."
    }
]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Kent 11+ Grammar Schools Hub API"}

@api_router.get("/schools", response_model=List[SchoolResponse])
async def get_schools(
    gender: Optional[str] = Query(None, description="Filter by gender: boys, girls, mixed"),
    min_competition: Optional[float] = Query(None, description="Minimum competition ratio"),
    max_competition: Optional[float] = Query(None, description="Maximum competition ratio"),
    search: Optional[str] = Query(None, description="Search by school name or location"),
    sort_by: Optional[str] = Query("name", description="Sort by: name, pupils, places_year7, competition_ratio"),
    sort_order: Optional[str] = Query("asc", description="Sort order: asc, desc")
):
    query = {}
    
    if gender:
        query["gender"] = gender
    
    if min_competition is not None:
        query["competition_ratio"] = {"$gte": min_competition}
    
    if max_competition is not None:
        if "competition_ratio" in query:
            query["competition_ratio"]["$lte"] = max_competition
        else:
            query["competition_ratio"] = {"$lte": max_competition}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"address": {"$regex": search, "$options": "i"}}
        ]
    
    sort_direction = 1 if sort_order == "asc" else -1
    
    schools = await db.schools.find(query, {"_id": 0}).sort(sort_by, sort_direction).to_list(100)
    return schools

@api_router.get("/schools/{slug}", response_model=SchoolResponse)
async def get_school(slug: str):
    school = await db.schools.find_one({"slug": slug}, {"_id": 0})
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@api_router.post("/schools/compare", response_model=List[SchoolResponse])
async def compare_schools(request: CompareRequest):
    if len(request.school_ids) < 2 or len(request.school_ids) > 4:
        raise HTTPException(status_code=400, detail="Please select 2-4 schools to compare")
    
    schools = await db.schools.find(
        {"id": {"$in": request.school_ids}}, 
        {"_id": 0}
    ).to_list(4)
    
    return schools

@api_router.get("/schools/stats/summary")
async def get_stats_summary():
    total_schools = await db.schools.count_documents({})
    boys_schools = await db.schools.count_documents({"gender": "boys"})
    girls_schools = await db.schools.count_documents({"gender": "girls"})
    mixed_schools = await db.schools.count_documents({"gender": "mixed"})
    
    pipeline = [
        {"$group": {
            "_id": None,
            "total_places": {"$sum": "$places_year7"},
            "avg_competition": {"$avg": "$competition_ratio"},
            "total_pupils": {"$sum": "$pupils"}
        }}
    ]
    
    stats = await db.schools.aggregate(pipeline).to_list(1)
    
    return {
        "total_schools": total_schools,
        "boys_schools": boys_schools,
        "girls_schools": girls_schools,
        "mixed_schools": mixed_schools,
        "total_places_year7": stats[0]["total_places"] if stats else 0,
        "average_competition": round(stats[0]["avg_competition"], 1) if stats else 0,
        "total_pupils": stats[0]["total_pupils"] if stats else 0
    }

@api_router.post("/seed-schools")
async def seed_schools():
    """Seed the database with Kent Grammar Schools data"""
    # Clear existing schools
    await db.schools.delete_many({})
    
    # Insert schools with generated IDs
    for school_data in KENT_GRAMMAR_SCHOOLS:
        school = School(**school_data)
        doc = school.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.schools.insert_one(doc)
    
    return {"message": f"Seeded {len(KENT_GRAMMAR_SCHOOLS)} schools successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    # Auto-seed schools if collection is empty
    count = await db.schools.count_documents({})
    if count == 0:
        logger.info("Seeding schools database...")
        for school_data in KENT_GRAMMAR_SCHOOLS:
            school = School(**school_data)
            doc = school.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.schools.insert_one(doc)
        logger.info(f"Seeded {len(KENT_GRAMMAR_SCHOOLS)} schools")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
