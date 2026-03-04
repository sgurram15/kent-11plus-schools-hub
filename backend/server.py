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
    # School-specific unique features
    specialist_status: str = ""  # e.g., "Language College", "Science Specialist"
    sixth_form: str = ""  # e.g., "Co-educational", "IB Programme available"
    highlights: List[str] = []  # Unique features/achievements
    founded: str = ""  # Year founded if known
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
    specialist_status: str = ""
    sixth_form: str = ""
    highlights: List[str] = []
    founded: str = ""

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
    specialist_status: str = ""
    sixth_form: str = ""
    highlights: List[str] = []
    founded: str = ""

class CompareRequest(BaseModel):
    school_ids: List[str]

# Seed data for all 32 Kent Grammar Schools with unique features
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
        "description": "Dartford Grammar School is an oversubscribed school with a co-educational sixth form. The school offers AS, A-level courses and the International Baccalaureate (IB) programme.",
        "specialist_status": "International Language College",
        "sixth_form": "Co-educational with IB Diploma Programme",
        "highlights": ["International Baccalaureate (IB) since 1995", "Middle Years Programme (MYP)", "Visual impairment support unit", "RATL mentor school"],
        "founded": "1576"
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
        "description": "Dartford Grammar School for Girls is a selective girls' grammar school with an excellent academic record and strong pastoral care.",
        "specialist_status": "Science College",
        "sixth_form": "Girls only with wide A-level range",
        "highlights": ["Outstanding Ofsted rating", "Strong STEM programs", "Duke of Edinburgh Award scheme", "Extensive sports facilities"],
        "founded": "1904"
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
        "description": "The Judd School is a selective school with specialist status in music and mathematics. Almost all students go on to higher education.",
        "specialist_status": "Music and Mathematics Specialist",
        "sixth_form": "Co-educational from Year 12",
        "highlights": ["Specialist Music College", "Outstanding Mathematics results", "Strong Oxbridge entry record", "Extensive co-curricular program"],
        "founded": "1888"
    },
    {
        "name": "Barton Court Grammar School",
        "slug": "barton-court-grammar-school",
        "address": "Longport, Canterbury CT1 1PH",
        "type": "Co-educational Grammar",
        "gender": "mixed",
        "pupils": 838,
        "places_year7": 120,
        "open_days": "June",
        "competition": "5 applicants for every place",
        "competition_ratio": 5.0,
        "website": "http://www.bartoncourt.org",
        "description": "Barton Court Grammar School is a co-educational selective school drawing most of its students from Canterbury and the surrounding area.",
        "specialist_status": "Specialist Language College",
        "sixth_form": "International Baccalaureate (IB) only",
        "highlights": ["IB Diploma Programme since 2007", "Language College since 2005", "European exchange students", "Strong international links"],
        "founded": "1942"
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
        "description": "Borden Grammar School is a selective boys' grammar school in Sittingbourne with a co-educational sixth form.",
        "specialist_status": "Science and Mathematics Specialist",
        "sixth_form": "Co-educational",
        "highlights": ["Science specialist status", "Strong engineering links", "Combined Cadet Force (CCF)", "Award-winning Duke of Edinburgh program"],
        "founded": "1879"
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
        "description": "Chatham House Grammar School is a selective boys' grammar school with a mixed sixth form and strong academic tradition.",
        "specialist_status": "Technology College",
        "sixth_form": "Co-educational",
        "highlights": ["Technology College status", "Strong sporting tradition", "Historic school building", "Active alumni network"],
        "founded": "1797"
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
        "description": "Clarendon House Grammar School is a selective girls' grammar school with a mixed sixth form in Ramsgate, known for excellent pastoral care.",
        "specialist_status": "Humanities College",
        "sixth_form": "Co-educational",
        "highlights": ["Humanities specialist", "Outstanding pastoral support", "Strong arts program", "Community engagement focus"],
        "founded": "1904"
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
        "description": "Dane Court Grammar School is a fully co-educational grammar school in Broadstairs with excellent facilities for science and the arts.",
        "specialist_status": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Modern science facilities", "Strong performing arts", "Beach proximity for marine biology"],
        "founded": "1957"
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
        "description": "Dover Grammar School for Boys is a selective boys' grammar school with a strong tradition of academic achievement.",
        "specialist_status": "Sports College",
        "sixth_form": "Co-educational",
        "highlights": ["Sports College status", "Rugby excellence program", "French exchange links", "Strong cadet force"],
        "founded": "1905"
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
        "description": "Dover Grammar School for Girls is a selective girls' grammar school with excellent academic results and wide extra-curricular activities.",
        "specialist_status": "Mathematics and Computing College",
        "sixth_form": "Girls only",
        "highlights": ["Maths & Computing specialist", "STEM ambassador school", "Music excellence", "European school partnerships"],
        "founded": "1905"
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
        "description": "Gravesend Grammar School is one of the oldest grammar schools in Kent with strong academic and sporting traditions.",
        "specialist_status": "Language College",
        "sixth_form": "Co-educational",
        "highlights": ["One of Kent's oldest schools", "Strong Oxbridge tradition", "Award-winning Combined Cadet Force", "Mandarin Chinese offered"],
        "founded": "1576"
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
        "description": "Highsted Grammar School is a selective girls' grammar school known for strong STEM programs and science specialist status.",
        "specialist_status": "Science Specialist",
        "sixth_form": "Girls only",
        "highlights": ["Science specialist since 2003", "Outstanding STEM results", "Young Enterprise awards", "Strong university preparation"],
        "founded": "1904"
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
        "description": "Highworth Grammar School is a selective girls' grammar school in Ashford with strong links with local businesses and universities.",
        "specialist_status": "Business and Enterprise College",
        "sixth_form": "Co-educational",
        "highlights": ["Business & Enterprise status", "Industry partnerships", "Young Enterprise champions", "Entrepreneur programs"],
        "founded": "1903"
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
        "description": "Invicta Grammar School is a selective girls' grammar school in Maidstone known for excellent academic results and strong performing arts.",
        "specialist_status": "Performing Arts College",
        "sixth_form": "Girls only",
        "highlights": ["Performing Arts specialist", "Outstanding drama facilities", "Annual West End show trip", "Music scholarships available"],
        "founded": "1907"
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
        "description": "Maidstone Grammar School is one of the oldest grammar schools in England, founded in 1549, with a strong academic tradition.",
        "specialist_status": "Mathematics and Computing",
        "sixth_form": "Co-educational",
        "highlights": ["Founded 1549 - one of England's oldest", "Maths & Computing specialist", "Historic campus", "Strong rugby tradition"],
        "founded": "1549"
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
        "description": "Maidstone Grammar School for Girls is a highly successful selective school with outstanding academic results.",
        "specialist_status": "Language College",
        "sixth_form": "Girls only",
        "highlights": ["Outstanding Ofsted rating", "Language College status", "Extensive modern languages", "Japanese exchange program"],
        "founded": "1888"
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
        "description": "Mayfield Grammar School is a selective girls' grammar school in Gravesend with strong academic results and excellent pastoral support.",
        "specialist_status": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Outstanding pastoral care", "STEM ambassador school", "Award-winning eco initiatives"],
        "founded": "1912"
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
        "description": "Oakwood Park Grammar School is a selective boys' grammar school in Maidstone with a co-educational sixth form and science specialist status.",
        "specialist_status": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Modern science labs", "Strong engineering links", "Active careers program"],
        "founded": "1958"
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
        "description": "Queen Elizabeth's Grammar School in Faversham is a fully co-educational grammar school founded in 1527 with a rich history.",
        "specialist_status": "Mathematics and Computing",
        "sixth_form": "Co-educational",
        "highlights": ["Founded 1527 - nearly 500 years old", "Historic Tudor buildings", "Maths & Computing specialist", "Strong community links"],
        "founded": "1527"
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
        "description": "Simon Langton Grammar School for Boys is a highly selective grammar school in Canterbury with excellent academic results and strong science programs.",
        "specialist_status": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Top 100 UK state school", "Science College status", "Strong Oxbridge record", "Canterbury Cathedral links"],
        "founded": "1881"
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
        "description": "Simon Langton Girls' Grammar School is a selective girls' grammar school in Canterbury with outstanding academic results.",
        "specialist_status": "Mathematics and Computing",
        "sixth_form": "Co-educational",
        "highlights": ["Outstanding Ofsted rating", "Maths & Computing specialist", "Extensive music program", "International school links"],
        "founded": "1881"
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
        "description": "Sir Roger Manwood's School is a fully co-educational grammar school in Sandwich, founded in 1563 with a strong tradition of academic excellence.",
        "specialist_status": "Language College",
        "sixth_form": "Co-educational",
        "highlights": ["Founded 1563 - Elizabethan heritage", "Language College status", "Historic school chapel", "Extensive playing fields"],
        "founded": "1563"
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
        "description": "The Folkestone School for Girls is a selective girls' grammar school with a mixed sixth form and strong academic results.",
        "specialist_status": "Arts College",
        "sixth_form": "Co-educational",
        "highlights": ["Arts College status", "Outstanding creative arts", "Channel proximity for French links", "Strong pastoral support"],
        "founded": "1905"
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
        "description": "The Harvey Grammar School is a selective boys' grammar school in Folkestone with a mixed sixth form and strong links with local businesses.",
        "specialist_status": "Business and Enterprise",
        "sixth_form": "Co-educational",
        "highlights": ["Business & Enterprise status", "Industry partnerships", "Strong cricket tradition", "Named after William Harvey (blood circulation)"],
        "founded": "1674"
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
        "description": "The Norton Knatchbull School is a selective boys' grammar school in Ashford with specialist status in Mathematics and Computing.",
        "specialist_status": "Mathematics and Computing",
        "sixth_form": "Co-educational",
        "highlights": ["Maths & Computing specialist", "Strong programming clubs", "Robotics competitions", "Award-winning STEM projects"],
        "founded": "1635"
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
        "description": "The Skinners' School is a highly selective boys' grammar school in Tunbridge Wells with excellent academic results and strong sporting traditions.",
        "specialist_status": "Mathematics and Computing",
        "sixth_form": "Boys only with joint sixth form activities",
        "highlights": ["Founded by Skinners' Company", "Outstanding academic results", "Strong rugby and rowing", "Historic links to City of London"],
        "founded": "1887"
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
        "description": "Tonbridge Grammar School is a selective girls' grammar school with outstanding academic results and a strong focus on student wellbeing.",
        "specialist_status": "Language College",
        "sixth_form": "Girls only",
        "highlights": ["Outstanding Ofsted rating", "Language College status", "Japanese exchange program", "Extensive wellbeing support"],
        "founded": "1905"
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
        "description": "Tunbridge Wells Girls' Grammar School is a highly selective girls' grammar school with excellent academic results and strong music and drama programs.",
        "specialist_status": "Music College",
        "sixth_form": "Girls only",
        "highlights": ["Music College status", "Outstanding orchestra", "Award-winning drama", "Strong Oxbridge record"],
        "founded": "1905"
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
        "description": "Tunbridge Wells Grammar School for Boys is a selective boys' grammar school with a mixed sixth form and strong academic and sporting traditions.",
        "specialist_status": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Strong STEM results", "Excellent sports facilities", "Active Combined Cadet Force"],
        "founded": "1887"
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
        "description": "Weald of Kent Grammar School is a selective girls' grammar school with annexes in Tonbridge and Sevenoaks. It is one of the largest grammar schools in Kent.",
        "specialist_status": "Language College",
        "sixth_form": "Girls only",
        "highlights": ["Largest Kent grammar school", "Two campus sites (Tonbridge & Sevenoaks)", "Language College status", "Outstanding academic results"],
        "founded": "1906"
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
        "description": "Wilmington Grammar School for Boys is a selective boys' grammar school with a mixed sixth form and specialist status in Mathematics and ICT.",
        "specialist_status": "Mathematics and ICT",
        "sixth_form": "Co-educational",
        "highlights": ["Maths & ICT specialist", "Modern computing facilities", "Strong engineering links", "Award-winning robotics club"],
        "founded": "1957"
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
        "description": "Wilmington Grammar School for Girls is a selective girls' grammar school with a mixed sixth form and strong academic results.",
        "specialist_status": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Outstanding STEM results", "Modern facilities", "Strong university progression"],
        "founded": "1957"
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
