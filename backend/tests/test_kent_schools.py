"""
Kent 11+ Grammar Schools Hub API Tests
Tests for:
- Schools CRUD endpoints with academic performance data
- Practice Papers API for local PDF serving
- School comparison feature
"""
import pytest
import requests
import os

# Use external URL for production-like testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://schools-hub-kent.preview.emergentagent.com')

class TestSchoolsAPI:
    """Test school listing and filtering endpoints"""
    
    def test_get_all_schools(self):
        """GET /api/schools - returns list of all schools"""
        response = requests.get(f"{BASE_URL}/api/schools")
        assert response.status_code == 200
        schools = response.json()
        assert isinstance(schools, list)
        assert len(schools) > 0
        # Verify school structure
        school = schools[0]
        assert "name" in school
        assert "slug" in school
        assert "gender" in school
        print(f"SUCCESS: Retrieved {len(schools)} schools")
    
    def test_schools_have_academic_data(self):
        """Verify academic performance fields exist in school data"""
        response = requests.get(f"{BASE_URL}/api/schools")
        assert response.status_code == 200
        schools = response.json()
        
        # Check that at least some schools have academic data
        schools_with_ofsted = [s for s in schools if s.get('ofsted')]
        schools_with_attainment = [s for s in schools if s.get('attainment_8')]
        schools_with_grade5 = [s for s in schools if s.get('grade_5_english_maths')]
        
        assert len(schools_with_ofsted) > 0, "No schools have Ofsted ratings"
        assert len(schools_with_attainment) > 0, "No schools have Attainment 8 scores"
        assert len(schools_with_grade5) > 0, "No schools have Grade 5+ English & Maths data"
        
        print(f"SUCCESS: {len(schools_with_ofsted)} schools with Ofsted, {len(schools_with_attainment)} with Attainment 8")
    
    def test_filter_schools_by_gender(self):
        """GET /api/schools?gender=boys - filters by gender"""
        for gender in ['boys', 'girls', 'mixed']:
            response = requests.get(f"{BASE_URL}/api/schools?gender={gender}")
            assert response.status_code == 200
            schools = response.json()
            for school in schools:
                assert school['gender'] == gender
            print(f"SUCCESS: {len(schools)} {gender} schools found")
    
    def test_sort_schools_by_competition(self):
        """GET /api/schools?sort_by=competition_ratio - sorts correctly"""
        response = requests.get(f"{BASE_URL}/api/schools?sort_by=competition_ratio&sort_order=desc")
        assert response.status_code == 200
        schools = response.json()
        # Verify descending order
        for i in range(len(schools) - 1):
            assert schools[i]['competition_ratio'] >= schools[i+1]['competition_ratio']
        print(f"SUCCESS: Schools sorted by competition ratio descending")
    
    def test_search_schools(self):
        """GET /api/schools?search=Dartford - search functionality"""
        response = requests.get(f"{BASE_URL}/api/schools?search=Dartford")
        assert response.status_code == 200
        schools = response.json()
        assert len(schools) >= 1
        # All results should contain search term
        for school in schools:
            assert 'dartford' in school['name'].lower() or 'dartford' in school['address'].lower()
        print(f"SUCCESS: Search returned {len(schools)} results for 'Dartford'")


class TestSchoolDetail:
    """Test individual school endpoints"""
    
    def test_get_school_by_slug(self):
        """GET /api/schools/{slug} - returns specific school"""
        response = requests.get(f"{BASE_URL}/api/schools/dartford-grammar-school")
        assert response.status_code == 200
        school = response.json()
        assert school['name'] == "Dartford Grammar School"
        assert school['slug'] == "dartford-grammar-school"
        print(f"SUCCESS: Retrieved school: {school['name']}")
    
    def test_school_detail_has_academic_performance(self):
        """Verify school detail includes academic performance data"""
        response = requests.get(f"{BASE_URL}/api/schools/dartford-grammar-school")
        assert response.status_code == 200
        school = response.json()
        
        # Dartford Grammar should have academic data
        assert school.get('ofsted') == "Outstanding"
        assert school.get('attainment_8') == 79.9
        assert school.get('grade_5_english_maths') == 98.9
        assert school.get('ebacc_entry') == 98.9
        
        print(f"SUCCESS: Dartford Grammar - Ofsted: {school['ofsted']}, Attainment 8: {school['attainment_8']}")
    
    def test_school_not_found(self):
        """GET /api/schools/{invalid_slug} - returns 404"""
        response = requests.get(f"{BASE_URL}/api/schools/nonexistent-school")
        assert response.status_code == 404
        print("SUCCESS: 404 returned for nonexistent school")


class TestSchoolComparison:
    """Test school comparison endpoint"""
    
    def test_compare_schools(self):
        """POST /api/schools/compare - returns comparison data"""
        # First get some school IDs
        schools_response = requests.get(f"{BASE_URL}/api/schools")
        schools = schools_response.json()
        school_ids = [s['id'] for s in schools[:3]]
        
        response = requests.post(
            f"{BASE_URL}/api/schools/compare",
            json={"school_ids": school_ids}
        )
        assert response.status_code == 200
        compared = response.json()
        assert len(compared) == 3
        
        # Verify comparison includes academic data
        for school in compared:
            assert 'ofsted' in school
            assert 'attainment_8' in school
            assert 'grade_5_english_maths' in school
        
        print(f"SUCCESS: Compared {len(compared)} schools with academic data")
    
    def test_compare_too_few_schools(self):
        """POST /api/schools/compare - rejects single school"""
        schools_response = requests.get(f"{BASE_URL}/api/schools")
        schools = schools_response.json()
        
        response = requests.post(
            f"{BASE_URL}/api/schools/compare",
            json={"school_ids": [schools[0]['id']]}
        )
        assert response.status_code == 400
        print("SUCCESS: 400 returned for single school comparison")


class TestStatsSummary:
    """Test statistics endpoint"""
    
    def test_get_stats_summary(self):
        """GET /api/schools/stats/summary - returns aggregated stats"""
        response = requests.get(f"{BASE_URL}/api/schools/stats/summary")
        assert response.status_code == 200
        stats = response.json()
        
        assert 'total_schools' in stats
        assert 'boys_schools' in stats
        assert 'girls_schools' in stats
        assert 'mixed_schools' in stats
        assert 'total_places_year7' in stats
        assert 'average_competition' in stats
        
        # Verify counts add up
        assert stats['boys_schools'] + stats['girls_schools'] + stats['mixed_schools'] == stats['total_schools']
        
        print(f"SUCCESS: Stats - {stats['total_schools']} schools, {stats['total_places_year7']} places")


class TestPapersAPI:
    """Test practice papers endpoints - LOCAL PDF SERVING"""
    
    def test_list_papers(self):
        """GET /api/papers - lists all available PDF papers"""
        response = requests.get(f"{BASE_URL}/api/papers")
        assert response.status_code == 200
        data = response.json()
        
        assert 'papers' in data
        assert 'count' in data
        assert data['count'] == 130, f"Expected 130 papers, got {data['count']}"
        
        # Verify PDFs are listed
        papers = data['papers']
        assert all(p.endswith('.pdf') for p in papers)
        
        print(f"SUCCESS: {data['count']} papers listed")
    
    def test_download_bond_maths_paper(self):
        """GET /api/papers/{filename} - downloads Bond Maths paper"""
        response = requests.get(
            f"{BASE_URL}/api/papers/Bond-11-Plus-Maths-Sample-Paper1.pdf"
        )
        assert response.status_code == 200
        assert 'application/pdf' in response.headers.get('content-type', '')
        assert len(response.content) > 1000  # Should be a real PDF
        print(f"SUCCESS: Downloaded Bond Maths paper ({len(response.content)} bytes)")
    
    def test_download_bond_english_paper(self):
        """GET /api/papers/{filename} - downloads Bond English paper"""
        response = requests.get(
            f"{BASE_URL}/api/papers/Bond-11-Plus-English-Sample-Test.pdf"
        )
        assert response.status_code == 200
        assert 'application/pdf' in response.headers.get('content-type', '')
        print(f"SUCCESS: Downloaded Bond English paper ({len(response.content)} bytes)")
    
    def test_download_cgp_vr_paper(self):
        """GET /api/papers/{filename} - downloads CGP Verbal Reasoning paper"""
        response = requests.get(
            f"{BASE_URL}/api/papers/cgp-11plus-gl-vr-free-practice-test.pdf"
        )
        assert response.status_code == 200
        assert 'application/pdf' in response.headers.get('content-type', '')
        print(f"SUCCESS: Downloaded CGP VR paper ({len(response.content)} bytes)")
    
    def test_download_nvr_paper(self):
        """GET /api/papers/{filename} - downloads Non-Verbal Reasoning paper"""
        response = requests.get(
            f"{BASE_URL}/api/papers/nvr-1-familiarisation-test-booklet.pdf"
        )
        assert response.status_code == 200
        assert 'application/pdf' in response.headers.get('content-type', '')
        print(f"SUCCESS: Downloaded NVR paper ({len(response.content)} bytes)")
    
    def test_paper_not_found(self):
        """GET /api/papers/{invalid} - returns 404 for missing paper"""
        response = requests.get(f"{BASE_URL}/api/papers/nonexistent-paper.pdf")
        assert response.status_code == 404
        print("SUCCESS: 404 returned for nonexistent paper")


class TestRootEndpoint:
    """Test API root"""
    
    def test_api_root(self):
        """GET /api/ - returns API info"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert 'message' in data
        print(f"SUCCESS: API root - {data['message']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
