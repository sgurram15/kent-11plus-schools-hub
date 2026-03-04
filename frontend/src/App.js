import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search, MapPin, Users, GraduationCap, Trophy, ExternalLink, ArrowRight, Filter, X, ChevronDown, BookOpen, Building2, Scale, Menu, Home as HomeIcon, List, GitCompare, Calendar, Clock, Bell, CheckCircle, AlertCircle, FileText, Mail } from "lucide-react";

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
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-home">
              Home
            </Link>
            <Link to="/schools" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-schools">
              Schools
            </Link>
            <Link to="/compare" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-compare">
              Compare
            </Link>
            <Link to="/exam-info" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-exam-info">
              Exam Info
            </Link>
            <Link to="/key-dates" className="text-stone-600 hover:text-primary transition-colors font-medium" data-testid="nav-key-dates">
              Key Dates
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
              <Link to="/exam-info" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Exam Info
              </Link>
              <Link to="/key-dates" className="text-stone-600 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Key Dates
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
            <li><Link to="/exam-info" className="hover:text-white transition-colors">Exam Information</Link></li>
            <li><Link to="/key-dates" className="hover:text-white transition-colors">Key Dates & Calendar</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-heading font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><a href="https://www.11plusguide.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">11+ Guide</a></li>
            <li><a href="https://www.kent.gov.uk/education-and-children/schools/school-places" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kent County Council</a></li>
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
    sortBy: searchParams.get('sort_by') || 'name',
    sortOrder: searchParams.get('sort_order') || 'asc'
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
    setFilters({ search: '', gender: '', sortBy: 'name', sortOrder: 'asc' });
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
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`${API}/schools`);
        setSchools(response.data);
      } catch (e) {
        console.error("Error fetching schools:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);
  
  const handleSelectSchool = (school) => {
    if (selectedSchools.find(s => s.id === school.id)) {
      setSelectedSchools(prev => prev.filter(s => s.id !== school.id));
    } else if (selectedSchools.length < 4) {
      setSelectedSchools(prev => [...prev, school]);
    }
  };
  
  const compareFields = [
    { key: 'type', label: 'Type' },
    { key: 'pupils', label: 'Total Pupils', format: (v) => v.toLocaleString() },
    { key: 'places_year7', label: 'Year 7 Places' },
    { key: 'competition', label: 'Competition' },
    { key: 'competition_ratio', label: 'Competition Ratio', format: (v) => `${v}:1` },
    { key: 'open_days', label: 'Open Days' },
    { key: 'exam_format', label: 'Exam Format' },
    { key: 'address', label: 'Address' },
  ];
  
  return (
    <div className="min-h-screen py-8" data-testid="compare-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Compare Schools
          </h1>
          <p className="text-stone-600">Select 2-4 schools to compare side by side</p>
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
        </div>
        
        {/* Comparison Table */}
        {selectedSchools.length >= 2 ? (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="comparison-table">
                <thead>
                  <tr className="bg-stone-50">
                    <th className="text-left p-4 font-semibold text-stone-900 border-b border-stone-200 min-w-[140px]">
                      Attribute
                    </th>
                    {selectedSchools.map(school => (
                      <th key={school.id} className="text-left p-4 font-semibold text-stone-900 border-b border-stone-200 min-w-[180px]">
                        <Link to={`/schools/${school.slug}`} className="hover:text-primary">
                          {school.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map(field => (
                    <tr key={field.key} className="border-b border-stone-100 last:border-0">
                      <td className="p-4 text-stone-500 font-medium">{field.label}</td>
                      {selectedSchools.map(school => (
                        <td key={school.id} className="p-4 text-stone-900">
                          {field.format ? field.format(school[field.key]) : school[field.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  href="https://www.11plusguide.com/grammar-school-test-areas/kent-grammar-schools/kent-11-plus-exam-format/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Kent 11+ Exam Format
                </a>
              </li>
              <li>
                <a 
                  href="https://www.kent.gov.uk/education-and-children/schools/school-places/kent-test" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Kent County Council
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
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
