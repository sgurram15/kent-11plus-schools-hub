import React, { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search, MapPin, Users, GraduationCap, Trophy, ExternalLink, ArrowRight, Filter, X, ChevronDown, BookOpen, Building2, Scale, Menu, Home as HomeIcon, List, GitCompare, Calendar, Clock, Bell, CheckCircle, AlertCircle, FileText, Mail, Award, ShoppingCart } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-heading text-xl font-bold text-stone-900">Kent 11+</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-home">
              Home
            </Link>
            <Link to="/schools" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-schools">
              Schools
            </Link>
            <Link to="/compare" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-compare">
              Compare
            </Link>
            <Link to="/open-events" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-open-events">
              Open Events
            </Link>
            <Link to="/cut-off-scores" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-cut-off-scores">
              Cut-off Scores
            </Link>
            <Link to="/key-dates" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-key-dates">
              Key Dates
            </Link>
            <Link to="/practice-papers" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-practice-papers">
              Practice Papers
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-stone-600 hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/schools" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Schools
              </Link>
              <Link to="/compare" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Compare
              </Link>
              <Link to="/open-events" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Open Events
              </Link>
              <Link to="/cut-off-scores" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Cut-off Scores
              </Link>
              <Link to="/key-dates" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Key Dates
              </Link>
              <Link to="/practice-papers" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Practice Papers
              </Link>
              <Link to="/independent-schools" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Independent Schools
              </Link>
              <Link to="/admin" className="text-stone-400 hover:text-primary transition-colors font-medium text-sm" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-stone-900 text-stone-400 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-heading text-xl font-bold text-white">Kent 11+ Hub</span>
          </div>
          <p className="text-stone-400 max-w-md">
            Your comprehensive guide to Kent grammar schools and 11+ admissions. Helping parents and students navigate the journey to academic excellence.
          </p>
        </div>
        
        <div>
          <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/schools" className="hover:text-white transition-colors">All Schools</Link></li>
            <li><Link to="/compare" className="hover:text-white transition-colors">Compare Schools</Link></li>
            <li><Link to="/open-events" className="hover:text-white transition-colors">Open Events</Link></li>
            <li><Link to="/cut-off-scores" className="hover:text-white transition-colors">Cut-off Scores</Link></li>
            <li><Link to="/key-dates" className="hover:text-white transition-colors">Key Dates & Calendar</Link></li>
            <li><Link to="/practice-papers" className="hover:text-white transition-colors">Practice Papers</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-heading font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><a href="https://www.kent.gov.uk/education-and-children/schools/school-places" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kent County Council</a></li>
            <li><a href="https://www.gl-assessment.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GL Assessment</a></li>
            <li><Link to="/exam-info" className="hover:text-white transition-colors">Exam Information</Link></li>
            <li><Link to="/independent-schools" className="hover:text-white transition-colors">Independent Schools</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1"><Mail className="h-3 w-3" /> Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Kent 11+ Grammar Schools Hub. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// School Card Component
const SchoolCard = ({ school, onCompareToggle, isSelected }) => (
  <div className="school-card bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col" data-testid={`school-card-${school.slug}`}>
    <div className="p-6 flex-1">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${
          school.gender === 'boys' ? 'bg-blue-100 text-blue-700' :
          school.gender === 'girls' ? 'bg-pink-100 text-pink-700' :
          'bg-green-100 text-green-700'
        }`}>
          {school.type}
        </span>
        <button 
          onClick={() => onCompareToggle(school)}
          className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          data-testid={`compare-toggle-${school.slug}`}
          title={isSelected ? "Remove from comparison" : "Add to comparison"}
        >
          <Scale className="h-4 w-4" />
        </button>
      </div>
      
      <h3 className="font-heading text-xl font-semibold text-stone-900 mb-2">{school.name}</h3>
      
      <div className="flex items-center gap-1 text-stone-500 text-sm mb-4">
        <MapPin className="h-4 w-4" />
        <span>{school.address}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-stone-50 rounded-lg">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-semibold text-stone-900">{school.pupils.toLocaleString()}</p>
          <p className="text-xs text-stone-500">Pupils</p>
        </div>
        <div className="text-center p-3 bg-stone-50 rounded-lg">
          <Trophy className="h-5 w-5 text-secondary mx-auto mb-1" />
          <p className="text-lg font-semibold text-stone-900">{school.competition_ratio}:1</p>
          <p className="text-xs text-stone-500">Competition</p>
        </div>
      </div>
      
      <p className="text-sm text-stone-500">
        <strong>{school.places_year7}</strong> places available in Year 7
      </p>
    </div>
    
    <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/50">
      <Link 
        to={`/schools/${school.slug}`} 
        className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors btn-press"
        data-testid={`view-school-${school.slug}`}
      >
        View Details <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

// Stats Card Component
const StatCard = ({ icon: Icon, value, label, color = "primary" }) => (
  <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm flex flex-col items-center text-center">
    <Icon className={`h-8 w-8 mb-3 ${color === 'primary' ? 'text-primary' : 'text-secondary'}`} />
    <p className="text-3xl font-bold text-stone-900">{value}</p>
    <p className="text-sm text-stone-500">{label}</p>
  </div>
);

// Home Page
const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [featuredSchools, setFeaturedSchools] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, schoolsRes] = await Promise.all([
          axios.get(`${API}/schools/stats/summary`),
          axios.get(`${API}/schools?sort_by=competition_ratio&sort_order=desc`)
        ]);
        setStats(statsRes.data);
        setFeaturedSchools(schoolsRes.data.slice(0, 6));
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetchData();
  }, []);
  
  const handleCompareToggle = (school) => {
    setCompareList(prev => {
      if (prev.find(s => s.id === school.id)) {
        return prev.filter(s => s.id !== school.id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, school];
    });
  };
  
  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1743291110939-d1bc31239c5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHxicml0aXNoJTIwZ3JhbW1hciUyMHNjaG9vbCUyMGJ1aWxkaW5nJTIwYnJpY2slMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzcyNjYzNjQyfDA&ixlib=rb-4.1.0&q=85)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Kent Grammar Schools Hub
            </h1>
            <p className="text-lg md:text-xl text-stone-300 mb-8 leading-relaxed">
              Your comprehensive guide to all 32 Kent grammar schools. Compare schools, understand admissions, and prepare for the 11+ exam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/schools" 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-all btn-press"
                data-testid="hero-explore-btn"
              >
                Explore Schools <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/exam-info" 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur text-white border border-white/20 rounded-md font-medium hover:bg-white/20 transition-all"
                data-testid="hero-exam-btn"
              >
                Exam Information <BookOpen className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      {stats && (
        <section className="py-16 md:py-20 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="animate-fade-in">
                <StatCard icon={Building2} value={stats.total_schools} label="Grammar Schools" />
              </div>
              <div className="animate-fade-in-delay-1">
                <StatCard icon={Users} value={stats.total_places_year7?.toLocaleString() || 0} label="Year 7 Places" />
              </div>
              <div className="animate-fade-in-delay-2">
                <StatCard icon={GraduationCap} value={stats.total_pupils?.toLocaleString() || 0} label="Total Pupils" color="secondary" />
              </div>
              <div className="animate-fade-in-delay-3">
                <StatCard icon={Trophy} value={`${stats.average_competition}:1`} label="Avg Competition" color="secondary" />
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Featured Schools */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-stone-900 tracking-tight mb-2">
                Most Competitive Schools
              </h2>
              <p className="text-stone-600">Schools with the highest competition for places</p>
            </div>
            <Link 
              to="/schools" 
              className="mt-4 md:mt-0 text-primary font-medium hover:underline flex items-center gap-1"
              data-testid="view-all-schools"
            >
              View all schools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSchools.map((school, i) => (
              <div key={school.id} className={`animate-fade-in-delay-${i % 3 + 1}`}>
                <SchoolCard 
                  school={school} 
                  onCompareToggle={handleCompareToggle}
                  isSelected={compareList.some(s => s.id === school.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1651154368144-a53e9f1b3e23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwzfHxkaXZlcnNlJTIwaGlnaCUyMHNjaG9vbCUyMHN0dWRlbnRzJTIwc3R1ZHlpbmclMjB0b2dldGhlciUyMG1vZGVybnxlbnwwfHx8fDE3NzI2NjM2NTJ8MA&ixlib=rb-4.1.0&q=85)`,
        }}
      >
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white mb-4">
            Ready to Compare Schools?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Use our comparison tool to evaluate schools side by side. Compare competition ratios, available places, and more.
          </p>
          <Link 
            to="/compare" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-md font-semibold hover:bg-stone-100 transition-all btn-press"
            data-testid="cta-compare-btn"
          >
            <Scale className="h-5 w-5" />
            Compare Schools
          </Link>
        </div>
      </section>
      
      {/* Compare Float Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => navigate('/compare', { state: { selectedSchools: compareList } })}
            className="flex items-center gap-2 px-4 py-3 bg-secondary text-white rounded-full shadow-lg hover:bg-secondary/90 transition-all btn-press"
            data-testid="compare-float-btn"
          >
            <Scale className="h-5 w-5" />
            Compare ({compareList.length})
          </button>
        </div>
      )}
    </div>
  );
};

// Schools List Page
const SchoolsPage = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    gender: searchParams.get('gender') || '',
    sortBy: searchParams.get('sort_by') || 'competition_ratio',
    sortOrder: searchParams.get('sort_order') || 'desc'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.gender) params.append('gender', filters.gender);
      params.append('sort_by', filters.sortBy);
      params.append('sort_order', filters.sortOrder);
      
      const response = await axios.get(`${API}/schools?${params.toString()}`);
      setSchools(response.data);
    } catch (e) {
      console.error("Error fetching schools:", e);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key === 'sortBy' ? 'sort_by' : key === 'sortOrder' ? 'sort_order' : key, value);
    } else {
      newParams.delete(key === 'sortBy' ? 'sort_by' : key === 'sortOrder' ? 'sort_order' : key);
    }
    setSearchParams(newParams);
  };
  
  const handleCompareToggle = (school) => {
    setCompareList(prev => {
      if (prev.find(s => s.id === school.id)) {
        return prev.filter(s => s.id !== school.id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, school];
    });
  };
  
  const clearFilters = () => {
    setFilters({ search: '', gender: '', sortBy: 'competition_ratio', sortOrder: 'desc' });
    setSearchParams(new URLSearchParams());
  };
  
  return (
    <div className="min-h-screen py-8" data-testid="schools-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Kent Grammar Schools
          </h1>
          <p className="text-stone-600">Browse and search all 32 grammar schools in Kent</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search schools by name or location..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                data-testid="search-input"
              />
            </div>
            
            {/* Filter Toggle Button (Mobile/Tablet) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 border border-stone-200 rounded-md text-stone-600 hover:bg-stone-50"
              data-testid="filter-toggle-btn"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
            
            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4">
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="px-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-stone-600"
                data-testid="gender-filter"
              >
                <option value="">All Schools</option>
                <option value="boys">Boys Schools</option>
                <option value="girls">Girls Schools</option>
                <option value="mixed">Co-educational</option>
              </select>
              
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-stone-600"
                data-testid="sort-by-filter"
              >
                <option value="name">Sort by Name</option>
                <option value="pupils">Sort by Size</option>
                <option value="places_year7">Sort by Places</option>
                <option value="competition_ratio">Sort by Competition</option>
              </select>
              
              <button
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-stone-200 rounded-md text-stone-600 hover:bg-stone-50 transition-all"
                data-testid="sort-order-btn"
              >
                {filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
              
              {(filters.search || filters.gender) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-4 py-3 text-stone-500 hover:text-stone-700"
                  data-testid="clear-filters-btn"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile/Tablet Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-stone-200 flex flex-col gap-4">
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="px-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-stone-600"
              >
                <option value="">All Schools</option>
                <option value="boys">Boys Schools</option>
                <option value="girls">Girls Schools</option>
                <option value="mixed">Co-educational</option>
              </select>
              
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-stone-600"
              >
                <option value="name">Sort by Name</option>
                <option value="pupils">Sort by Size</option>
                <option value="places_year7">Sort by Places</option>
                <option value="competition_ratio">Sort by Competition</option>
              </select>
              
              <div className="flex gap-4">
                <button
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex-1 px-4 py-3 border border-stone-200 rounded-md text-stone-600 hover:bg-stone-50 transition-all"
                >
                  {filters.sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
                {(filters.search || filters.gender) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-4 py-3 text-stone-500 hover:text-stone-700"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <p className="text-stone-500 mb-6">
          Showing <strong className="text-stone-900">{schools.length}</strong> schools
        </p>
        
        {/* Schools Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map(school => (
              <SchoolCard 
                key={school.id} 
                school={school}
                onCompareToggle={handleCompareToggle}
                isSelected={compareList.some(s => s.id === school.id)}
              />
            ))}
          </div>
        )}
        
        {/* Compare Float Button */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => navigate('/compare', { state: { selectedSchools: compareList } })}
              className="flex items-center gap-2 px-4 py-3 bg-secondary text-white rounded-full shadow-lg hover:bg-secondary/90 transition-all btn-press"
              data-testid="compare-float-btn"
            >
              <Scale className="h-5 w-5" />
              Compare ({compareList.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// School Detail Page
const SchoolDetailPage = () => {
  const { slug } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await axios.get(`${API}/schools/${slug}`);
        setSchool(response.data);
      } catch (e) {
        console.error("Error fetching school:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSchool();
  }, [slug]);
  
  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-stone-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-stone-200 rounded-xl" />
              <div className="h-96 bg-stone-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!school) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-stone-900 mb-4">School Not Found</h1>
          <Link to="/schools" className="text-primary hover:underline">Back to all schools</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8" data-testid="school-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/schools" className="hover:text-primary">Schools</Link>
          <span>/</span>
          <span className="text-stone-900">{school.name}</span>
        </nav>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded ${
              school.gender === 'boys' ? 'bg-blue-100 text-blue-700' :
              school.gender === 'girls' ? 'bg-pink-100 text-pink-700' :
              'bg-green-100 text-green-700'
            }`}>
              {school.type}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded bg-stone-100 text-stone-600">
              {school.county}
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            {school.name}
          </h1>
          <div className="flex items-center gap-2 text-stone-500">
            <MapPin className="h-5 w-5" />
            <span>{school.address}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-4">About</h2>
              <p className="text-stone-600 leading-relaxed">{school.description}</p>
            </div>
            
            {/* School Highlights - Unique to each school */}
            {school.highlights && school.highlights.length > 0 && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
                <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-4">What Makes Us Unique</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {school.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-stone-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-stone-700">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Specialist Status & Sixth Form */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-4">Programs & Specialisms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {school.specialist_status && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-stone-900">Specialist Status</h3>
                    </div>
                    <p className="text-stone-600">{school.specialist_status}</p>
                  </div>
                )}
                {school.sixth_form && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-amber-600" />
                      <h3 className="font-semibold text-stone-900">Sixth Form</h3>
                    </div>
                    <p className="text-stone-600">{school.sixth_form}</p>
                  </div>
                )}
              </div>
              {school.founded && (
                <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <p className="text-stone-600">
                    <span className="font-semibold text-stone-900">Founded:</span> {school.founded}
                    {parseInt(school.founded) < 1600 && " — One of England's oldest grammar schools"}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Academic Performance */}
            {(school.ofsted || school.attainment_8) && (
              <div className="bg-gradient-to-br from-primary to-primary/90 rounded-xl shadow-sm p-6 text-white">
                <h3 className="font-heading text-lg font-semibold mb-4">Academic Performance</h3>
                <div className="space-y-3">
                  {school.ofsted && (
                    <div className="flex justify-between items-center pb-2 border-b border-white/20">
                      <span className="text-white/80">Ofsted Rating</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-sm ${school.ofsted === 'Outstanding' ? 'bg-green-500' : 'bg-amber-500'}`}>
                        {school.ofsted}
                      </span>
                    </div>
                  )}
                  {school.attainment_8 && (
                    <div className="flex justify-between items-center pb-2 border-b border-white/20">
                      <span className="text-white/80">Attainment 8</span>
                      <span className="font-semibold">{school.attainment_8.toFixed(1)}</span>
                    </div>
                  )}
                  {school.grade_5_english_maths && (
                    <div className="flex justify-between items-center pb-2 border-b border-white/20">
                      <span className="text-white/80">Grade 5+ Eng & Maths</span>
                      <span className="font-semibold">{school.grade_5_english_maths}%</span>
                    </div>
                  )}
                  {school.ebacc_entry && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">EBacc Entry</span>
                      <span className="font-semibold">{school.ebacc_entry}%</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/60 mt-3">Data from GOV.UK 2024/25</p>
              </div>
            )}
            
            {/* Key Stats */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">Key Information</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-stone-500">Total Pupils</span>
                  <span className="font-semibold text-stone-900">{school.pupils.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-stone-500">Year 7 Places</span>
                  <span className="font-semibold text-stone-900">{school.places_year7}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-stone-500">Competition</span>
                  <span className="font-semibold text-secondary">{school.competition}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <span className="text-stone-500">Open Days</span>
                  <span className="font-semibold text-stone-900">{school.open_days}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Exam Format</span>
                  <span className="font-semibold text-stone-900">{school.exam_format}</span>
                </div>
              </div>
            </div>
            
            {/* Website Link */}
            <a 
              href={school.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all btn-press"
              data-testid="school-website-link"
            >
              Visit School Website <ExternalLink className="h-4 w-4" />
            </a>
            
            {/* Back to Schools */}
            <Link 
              to="/schools"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-all"
              data-testid="back-to-schools"
            >
              Back to All Schools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compare Page
const ComparePage = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [cutOffScores, setCutOffScores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsRes, scoresRes] = await Promise.all([
          axios.get(`${API}/schools`),
          axios.get(`${API}/cut-off-scores`)
        ]);
        setSchools(schoolsRes.data);
        setCutOffScores(scoresRes.data);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const handleSelectSchool = (school) => {
    if (selectedSchools.find(s => s.id === school.id)) {
      setSelectedSchools(prev => prev.filter(s => s.id !== school.id));
    } else if (selectedSchools.length < 4) {
      setSelectedSchools(prev => [...prev, school]);
    }
  };
  
  // Get cut-off score for a school
  const getCutOffScore = (schoolSlug, field) => {
    const score = cutOffScores.find(s => s.school_slug === schoolSlug && s.entry_year === "2026");
    return score ? score[field] : null;
  };
  
  const compareFields = [
    // Basic Info Section
    { key: 'type', label: 'Type', section: 'Basic Information' },
    { key: 'pupils', label: 'Total Pupils', format: (v) => v?.toLocaleString() || '-' },
    { key: 'places_year7', label: 'Year 7 Places' },
    { key: 'competition', label: 'Competition' },
    { key: 'competition_ratio', label: 'Competition Ratio', format: (v) => v ? `${v}:1` : '-' },
    { key: 'founded', label: 'Founded' },
    // Academic Performance Section
    { key: 'ofsted', label: 'Ofsted Rating', section: 'Academic Performance', highlight: true },
    { key: 'attainment_8', label: 'Attainment 8 Score', format: (v) => v ? v.toFixed(1) : '-', highlight: true },
    { key: 'grade_5_english_maths', label: 'Grade 5+ English & Maths', format: (v) => v ? `${v}%` : '-', highlight: true },
    { key: 'ebacc_entry', label: 'EBacc Entry Rate', format: (v) => v ? `${v}%` : '-' },
    { key: 'post_16_destination', label: 'Post-16 Destination', format: (v) => v ? `${v}%` : '-' },
    // Cut-off Scores Section (2026)
    { key: 'cutoff_inner', label: 'Inner Area Cut-off (2026)', section: 'Cut-off Scores (2026 Entry)', highlight: true, isCutoff: true, cutoffField: 'inner_area_score' },
    { key: 'cutoff_outer', label: 'Outer Area Cut-off (2026)', highlight: true, isCutoff: true, cutoffField: 'outer_area_score' },
    { key: 'cutoff_governors', label: 'Governors\' Score (2026)', isCutoff: true, cutoffField: 'governors_score' },
    { key: 'cutoff_total_offers', label: 'Total Offers Made', isCutoff: true, cutoffField: 'total_offers' },
    { key: 'cutoff_inner_places', label: 'Inner Area Places', isCutoff: true, cutoffField: 'inner_area_places' },
    { key: 'cutoff_outer_places', label: 'Outer Area Places', isCutoff: true, cutoffField: 'outer_area_places' },
    { key: 'cutoff_distance', label: 'Furthest Distance (Inner)', isCutoff: true, cutoffField: 'furthest_distance_inner' },
    // Admissions Section
    { key: 'admissions_criteria', label: 'Admissions Criteria', section: 'Admissions' },
    { key: 'catchment_distance', label: 'Catchment Info' },
    { key: 'open_days', label: 'Open Days' },
    // Programs Section
    { key: 'specialist_status', label: 'Specialist Status', section: 'Programs' },
    { key: 'sixth_form', label: 'Sixth Form' },
    { key: 'address', label: 'Address', section: 'Location' },
  ];
  
  // Get the value for a field (either from school or cut-off scores)
  const getFieldValue = (school, field) => {
    if (field.isCutoff) {
      const value = getCutOffScore(school.slug, field.cutoffField);
      if (value === null || value === undefined) return '-';
      if (field.format) return field.format(value);
      return value;
    }
    const value = school[field.key];
    if (field.format) return field.format(value);
    return value || '-';
  };
  
  return (
    <div className="min-h-screen py-8" data-testid="compare-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Compare Schools
          </h1>
          <p className="text-stone-600">Select 2-4 schools to compare side by side including 2026 cut-off scores</p>
        </div>
        
        {/* School Selector */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-stone-900 mb-4">Select Schools ({selectedSchools.length}/4)</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSchools.map(school => (
              <span 
                key={school.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {school.name}
                <button onClick={() => handleSelectSchool(school)} className="hover:text-primary/70">
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          
          <select
            onChange={(e) => {
              const school = schools.find(s => s.id === e.target.value);
              if (school) handleSelectSchool(school);
              e.target.value = '';
            }}
            className="w-full md:w-auto px-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-stone-600"
            data-testid="school-selector"
            disabled={selectedSchools.length >= 4}
          >
            <option value="">Add a school to compare...</option>
            {schools.filter(s => !selectedSchools.find(sel => sel.id === s.id)).map(school => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>
          
          {cutOffScores.length > 0 && (
            <p className="text-xs text-stone-500 mt-3">
              <span className="text-green-600">●</span> Cut-off scores available for {cutOffScores.length} schools (2026 entry)
            </p>
          )}
        </div>
        
        {/* Comparison Table */}
        {selectedSchools.length >= 2 ? (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="comparison-table">
                <thead>
                  <tr className="bg-stone-50">
                    <th className="text-left p-4 font-semibold text-stone-900 border-b border-stone-200 min-w-[180px]">
                      Attribute
                    </th>
                    {selectedSchools.map(school => (
                      <th key={school.id} className="text-left p-4 font-semibold text-stone-900 border-b border-stone-200 min-w-[200px]">
                        <Link to={`/schools/${school.slug}`} className="hover:text-primary">
                          {school.name}
                        </Link>
                        {getCutOffScore(school.slug, 'inner_area_score') && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            2026 data
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map((field, index) => (
                    <React.Fragment key={`field-${index}-${field.key}`}>
                      {field.section && (
                        <tr className={field.isCutoff ? "bg-green-50" : "bg-primary/5"}>
                          <td colSpan={selectedSchools.length + 1} className={`p-3 font-semibold text-sm uppercase tracking-wide ${field.isCutoff ? 'text-green-700' : 'text-primary'}`}>
                            {field.section}
                          </td>
                        </tr>
                      )}
                      <tr className={`border-b border-stone-100 last:border-0 ${field.highlight ? (field.isCutoff ? 'bg-green-50/50' : 'bg-amber-50/50') : ''}`}>
                        <td className="p-4 text-stone-600 font-medium">
                          {field.label}
                          {field.highlight && <span className={`ml-1 text-xs ${field.isCutoff ? 'text-green-600' : 'text-amber-600'}`}>★</span>}
                        </td>
                        {selectedSchools.map(school => (
                          <td key={school.id} className={`p-4 ${field.highlight ? 'font-semibold text-stone-900' : 'text-stone-700'}`}>
                            {getFieldValue(school, field)}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Legend */}
            <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 text-sm text-stone-500">
              <span className="text-amber-600">★</span> Academic metrics from GOV.UK 2024/25 &nbsp;|&nbsp;
              <span className="text-green-600">★</span> Cut-off scores from school websites (March 2026)
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-xl border border-dashed border-stone-300 p-12 text-center">
            <Scale className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-500">Select at least 2 schools to compare</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Exam Info Page
const ExamInfoPage = () => (
  <div className="min-h-screen py-8" data-testid="exam-info-page">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
          Kent 11+ Exam Information
        </h1>
        <p className="text-stone-600">Everything you need to know about the Kent grammar school entrance exam</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Exam Format */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
            <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-4">Exam Format</h2>
            <p className="text-stone-600 mb-6">
              The Kent 11+ test is written by GL Assessment. All schools in Kent use the same exam which grants entry for all schools.
            </p>
            
            <div className="space-y-4">
              <div className="p-5 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-stone-900 mb-2">Paper 1 - Reasoning (50 minutes)</h3>
                <ul className="text-stone-600 space-y-2 text-sm">
                  <li>• Verbal Reasoning: 25 minutes (includes 5 minute practice)</li>
                  <li>• Spatial Reasoning: Two 5-minute sections</li>
                  <li>• Non-Verbal Reasoning: Three 5-minute sections</li>
                </ul>
              </div>
              
              <div className="p-5 bg-amber-50 rounded-lg border border-amber-100">
                <h3 className="font-semibold text-stone-900 mb-2">Paper 2 - English & Mathematics (60 minutes)</h3>
                <ul className="text-stone-600 space-y-2 text-sm">
                  <li>• English: 30 minutes (includes 5 minute practice)</li>
                  <li>• Mathematics: 30 minutes (includes 5 minute practice)</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Age Adjustment */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
            <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-4">Age Adjusted Results</h2>
            <p className="text-stone-600 leading-relaxed">
              Because Kent uses GL papers, results are age adjusted to ensure younger children are not disadvantaged. 
              The difference varies by paper and by year, but if there is a year gap, the oldest children would need 
              to score roughly 10% more to get the same result as someone a year younger than them.
            </p>
          </div>
          
          {/* Preparation Tips */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
            <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-4">Preparation Options</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-stone-200 rounded-lg">
                <h3 className="font-semibold text-stone-900 mb-1">Private Tutor</h3>
                <p className="text-stone-500 text-sm">£2,500 - £6,000 per year. One-to-one focused preparation.</p>
              </div>
              
              <div className="p-4 border border-stone-200 rounded-lg">
                <h3 className="font-semibold text-stone-900 mb-1">Tuition Centre</h3>
                <p className="text-stone-500 text-sm">£1,500 - £3,500 per year. Group tuition with structured learning.</p>
              </div>
              
              <div className="p-4 border border-stone-200 rounded-lg">
                <h3 className="font-semibold text-stone-900 mb-1">Home Preparation</h3>
                <p className="text-stone-500 text-sm">~£300 average spend on books and papers. Great for hands-on parents.</p>
              </div>
              
              <div className="p-4 border border-stone-200 rounded-lg">
                <h3 className="font-semibold text-stone-900 mb-1">Structured Courses</h3>
                <p className="text-stone-500 text-sm">£12 - £89 total. Skills built gradually with guided materials.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary text-white rounded-xl p-6">
            <h3 className="font-heading text-xl font-semibold mb-4">Key Dates</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-white/80">Registration Opens</span>
                <span className="font-semibold">June</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/80">Registration Closes</span>
                <span className="font-semibold">July</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/80">Test Date</span>
                <span className="font-semibold">September</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/80">Results</span>
                <span className="font-semibold">October</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
            <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">Useful Resources</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.kent.gov.uk/education-and-children/schools/school-places/kent-test" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Kent Test Official Info
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gl-assessment.co.uk/products/11plus-series-702/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  GL Assessment 11+ Resources
                </a>
              </li>
            </ul>
          </div>
          
          <Link 
            to="/schools"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-all btn-press"
          >
            Browse All Schools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Practice Papers Page - Kent 11+ Only
const PracticePapersPage = () => {
  // Helper to generate local paper URL from filename
  const getPaperUrl = (filename) => `${API}/papers/${encodeURIComponent(filename)}`;

  const glPapers = [
    {
      subject: "Maths",
      provider: "Bond",
      links: [
        { label: "Sample Paper", url: getPaperUrl("Bond-11-Plus-Maths-Sample-Paper1.pdf") },
        { label: "Answers", url: getPaperUrl("Bond-11-Plus-Maths-paper-answers.pdf") }
      ]
    },
    {
      subject: "Maths",
      provider: "CGP CEM",
      links: [
        { label: "Practice Paper", url: getPaperUrl("cgp-11plus-cem-maths-free-practice-test-1.pdf") },
        { label: "Answers", url: getPaperUrl("cgp-11plus-cem-maths-free-practice-test-answers.pdf") }
      ]
    },
    {
      subject: "English",
      provider: "Bond",
      links: [
        { label: "Sample Test", url: getPaperUrl("Bond-11-Plus-English-Sample-Test.pdf") },
        { label: "Answers", url: getPaperUrl("Bond-11-Plus-English-Test-Answers.pdf") }
      ]
    },
    {
      subject: "English",
      provider: "CGP",
      links: [
        { label: "Assessment Test", url: getPaperUrl("CGP11plusAssessmentTest_English.pdf") },
        { label: "Answer Sheet", url: getPaperUrl("CGP11plusAssessmentTest_English_MCAnswersheet.pdf") },
        { label: "Answers", url: getPaperUrl("CGP11plusAssessmentTest_English_Answers.pdf") }
      ]
    },
    {
      subject: "English",
      provider: "CSSE 2016",
      links: [
        { label: "Exam Paper", url: getPaperUrl("ENG-2016-PAPERS-FOR-UPLOAD-CSSE.pdf") },
        { label: "Answers", url: getPaperUrl("ENG-2016-ANSWER-SCHEME-FOR-UPLOAD-CSSE.pdf") }
      ]
    },
    {
      subject: "Verbal Reasoning",
      provider: "GL Official",
      links: [
        { label: "Familiarisation Paper", url: getPaperUrl("vr-1-familiarisation-test-booklet.pdf") },
        { label: "Answer Sheet", url: getPaperUrl("vr1_answer_sheet.pdf") }
      ]
    },
    {
      subject: "Verbal Reasoning",
      provider: "CGP GL",
      links: [
        { label: "Practice Paper", url: getPaperUrl("cgp-11plus-gl-vr-free-practice-test.pdf") },
        { label: "Answers", url: getPaperUrl("cgp-11plus-gl-vr-free-practice-test-answers.pdf") }
      ]
    },
    {
      subject: "Verbal Reasoning",
      provider: "CGP CEM",
      links: [
        { label: "Practice Paper", url: getPaperUrl("CGP-11-Plus-CEM-Verbal-Reasoning-Paper.pdf") },
        { label: "Answer Sheet", url: getPaperUrl("CGP-11-Plus-CEM-VR-Answer-Sheet.pdf") },
        { label: "Answers", url: getPaperUrl("CGP-11-Plus-CEM-VR-Answers1.pdf") }
      ]
    },
    {
      subject: "Verbal Reasoning",
      provider: "Bond GL",
      links: [
        { label: "Practice Paper", url: getPaperUrl("k70636_vr_test.pdf") },
        { label: "Answers", url: getPaperUrl("k70647_vr_answers.pdf") }
      ]
    },
    {
      subject: "Non-Verbal Reasoning",
      provider: "GL Official",
      links: [
        { label: "Familiarisation Booklet", url: getPaperUrl("nvr-1-familiarisation-test-booklet.pdf") },
        { label: "Answer Sheet", url: getPaperUrl("nvr1_answer_sheet.pdf") }
      ]
    },
    {
      subject: "Non-Verbal Reasoning",
      provider: "CGP GL",
      links: [
        { label: "Sample Test", url: getPaperUrl("cgp-11plus-gl-nvr-free-practice-test.pdf") },
        { label: "Answers", url: getPaperUrl("cgp-11plus-gl-nvr-free-practice-test-answers.pdf") }
      ]
    },
    {
      subject: "Non-Verbal Reasoning",
      provider: "CGP CEM",
      links: [
        { label: "Sample Test", url: getPaperUrl("cgp-11plus-cem-nvr-free-practice-test.pdf") },
        { label: "Answers", url: getPaperUrl("cgp-11plus-cem-nvr-free-practice-test-answers.pdf") }
      ]
    },
    {
      subject: "Non-Verbal Reasoning",
      provider: "Bond",
      links: [
        { label: "Sample Test", url: getPaperUrl("k70635_nvr_test.pdf") },
        { label: "Answers", url: getPaperUrl("k70646_nvr_answers.pdf") }
      ]
    },
    {
      subject: "CEM Full Test",
      provider: "Bond",
      links: [
        { label: "Full Test", url: getPaperUrl("Bond-CEM-11-Plus-Practice-test.pdf") },
        { label: "Answers", url: getPaperUrl("Bond-CEM-11-Plus-Practice-test-answers.pdf") }
      ]
    }
  ];

  const getSubjectColor = (subject) => {
    switch(subject) {
      case "Maths": return "bg-blue-100 text-blue-700 border-blue-200";
      case "English": return "bg-green-100 text-green-700 border-green-200";
      case "Verbal Reasoning": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Non-Verbal Reasoning": return "bg-amber-100 text-amber-700 border-amber-200";
      case "CEM Full Test": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  // Group papers by subject
  const subjects = ["Maths", "English", "Verbal Reasoning", "Non-Verbal Reasoning", "CEM Full Test"];

  return (
    <div className="min-h-screen py-8" data-testid="practice-papers-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Kent 11+ Practice Papers
          </h1>
          <p className="text-stone-600">Free GL Assessment practice papers for the Kent Test</p>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-stone-900 mb-1">Kent Test Uses GL Assessment</h3>
              <p className="text-stone-600 text-sm">
                All Kent grammar schools use GL Assessment papers. These free practice papers help you understand the format. 
                We recommend using these alongside structured learning resources for best results.
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Books Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">📚 Recommended 11+ Practice Books</h3>
                <p className="text-stone-600 text-sm">
                  Complement free papers with structured workbooks from top publishers
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://amzn.to/4bnUnp2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Bond Maths
              </a>
              <a 
                href="https://amzn.to/3Nkx7Aq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Bond English
              </a>
              <a 
                href="https://amzn.to/3P8WJ3O" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Bond VR
              </a>
              <a 
                href="https://amzn.to/4dkssZK" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Bond NVR
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {subjects.map(subject => (
              <div key={subject} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded border ${getSubjectColor(subject)}`}>
                    {subject}
                  </span>
                </div>
                <div className="space-y-3">
                  {glPapers.filter(p => p.subject === subject).map((paper, index) => (
                    <div key={index} className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-sm font-medium text-stone-700">by {paper.provider}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {paper.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 rounded-md text-sm text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Books - Affiliate Section */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Recommended Books
              </h3>
              <p className="text-xs text-stone-500 mb-4">Best-selling 11+ preparation materials</p>
              
              <div className="space-y-3">
                <a 
                  href="https://amzn.to/4bnUnp2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-white rounded-lg border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <BookOpen className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">Bond 11+ Maths</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Assessment Papers 10-11+</p>
                      <span className="inline-flex items-center text-xs text-amber-600 mt-1 font-medium">
                        View on Amazon <ExternalLink className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                  </div>
                </a>

                <a 
                  href="https://amzn.to/3Nkx7Aq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-white rounded-lg border border-green-100 hover:border-green-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <BookOpen className="h-5 w-5 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm group-hover:text-green-700 transition-colors">Bond 11+ English</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Assessment Papers 10-11+</p>
                      <span className="inline-flex items-center text-xs text-green-600 mt-1 font-medium">
                        View on Amazon <ExternalLink className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                  </div>
                </a>

                <a 
                  href="https://amzn.to/3P8WJ3O" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <BookOpen className="h-5 w-5 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm group-hover:text-purple-700 transition-colors">Bond 11+ Verbal Reasoning</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Assessment Papers 10-11+</p>
                      <span className="inline-flex items-center text-xs text-purple-600 mt-1 font-medium">
                        View on Amazon <ExternalLink className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                  </div>
                </a>

                <a 
                  href="https://amzn.to/4dkssZK" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm group-hover:text-blue-700 transition-colors">Bond 11+ Non-Verbal Reasoning</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Assessment Papers 10-11+</p>
                      <span className="inline-flex items-center text-xs text-blue-600 mt-1 font-medium">
                        View on Amazon <ExternalLink className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                  </div>
                </a>

                <a 
                  href="https://amzn.to/4spcAtu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-white rounded-lg border border-red-100 hover:border-red-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <BookOpen className="h-5 w-5 text-red-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm group-hover:text-red-700 transition-colors">Bond 11+ Complete Pack</h4>
                      <p className="text-xs text-stone-500 mt-0.5">All Subjects Bundle</p>
                      <span className="inline-flex items-center text-xs text-red-600 mt-1 font-medium">
                        View on Amazon <ExternalLink className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                  </div>
                </a>

                <a 
                  href="https://amzn.to/413XnlI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-white rounded-lg border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <BookOpen className="h-5 w-5 text-orange-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm group-hover:text-orange-700 transition-colors">CGP 11+ GL Practice Pack</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Complete Test Bundle</p>
                      <span className="inline-flex items-center text-xs text-orange-600 mt-1 font-medium">
                        View on Amazon <ExternalLink className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              <p className="text-xs text-stone-400 mt-4 text-center italic">
                As an Amazon Associate, we earn from qualifying purchases
              </p>
            </div>

            {/* Kent Test Format */}
            <div className="bg-primary text-white rounded-xl p-6">
              <h3 className="font-heading text-xl font-semibold mb-4">Kent Test Format</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-white/10 rounded-lg">
                  <p className="font-semibold mb-1">Paper 1 - Reasoning (50 mins)</p>
                  <ul className="text-white/80 space-y-1">
                    <li>• Verbal Reasoning (25 mins)</li>
                    <li>• Spatial Reasoning (10 mins)</li>
                    <li>• Non-Verbal Reasoning (15 mins)</li>
                  </ul>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <p className="font-semibold mb-1">Paper 2 - Core Subjects (60 mins)</p>
                  <ul className="text-white/80 space-y-1">
                    <li>• English (30 mins)</li>
                    <li>• Mathematics (30 mins)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Subject Guide */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">Subject Focus Areas</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-stone-600">Maths - Arithmetic, Problem Solving</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-stone-600">English - Comprehension, Grammar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-stone-600">VR - Word Patterns, Logic</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-stone-600">NVR - Shapes, Sequences</span>
                </div>
              </div>
            </div>

            {/* External Resources */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">More Resources</h3>
              <div className="space-y-3">
                <a 
                  href="https://www.gl-assessment.co.uk/products/11plus-series-702/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  GL Assessment Official
                </a>
                <a 
                  href="https://www.kent.gov.uk/education-and-children/schools/school-places/kent-test/prepare-for-the-kent-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Kent Council Preparation Guide
                </a>
              </div>
            </div>

            {/* Independent Schools Link */}
            <Link 
              to="/independent-schools"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-all btn-press"
            >
              Independent School Papers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Independent Schools Page
const IndependentSchoolsPage = () => {
  // Helper to generate local paper URL from filename
  const getPaperUrl = (filename) => `${API}/papers/${encodeURIComponent(filename)}`;

  const independentSchools = [
    {
      school: "Alleyn's School",
      location: "Dulwich, London",
      description: "Independent co-educational school in South London",
      maths: [
        { label: "Maths Sample 1", url: getPaperUrl("Alleyns-11_Maths_Sample_Examination_Paper_1.pdf") },
        { label: "Maths Sample 2", url: getPaperUrl("Alleyns-11_Maths_Sample_Examination_Paper_2.pdf") }
      ],
      english: [
        { label: "English Sample 1", url: getPaperUrl("11_English_Sample_Examination_Paper_1-Alleyns.pdf") },
        { label: "English Sample 2", url: getPaperUrl("11_English_Sample_Examination_Paper_2-Alleyns.pdf") }
      ]
    },
    {
      school: "Bancroft's School",
      location: "Woodford Green, Essex",
      description: "Independent co-educational school",
      maths: [
        { label: "Maths 2017", url: getPaperUrl("Bancrofts-2017-11-Maths-Complete-1.pdf") },
        { label: "Maths 2016", url: getPaperUrl("11-Mathematics-Sample-Paper-from-January-2016-Bancrofts.pdf") },
        { label: "Maths Sample", url: getPaperUrl("11-maths-bancrofts-school-sample-paper-Year-unknown....pdf") }
      ],
      english: [
        { label: "English 2017", url: getPaperUrl("2017-11-English-Paper-complete-Bancrofts.pdf") },
        { label: "English 2016", url: getPaperUrl("11-English-Sample-Paper-from-January-2016-Bancrofts.pdf") },
        { label: "English Sample 1", url: getPaperUrl("11-english-bancrofts-school-sample-paper-1.pdf") },
        { label: "English Sample 2", url: getPaperUrl("11-english-bancrofts-school-sample-paper-2.pdf") }
      ]
    },
    {
      school: "City of London School",
      location: "London",
      description: "Independent boys' school near St Paul's Cathedral",
      maths: [
        { label: "Maths 2018", url: getPaperUrl("City-of-London-11plus_Specimen_Maths_Jul18.pdf") }
      ],
      english: [
        { label: "English 2018", url: getPaperUrl("11plus_Specimen_English_Jul18-City-of-London.pdf") },
        { label: "English Sample", url: getPaperUrl("11-english-city-of-london-school.pdf") }
      ]
    },
    {
      school: "Dulwich College",
      location: "Dulwich, London",
      description: "Independent boys' school with extensive past papers",
      maths: [
        { label: "Maths A", url: getPaperUrl("Dulwich-College-11-Plus-Maths-Paper-A.pdf") },
        { label: "Maths A Answers", url: getPaperUrl("Dulwich-College-Maths-Paper-A-Mark-Scheme.pdf") },
        { label: "Maths B", url: getPaperUrl("Dulwich-College-11-Plus-Maths-Paper-B.pdf") },
        { label: "Maths B Answers", url: getPaperUrl("Dulwich-College-11-Plus-Maths-Paper-B-Mark-Scheme.pdf") },
        { label: "Maths C", url: getPaperUrl("Dulwich-year-7-maths-specimen-paper-c.pdf") },
        { label: "Maths D", url: getPaperUrl("Dulwich-year-7-maths-specimen-paper-d.pdf") },
        { label: "Maths E", url: getPaperUrl("Dulwich-year-7-maths-specimen-paper-e.pdf") },
        { label: "Maths F", url: getPaperUrl("Dulwich-year-7-maths-specimen-paper-f.pdf") }
      ],
      english: [
        { label: "English A", url: getPaperUrl("Dulwich-College-11-Plus-English-Paper-A.pdf") },
        { label: "English B", url: getPaperUrl("Dulwich-College-11-Plus-English-Paper-B.pdf") },
        { label: "English C", url: getPaperUrl("11-english-dulwich-college-specimen-paper-c.pdf") },
        { label: "English 2009", url: getPaperUrl("11-english-dulwich-college.pdf") }
      ]
    },
    {
      school: "Haberdashers' Aske's Boys'",
      location: "Elstree, Hertfordshire",
      description: "Leading independent boys' school",
      maths: [
        { label: "Maths 2013", url: getPaperUrl("Haberdahers-Askes-Boys-11-Plus-Maths-Paper-A.pdf") },
        { label: "Maths 2011", url: getPaperUrl("11-maths-haberdashers-askes-boys-school-2011-1.pdf") }
      ],
      english: [
        { label: "English 2013", url: getPaperUrl("Haberdashers-Askes-Boys-11-Plus-English-Paper-A.pdf") },
        { label: "English 2011", url: getPaperUrl("11-english-haberdashers-aske-boys-school-2011.pdf") }
      ]
    },
    {
      school: "Highgate School",
      location: "Highgate, London",
      description: "Independent co-educational school",
      maths: [
        { label: "Maths 2013", url: getPaperUrl("11-maths-highgate-school-2013.pdf") }
      ],
      english: []
    },
    {
      school: "King's College School Wimbledon",
      location: "Wimbledon, London",
      description: "Independent boys' school with co-ed sixth form",
      maths: [
        { label: "Maths Section A 2017", url: getPaperUrl("11-maths-section-a-kings-college-school-wimbledon-2017.pdf") },
        { label: "Maths Section B 2017", url: getPaperUrl("11-maths-section-b-kings-college-school-wimbledon-2017.pdf") },
        { label: "Maths 2014", url: getPaperUrl("11-maths-kings-college-school-wimbledon-2014.pdf") }
      ],
      english: [
        { label: "Reading 2015", url: getPaperUrl("11-english-reading-kings-college-school-wimbledon-2015.pdf") },
        { label: "Writing 2015", url: getPaperUrl("11-english-writing-kings-college-school-wimbledon-2015.pdf") },
        { label: "Section A 2017", url: getPaperUrl("11-english-section-a-kings-college-school-wimbledon-2017-and-pre-test-2019.pdf") },
        { label: "Section B 2017", url: getPaperUrl("11-english-section-b-kings-college-school-wimbledon-2017-and-pre-test-2019.pdf") }
      ]
    },
    {
      school: "Manchester Grammar School",
      location: "Manchester",
      description: "Independent boys' day school, one of the largest in the UK",
      maths: [
        { label: "Maths A 2018", url: getPaperUrl("MG-2018-Arithmetic-Section-A.pdf") },
        { label: "Maths A 2018 Answers", url: getPaperUrl("MG-2018-Arithmetic-Section-A-Answers.pdf") },
        { label: "Maths B 2018", url: getPaperUrl("MG-2018-Arithmetic-Section-B.pdf") },
        { label: "Maths B 2018 Answers", url: getPaperUrl("MG-2018-Arithmetic-Section-B-Answers.pdf") },
        { label: "Maths A 2017", url: getPaperUrl("MG-2017-Arithmetic-Section-A.pdf") },
        { label: "Maths B 2017", url: getPaperUrl("MG-2017-Arithmetic-Section-B.pdf") },
        { label: "Maths A 2016", url: getPaperUrl("MG-Arithmetic-Section-A-2016.pdf") },
        { label: "Maths B 2016", url: getPaperUrl("MG-Arithmetic-Section-B-2016.pdf") }
      ],
      english: [
        { label: "English A 2018", url: getPaperUrl("2018-English-Section-A.pdf") },
        { label: "English A 2018 Answers", url: getPaperUrl("2018-English-Section-A-Answers.pdf") },
        { label: "Comprehension 2018", url: getPaperUrl("2018-English-Comprehension-Passage.pdf") },
        { label: "English A 2017", url: getPaperUrl("2017-English-Paper-Section-A.pdf") },
        { label: "English A 2016", url: getPaperUrl("English-Section-A-2016.pdf") }
      ]
    },
    {
      school: "Merchant Taylor's School",
      location: "Northwood, Middlesex",
      description: "Independent boys' school",
      maths: [
        { label: "Maths Specimen 1", url: getPaperUrl("merchant-taylors-11plus_Maths_specimen_1.pdf") },
        { label: "Maths Specimen 2", url: getPaperUrl("merchant-taylors-11plus_Maths_specimen_2.pdf") }
      ],
      english: [
        { label: "English 2010", url: getPaperUrl("11__English_Entrance_Exam_10-Merchant-Taylors.pdf") },
        { label: "English Practice", url: getPaperUrl("11__English_practice_paper-Merchant-Taylors.pdf") }
      ]
    },
    {
      school: "North London Girls' Consortium",
      location: "London",
      description: "Group of independent girls' schools including Notting Hill & Ealing, Godolphin & Latymer",
      maths: [
        { label: "Maths 2016 G1", url: getPaperUrl("11-maths-group-1-notting-hill-ealing-high-school-2016-group-1.pdf") },
        { label: "Maths 2016 G2", url: getPaperUrl("11-maths-godolphin-latymer-2016-group-2.pdf") },
        { label: "Maths 2015 G1", url: getPaperUrl("11-maths-notting-hill-ealing-high-school-2015-group-1.pdf") },
        { label: "Maths 2015 G2", url: getPaperUrl("11-maths-godolphin-latymer-2015-group-2.pdf") },
        { label: "Maths 2014 G1", url: getPaperUrl("11-maths-notting-hill-ealing-high-school-2014-group-1.pdf") },
        { label: "Maths 2013 G1", url: getPaperUrl("11-maths-notting-hill-ealing-high-school-2013-group-1.pdf") }
      ],
      english: [
        { label: "English 2016 G1", url: getPaperUrl("11-english-group-1-notting-hill-ealing-high-school-2016.pdf") },
        { label: "English 2016 G2", url: getPaperUrl("11-english-north-london-independent-girls-schools-consortium-2016.pdf") },
        { label: "English 2015 G1", url: getPaperUrl("11-english-notting-hill-ealing-high-school-2015.pdf") },
        { label: "English 2014 G1", url: getPaperUrl("11-english-notting-hill-ealing-high-school-2014.pdf") },
        { label: "English 2013 G1", url: getPaperUrl("11-english-notting-hill-ealing-high-school-2013.pdf") }
      ]
    },
    {
      school: "The Perse School",
      location: "Cambridge",
      description: "Independent co-educational school",
      maths: [
        { label: "Maths Sample A", url: getPaperUrl("11-maths-specimen-paper-1-the-perse-upper-school-cambridge-year-unknown.pdf") },
        { label: "Maths Sample B", url: getPaperUrl("11-maths-specimen-paper-2-the-perse-upper-school-cambridge-year-unknown.pdf") },
        { label: "Maths Sample C", url: getPaperUrl("11-maths-specimen-paper-3-the-perse-upper-school-cambridge-year-unknown.pdf") },
        { label: "Maths Sample D", url: getPaperUrl("11-maths-specimen-paper-4-the-perse-upper-school-cambridge-year-unknown.pdf") },
        { label: "Maths Sample E", url: getPaperUrl("11-maths-specimen-paper-5-the-perse-upper-school-cambridge-year-unknown.pdf") }
      ],
      english: [
        { label: "English Sample 1", url: getPaperUrl("11-english-specimen-paper-1-the-perse-upper-school-cambridge.pdf") },
        { label: "English Sample 2", url: getPaperUrl("11-english-specimen-paper-2-the-perse-upper-school-cambridge.pdf") },
        { label: "English Sample 3", url: getPaperUrl("11-english-specimen-paper-3-the-perse-upper-school-cambridge.pdf") },
        { label: "English Sample 4", url: getPaperUrl("11-english-specimen-paper-4-the-perse-upper-school-cambridge.pdf") }
      ]
    },
    {
      school: "St Paul's Girls' School",
      location: "Hammersmith, London",
      description: "Leading independent girls' school",
      maths: [],
      english: [
        { label: "English Paper 2", url: getPaperUrl("St-Pauls-Girls-school-11-Plus-English-paper-2.pdf") },
        { label: "Comprehension Paper 2", url: getPaperUrl("St-Pauls-Girls-School-English-Comprehension-Paper-2.pdf") }
      ]
    },
    {
      school: "Emanuel School",
      location: "Battersea, London",
      description: "Independent co-educational school",
      maths: [
        { label: "Maths 2013", url: getPaperUrl("11-maths-emanuel-2013.pdf") }
      ],
      english: [
        { label: "English 2012", url: getPaperUrl("11-english-emanuel-school-2012.pdf") },
        { label: "English 2011", url: getPaperUrl("Emanuel-School-11-Plus-English-Paper-1.pdf") },
        { label: "English 2010", url: getPaperUrl("11-english-emanuel-2010.pdf") }
      ]
    },
    {
      school: "ISEB Common Entrance",
      location: "National",
      description: "Independent Schools Examinations Board - used by many schools",
      maths: [
        { label: "Maths 2016", url: getPaperUrl("11-mathematics-iseb-2016.pdf") },
        { label: "Maths 2016 Answers", url: getPaperUrl("11-mathematics-mark-scheme-iseb-2016.pdf") },
        { label: "Maths 2009", url: getPaperUrl("11-maths-iseb-2009.pdf") },
        { label: "Maths 2008", url: getPaperUrl("11-maths-iseb-2008-1.pdf") }
      ],
      english: [
        { label: "English Paper 1 2009", url: getPaperUrl("11-english-paper-1-iseb-2009.pdf") },
        { label: "English Paper 2 2009", url: getPaperUrl("11-english-paper-2-iseb-2009.pdf") },
        { label: "English Paper 1 2008", url: getPaperUrl("11-english-paper-1-iseb-2008.pdf") },
        { label: "English Paper 2 2008", url: getPaperUrl("11-english-paper-2-iseb-2008.pdf") }
      ]
    },
    {
      school: "The King's School Chester",
      location: "Chester",
      description: "Independent school in Chester",
      maths: [
        { label: "Maths Paper", url: getPaperUrl("The-Kings-School-Chester-11-Plus-Maths-Paper.pdf") }
      ],
      english: [
        { label: "Comprehension", url: getPaperUrl("The-Kings-School-Chester-11-Plus-English-Question-Paper.pdf") },
        { label: "Passage", url: getPaperUrl("The-Kings-School-Chester-11-Plus-English-Texts-for-Question-Paper.pdf") }
      ]
    },
    {
      school: "Reigate Grammar School",
      location: "Reigate, Surrey",
      description: "Independent co-educational school",
      maths: [
        { label: "Maths 2013", url: getPaperUrl("11-maths-reigate-2013.pdf") },
        { label: "Maths 2012", url: getPaperUrl("11-maths-reigate-grammar-school-2012.pdf") }
      ],
      english: [
        { label: "English 2012", url: getPaperUrl("11-english-reigate-grammar-school-2012.pdf") }
      ]
    },
    {
      school: "Dame Alice Owen's School",
      location: "Potters Bar, Hertfordshire",
      description: "Selective co-educational school",
      maths: [
        { label: "Maths Paper", url: getPaperUrl("Dame-Alice-Owens-School-Maths-Familiarisation-Paper-ilovepdf-compressed-1.pdf") },
        { label: "Answers", url: getPaperUrl("Dame-Alice-Owens-School-Maths-Familiarisation-Paper-Answers.pdf") }
      ],
      english: []
    },
    {
      school: "Colfe's School",
      location: "Lee, London",
      description: "Independent co-educational school",
      maths: [
        { label: "Maths Sample", url: getPaperUrl("11-maths-colfes-school-year-unknown....pdf") }
      ],
      english: []
    },
    {
      school: "Kent College",
      location: "Canterbury, Kent",
      description: "Independent co-educational school",
      maths: [
        { label: "Maths Sample", url: getPaperUrl("11-maths-kent-college-year-unknown.pdf") }
      ],
      english: [
        { label: "English 2009", url: getPaperUrl("11-english-kent-college-2009.pdf") }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-8" data-testid="independent-schools-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Independent School Papers
          </h1>
          <p className="text-stone-600">Free sample papers from {independentSchools.length} leading independent schools across the UK</p>
        </div>

        {/* Info Note */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Building2 className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-stone-900 mb-1">About Independent School Exams</h3>
              <p className="text-stone-600 text-sm">
                Independent schools often create their own entrance exams. These papers differ from the Kent 11+ (GL Assessment) 
                but are excellent practice for developing broader skills. Many schools use ISEB Common Pre-Tests or their own papers.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {independentSchools.map((school, index) => (
                <div key={index} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-stone-900">{school.school}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-stone-400" />
                        <span className="text-sm text-stone-500">{school.location}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded">
                      {school.maths.length + school.english.length} papers
                    </span>
                  </div>
                  <p className="text-sm text-stone-500 mb-4">{school.description}</p>
                  
                  {school.maths.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase text-blue-600 mb-2">Maths</p>
                      <div className="flex flex-wrap gap-2">
                        {school.maths.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {school.english.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-green-600 mb-2">English</p>
                      <div className="flex flex-wrap gap-2">
                        {school.english.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 border border-green-200 rounded text-xs text-green-700 hover:bg-green-100 transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Differences */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">Independent vs Grammar</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <p className="font-semibold text-stone-900 mb-1">Grammar Schools (Kent)</p>
                  <ul className="text-stone-600 space-y-1">
                    <li>• Free state-funded education</li>
                    <li>• Standard GL Assessment test</li>
                    <li>• Single test for all schools</li>
                  </ul>
                </div>
                <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                  <p className="font-semibold text-stone-900 mb-1">Independent Schools</p>
                  <ul className="text-stone-600 space-y-1">
                    <li>• Fee-paying education</li>
                    <li>• School-specific exams</li>
                    <li>• May include interviews</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exam Boards */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">Common Exam Types</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-stone-600">ISEB Common Pre-Tests</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-stone-600">School-specific papers</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-stone-600">GL Assessment (some)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-stone-600">CEM papers (some)</span>
                </div>
              </div>
            </div>

            {/* External Resources */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">Resources</h3>
              <div className="space-y-3">
                <a 
                  href="https://www.iseb.co.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  ISEB Official Website
                </a>
                <a 
                  href="https://www.gov.uk/school-performance-tables"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  School Performance Tables
                </a>
              </div>
            </div>

            {/* Kent 11+ Link */}
            <Link 
              to="/practice-papers"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all btn-press"
            >
              Kent 11+ Papers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Key Dates Page
const KeyDatesPage = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison
  
  // Important dates for Kent Test 2025/2026 cycle
  const rawDates = [
    {
      id: 1,
      date: "2 June 2025",
      dateObj: new Date("2025-06-02"),
      title: "Kent Test Registration Opens",
      description: "Online registration opens for the September 2025 Kent Test",
      category: "registration"
    },
    {
      id: 2,
      date: "1 July 2025",
      dateObj: new Date("2025-07-01"),
      title: "Kent Test Registration Closes",
      description: "Deadline to register your child for the Kent Test. Late registrations may be accepted - contact kent.admissions@kent.gov.uk",
      category: "registration"
    },
    {
      id: 3,
      date: "11 September 2025",
      dateObj: new Date("2025-09-11"),
      title: "Kent Test Takes Place",
      description: "Children sit the Kent Test at designated test centres. Two papers: Reasoning (50 mins) and English & Maths (60 mins)",
      category: "exam"
    },
    {
      id: 4,
      date: "16 October 2025",
      dateObj: new Date("2025-10-16"),
      title: "Kent Test Results Day",
      description: "Results emailed to parents. Grammar threshold for 2025: total score of 332+ with no single score below 108",
      category: "results"
    },
    {
      id: 5,
      date: "31 October 2025",
      dateObj: new Date("2025-10-31"),
      title: "Secondary School Application Deadline",
      description: "Deadline to submit secondary school applications via your local authority. Name up to 4 school preferences",
      category: "application"
    },
    {
      id: 6,
      date: "2 March 2026",
      dateObj: new Date("2026-03-02"),
      title: "National Offer Day",
      description: "Secondary school places are offered. Check your email or local authority portal for your child's school allocation",
      category: "results"
    },
    {
      id: 7,
      date: "16 March 2026",
      dateObj: new Date("2026-03-16"),
      title: "Appeal Deadline",
      description: "Deadline to submit appeals if you wish to challenge your school allocation. Appeals heard by independent panels",
      category: "application"
    },
    {
      id: 8,
      date: "1 May 2026",
      dateObj: new Date("2026-05-01"),
      title: "2026 Kent Test Details Released",
      description: "Information and dates for the September 2026 Kent Test will be published on Kent County Council website",
      category: "registration"
    },
    {
      id: 9,
      date: "1 June 2026",
      dateObj: new Date("2026-06-01"),
      title: "2026 Registration Opens",
      description: "Registration opens for children entering Year 6 in September 2026 who wish to take the Kent Test",
      category: "registration"
    }
  ];

  // Dynamically calculate status based on today's date
  const keyDates = rawDates.map(event => ({
    ...event,
    status: event.dateObj < today ? "completed" : "upcoming"
  }));
  
  // Find the next upcoming event
  const nextUpcoming = keyDates.find(e => e.status === "upcoming");

  const getStatusIcon = (status) => {
    if (status === "completed") return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <Clock className="h-5 w-5 text-amber-500" />;
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "registration": return "bg-blue-100 text-blue-700 border-blue-200";
      case "exam": return "bg-purple-100 text-purple-700 border-purple-200";
      case "results": return "bg-green-100 text-green-700 border-green-200";
      case "application": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const upcomingEvents = keyDates.filter(d => d.status === "upcoming");
  const completedEvents = keyDates.filter(d => d.status === "completed");
  
  // Format today's date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen py-8" data-testid="key-dates-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Key Dates & Calendar
          </h1>
          <p className="text-stone-600">Important dates for Kent 11+ admissions 2025/2026 cycle</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" />
            Today: {formatDate(today)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Events Alert */}
            {upcomingEvents.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="h-6 w-6 text-amber-600" />
                  <h2 className="font-heading text-xl font-semibold text-stone-900">Upcoming Events</h2>
                </div>
                
                {/* Next Event - Highlighted */}
                {nextUpcoming && (
                  <div className="mb-4 p-4 bg-amber-100 rounded-lg border-2 border-amber-400 relative">
                    <span className="absolute -top-2 left-4 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded uppercase">
                      Next Up
                    </span>
                    <div className="flex items-start gap-4 mt-2">
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-xs font-bold uppercase text-amber-700">{nextUpcoming.date.split(" ")[1]}</div>
                        <div className="text-3xl font-bold text-stone-900">{nextUpcoming.date.split(" ")[0]}</div>
                        <div className="text-xs text-amber-600">{nextUpcoming.date.split(" ")[2]}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-900 text-lg">{nextUpcoming.title}</h3>
                        <p className="text-sm text-stone-600 mt-1">{nextUpcoming.description}</p>
                        <p className="text-xs text-amber-700 mt-2 font-medium">
                          {Math.ceil((nextUpcoming.dateObj - today) / (1000 * 60 * 60 * 24))} days from now
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Other upcoming events */}
                <div className="space-y-3">
                  {upcomingEvents.filter(e => e.id !== nextUpcoming?.id).slice(0, 2).map(event => (
                    <div key={event.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-amber-100">
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-xs font-bold uppercase text-amber-600">{event.date.split(" ")[1]}</div>
                        <div className="text-2xl font-bold text-stone-900">{event.date.split(" ")[0]}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-900">{event.title}</h3>
                        <p className="text-sm text-stone-500 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Timeline */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8">
              <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-6">Complete Timeline</h2>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-stone-200" />
                
                <div className="space-y-6">
                  {keyDates.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4 pl-14">
                      {/* Timeline dot */}
                      <div className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                        event.status === "completed" 
                          ? "bg-green-500 border-green-500" 
                          : event.id === nextUpcoming?.id 
                            ? "bg-amber-500 border-amber-500 ring-4 ring-amber-200" 
                            : "bg-white border-stone-300"
                      }`} />
                      
                      <div className={`flex-1 p-4 rounded-lg border ${
                        event.id === nextUpcoming?.id 
                          ? "bg-amber-100 border-amber-400 border-2" 
                          : event.status === "upcoming" 
                            ? "bg-stone-50 border-stone-200" 
                            : "bg-stone-50 border-stone-200 opacity-75"
                      }`}>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {event.id === nextUpcoming?.id && (
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-amber-500 text-white">
                              Next
                            </span>
                          )}
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                          <span className="text-sm font-medium text-stone-500">{event.date}</span>
                          {getStatusIcon(event.status)}
                        </div>
                        <h3 className="font-semibold text-stone-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-stone-600">{event.description}</p>
                        {event.id === nextUpcoming?.id && (
                          <p className="text-xs text-amber-700 mt-2 font-medium">
                            {Math.ceil((event.dateObj - today) / (1000 * 60 * 60 * 24))} days from now
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-primary text-white rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6" />
                <h3 className="font-heading text-xl font-semibold">2025/2026 Cycle</h3>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Key dates for children entering Year 7 in September 2026
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Test Date</span>
                  <span className="font-semibold">Sept 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Results</span>
                  <span className="font-semibold">16 Oct 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Offer Day</span>
                  <span className="font-semibold">2 Mar 2026</span>
                </div>
              </div>
            </div>

            {/* Grammar Threshold */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">2025 Grammar Threshold</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-2xl font-bold text-green-700">332+</div>
                  <div className="text-sm text-green-600">Total Score Required</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-lg font-semibold text-stone-900">108+</div>
                  <div className="text-sm text-stone-500">Minimum per subject</div>
                </div>
                <p className="text-xs text-stone-500">
                  Score range: 69-141 per subject. Maximum total: 423
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a 
                  href="mailto:kent.admissions@kent.gov.uk"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <Mail className="h-4 w-4" />
                  kent.admissions@kent.gov.uk
                </a>
                <a 
                  href="https://www.kent.gov.uk/education-and-children/schools/school-places/kent-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Kent County Council Website
                </a>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-stone-900">Important Notes</h3>
              </div>
              <ul className="space-y-2 text-sm text-stone-600">
                <li>• Being grammar assessed does NOT guarantee a place</li>
                <li>• Grammar schools serve top 25% of ability range</li>
                <li>• Check individual school admissions criteria</li>
                <li>• Late registrations may be possible - contact admissions</li>
                <li>• Medway & Bexley have separate tests</li>
              </ul>
            </div>

            {/* CTA */}
            <Link 
              to="/schools"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-all btn-press"
            >
              Browse All Schools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Open Events Page
const OpenEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, schoolsRes] = await Promise.all([
          axios.get(`${API}/open-events`),
          axios.get(`${API}/schools`)
        ]);
        setEvents(eventsRes.data);
        setSchools(schoolsRes.data);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEvents = selectedSchool 
    ? events.filter(e => e.school_slug === selectedSchool)
    : events;

  // Group events by month
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const month = event.event_date.split(' ').slice(1).join(' '); // "September 2025"
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  const getEventTypeColor = (type) => {
    if (type.includes('Evening')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (type.includes('Morning')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (type.includes('Sixth Form')) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <div className="min-h-screen py-8" data-testid="open-events-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            School Open Events
          </h1>
          <p className="text-stone-600">Visit schools to learn more about their facilities and meet staff</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-stone-600 font-medium">Filter by school:</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="flex-1 md:flex-none md:w-80 px-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-stone-600"
              data-testid="school-filter"
            >
              <option value="">All Schools</option>
              {schools.map(school => (
                <option key={school.id} value={school.slug}>{school.name}</option>
              ))}
            </select>
            {selectedSchool && (
              <button
                onClick={() => setSelectedSchool('')}
                className="text-stone-500 hover:text-stone-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-stone-50 rounded-xl border border-dashed border-stone-300 p-12 text-center">
            <Calendar className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-500">No open events found for the selected filter</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([month, monthEvents]) => (
              <div key={month}>
                <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {month}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monthEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${getEventTypeColor(event.event_type)}`}>
                          {event.event_type}
                        </span>
                        {!event.booking_required && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">No booking required</span>
                        )}
                      </div>
                      
                      <Link to={`/schools/${event.school_slug}`} className="font-heading text-lg font-semibold text-stone-900 hover:text-primary transition-colors">
                        {event.school_name}
                      </Link>
                      
                      <div className="mt-3 space-y-2 text-sm text-stone-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-stone-400" />
                          <span className="font-medium">{event.event_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-stone-400" />
                          <span>{event.event_time}</span>
                        </div>
                        {event.headteacher_speaks && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-stone-400" />
                            <span>Headteacher speaks: {event.headteacher_speaks}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.notes && (
                        <p className="mt-3 text-sm text-stone-500 bg-stone-50 p-2 rounded">{event.notes}</p>
                      )}
                      
                      {event.source_url && (
                        <a 
                          href={event.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> View on school website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-stone-900 mb-1">Keep Events Updated</h3>
              <p className="text-stone-600 text-sm">
                Open event dates can change. We recommend checking the school's official website for the most current information.
                This data was last updated from school websites and may not reflect recent changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cut-off Scores Page
const CutOffScoresPage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/cut-off-scores`);
        setScores(response.data);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredScores = selectedYear 
    ? scores.filter(s => s.entry_year === selectedYear)
    : scores;

  // Sort by inner_area_score descending, then by school name
  const sortedScores = [...filteredScores].sort((a, b) => {
    if (a.inner_area_score && b.inner_area_score) {
      return b.inner_area_score - a.inner_area_score;
    }
    if (a.inner_area_score) return -1;
    if (b.inner_area_score) return 1;
    return a.school_name.localeCompare(b.school_name);
  });

  const years = [...new Set(scores.map(s => s.entry_year))].sort().reverse();

  return (
    <div className="min-h-screen py-8" data-testid="cut-off-scores-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Cut-off Scores by School
          </h1>
          <p className="text-stone-600">Historical and current admission cut-off scores for Kent grammar schools</p>
        </div>

        {/* Controls: Year Filter + View Toggle */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-600 font-medium mr-2">Entry Year:</span>
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    selectedYear === year 
                      ? 'bg-primary text-white' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-600 font-medium mr-2">View:</span>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'table' 
                    ? 'bg-primary text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
                data-testid="view-table-btn"
              >
                <FileText className="h-4 w-4" /> Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'cards' 
                    ? 'bg-primary text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
                data-testid="view-cards-btn"
              >
                <Award className="h-4 w-4" /> Cards
              </button>
            </div>
          </div>
        </div>

        {/* Explanation Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-stone-900 mb-1">Understanding Cut-off Scores</h3>
              <p className="text-stone-600 text-sm">
                Cut-off scores vary each year based on the number of applicants and their scores. 
                The <strong>inner area</strong> is typically closer to the school, while the <strong>outer area</strong> covers a wider catchment.
                Some schools also have <strong>governors' places</strong> awarded by highest score regardless of distance.
                Schools marked as "Distance" allocate by proximity after Kent Test eligibility (332+ total score).
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl border border-stone-200 h-64 animate-pulse" />
        ) : sortedScores.length === 0 ? (
          <div className="bg-stone-50 rounded-xl border border-dashed border-stone-300 p-12 text-center">
            <Trophy className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-500">No cut-off scores available for {selectedYear}</p>
            <p className="text-stone-400 text-sm mt-2">Data is being collected from schools. Check back soon!</p>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="cut-off-scores-table">
                <thead>
                  <tr className="bg-gradient-to-r from-primary to-primary/90 text-white">
                    <th className="px-4 py-4 text-left font-semibold">School</th>
                    <th className="px-4 py-4 text-center font-semibold">Inner Area</th>
                    <th className="px-4 py-4 text-center font-semibold">Outer Area</th>
                    <th className="px-4 py-4 text-center font-semibold">Governors</th>
                    <th className="px-4 py-4 text-center font-semibold">Total Places</th>
                    <th className="px-4 py-4 text-left font-semibold">Allocation Method</th>
                    <th className="px-4 py-4 text-center font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedScores.map((score, index) => (
                    <tr 
                      key={score.id} 
                      className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <Link 
                          to={`/schools/${score.school_slug}`}
                          className="font-semibold text-stone-900 hover:text-primary transition-colors"
                        >
                          {score.school_name}
                        </Link>
                        <p className="text-xs text-stone-500 mt-1">Entry {score.entry_year}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {score.inner_area_score ? (
                          <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 bg-blue-100 text-blue-700 font-bold rounded-lg text-lg">
                            {score.inner_area_score}
                          </span>
                        ) : (
                          <span className="text-stone-400 text-sm">Distance</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {score.outer_area_score ? (
                          <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 bg-purple-100 text-purple-700 font-bold rounded-lg text-lg">
                            {score.outer_area_score}
                          </span>
                        ) : (
                          <span className="text-stone-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {score.governors_score ? (
                          <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 bg-amber-100 text-amber-700 font-bold rounded-lg text-lg">
                            {score.governors_score}
                          </span>
                        ) : (
                          <span className="text-stone-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 bg-green-100 text-green-700 font-bold rounded-lg">
                          {score.total_offers || '-'}
                        </span>
                        {(score.inner_area_places || score.outer_area_places) && (
                          <p className="text-xs text-stone-500 mt-1">
                            {score.inner_area_places && `In: ${score.inner_area_places}`}
                            {score.inner_area_places && score.outer_area_places && ' / '}
                            {score.outer_area_places && `Out: ${score.outer_area_places}`}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          score.inner_area_score 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {score.inner_area_score ? 'Score-based' : 'Distance-based'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {score.source_url ? (
                          <a 
                            href={score.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Legend */}
            <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
              <div className="flex flex-wrap gap-4 text-xs text-stone-600">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-100 rounded"></span> Inner Area Score
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-purple-100 rounded"></span> Outer Area Score
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-amber-100 rounded"></span> Governors' Places
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-100 rounded"></span> Total Places
                </span>
                <span className="text-stone-500">| "Distance" = allocated by proximity, not score</span>
              </div>
            </div>
          </div>
        ) : (
          /* CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedScores.map((score) => (
              <div key={score.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/90 p-4 text-white">
                  <Link to={`/schools/${score.school_slug}`} className="font-heading text-lg font-semibold hover:underline">
                    {score.school_name}
                  </Link>
                  <p className="text-sm text-white/80">Entry Year: {score.entry_year}</p>
                </div>
                
                <div className="p-6">
                  {/* Score Boxes */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {score.inner_area_score && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-700">{score.inner_area_score}</p>
                        <p className="text-xs text-stone-500">Inner Area Cut-off</p>
                      </div>
                    )}
                    {score.outer_area_score && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-700">{score.outer_area_score}</p>
                        <p className="text-xs text-stone-500">Outer Area Cut-off</p>
                      </div>
                    )}
                    {score.governors_score && (
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-2xl font-bold text-amber-700">{score.governors_score}</p>
                        <p className="text-xs text-stone-500">Governors' Places</p>
                      </div>
                    )}
                    {score.total_offers && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-700">{score.total_offers}</p>
                        <p className="text-xs text-stone-500">Total Places</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Basic Stats */}
                  <div className="space-y-2 text-sm border-b border-stone-100 pb-4 mb-4">
                    {(score.inner_area_places || score.outer_area_places) && (
                      <div className="flex justify-between text-stone-600">
                        <span>Places Breakdown:</span>
                        <span className="font-medium">
                          {score.inner_area_places && `Inner: ${score.inner_area_places}`}
                          {score.inner_area_places && score.outer_area_places && ' | '}
                          {score.outer_area_places && `Outer: ${score.outer_area_places}`}
                        </span>
                      </div>
                    )}
                    {(score.furthest_distance_inner || score.furthest_distance_outer) && (
                      <div className="flex justify-between text-stone-600">
                        <span>Furthest Distance:</span>
                        <span className="font-medium">
                          {score.furthest_distance_inner}
                          {score.furthest_distance_inner && score.furthest_distance_outer && ' / '}
                          {score.furthest_distance_outer}
                        </span>
                      </div>
                    )}
                    {(score.mean_score_inner || score.mean_score_outer) && (
                      <div className="flex justify-between text-stone-600">
                        <span>Mean Score:</span>
                        <span className="font-medium">
                          {score.mean_score_inner && `Inner: ${score.mean_score_inner}`}
                          {score.mean_score_inner && score.mean_score_outer && ' | '}
                          {score.mean_score_outer && `Outer: ${score.mean_score_outer}`}
                        </span>
                      </div>
                    )}
                    {score.eligibility_threshold && (
                      <div className="flex justify-between text-stone-600">
                        <span>Eligibility:</span>
                        <span className="font-medium text-right max-w-[60%]">{score.eligibility_threshold}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Detailed Information Sections */}
                  <div className="space-y-3">
                    {score.catchment_info && (
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-stone-700 hover:text-primary">
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Catchment Area
                          </span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="mt-2 text-sm text-stone-600 pl-6">{score.catchment_info}</p>
                      </details>
                    )}
                    
                    {score.named_parishes && (
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-stone-700 hover:text-primary">
                          <span className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> Priority Parishes
                          </span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="mt-2 text-sm text-stone-600 pl-6">{score.named_parishes}</p>
                      </details>
                    )}
                    
                    {score.campus_info && (
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-stone-700 hover:text-primary">
                          <span className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> Campus Information
                          </span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="mt-2 text-sm text-stone-600 pl-6">{score.campus_info}</p>
                      </details>
                    )}
                    
                    {score.waiting_list_info && (
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-stone-700 hover:text-primary">
                          <span className="flex items-center gap-2">
                            <List className="h-4 w-4" /> Waiting List
                          </span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="mt-2 text-sm text-stone-600 pl-6">{score.waiting_list_info}</p>
                      </details>
                    )}
                    
                    {score.appeals_info && (
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-stone-700 hover:text-primary">
                          <span className="flex items-center gap-2">
                            <Scale className="h-4 w-4" /> Appeals
                          </span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="mt-2 text-sm text-stone-600 pl-6">{score.appeals_info}</p>
                      </details>
                    )}
                    
                    {score.pupil_premium_info && (
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-stone-700 hover:text-primary">
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" /> Pupil Premium
                          </span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="mt-2 text-sm text-stone-600 pl-6">{score.pupil_premium_info}</p>
                      </details>
                    )}
                    
                    {score.key_dates && (
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-stone-700 hover:text-primary">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Key Dates
                          </span>
                          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="mt-2 text-sm text-stone-600 pl-6">{score.key_dates}</p>
                      </details>
                    )}
                  </div>
                  
                  {/* Notes */}
                  {score.notes && (
                    <p className="mt-4 text-sm text-stone-500 bg-stone-50 p-3 rounded">{score.notes}</p>
                  )}
                  
                  {/* Footer Links */}
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                    {score.source_url && (
                      <a 
                        href={score.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Official Admissions Page
                      </a>
                    )}
                    {score.contact_email && (
                      <a 
                        href={`mailto:${score.contact_email}`}
                        className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-primary"
                      >
                        <Mail className="h-3 w-3" /> {score.contact_email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-8 bg-white rounded-xl border border-stone-200 shadow-sm p-6 text-center">
          <h3 className="font-heading text-lg font-semibold text-stone-900 mb-2">Want more school data?</h3>
          <p className="text-stone-600 text-sm mb-4">
            We're actively collecting cut-off scores and admissions data from all Kent grammar schools.
            Contact us if you have data to contribute or notice any inaccuracies.
          </p>
          <Link 
            to="/schools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-all"
          >
            Browse All Schools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Contact Page
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      await axios.post(`${API}/contact`, formData);
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again or email directly.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen py-16" data-testid="contact-page">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 rounded-xl border border-green-200 p-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-2">Message Sent!</h2>
            <p className="text-stone-600 mb-6">
              Thank you for contacting us. We'll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setSent(false)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="contact-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Have questions about Kent grammar schools or the 11+ process? Want to contribute data or report an issue? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8">
              <h2 className="font-heading text-xl font-semibold text-stone-900 mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Send us a Message
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  >
                    <option value="">Select a subject...</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="School Information">School Information Update</option>
                    <option value="Cut-off Scores">Cut-off Scores Data</option>
                    <option value="Open Events">Open Events Information</option>
                    <option value="Technical Issue">Report a Technical Issue</option>
                    <option value="Partnership">Partnership / Collaboration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-6 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-primary text-white rounded-xl p-6">
              <h3 className="font-heading text-lg font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:shradsgurram23@gmail.com" className="text-white/80 hover:text-white text-sm">
                      shradsgurram23@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-white/80 text-sm">Usually within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">How Can We Help?</h3>
              <ul className="space-y-3 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>School information updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Cut-off score submissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Open event notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Technical issues reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Partnership opportunities</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-2">
                📝 Data Contributors Welcome
              </h3>
              <p className="text-sm text-stone-600">
                Have updated cut-off scores or event information? We appreciate community contributions to keep our data accurate and up-to-date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Page for Managing Data
const AdminPage = () => {
  const [schools, setSchools] = useState([]);
  const [events, setEvents] = useState([]);
  const [scores, setScores] = useState([]);
  const [scrapeSources, setScrapeSources] = useState([]);
  const [contactQueries, setContactQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [scrapeResult, setScrapeResult] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [refreshingScores, setRefreshingScores] = useState(false);
  
  // Form states for new event
  const [newEvent, setNewEvent] = useState({
    school_slug: '',
    school_name: '',
    event_type: 'Open Evening',
    event_date: '',
    event_time: '',
    headteacher_speaks: '',
    booking_required: false,
    notes: '',
    source_url: ''
  });
  
  // Form states for new score
  const [newScore, setNewScore] = useState({
    school_slug: '',
    school_name: '',
    entry_year: '2026',
    inner_area_score: '',
    outer_area_score: '',
    governors_score: '',
    total_offers: '',
    inner_area_places: '',
    outer_area_places: '',
    furthest_distance_inner: '',
    furthest_distance_outer: '',
    mean_score_inner: '',
    mean_score_outer: '',
    notes: '',
    source_url: '',
    // New detailed fields
    eligibility_threshold: '',
    catchment_info: '',
    named_parishes: '',
    waiting_list_info: '',
    appeals_info: '',
    campus_info: '',
    pupil_premium_info: '',
    key_dates: '',
    contact_email: ''
  });
  
  // State for editing existing scores
  const [editingScore, setEditingScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsRes, eventsRes, scoresRes, sourcesRes] = await Promise.all([
          axios.get(`${API}/schools`),
          axios.get(`${API}/open-events`),
          axios.get(`${API}/cut-off-scores`),
          axios.get(`${API}/scrape-sources`)
        ]);
        setSchools(schoolsRes.data);
        setEvents(eventsRes.data);
        setScores(scoresRes.data);
        setScrapeSources(sourcesRes.data.sources || []);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefreshAllScores = async () => {
    if (!window.confirm('This will re-seed all cut-off scores from the configured sources. Continue?')) return;
    setRefreshingScores(true);
    try {
      await axios.post(`${API}/seed-cut-off-scores`);
      const scoresRes = await axios.get(`${API}/cut-off-scores`);
      setScores(scoresRes.data);
      alert('Cut-off scores refreshed successfully!');
    } catch (e) {
      alert('Error refreshing scores: ' + e.message);
    } finally {
      setRefreshingScores(false);
    }
  };

  const handleScrapeSchool = async (schoolSlug) => {
    setScraping(true);
    try {
      const response = await axios.post(`${API}/scrape-cutoff/${schoolSlug}`);
      setScrapeResult(response.data);
      alert(`Scraped ${schoolSlug}: ${response.data.success ? 'Success' : 'Failed'}`);
    } catch (e) {
      alert('Error scraping: ' + e.message);
    } finally {
      setScraping(false);
    }
  };

  const handleSchoolSelect = (slug) => {
    const school = schools.find(s => s.slug === slug);
    if (school) {
      setSelectedSchool(slug);
      setNewEvent(prev => ({ ...prev, school_slug: slug, school_name: school.name }));
      setNewScore(prev => ({ ...prev, school_slug: slug, school_name: school.name }));
    }
  };

  const handleScrape = async () => {
    if (!scrapeUrl || !selectedSchool) return;
    
    setScraping(true);
    setScrapeResult(null);
    
    try {
      const school = schools.find(s => s.slug === selectedSchool);
      const response = await axios.post(`${API}/scrape-school-page`, {
        url: scrapeUrl,
        school_slug: selectedSchool,
        school_name: school?.name || ''
      });
      setScrapeResult(response.data);
    } catch (e) {
      setScrapeResult({ success: false, error: e.message });
    } finally {
      setScraping(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      await axios.post(`${API}/open-events`, newEvent);
      const eventsRes = await axios.get(`${API}/open-events`);
      setEvents(eventsRes.data);
      setNewEvent({
        school_slug: selectedSchool,
        school_name: schools.find(s => s.slug === selectedSchool)?.name || '',
        event_type: 'Open Evening',
        event_date: '',
        event_time: '',
        headteacher_speaks: '',
        booking_required: false,
        notes: '',
        source_url: scrapeUrl
      });
      alert('Event added successfully!');
    } catch (e) {
      alert('Error adding event: ' + e.message);
    }
  };

  const handleAddScore = async () => {
    try {
      const scoreData = {
        ...newScore,
        inner_area_score: newScore.inner_area_score ? parseInt(newScore.inner_area_score) : null,
        outer_area_score: newScore.outer_area_score ? parseInt(newScore.outer_area_score) : null,
        governors_score: newScore.governors_score ? parseInt(newScore.governors_score) : null,
        total_offers: newScore.total_offers ? parseInt(newScore.total_offers) : null,
        inner_area_places: newScore.inner_area_places ? parseInt(newScore.inner_area_places) : null,
        outer_area_places: newScore.outer_area_places ? parseInt(newScore.outer_area_places) : null,
        mean_score_inner: newScore.mean_score_inner ? parseFloat(newScore.mean_score_inner) : null,
        mean_score_outer: newScore.mean_score_outer ? parseFloat(newScore.mean_score_outer) : null,
      };
      await axios.post(`${API}/cut-off-scores`, scoreData);
      const scoresRes = await axios.get(`${API}/cut-off-scores`);
      setScores(scoresRes.data);
      resetScoreForm();
      alert('Score added successfully!');
    } catch (e) {
      alert('Error adding score: ' + e.message);
    }
  };

  const handleEditScore = (score) => {
    setEditingScore(score);
    setNewScore({
      school_slug: score.school_slug,
      school_name: score.school_name,
      entry_year: score.entry_year,
      inner_area_score: score.inner_area_score || '',
      outer_area_score: score.outer_area_score || '',
      governors_score: score.governors_score || '',
      total_offers: score.total_offers || '',
      inner_area_places: score.inner_area_places || '',
      outer_area_places: score.outer_area_places || '',
      furthest_distance_inner: score.furthest_distance_inner || '',
      furthest_distance_outer: score.furthest_distance_outer || '',
      mean_score_inner: score.mean_score_inner || '',
      mean_score_outer: score.mean_score_outer || '',
      notes: score.notes || '',
      source_url: score.source_url || '',
      eligibility_threshold: score.eligibility_threshold || '',
      catchment_info: score.catchment_info || '',
      named_parishes: score.named_parishes || '',
      waiting_list_info: score.waiting_list_info || '',
      appeals_info: score.appeals_info || '',
      campus_info: score.campus_info || '',
      pupil_premium_info: score.pupil_premium_info || '',
      key_dates: score.key_dates || '',
      contact_email: score.contact_email || ''
    });
    setSelectedSchool(score.school_slug);
  };

  const handleUpdateScore = async () => {
    if (!editingScore) return;
    try {
      const scoreData = {
        ...newScore,
        inner_area_score: newScore.inner_area_score ? parseInt(newScore.inner_area_score) : null,
        outer_area_score: newScore.outer_area_score ? parseInt(newScore.outer_area_score) : null,
        governors_score: newScore.governors_score ? parseInt(newScore.governors_score) : null,
        total_offers: newScore.total_offers ? parseInt(newScore.total_offers) : null,
        inner_area_places: newScore.inner_area_places ? parseInt(newScore.inner_area_places) : null,
        outer_area_places: newScore.outer_area_places ? parseInt(newScore.outer_area_places) : null,
        mean_score_inner: newScore.mean_score_inner ? parseFloat(newScore.mean_score_inner) : null,
        mean_score_outer: newScore.mean_score_outer ? parseFloat(newScore.mean_score_outer) : null,
      };
      await axios.put(`${API}/cut-off-scores/${editingScore.id}`, scoreData);
      const scoresRes = await axios.get(`${API}/cut-off-scores`);
      setScores(scoresRes.data);
      setEditingScore(null);
      resetScoreForm();
      alert('Score updated successfully!');
    } catch (e) {
      alert('Error updating score: ' + e.message);
    }
  };

  const resetScoreForm = () => {
    setNewScore({
      school_slug: selectedSchool,
      school_name: schools.find(s => s.slug === selectedSchool)?.name || '',
      entry_year: '2026',
      inner_area_score: '',
      outer_area_score: '',
      governors_score: '',
      total_offers: '',
      inner_area_places: '',
      outer_area_places: '',
      furthest_distance_inner: '',
      furthest_distance_outer: '',
      mean_score_inner: '',
      mean_score_outer: '',
      notes: '',
      source_url: scrapeUrl,
      eligibility_threshold: '',
      catchment_info: '',
      named_parishes: '',
      waiting_list_info: '',
      appeals_info: '',
      campus_info: '',
      pupil_premium_info: '',
      key_dates: '',
      contact_email: ''
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${API}/open-events/${eventId}`);
      setEvents(events.filter(e => e.id !== eventId));
    } catch (e) {
      alert('Error deleting event: ' + e.message);
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (!window.confirm('Are you sure you want to delete this score record?')) return;
    try {
      await axios.delete(`${API}/cut-off-scores/${scoreId}`);
      setScores(scores.filter(s => s.id !== scoreId));
    } catch (e) {
      alert('Error deleting score: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-stone-200 rounded w-1/4" />
            <div className="h-64 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="admin-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Admin: Manage School Data
          </h1>
          <p className="text-stone-600">Add and manage open events and cut-off scores for Kent grammar schools</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'events' ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Open Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'scores' ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Cut-off Scores ({scores.length})
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'sources' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Data Sources ({scrapeSources.length})
          </button>
          <button
            onClick={() => setActiveTab('scrape')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'scrape' ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Scrape Helper
          </button>
        </div>

        {/* Data Sources Tab */}
        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-stone-900">Configured Data Sources</h2>
                  <p className="text-stone-600 text-sm mt-1">School websites configured for cut-off score scraping</p>
                </div>
                <button
                  onClick={handleRefreshAllScores}
                  disabled={refreshingScores}
                  className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {refreshingScores ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Refresh All Scores
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {scrapeSources.map((source, index) => (
                  <div key={index} className="border border-stone-200 rounded-lg p-4 hover:border-green-300 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-900">{source.school_name}</h3>
                        <p className="text-sm text-stone-600 mt-1">{source.description}</p>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {source.url}
                        </a>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                          source.type === 'pdf' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {source.type.toUpperCase()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleScrapeSchool(source.school_slug)}
                        disabled={scraping || source.type === 'pdf'}
                        className="px-4 py-2 bg-stone-100 text-stone-700 rounded-md text-sm font-medium hover:bg-stone-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {source.type === 'pdf' ? 'Manual Entry' : 'Scrape Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Scores Summary */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <h3 className="font-semibold text-stone-900 mb-4">Current Cut-off Scores (2026 Entry)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-stone-50">
                        <th className="text-left p-3 font-semibold">School</th>
                        <th className="text-center p-3 font-semibold">Inner Area</th>
                        <th className="text-center p-3 font-semibold">Outer Area</th>
                        <th className="text-center p-3 font-semibold">Governors</th>
                        <th className="text-center p-3 font-semibold">Total Offers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.filter(s => s.entry_year === '2026').map(score => (
                        <tr key={score.id} className="border-b border-stone-100">
                          <td className="p-3 font-medium">{score.school_name}</td>
                          <td className="p-3 text-center">
                            {score.inner_area_score ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                                {score.inner_area_score}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-3 text-center">
                            {score.outer_area_score ? (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                                {score.outer_area_score}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-3 text-center">
                            {score.governors_score ? (
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                                {score.governors_score}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-3 text-center">{score.total_offers || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* School Selector */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 mb-6">
          <label className="block text-sm font-medium text-stone-700 mb-2">Select School</label>
          <select
            value={selectedSchool}
            onChange={(e) => handleSchoolSelect(e.target.value)}
            className="w-full px-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-stone-600"
            data-testid="admin-school-selector"
          >
            <option value="">Select a school...</option>
            {schools.map(school => (
              <option key={school.id} value={school.slug}>{school.name}</option>
            ))}
          </select>
        </div>

        {/* Scrape Helper Tab */}
        {activeTab === 'scrape' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 mb-6">
            <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4">Scrape School Page</h2>
            <p className="text-stone-600 text-sm mb-4">
              Enter a school's admissions page URL to extract dates and scores. Review the extracted data and add it manually.
            </p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                placeholder="https://www.school-name.sch.uk/admissions..."
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                className="flex-1 px-4 py-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={handleScrape}
                disabled={!scrapeUrl || !selectedSchool || scraping}
                className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scraping ? 'Scraping...' : 'Scrape'}
              </button>
            </div>
            
            {scrapeResult && (
              <div className={`p-4 rounded-lg ${scrapeResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className="font-semibold mb-2">{scrapeResult.success ? 'Extracted Data' : 'Error'}</h3>
                {scrapeResult.success ? (
                  <div className="text-sm space-y-2">
                    {scrapeResult.extracted_data?.dates_found?.length > 0 && (
                      <div>
                        <strong>Dates Found:</strong>
                        <ul className="list-disc list-inside ml-2">
                          {scrapeResult.extracted_data.dates_found.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    )}
                    {scrapeResult.extracted_data?.times_found?.length > 0 && (
                      <div>
                        <strong>Times Found:</strong>
                        <ul className="list-disc list-inside ml-2">
                          {scrapeResult.extracted_data.times_found.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                    {scrapeResult.extracted_data?.cut_off_data?.potential_scores && (
                      <div>
                        <strong>Potential Scores:</strong> {scrapeResult.extracted_data.cut_off_data.potential_scores.join(', ')}
                      </div>
                    )}
                    {scrapeResult.extracted_data?.cut_off_data?.potential_distances && (
                      <div>
                        <strong>Distances:</strong> {scrapeResult.extracted_data.cut_off_data.potential_distances.join(', ')} miles
                      </div>
                    )}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-primary">View text preview</summary>
                      <pre className="mt-2 p-2 bg-stone-100 rounded text-xs overflow-auto max-h-48">
                        {scrapeResult.extracted_data?.text_preview}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <p className="text-red-600">{scrapeResult.error}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Add Event Form */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4">Add New Event</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Event Type</label>
                  <select
                    value={newEvent.event_type}
                    onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  >
                    <option>Open Evening</option>
                    <option>Open Morning</option>
                    <option>Year 5 Open Morning</option>
                    <option>Sixth Form Options Evening</option>
                    <option>School Tour</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Date (e.g., "24 September 2025")</label>
                  <input
                    type="text"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    placeholder="24 September 2025"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEvent.event_time}
                    onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
                    placeholder="4:30pm to 7:30pm"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Headteacher Speaks</label>
                  <input
                    type="text"
                    value={newEvent.headteacher_speaks}
                    onChange={(e) => setNewEvent({ ...newEvent, headteacher_speaks: e.target.value })}
                    placeholder="5:30pm and 6:30pm"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newEvent.booking_required}
                    onChange={(e) => setNewEvent({ ...newEvent, booking_required: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm text-stone-700">Booking Required</label>
                </div>
              </div>
              
              <button
                onClick={handleAddEvent}
                disabled={!selectedSchool || !newEvent.event_date}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                Add Event
              </button>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4">Existing Events</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div>
                      <p className="font-medium text-stone-900">{event.school_name}</p>
                      <p className="text-sm text-stone-600">{event.event_type} - {event.event_date} @ {event.event_time}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <div className="space-y-6">
            {/* Add/Edit Score Form */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4">
                {editingScore ? `Edit: ${editingScore.school_name} (${editingScore.entry_year})` : 'Add New Cut-off Score'}
              </h2>
              
              {/* Basic Score Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Entry Year</label>
                  <select
                    value={newScore.entry_year}
                    onChange={(e) => setNewScore({ ...newScore, entry_year: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  >
                    <option>2026</option>
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Inner Area Score</label>
                  <input
                    type="number"
                    value={newScore.inner_area_score}
                    onChange={(e) => setNewScore({ ...newScore, inner_area_score: e.target.value })}
                    placeholder="389"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Outer Area Score</label>
                  <input
                    type="number"
                    value={newScore.outer_area_score}
                    onChange={(e) => setNewScore({ ...newScore, outer_area_score: e.target.value })}
                    placeholder="403"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Governors' Score</label>
                  <input
                    type="number"
                    value={newScore.governors_score}
                    onChange={(e) => setNewScore({ ...newScore, governors_score: e.target.value })}
                    placeholder="384"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Total Offers</label>
                  <input
                    type="number"
                    value={newScore.total_offers}
                    onChange={(e) => setNewScore({ ...newScore, total_offers: e.target.value })}
                    placeholder="180"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Inner Area Places</label>
                  <input
                    type="number"
                    value={newScore.inner_area_places}
                    onChange={(e) => setNewScore({ ...newScore, inner_area_places: e.target.value })}
                    placeholder="157"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Outer Area Places</label>
                  <input
                    type="number"
                    value={newScore.outer_area_places}
                    onChange={(e) => setNewScore({ ...newScore, outer_area_places: e.target.value })}
                    placeholder="23"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Furthest Distance (Inner)</label>
                  <input
                    type="text"
                    value={newScore.furthest_distance_inner}
                    onChange={(e) => setNewScore({ ...newScore, furthest_distance_inner: e.target.value })}
                    placeholder="5.474 miles"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Furthest Distance (Outer)</label>
                  <input
                    type="text"
                    value={newScore.furthest_distance_outer}
                    onChange={(e) => setNewScore({ ...newScore, furthest_distance_outer: e.target.value })}
                    placeholder="13.921 miles"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
              </div>
              
              {/* Detailed Information Section */}
              <details className="mb-6 border border-stone-200 rounded-lg">
                <summary className="px-4 py-3 bg-stone-50 cursor-pointer font-medium text-stone-700 rounded-t-lg">
                  Detailed Information (Expandable Fields)
                </summary>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Eligibility Threshold</label>
                    <input
                      type="text"
                      value={newScore.eligibility_threshold}
                      onChange={(e) => setNewScore({ ...newScore, eligibility_threshold: e.target.value })}
                      placeholder="332+ total, no section below 108"
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={newScore.contact_email}
                      onChange={(e) => setNewScore({ ...newScore, contact_email: e.target.value })}
                      placeholder="admissions@school.kent.sch.uk"
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Catchment Area Info</label>
                    <textarea
                      value={newScore.catchment_info}
                      onChange={(e) => setNewScore({ ...newScore, catchment_info: e.target.value })}
                      placeholder="No catchment area. Average furthest distance: 18.81 miles..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                      rows="2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Named Parishes</label>
                    <textarea
                      value={newScore.named_parishes}
                      onChange={(e) => setNewScore({ ...newScore, named_parishes: e.target.value })}
                      placeholder="Tonbridge, Sevenoaks, Tunbridge Wells..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Campus Information</label>
                    <textarea
                      value={newScore.campus_info}
                      onChange={(e) => setNewScore({ ...newScore, campus_info: e.target.value })}
                      placeholder="210 places TW campus, 90 Sevenoaks..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Waiting List Info</label>
                    <textarea
                      value={newScore.waiting_list_info}
                      onChange={(e) => setNewScore({ ...newScore, waiting_list_info: e.target.value })}
                      placeholder="Maintained until end of January..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Appeals Info</label>
                    <textarea
                      value={newScore.appeals_info}
                      onChange={(e) => setNewScore({ ...newScore, appeals_info: e.target.value })}
                      placeholder="2024: 1 upheld. 2023: 7 upheld..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Pupil Premium Info</label>
                    <textarea
                      value={newScore.pupil_premium_info}
                      onChange={(e) => setNewScore({ ...newScore, pupil_premium_info: e.target.value })}
                      placeholder="SIF required. Free 11+ prep via Atom Learning..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Key Dates</label>
                    <textarea
                      value={newScore.key_dates}
                      onChange={(e) => setNewScore({ ...newScore, key_dates: e.target.value })}
                      placeholder="National Offer Day: 2 March. Acceptance: 16 March..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-md"
                      rows="2"
                    />
                  </div>
                </div>
              </details>
              
              {/* Notes and Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
                  <textarea
                    value={newScore.notes}
                    onChange={(e) => setNewScore({ ...newScore, notes: e.target.value })}
                    placeholder="Additional context about scores..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Source URL</label>
                  <input
                    type="url"
                    value={newScore.source_url}
                    onChange={(e) => setNewScore({ ...newScore, source_url: e.target.value })}
                    placeholder="https://www.school.kent.sch.uk/admissions"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {editingScore ? (
                  <>
                    <button
                      onClick={handleUpdateScore}
                      className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-all"
                    >
                      Update Score
                    </button>
                    <button
                      onClick={() => { setEditingScore(null); resetScoreForm(); }}
                      className="px-6 py-2 bg-stone-200 text-stone-700 rounded-md font-medium hover:bg-stone-300 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAddScore}
                    disabled={!selectedSchool}
                    className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    Add Score
                  </button>
                )}
              </div>
            </div>

            {/* Scores List */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4">Existing Scores ({scores.length})</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {scores.map(score => (
                  <div key={score.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-stone-900">{score.school_name} ({score.entry_year})</p>
                      <p className="text-sm text-stone-600">
                        Inner: {score.inner_area_score || 'Distance'} | 
                        Outer: {score.outer_area_score || '-'} | 
                        Gov: {score.governors_score || '-'} |
                        Places: {score.total_offers || '-'}
                      </p>
                      {score.source_url && (
                        <a href={score.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                          View Source
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditScore(score)}
                        className="p-2 text-primary hover:bg-primary/10 rounded"
                        title="Edit"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteScore(score.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App
function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/schools/:slug" element={<SchoolDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/exam-info" element={<ExamInfoPage />} />
            <Route path="/key-dates" element={<KeyDatesPage />} />
            <Route path="/practice-papers" element={<PracticePapersPage />} />
            <Route path="/independent-schools" element={<IndependentSchoolsPage />} />
            <Route path="/open-events" element={<OpenEventsPage />} />
            <Route path="/cut-off-scores" element={<CutOffScoresPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
