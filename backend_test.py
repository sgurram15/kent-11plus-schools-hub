import requests
import sys
from datetime import datetime
import json

class KentSchoolsAPITester:
    def __init__(self, base_url="https://school-picker.preview.emergentagent.com"):
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

def main():
    print("🚀 Starting Kent Schools Hub API Tests")
    print("=" * 50)
    
    # Setup
    tester = KentSchoolsAPITester()
    
    # Run all tests
    test_results = []
    
    # Basic API tests
    test_results.append(tester.test_root_endpoint())
    test_results.append(tester.test_get_all_schools())
    
    # Search and filter tests
    test_results.append(tester.test_school_search())
    test_results.append(tester.test_school_filter_by_gender())
    test_results.append(tester.test_school_sorting())
    
    # Individual school tests
    test_results.append(tester.test_get_specific_school())
    test_results.append(tester.test_school_not_found())
    
    # Stats and comparison tests
    test_results.append(tester.test_stats_summary())
    test_results.append(tester.test_compare_schools())
    test_results.append(tester.test_compare_schools_validation())
    
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