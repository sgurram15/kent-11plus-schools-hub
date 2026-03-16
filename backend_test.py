import requests
import sys
from datetime import datetime
import json

class KentSchoolsAPITester:
    def __init__(self, base_url="https://schools-hub-kent.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status=200, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_base}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: Array with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response: Dict with keys: {list(response_data.keys())[:5]}")
                    return True, response_data
                except:
                    print(f"   Response: Non-JSON content")
                    return True, response.text
            else:
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'url': url,
                    'response': response.text[:200] if hasattr(response, 'text') else 'No response'
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                return False, {}

        except requests.exceptions.RequestException as e:
            self.failed_tests.append({
                'test': name,
                'error': str(e),
                'url': url
            })
            print(f"❌ Failed - Request Error: {str(e)}")
            return False, {}
        except Exception as e:
            self.failed_tests.append({
                'test': name,
                'error': str(e),
                'url': url
            })
            print(f"❌ Failed - Unexpected Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the API root endpoint"""
        return self.run_test("API Root", "GET", "")

    def test_get_all_schools(self):
        """Test getting all schools"""
        success, response = self.run_test("Get All Schools", "GET", "schools")
        if success and isinstance(response, list):
            print(f"   Found {len(response)} schools")
            if len(response) > 0:
                first_school = response[0]
                required_fields = ['id', 'name', 'slug', 'type', 'gender', 'pupils', 'places_year7', 'competition_ratio']
                missing_fields = [field for field in required_fields if field not in first_school]
                if missing_fields:
                    print(f"   ⚠️  Missing required fields: {missing_fields}")
                else:
                    print(f"   ✅ School data structure is valid")
        return success

    def test_school_search(self):
        """Test school search functionality"""
        return self.run_test("Search Schools (Dartford)", "GET", "schools", params={"search": "Dartford"})

    def test_school_filter_by_gender(self):
        """Test filtering schools by gender"""
        success1, _ = self.run_test("Filter Boys Schools", "GET", "schools", params={"gender": "boys"})
        success2, _ = self.run_test("Filter Girls Schools", "GET", "schools", params={"gender": "girls"})
        success3, _ = self.run_test("Filter Co-ed Schools", "GET", "schools", params={"gender": "mixed"})
        return all([success1, success2, success3])

    def test_school_sorting(self):
        """Test school sorting"""
        success1, _ = self.run_test("Sort by Name (Asc)", "GET", "schools", params={"sort_by": "name", "sort_order": "asc"})
        success2, _ = self.run_test("Sort by Competition (Desc)", "GET", "schools", params={"sort_by": "competition_ratio", "sort_order": "desc"})
        success3, _ = self.run_test("Sort by Pupils (Desc)", "GET", "schools", params={"sort_by": "pupils", "sort_order": "desc"})
        return all([success1, success2, success3])

    def test_get_specific_school(self):
        """Test getting a specific school by slug"""
        success, response = self.run_test("Get Dartford Grammar School", "GET", "schools/dartford-grammar-school")
        if success and isinstance(response, dict):
            required_fields = ['name', 'slug', 'address', 'type', 'gender', 'pupils', 'places_year7', 'competition', 'description']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"   ⚠️  Missing required fields: {missing_fields}")
            else:
                print(f"   ✅ School detail data structure is valid")
                print(f"   School: {response.get('name', 'Unknown')}")
        return success

    def test_school_not_found(self):
        """Test 404 for non-existent school"""
        return self.run_test("Non-existent School (404)", "GET", "schools/non-existent-school", expected_status=404)

    def test_stats_summary(self):
        """Test getting statistics summary"""
        success, response = self.run_test("Get Stats Summary", "GET", "schools/stats/summary")
        if success and isinstance(response, dict):
            expected_fields = ['total_schools', 'boys_schools', 'girls_schools', 'mixed_schools', 'total_places_year7', 'average_competition', 'total_pupils']
            missing_fields = [field for field in expected_fields if field not in response]
            if missing_fields:
                print(f"   ⚠️  Missing expected fields: {missing_fields}")
            else:
                print(f"   ✅ Stats structure is valid")
                print(f"   Total Schools: {response.get('total_schools', 0)}")
                print(f"   Total Places: {response.get('total_places_year7', 0)}")
        return success

    def test_compare_schools(self):
        """Test comparing schools"""
        # First get some school IDs
        success, schools_response = self.run_test("Get Schools for Comparison", "GET", "schools", params={"sort_by": "name"})
        if success and isinstance(schools_response, list) and len(schools_response) >= 2:
            school_ids = [school['id'] for school in schools_response[:3]]  # Take first 3 schools
            print(f"   Using school IDs: {school_ids[:2]}...")  # Show first 2
            
            compare_data = {"school_ids": school_ids}
            return self.run_test("Compare Schools", "POST", "schools/compare", data=compare_data)
        else:
            print(f"   ❌ Could not get school IDs for comparison")
            return False

    def test_compare_schools_validation(self):
        """Test comparison validation (too few schools)"""
        compare_data = {"school_ids": ["single-id"]}
        return self.run_test("Compare Schools Validation (Bad Request)", "POST", "schools/compare", expected_status=400, data=compare_data)

    def test_health_check(self):
        """Test the health check endpoint"""
        success, response = self.run_test("Health Check", "GET", "health")
        if success and isinstance(response, dict):
            if response.get('status') == 'healthy':
                print(f"   ✅ Service is healthy")
            else:
                print(f"   ⚠️  Unexpected health status: {response.get('status')}")
        return success

    def test_get_judd_school(self):
        """Test getting The Judd School specifically"""
        success, response = self.run_test("Get The Judd School", "GET", "schools/judd-school")
        if success and isinstance(response, dict):
            if response.get('name') == 'The Judd School':
                print(f"   ✅ Found The Judd School")
                print(f"   Address: {response.get('address', 'Unknown')}")
                print(f"   Type: {response.get('type', 'Unknown')}")
            else:
                print(f"   ⚠️  Expected 'The Judd School', got: {response.get('name')}")
        return success

    def test_get_cut_off_scores(self):
        """Test getting cut-off scores"""
        success, response = self.run_test("Get Cut-off Scores", "GET", "cut-off-scores")
        if success and isinstance(response, list):
            print(f"   Found {len(response)} cut-off score records")
            if len(response) > 0:
                # Check for The Judd School and The Skinners' School scores
                judd_scores = [score for score in response if score.get('school_name') == 'The Judd School']
                skinners_scores = [score for score in response if score.get('school_name') == "The Skinners' School"]
                
                if judd_scores:
                    judd = judd_scores[0]
                    print(f"   ✅ The Judd School - Inner: {judd.get('inner_area_score')}, Outer: {judd.get('outer_area_score')}")
                else:
                    print(f"   ⚠️  The Judd School scores not found")
                
                if skinners_scores:
                    skinners = skinners_scores[0]
                    print(f"   ✅ The Skinners' School - Inner: {skinners.get('inner_area_score')}, Outer: {skinners.get('outer_area_score')}")
                else:
                    print(f"   ⚠️  The Skinners' School scores not found")
                    
                # Check data structure
                first_score = response[0]
                required_fields = ['id', 'school_slug', 'school_name', 'entry_year']
                missing_fields = [field for field in required_fields if field not in first_score]
                if missing_fields:
                    print(f"   ⚠️  Missing required fields: {missing_fields}")
                else:
                    print(f"   ✅ Cut-off score data structure is valid")
        return success

    def test_get_open_events(self):
        """Test getting open events"""
        success, response = self.run_test("Get Open Events", "GET", "open-events")
        if success and isinstance(response, list):
            print(f"   Found {len(response)} open events")
            if len(response) > 0:
                # Check data structure
                first_event = response[0]
                required_fields = ['id', 'school_slug', 'school_name', 'event_type', 'event_date', 'event_time']
                missing_fields = [field for field in required_fields if field not in first_event]
                if missing_fields:
                    print(f"   ⚠️  Missing required fields: {missing_fields}")
                else:
                    print(f"   ✅ Open event data structure is valid")
                
                # Show some sample events
                for i, event in enumerate(response[:3]):
                    print(f"   Event {i+1}: {event.get('school_name')} - {event.get('event_type')} on {event.get('event_date')}")
        return success

    def test_schools_count(self):
        """Test that we have the expected number of schools (31)"""
        success, response = self.run_test("Check Schools Count", "GET", "schools")
        if success and isinstance(response, list):
            school_count = len(response)
            if school_count == 31:
                print(f"   ✅ Found expected 31 schools")
            else:
                print(f"   ⚠️  Expected 31 schools, found {school_count}")
        return success

    def test_cut_off_scores_count(self):
        """Test that we have the expected number of cut-off scores (2)"""
        success, response = self.run_test("Check Cut-off Scores Count", "GET", "cut-off-scores")
        if success and isinstance(response, list):
            scores_count = len(response)
            if scores_count == 2:
                print(f"   ✅ Found expected 2 cut-off score records")
            else:
                print(f"   ⚠️  Expected 2 cut-off score records, found {scores_count}")
        return success

    def test_open_events_count(self):
        """Test that we have the expected number of open events (7)"""
        success, response = self.run_test("Check Open Events Count", "GET", "open-events")
        if success and isinstance(response, list):
            events_count = len(response)
            if events_count == 7:
                print(f"   ✅ Found expected 7 open events")
            else:
                print(f"   ⚠️  Expected 7 open events, found {events_count}")
        return success

    def test_scrape_sources(self):
        """Test getting scrape sources configuration"""
        success, response = self.run_test("Get Scrape Sources", "GET", "scrape-sources")
        if success and isinstance(response, dict):
            sources = response.get('sources', [])
            count = response.get('count', 0)
            print(f"   Found {count} scrape sources")
            
            if count == 4:
                print(f"   ✅ Found expected 4 scrape sources")
            else:
                print(f"   ⚠️  Expected 4 scrape sources, found {count}")
            
            # Check for specific schools
            school_slugs = [source.get('school_slug') for source in sources]
            expected_schools = ['judd-school', 'skinners-school', 'tonbridge-grammar-school', 'dartford-grammar-school']
            
            for school in expected_schools:
                if school in school_slugs:
                    print(f"   ✅ Found {school} in scrape sources")
                else:
                    print(f"   ⚠️  Missing {school} in scrape sources")
        return success

    def test_cut_off_scores_2026(self):
        """Test getting cut-off scores for 2026 entry with specific expected scores"""
        success, response = self.run_test("Get Cut-off Scores for 2026", "GET", "cut-off-scores", params={"entry_year": "2026"})
        if success and isinstance(response, list):
            print(f"   Found {len(response)} cut-off score records for 2026")
            
            if len(response) == 4:
                print(f"   ✅ Found expected 4 cut-off scores for 2026")
            else:
                print(f"   ⚠️  Expected 4 cut-off scores for 2026, found {len(response)}")
            
            # Check specific expected scores
            expected_scores = {
                'The Judd School': {'inner': 389, 'outer': 403},
                'The Skinners\' School': {'inner': 372, 'outer': 384},  # governors_score as outer
                'Tonbridge Grammar School': {'inner': 378, 'outer': 400},  # governors_score as outer
                'Dartford Grammar School': {'inner': 381, 'outer': 403}
            }
            
            for score_record in response:
                school_name = score_record.get('school_name')
                if school_name in expected_scores:
                    expected = expected_scores[school_name]
                    inner_score = score_record.get('inner_area_score')
                    outer_score = score_record.get('outer_area_score') or score_record.get('governors_score')
                    
                    if inner_score == expected['inner']:
                        print(f"   ✅ {school_name} inner score: {inner_score} (correct)")
                    else:
                        print(f"   ⚠️  {school_name} inner score: {inner_score}, expected {expected['inner']}")
                    
                    if outer_score == expected['outer']:
                        print(f"   ✅ {school_name} outer score: {outer_score} (correct)")
                    else:
                        print(f"   ⚠️  {school_name} outer score: {outer_score}, expected {expected['outer']}")
        return success

    def test_schools_compare_with_cutoffs(self):
        """Test comparing schools functionality with actual school IDs"""
        # First get some school IDs
        success, schools_response = self.run_test("Get Schools for Comparison Test", "GET", "schools", params={"sort_by": "name"})
        if success and isinstance(schools_response, list) and len(schools_response) >= 2:
            # Get specific schools we know have cut-off data
            target_schools = ['judd-school', 'skinners-school', 'tonbridge-grammar-school']
            school_ids = []
            
            for school in schools_response:
                if school.get('slug') in target_schools:
                    school_ids.append(school['id'])
                if len(school_ids) >= 3:
                    break
            
            if len(school_ids) >= 2:
                print(f"   Using {len(school_ids)} school IDs for comparison")
                compare_data = {"school_ids": school_ids}
                success, compare_response = self.run_test("Compare Schools with Cut-offs", "POST", "schools/compare", data=compare_data)
                
                if success and isinstance(compare_response, list):
                    print(f"   ✅ Successfully compared {len(compare_response)} schools")
                    for school in compare_response:
                        print(f"   - {school.get('name', 'Unknown')}")
                return success
            else:
                print(f"   ❌ Could not find enough target schools for comparison")
                return False
        else:
            print(f"   ❌ Could not get school data for comparison")
            return False

    def test_scrape_individual_school(self):
        """Test scraping individual school (Judd School)"""
        success, response = self.run_test("Scrape Judd School Cut-off", "POST", "scrape-cutoff/judd-school")
        if success and isinstance(response, dict):
            if response.get('success'):
                print(f"   ✅ Successfully scraped Judd School data")
                extracted_data = response.get('extracted_data', {})
                if extracted_data:
                    print(f"   School: {extracted_data.get('school_name', 'Unknown')}")
                    if 'inner_area_score' in extracted_data:
                        print(f"   Inner score: {extracted_data['inner_area_score']}")
                    if 'outer_area_score' in extracted_data:
                        print(f"   Outer score: {extracted_data['outer_area_score']}")
            else:
                print(f"   ⚠️  Scraping failed: {response.get('error', 'Unknown error')}")
        return success

def main():
    print("🚀 Starting Kent Schools Hub API Tests")
    print("=" * 50)
    
    # Setup
    tester = KentSchoolsAPITester()
    
    # Run all tests
    test_results = []
    
    # Health check test
    test_results.append(tester.test_health_check())
    
    # Basic API tests
    test_results.append(tester.test_root_endpoint())
    test_results.append(tester.test_get_all_schools())
    test_results.append(tester.test_schools_count())
    
    # Search and filter tests
    test_results.append(tester.test_school_search())
    test_results.append(tester.test_school_filter_by_gender())
    test_results.append(tester.test_school_sorting())
    
    # Individual school tests
    test_results.append(tester.test_get_specific_school())
    test_results.append(tester.test_get_judd_school())
    test_results.append(tester.test_school_not_found())
    
    # Stats and comparison tests
    test_results.append(tester.test_stats_summary())
    test_results.append(tester.test_compare_schools())
    test_results.append(tester.test_compare_schools_validation())
    
    # Cut-off scores tests
    test_results.append(tester.test_get_cut_off_scores())
    test_results.append(tester.test_cut_off_scores_count())
    
    # Open events tests
    test_results.append(tester.test_get_open_events())
    test_results.append(tester.test_open_events_count())
    
    # NEW SCRAPING AND CUT-OFF FEATURES TESTS
    print("\n🔍 Testing NEW Scraping and Cut-off Features...")
    test_results.append(tester.test_scrape_sources())
    test_results.append(tester.test_cut_off_scores_2026())
    test_results.append(tester.test_schools_compare_with_cutoffs())
    test_results.append(tester.test_scrape_individual_school())
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    print(f"✅ Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests ({len(tester.failed_tests)}):")
        for failed in tester.failed_tests:
            print(f"   • {failed.get('test', 'Unknown')}")
            if 'expected' in failed:
                print(f"     Expected: {failed['expected']}, Got: {failed['actual']}")
            if 'error' in failed:
                print(f"     Error: {failed['error']}")
            if 'url' in failed:
                print(f"     URL: {failed['url']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())