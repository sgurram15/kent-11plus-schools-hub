from fastapi import FastAPI, APIRouter, HTTPException, Query, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import httpx
from bs4 import BeautifulSoup
import re

ROOT_DIR = Path(__file__).parent
PAPERS_DIR = ROOT_DIR / "static" / "papers"
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint (for Railway/Render)
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "kent-11plus-api"}

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
    key_strengths: str = ""  # Key academic strengths or focus areas
    sixth_form: str = ""  # e.g., "Co-educational", "IB Programme available"
    highlights: List[str] = []  # Unique features/achievements
    founded: str = ""  # Year founded if known
    # Academic Performance Data (from GOV.UK 2025)
    ofsted: str = ""  # Ofsted rating: Outstanding, Good, etc.
    attainment_8: Optional[float] = None  # Attainment 8 score
    grade_5_english_maths: Optional[float] = None  # % achieving Grade 5+ in English & Maths
    ebacc_entry: Optional[float] = None  # % entering EBacc
    post_16_destination: Optional[int] = None  # % staying in education/employment
    admissions_criteria: str = ""  # Primary admissions criteria
    catchment_distance: str = ""  # Catchment area info
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
    ofsted: str = ""
    attainment_8: Optional[float] = None
    grade_5_english_maths: Optional[float] = None
    ebacc_entry: Optional[float] = None
    post_16_destination: Optional[int] = None
    admissions_criteria: str = ""
    catchment_distance: str = ""

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
    ofsted: str = ""
    attainment_8: Optional[float] = None
    grade_5_english_maths: Optional[float] = None
    ebacc_entry: Optional[float] = None
    post_16_destination: Optional[int] = None
    admissions_criteria: str = ""
    catchment_distance: str = ""

class CompareRequest(BaseModel):
    school_ids: List[str]

# Contact Query Model
class ContactQuery(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    status: str = "new"  # new, read, replied
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactQueryCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class ContactQueryResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    email: str
    subject: str
    message: str
    status: str
    created_at: str

# Open Events Model
class OpenEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    school_slug: str  # Links to school
    school_name: str
    event_type: str  # "Open Evening", "Open Morning", "Year 5 Open Morning", "Sixth Form Options Evening"
    event_date: str  # e.g., "24 September 2025"
    event_time: str  # e.g., "4:30pm to 7:30pm"
    headteacher_speaks: Optional[str] = None  # e.g., "5:30pm and 6:30pm"
    booking_required: bool = False
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    source_url: Optional[str] = None  # URL where this data was found
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OpenEventCreate(BaseModel):
    school_slug: str
    school_name: str
    event_type: str
    event_date: str
    event_time: str
    headteacher_speaks: Optional[str] = None
    booking_required: bool = False
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    source_url: Optional[str] = None

class OpenEventResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    school_slug: str
    school_name: str
    event_type: str
    event_date: str
    event_time: str
    headteacher_speaks: Optional[str] = None
    booking_required: bool = False
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    source_url: Optional[str] = None
    last_updated: str
    created_at: str

# Cut-off Scores Model
class CutOffScore(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    school_slug: str
    school_name: str
    entry_year: str  # e.g., "2026"
    inner_area_score: Optional[int] = None  # e.g., 389
    outer_area_score: Optional[int] = None  # e.g., 403
    governors_score: Optional[int] = None  # For schools with governors' places
    pupil_premium_score: Optional[int] = None
    furthest_distance_inner: Optional[str] = None  # e.g., "5.474 miles"
    furthest_distance_outer: Optional[str] = None
    total_offers: Optional[int] = None
    inner_area_places: Optional[int] = None
    outer_area_places: Optional[int] = None
    mean_score_inner: Optional[float] = None
    mean_score_outer: Optional[float] = None
    notes: Optional[str] = None
    source_url: Optional[str] = None
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CutOffScoreCreate(BaseModel):
    school_slug: str
    school_name: str
    entry_year: str
    inner_area_score: Optional[int] = None
    outer_area_score: Optional[int] = None
    governors_score: Optional[int] = None
    pupil_premium_score: Optional[int] = None
    furthest_distance_inner: Optional[str] = None
    furthest_distance_outer: Optional[str] = None
    total_offers: Optional[int] = None
    inner_area_places: Optional[int] = None
    outer_area_places: Optional[int] = None
    mean_score_inner: Optional[float] = None
    mean_score_outer: Optional[float] = None
    notes: Optional[str] = None
    source_url: Optional[str] = None
    # New detailed fields
    eligibility_threshold: Optional[str] = None
    catchment_info: Optional[str] = None
    named_parishes: Optional[str] = None
    waiting_list_info: Optional[str] = None
    appeals_info: Optional[str] = None
    campus_info: Optional[str] = None
    pupil_premium_info: Optional[str] = None
    key_dates: Optional[str] = None
    contact_email: Optional[str] = None

class CutOffScoreResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    school_slug: str
    school_name: str
    entry_year: str
    inner_area_score: Optional[int] = None
    outer_area_score: Optional[int] = None
    governors_score: Optional[int] = None
    pupil_premium_score: Optional[int] = None
    furthest_distance_inner: Optional[str] = None
    furthest_distance_outer: Optional[str] = None
    total_offers: Optional[int] = None
    inner_area_places: Optional[int] = None
    outer_area_places: Optional[int] = None
    mean_score_inner: Optional[float] = None
    mean_score_outer: Optional[float] = None
    notes: Optional[str] = None
    source_url: Optional[str] = None
    # New detailed fields
    eligibility_threshold: Optional[str] = None  # e.g., "332+ total, no section below 108"
    catchment_info: Optional[str] = None  # Catchment area details
    named_parishes: Optional[str] = None  # List of priority parishes
    waiting_list_info: Optional[str] = None  # Waiting list details
    appeals_info: Optional[str] = None  # Appeals statistics
    campus_info: Optional[str] = None  # For schools with multiple campuses
    pupil_premium_info: Optional[str] = None  # Pupil premium details
    key_dates: Optional[str] = None  # Important dates
    contact_email: Optional[str] = None  # Admissions contact
    last_updated: str
    created_at: str

# URL Scrape Request Model
class ScrapeRequest(BaseModel):
    url: str
    school_slug: str
    school_name: str

# Seed data for all 32 Kent Grammar Schools with authentic GCSE results from GOV.UK 2025
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
        "key_strengths": "International Language College",
        "sixth_form": "Co-educational with IB Diploma Programme",
        "highlights": ["2025 State Secondary School of the Year - South East", "International Baccalaureate (IB) since 1995", "Visual impairment support unit", "RATL mentor school"],
        "founded": "1576",
        "ofsted": "Outstanding",
        "attainment_8": 79.9,
        "grade_5_english_maths": 98.9,
        "ebacc_entry": 98.9,
        "post_16_destination": 98,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science College",
        "sixth_form": "Girls only with wide A-level range",
        "highlights": ["Outstanding Ofsted rating", "Strong STEM programs", "Duke of Edinburgh Award scheme", "Extensive sports facilities"],
        "founded": "1904",
        "ofsted": "Outstanding",
        "attainment_8": 75.5,
        "grade_5_english_maths": 94.9,
        "ebacc_entry": 80.1,
        "post_16_destination": 99,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Music and Mathematics Specialist",
        "sixth_form": "Co-educational from Year 12",
        "highlights": ["#2 Kent Grammar School by Attainment", "Specialist Music College", "Outstanding Mathematics results", "Strong Oxbridge entry record"],
        "founded": "1888",
        "ofsted": "Outstanding",
        "attainment_8": 78.4,
        "grade_5_english_maths": 98.4,
        "ebacc_entry": 67.7,
        "post_16_destination": 99,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Language College",
        "sixth_form": "Girls only",
        "highlights": ["#3 Kent Grammar School by Attainment", "Outstanding Ofsted rating", "Japanese exchange program", "Extensive wellbeing support"],
        "founded": "1905",
        "ofsted": "Outstanding",
        "attainment_8": 77.2,
        "grade_5_english_maths": 98.3,
        "ebacc_entry": 97.2,
        "post_16_destination": 94,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Music College",
        "sixth_form": "Girls only",
        "highlights": ["Music College status", "Outstanding orchestra", "Award-winning drama", "Strong Oxbridge record"],
        "founded": "1905",
        "ofsted": "Outstanding",
        "attainment_8": 73.4,
        "grade_5_english_maths": 97.9,
        "ebacc_entry": 95.8,
        "post_16_destination": 98,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Mathematics and Computing",
        "sixth_form": "Boys only with joint sixth form activities",
        "highlights": ["Founded by Skinners' Company", "Outstanding academic results", "Strong rugby and rowing", "Historic links to City of London"],
        "founded": "1887",
        "ofsted": "Good",
        "attainment_8": 70.8,
        "grade_5_english_maths": 93.4,
        "ebacc_entry": 72.5,
        "post_16_destination": 98,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Business and Enterprise College",
        "sixth_form": "Co-educational",
        "highlights": ["Business & Enterprise status", "Industry partnerships", "Young Enterprise champions", "Entrepreneur programs"],
        "founded": "1903",
        "ofsted": "Good",
        "attainment_8": 70.8,
        "grade_5_english_maths": 95.3,
        "ebacc_entry": 95.8,
        "post_16_destination": 99,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Performing Arts College",
        "sixth_form": "Girls only",
        "highlights": ["Performing Arts specialist", "Outstanding drama facilities", "Annual West End show trip", "Music scholarships available"],
        "founded": "1907",
        "ofsted": "Outstanding",
        "attainment_8": 70.8,
        "grade_5_english_maths": 92.8,
        "ebacc_entry": 95.2,
        "post_16_destination": 98,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Language College",
        "sixth_form": "Girls only",
        "highlights": ["Largest Kent grammar school", "Two campus sites (Tonbridge & Sevenoaks)", "Language College status", "Outstanding academic results"],
        "founded": "1906",
        "ofsted": "Outstanding",
        "attainment_8": 70.0,
        "grade_5_english_maths": 94.5,
        "ebacc_entry": 85.2,
        "post_16_destination": 97,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Modern science labs", "Strong engineering links", "Active careers program"],
        "founded": "1958",
        "ofsted": "Good",
        "attainment_8": 68.9,
        "grade_5_english_maths": 93.0,
        "ebacc_entry": 93.7,
        "post_16_destination": 97,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Mathematics and Computing",
        "sixth_form": "Co-educational",
        "highlights": ["Founded 1549 - one of England's oldest", "Maths & Computing specialist", "Historic campus", "Strong rugby tradition"],
        "founded": "1549",
        "ofsted": "Good",
        "attainment_8": 68.4,
        "grade_5_english_maths": 92.0,
        "ebacc_entry": 98.1,
        "post_16_destination": 96,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Mathematics and Computing",
        "sixth_form": "Co-educational",
        "highlights": ["Outstanding Ofsted rating", "Maths & Computing specialist", "Extensive music program", "International school links"],
        "founded": "1881",
        "ofsted": "Outstanding",
        "attainment_8": 67.7,
        "grade_5_english_maths": 89.8,
        "ebacc_entry": 48.0,
        "post_16_destination": 99,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Mathematics and Computing",
        "sixth_form": "Co-educational",
        "highlights": ["Maths & Computing specialist", "Strong programming clubs", "Robotics competitions", "Award-winning STEM projects"],
        "founded": "1635",
        "ofsted": "Good",
        "attainment_8": 67.3,
        "grade_5_english_maths": 90.9,
        "ebacc_entry": 98.6,
        "post_16_destination": 96,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Top 100 UK state school", "Science College status", "Strong Oxbridge record", "Canterbury Cathedral links"],
        "founded": "1881",
        "ofsted": "Good",
        "attainment_8": 66.8,
        "grade_5_english_maths": 88.9,
        "ebacc_entry": 42.0,
        "post_16_destination": 96,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Outstanding STEM results", "Modern facilities", "Strong university progression"],
        "founded": "1957",
        "ofsted": "Good",
        "attainment_8": 66.7,
        "grade_5_english_maths": 89.2,
        "ebacc_entry": 96.0,
        "post_16_destination": 99,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Specialist Language College",
        "sixth_form": "International Baccalaureate (IB) only",
        "highlights": ["IB Diploma Programme since 2007", "Language College since 2005", "European exchange students", "Strong international links"],
        "founded": "1942",
        "ofsted": "Good",
        "attainment_8": 66.4,
        "grade_5_english_maths": 84.9,
        "ebacc_entry": 91.4,
        "post_16_destination": 99,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Language College",
        "sixth_form": "Girls only",
        "highlights": ["Outstanding Ofsted rating", "Language College status", "Extensive modern languages", "Japanese exchange program"],
        "founded": "1888",
        "ofsted": "Outstanding",
        "attainment_8": 66.4,
        "grade_5_english_maths": 87.7,
        "ebacc_entry": 93.6,
        "post_16_destination": 98,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Sports College",
        "sixth_form": "Co-educational",
        "highlights": ["Sports College status", "Rugby excellence program", "French exchange links", "Strong cadet force"],
        "founded": "1905",
        "ofsted": "Good",
        "attainment_8": 65.4,
        "grade_5_english_maths": 93.0,
        "ebacc_entry": 71.9,
        "post_16_destination": 98,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Modern science facilities", "Strong performing arts", "Beach proximity for marine biology"],
        "founded": "1957",
        "ofsted": "Good",
        "attainment_8": 65.3,
        "grade_5_english_maths": 92.8,
        "ebacc_entry": 79.0,
        "post_16_destination": 96,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Language College",
        "sixth_form": "Co-educational",
        "highlights": ["One of Kent's oldest schools", "Strong Oxbridge tradition", "Award-winning Combined Cadet Force", "Mandarin Chinese offered"],
        "founded": "1576",
        "ofsted": "Good",
        "attainment_8": 65.3,
        "grade_5_english_maths": 91.9,
        "ebacc_entry": 89.6,
        "post_16_destination": 97,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Mathematics and Computing",
        "sixth_form": "Co-educational",
        "highlights": ["Founded 1527 - nearly 500 years old", "Historic Tudor buildings", "Maths & Computing specialist", "Strong community links"],
        "founded": "1527",
        "ofsted": "Good",
        "attainment_8": 65.1,
        "grade_5_english_maths": 87.2,
        "ebacc_entry": 70.5,
        "post_16_destination": 97,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Mathematics and ICT",
        "sixth_form": "Co-educational",
        "highlights": ["Maths & ICT specialist", "Modern computing facilities", "Strong engineering links", "Award-winning robotics club"],
        "founded": "1957",
        "ofsted": "Good",
        "attainment_8": 64.6,
        "grade_5_english_maths": 90.0,
        "ebacc_entry": 67.2,
        "post_16_destination": 100,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Outstanding pastoral care", "STEM ambassador school", "Award-winning eco initiatives"],
        "founded": "1912",
        "ofsted": "Good",
        "attainment_8": 64.3,
        "grade_5_english_maths": 85.1,
        "ebacc_entry": 53.7,
        "post_16_destination": 98,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
    },
    {
        "name": "Chatham & Clarendon Grammar School",
        "slug": "chatham-clarendon-grammar-school",
        "address": "Chatham Street, Ramsgate CT11 7PS",
        "type": "Co-educational Grammar",
        "gender": "mixed",
        "pupils": 1600,
        "places_year7": 240,
        "open_days": "October",
        "competition": "2 applicants for every place",
        "competition_ratio": 2.0,
        "website": "http://www.ccgrammarschool.co.uk",
        "description": "Chatham & Clarendon Grammar School was formed from the merger of Chatham House and Clarendon House grammar schools, now a large co-educational school.",
        "key_strengths": "Technology College",
        "sixth_form": "Co-educational",
        "highlights": ["Merged from two historic schools", "Technology College status", "Strong sporting tradition", "Ramsgate coastal location"],
        "founded": "1797",
        "ofsted": "Good",
        "attainment_8": 64.0,
        "grade_5_english_maths": 84.9,
        "ebacc_entry": 76.0,
        "post_16_destination": 96,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science College",
        "sixth_form": "Co-educational",
        "highlights": ["Science College status", "Strong STEM results", "Excellent sports facilities", "Active Combined Cadet Force"],
        "founded": "1887",
        "ofsted": "Good",
        "attainment_8": 63.7,
        "grade_5_english_maths": 91.2,
        "ebacc_entry": 80.6,
        "post_16_destination": 95,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science and Mathematics Specialist",
        "sixth_form": "Co-educational",
        "highlights": ["Science specialist status", "Strong engineering links", "Combined Cadet Force (CCF)", "Award-winning Duke of Edinburgh program"],
        "founded": "1879",
        "ofsted": "Good",
        "attainment_8": 63.2,
        "grade_5_english_maths": 83.1,
        "ebacc_entry": 64.5,
        "post_16_destination": 96,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Language College",
        "sixth_form": "Co-educational",
        "highlights": ["Founded 1563 - Elizabethan heritage", "Language College status", "Historic school chapel", "Extensive playing fields"],
        "founded": "1563",
        "ofsted": "Good",
        "attainment_8": 62.7,
        "grade_5_english_maths": 81.0,
        "ebacc_entry": 79.1,
        "post_16_destination": 97,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Business and Enterprise",
        "sixth_form": "Co-educational",
        "highlights": ["Business & Enterprise status", "Industry partnerships", "Strong cricket tradition", "Named after William Harvey (blood circulation)"],
        "founded": "1674",
        "ofsted": "Good",
        "attainment_8": 61.8,
        "grade_5_english_maths": 85.5,
        "ebacc_entry": 57.2,
        "post_16_destination": 100,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Science Specialist",
        "sixth_form": "Girls only",
        "highlights": ["Science specialist since 2003", "Outstanding STEM results", "Young Enterprise awards", "Strong university preparation"],
        "founded": "1904",
        "ofsted": "Good",
        "attainment_8": 61.1,
        "grade_5_english_maths": 82.4,
        "ebacc_entry": 97.2,
        "post_16_destination": 98,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Mathematics and Computing College",
        "sixth_form": "Girls only",
        "highlights": ["Maths & Computing specialist", "STEM ambassador school", "Music excellence", "European school partnerships"],
        "founded": "1905",
        "ofsted": "Good",
        "attainment_8": 59.9,
        "grade_5_english_maths": 75.2,
        "ebacc_entry": 84.2,
        "post_16_destination": 99,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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
        "key_strengths": "Arts College",
        "sixth_form": "Co-educational",
        "highlights": ["Arts College status", "Outstanding creative arts", "Channel proximity for French links", "Strong pastoral support"],
        "founded": "1905",
        "ofsted": "Good",
        "attainment_8": 57.9,
        "grade_5_english_maths": 67.3,
        "ebacc_entry": 43.6,
        "post_16_destination": 99,
        "admissions_criteria": "Distance from school (straight line)",
        "catchment_distance": "Priority to those living closest"
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

# Papers API endpoint
@api_router.get("/papers/{filename}")
async def get_paper(filename: str):
    """Serve a practice paper PDF"""
    file_path = PAPERS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Paper not found")
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename
    )

@api_router.get("/papers")
async def list_papers():
    """List all available practice papers"""
    if not PAPERS_DIR.exists():
        return {"papers": []}
    papers = [f.name for f in PAPERS_DIR.glob("*.pdf")]
    return {"papers": sorted(papers), "count": len(papers)}

# ============================================
# OPEN EVENTS API ENDPOINTS
# ============================================

@api_router.get("/open-events", response_model=List[OpenEventResponse])
async def get_open_events(
    school_slug: Optional[str] = Query(None, description="Filter by school slug"),
    upcoming_only: bool = Query(False, description="Show only upcoming events")
):
    """Get all open events, optionally filtered by school"""
    query = {}
    if school_slug:
        query["school_slug"] = school_slug
    
    events = await db.open_events.find(query, {"_id": 0}).sort("event_date", 1).to_list(200)
    
    # Filter upcoming events if requested
    if upcoming_only:
        today = datetime.now(timezone.utc).date()
        filtered_events = []
        for event in events:
            try:
                # Parse date like "24 September 2025"
                event_date = datetime.strptime(event['event_date'], "%d %B %Y").date()
                if event_date >= today:
                    filtered_events.append(event)
            except:
                # If date parsing fails, include the event
                filtered_events.append(event)
        events = filtered_events
    
    # Convert datetime objects to strings
    for event in events:
        if isinstance(event.get('last_updated'), datetime):
            event['last_updated'] = event['last_updated'].isoformat()
        if isinstance(event.get('created_at'), datetime):
            event['created_at'] = event['created_at'].isoformat()
    
    return events

@api_router.post("/open-events", response_model=OpenEventResponse)
async def create_open_event(event: OpenEventCreate):
    """Create a new open event"""
    new_event = OpenEvent(**event.model_dump())
    doc = new_event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['last_updated'] = doc['last_updated'].isoformat()
    await db.open_events.insert_one(doc)
    return doc

@api_router.put("/open-events/{event_id}", response_model=OpenEventResponse)
async def update_open_event(event_id: str, event: OpenEventCreate):
    """Update an existing open event"""
    update_data = event.model_dump()
    update_data['last_updated'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.open_events.update_one(
        {"id": event_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    updated = await db.open_events.find_one({"id": event_id}, {"_id": 0})
    return updated

@api_router.delete("/open-events/{event_id}")
async def delete_open_event(event_id: str):
    """Delete an open event"""
    result = await db.open_events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

# ============================================
# CUT-OFF SCORES API ENDPOINTS
# ============================================

@api_router.get("/cut-off-scores", response_model=List[CutOffScoreResponse])
async def get_cut_off_scores(
    school_slug: Optional[str] = Query(None, description="Filter by school slug"),
    entry_year: Optional[str] = Query(None, description="Filter by entry year")
):
    """Get all cut-off scores, optionally filtered"""
    query = {}
    if school_slug:
        query["school_slug"] = school_slug
    if entry_year:
        query["entry_year"] = entry_year
    
    scores = await db.cut_off_scores.find(query, {"_id": 0}).sort([("entry_year", -1), ("school_name", 1)]).to_list(200)
    
    # Convert datetime objects to strings
    for score in scores:
        if isinstance(score.get('last_updated'), datetime):
            score['last_updated'] = score['last_updated'].isoformat()
        if isinstance(score.get('created_at'), datetime):
            score['created_at'] = score['created_at'].isoformat()
    
    return scores

@api_router.post("/cut-off-scores", response_model=CutOffScoreResponse)
async def create_cut_off_score(score: CutOffScoreCreate):
    """Create a new cut-off score entry"""
    new_score = CutOffScore(**score.model_dump())
    doc = new_score.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['last_updated'] = doc['last_updated'].isoformat()
    await db.cut_off_scores.insert_one(doc)
    return doc

@api_router.put("/cut-off-scores/{score_id}", response_model=CutOffScoreResponse)
async def update_cut_off_score(score_id: str, score: CutOffScoreCreate):
    """Update an existing cut-off score"""
    update_data = score.model_dump()
    update_data['last_updated'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.cut_off_scores.update_one(
        {"id": score_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Score record not found")
    
    updated = await db.cut_off_scores.find_one({"id": score_id}, {"_id": 0})
    return updated

@api_router.delete("/cut-off-scores/{score_id}")
async def delete_cut_off_score(score_id: str):
    """Delete a cut-off score entry"""
    result = await db.cut_off_scores.delete_one({"id": score_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Score record not found")
    return {"message": "Score record deleted successfully"}

# ============================================
# SCRAPING HELPER ENDPOINT
# ============================================

@api_router.post("/scrape-school-page")
async def scrape_school_page(request: ScrapeRequest):
    """
    Scrape a school's admissions page to extract open events and cut-off data.
    Returns raw extracted data for user validation before saving.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(request.url, follow_redirects=True)
            response.raise_for_status()
            
        soup = BeautifulSoup(response.text, 'html.parser')
        text_content = soup.get_text(separator=' ', strip=True)
        
        # Extract potential open events
        open_events = []
        event_keywords = ['open evening', 'open morning', 'open day', 'open event', 'sixth form']
        
        # Look for date patterns near event keywords
        date_pattern = r'(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})'
        time_pattern = r'(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)(?:\s*(?:to|-)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))?)'
        
        dates_found = re.findall(date_pattern, text_content, re.IGNORECASE)
        times_found = re.findall(time_pattern, text_content, re.IGNORECASE)
        
        # Extract potential cut-off scores
        cut_off_data = {}
        score_patterns = [
            r'cut-?off\s*(?:score)?[:\s]+(\d{3})',
            r'score\s+of\s+(\d{3})',
            r'minimum\s+score[:\s]+(\d{3})',
            r'threshold[:\s]+(\d{3})',
            r'scored?\s+(\d{3})\s+or\s+higher',
        ]
        
        for pattern in score_patterns:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            if matches:
                cut_off_data['potential_scores'] = list(set(matches))
                break
        
        # Look for distance information
        distance_pattern = r'(\d+\.?\d*)\s*miles?'
        distances = re.findall(distance_pattern, text_content, re.IGNORECASE)
        if distances:
            cut_off_data['potential_distances'] = distances
        
        # Look for number of places/offers
        places_pattern = r'(\d+)\s*(?:places?|offers?)'
        places = re.findall(places_pattern, text_content, re.IGNORECASE)
        if places:
            cut_off_data['potential_places'] = places
        
        return {
            "success": True,
            "url": request.url,
            "school_slug": request.school_slug,
            "school_name": request.school_name,
            "extracted_data": {
                "dates_found": dates_found[:10],  # Limit to first 10
                "times_found": times_found[:10],
                "cut_off_data": cut_off_data,
                "text_preview": text_content[:2000]  # First 2000 chars for manual review
            },
            "message": "Data extracted successfully. Please review and validate before saving."
        }
        
    except httpx.HTTPError as e:
        return {
            "success": False,
            "url": request.url,
            "error": f"HTTP error: {str(e)}",
            "message": "Failed to fetch the page. Please check the URL and try again."
        }
    except Exception as e:
        return {
            "success": False,
            "url": request.url,
            "error": str(e),
            "message": "An error occurred while scraping. Please try again."
        }

# ============================================
# SEED INITIAL DATA ENDPOINT
# ============================================

@api_router.post("/seed-open-events")
async def seed_open_events():
    """Seed the database with initial open events data from scraped schools"""
    
    # Initial open events data from the scraped pages
    initial_events = [
        # TWGGS Events
        {
            "school_slug": "tunbridge-wells-girls-grammar-school",
            "school_name": "Tunbridge Wells Girls' Grammar School",
            "event_type": "Year 5 Open Morning",
            "event_date": "2 July 2025",
            "event_time": "10:40am to 12:30pm",
            "headteacher_speaks": "12 noon",
            "booking_required": False,
            "notes": "No need to book - just turn up",
            "source_url": "https://www.twggs.kent.sch.uk/548/open-events"
        },
        {
            "school_slug": "tunbridge-wells-girls-grammar-school",
            "school_name": "Tunbridge Wells Girls' Grammar School",
            "event_type": "Open Evening",
            "event_date": "24 September 2025",
            "event_time": "4:30pm to 7:30pm",
            "headteacher_speaks": "5:30pm and 6:30pm",
            "booking_required": False,
            "notes": "No need to book - just turn up",
            "source_url": "https://www.twggs.kent.sch.uk/548/open-events"
        },
        {
            "school_slug": "tunbridge-wells-girls-grammar-school",
            "school_name": "Tunbridge Wells Girls' Grammar School",
            "event_type": "Open Morning",
            "event_date": "6 October 2025",
            "event_time": "10:40am to 12:30pm",
            "headteacher_speaks": "12 noon",
            "booking_required": False,
            "source_url": "https://www.twggs.kent.sch.uk/548/open-events"
        },
        {
            "school_slug": "tunbridge-wells-girls-grammar-school",
            "school_name": "Tunbridge Wells Girls' Grammar School",
            "event_type": "Sixth Form Options Evening",
            "event_date": "8 October 2025",
            "event_time": "4:30pm onwards",
            "headteacher_speaks": "5:30pm and 6:30pm",
            "notes": "External candidates from 4:30pm, Current pupils from 5:30pm",
            "source_url": "https://www.twggs.kent.sch.uk/548/open-events"
        },
        {
            "school_slug": "tunbridge-wells-girls-grammar-school",
            "school_name": "Tunbridge Wells Girls' Grammar School",
            "event_type": "Open Morning",
            "event_date": "29 October 2025",
            "event_time": "10:40am to 12:00pm",
            "headteacher_speaks": "12 noon",
            "source_url": "https://www.twggs.kent.sch.uk/548/open-events"
        },
        # The Judd School Events (from their admissions page)
        {
            "school_slug": "judd-school",
            "school_name": "The Judd School",
            "event_type": "Open Evening",
            "event_date": "September 2025",
            "event_time": "TBC",
            "notes": "Check school website for exact date",
            "source_url": "https://www.judd.online/y7-joiners"
        },
        # The Skinners' School Events
        {
            "school_slug": "skinners-school",
            "school_name": "The Skinners' School",
            "event_type": "Open Events and Tours",
            "event_date": "September 2025",
            "event_time": "TBC",
            "notes": "Check school website for exact dates",
            "source_url": "https://www.skinners-school.co.uk/34/admission-events-and-tours"
        },
    ]
    
    # Clear existing events and insert new ones
    await db.open_events.delete_many({})
    
    for event_data in initial_events:
        event = OpenEvent(**event_data)
        doc = event.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['last_updated'] = doc['last_updated'].isoformat()
        await db.open_events.insert_one(doc)
    
    return {"message": f"Seeded {len(initial_events)} open events successfully"}

# ============================================
# SCRAPE SOURCES CONFIGURATION
# ============================================

SCRAPE_SOURCES = [
    {
        "school_slug": "judd-school",
        "school_name": "The Judd School",
        "url": "https://www.judd.online/y7-joiners",
        "type": "html",
        "description": "Year 7 Admissions page with cut-off scores"
    },
    {
        "school_slug": "tonbridge-grammar-school",
        "school_name": "Tonbridge Grammar School",
        "url": "https://www.tgs.kent.sch.uk/join-us-in-year-7",
        "type": "html",
        "description": "Year 7 entry page with threshold scores"
    },
    {
        "school_slug": "skinners-school",
        "school_name": "The Skinners' School",
        "url": "https://www.skinners-school.co.uk/38/2026-year-7-admission-information-updated-2nd-march",
        "type": "html",
        "description": "2026 Year 7 Admission Information"
    },
    {
        "school_slug": "dartford-grammar-school",
        "school_name": "Dartford Grammar School",
        "url": "https://www.dartfordgrammarschool.org.uk/docs/Admissions_Y7/Cut_off_scores_March_2026.pdf",
        "type": "pdf",
        "description": "Cut-off scores PDF for March 2026"
    }
]

@api_router.get("/scrape-sources")
async def get_scrape_sources():
    """Get all configured scrape sources for cut-off scores"""
    return {"sources": SCRAPE_SOURCES, "count": len(SCRAPE_SOURCES)}

@api_router.post("/scrape-cutoff/{school_slug}")
async def scrape_cutoff_score(school_slug: str):
    """Scrape cut-off score data from a specific school's website"""
    
    # Find the source configuration
    source = next((s for s in SCRAPE_SOURCES if s["school_slug"] == school_slug), None)
    if not source:
        raise HTTPException(status_code=404, detail=f"No scrape source configured for {school_slug}")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(source["url"], follow_redirects=True)
            response.raise_for_status()
        
        text_content = ""
        if source["type"] == "html":
            soup = BeautifulSoup(response.text, 'html.parser')
            text_content = soup.get_text(separator=' ', strip=True)
        else:
            # For PDF, return info that it needs manual extraction
            return {
                "success": True,
                "school_slug": school_slug,
                "school_name": source["school_name"],
                "url": source["url"],
                "type": "pdf",
                "message": "PDF detected. Please use the PDF extraction tool or enter data manually.",
                "source_url": source["url"]
            }
        
        # Extract scores using regex patterns
        extracted_data = {
            "school_slug": school_slug,
            "school_name": source["school_name"],
            "source_url": source["url"]
        }
        
        # Pattern for cut-off scores
        cutoff_patterns = [
            (r'cut-?off\s*(?:score)?\s*(?:for\s*(?:the\s*)?(?:inner|area))?\s*(?:was)?\s*\**(\d{3})\**', 'inner_area_score'),
            (r'inner\s*area\s*(?:was|:)?\s*\**(\d{3})\**', 'inner_area_score'),
            (r'outer\s*area\s*(?:being|was|:)?\s*\**(\d{3})\**', 'outer_area_score'),
            (r'Area\s*offers?\s*was\s*\**(\d{3})\**', 'inner_area_score'),
            (r'Trustee\s*offers?\s*was\s*\**(\d{3})\**', 'governors_score'),
            (r'Governors\'\s*places.*?lowest\s*score.*?(\d{3})', 'governors_score'),
            (r'(\d{3})\s*or\s*higher', 'inner_area_score'),
        ]
        
        for pattern, field in cutoff_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match and field not in extracted_data:
                extracted_data[field] = int(match.group(1))
        
        # Pattern for places/offers
        offers_patterns = [
            (r'(\d+)\s*offers?\s*(?:were\s*)?made', 'total_offers'),
            (r'(\d+)\s*places?\s*(?:have\s*been\s*)?offered?\s*to\s*(?:those\s*)?(?:living\s*)?(?:in\s*)?(?:the\s*)?(?:inner|West\s*Kent)', 'inner_area_places'),
            (r'(\d+)\s*places?\s*(?:have\s*been\s*)?offered?\s*to\s*(?:those\s*)?(?:living\s*)?(?:in\s*)?(?:the\s*)?(?:outer|Outer)', 'outer_area_places'),
            (r'inner\s*area\s*is\s*(\d+)', 'inner_area_places'),
            (r'outer\s*area\s*is\s*(\d+)', 'outer_area_places'),
        ]
        
        for pattern, field in offers_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match and field not in extracted_data:
                extracted_data[field] = int(match.group(1))
        
        # Pattern for distances
        distance_patterns = [
            (r'furthest\s*place\s*offered\s*is\s*\**(\d+\.?\d*)\s*miles?\**', 'furthest_distance_inner'),
            (r'distance\s*tie-?break.*?(\d+\.?\d*)\s*miles', 'furthest_distance_inner'),
        ]
        
        for pattern, field in distance_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match and field not in extracted_data:
                extracted_data[field] = f"{match.group(1)} miles"
        
        # Pattern for mean scores
        mean_patterns = [
            (r'mean\s*score.*?Inner.*?(\d{3}\.?\d*)', 'mean_score_inner'),
            (r'mean\s*score.*?Outer.*?(\d{3}\.?\d*)', 'mean_score_outer'),
        ]
        
        for pattern, field in mean_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE | re.DOTALL)
            if match and field not in extracted_data:
                extracted_data[field] = float(match.group(1))
        
        return {
            "success": True,
            "extracted_data": extracted_data,
            "text_preview": text_content[:2000],
            "message": "Data extracted. Please review before saving."
        }
        
    except httpx.HTTPError as e:
        return {
            "success": False,
            "error": f"HTTP error: {str(e)}",
            "url": source["url"]
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "url": source["url"]
        }

@api_router.post("/scrape-all-cutoffs")
async def scrape_all_cutoffs():
    """Scrape cut-off scores from all configured sources"""
    results = []
    for source in SCRAPE_SOURCES:
        try:
            if source["type"] == "pdf":
                results.append({
                    "school_slug": source["school_slug"],
                    "school_name": source["school_name"],
                    "status": "skipped",
                    "reason": "PDF - requires manual extraction",
                    "url": source["url"]
                })
                continue
                
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(source["url"], follow_redirects=True)
                response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            text_content = soup.get_text(separator=' ', strip=True)
            
            # Extract basic score info
            inner_match = re.search(r'(?:inner|area)\s*(?:cut-?off|score)?\s*(?:was|:)?\s*\**(\d{3})\**', text_content, re.IGNORECASE)
            outer_match = re.search(r'outer\s*(?:area)?\s*(?:being|was|:)?\s*\**(\d{3})\**', text_content, re.IGNORECASE)
            
            results.append({
                "school_slug": source["school_slug"],
                "school_name": source["school_name"],
                "status": "success",
                "inner_area_score": int(inner_match.group(1)) if inner_match else None,
                "outer_area_score": int(outer_match.group(1)) if outer_match else None,
                "url": source["url"]
            })
        except Exception as e:
            results.append({
                "school_slug": source["school_slug"],
                "school_name": source["school_name"],
                "status": "error",
                "error": str(e),
                "url": source["url"]
            })
    
    return {"results": results, "total": len(results)}

@api_router.post("/seed-cut-off-scores")
async def seed_cut_off_scores():
    """Seed the database with comprehensive cut-off score data from all schools"""
    
    # Comprehensive cut-off scores from scraped data (2026 entry)
    initial_scores = [
        {
            "school_slug": "judd-school",
            "school_name": "The Judd School",
            "entry_year": "2026",
            "inner_area_score": 389,
            "outer_area_score": 403,
            "total_offers": 180,
            "inner_area_places": 157,
            "outer_area_places": 23,
            "mean_score_inner": 396.5,
            "mean_score_outer": 409.2,
            "notes": "Inner area cut-off increased from 371 (2025) to 389 (2026). Outer area from 398 to 403. ~20 offers made from waiting list annually.",
            "source_url": "https://www.judd.online/y7-joiners"
        },
        {
            "school_slug": "tonbridge-grammar-school",
            "school_name": "Tonbridge Grammar School",
            "entry_year": "2026",
            "inner_area_score": 378,
            "governors_score": 400,
            "furthest_distance_inner": "4.7 miles",
            "furthest_distance_outer": "14.6 miles",
            "notes": "Area offers cut-off: 378 with 4.7 miles distance tie-break. Trustee offers cut-off: 400 with 14.6 miles tie-break.",
            "source_url": "https://www.tgs.kent.sch.uk/join-us-in-year-7"
        },
        {
            "school_slug": "skinners-school",
            "school_name": "The Skinners' School",
            "entry_year": "2026",
            "inner_area_score": 372,
            "governors_score": 384,
            "furthest_distance_inner": "5.474 miles",
            "furthest_distance_outer": "13.921 miles",
            "total_offers": 160,
            "inner_area_places": 140,
            "outer_area_places": 20,
            "notes": "West Kent Area: 124 places + 16 Governors' places (ranked by score, lowest 384). Outer Area: 20 places. Minimum score 372 required.",
            "source_url": "https://www.skinners-school.co.uk/38/2026-year-7-admission-information-updated-2nd-march"
        },
        {
            "school_slug": "dartford-grammar-school",
            "school_name": "Dartford Grammar School",
            "entry_year": "2026",
            "inner_area_score": 381,
            "outer_area_score": 403,
            "pupil_premium_score": 368,
            "notes": "Priority Area: 381 (Pupil Premium: 368). Category 2 All addresses: 403 (Pupil Premium: 392).",
            "source_url": "https://www.dartfordgrammarschool.org.uk/docs/Admissions_Y7/Cut_off_scores_March_2026.pdf"
        },
    ]
    
    # Clear existing scores and insert new ones
    await db.cut_off_scores.delete_many({})
    
    for score_data in initial_scores:
        score = CutOffScore(**score_data)
        doc = score.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['last_updated'] = doc['last_updated'].isoformat()
        await db.cut_off_scores.insert_one(doc)
    
    return {"message": f"Seeded {len(initial_scores)} cut-off scores successfully"}

# ============================================
# CONTACT QUERY ENDPOINTS
# ============================================

@api_router.post("/contact", response_model=ContactQueryResponse)
async def submit_contact_query(query: ContactQueryCreate):
    """Submit a contact query - stores in DB and sends email notification"""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    contact = ContactQuery(
        name=query.name,
        email=query.email,
        subject=query.subject,
        message=query.message
    )
    
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_queries.insert_one(doc)
    
    # Try to send email notification (using Gmail SMTP or environment configured SMTP)
    try:
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER', '')
        smtp_pass = os.environ.get('SMTP_PASS', '')
        recipient_email = os.environ.get('CONTACT_EMAIL', 'shradsgurram23@gmail.com')
        
        if smtp_user and smtp_pass:
            msg = MIMEMultipart()
            msg['From'] = smtp_user
            msg['To'] = recipient_email
            msg['Subject'] = f"[Kent 11+ Hub] New Contact: {query.subject}"
            
            body = f"""
New contact query received from Kent 11+ Schools Hub:

Name: {query.name}
Email: {query.email}
Subject: {query.subject}

Message:
{query.message}

---
Reply directly to: {query.email}
            """
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)
                
            logger.info(f"Contact email sent to {recipient_email}")
    except Exception as e:
        logger.warning(f"Failed to send contact email: {e}")
        # Still save to DB even if email fails
    
    return ContactQueryResponse(
        id=contact.id,
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message,
        status=contact.status,
        created_at=doc['created_at']
    )

@api_router.get("/contact", response_model=List[ContactQueryResponse])
async def get_contact_queries(status: Optional[str] = None):
    """Get all contact queries (for admin)"""
    query = {}
    if status:
        query['status'] = status
    
    queries = await db.contact_queries.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return queries

@api_router.put("/contact/{query_id}/status")
async def update_query_status(query_id: str, status: str = Body(..., embed=True)):
    """Update contact query status"""
    result = await db.contact_queries.update_one(
        {"id": query_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Query not found")
    return {"message": "Status updated", "status": status}

@api_router.delete("/contact/{query_id}")
async def delete_contact_query(query_id: str):
    """Delete a contact query"""
    result = await db.contact_queries.delete_one({"id": query_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Query not found")
    return {"message": "Query deleted"}

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
