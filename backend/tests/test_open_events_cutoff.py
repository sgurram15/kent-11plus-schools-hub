"""
Kent 11+ Grammar Schools Hub - Open Events & Cut-off Scores API Tests
Tests for:
- Open Events CRUD endpoints
- Cut-off Scores CRUD endpoints
- Scrape School Page endpoint
"""
import pytest
import requests
import os
import uuid

# Use external URL for production-like testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://kent-11-plus-hub.preview.emergentagent.com')


class TestOpenEventsAPI:
    """Test Open Events endpoints"""
    
    def test_get_all_open_events(self):
        """GET /api/open-events - returns list of all events"""
        response = requests.get(f"{BASE_URL}/api/open-events")
        assert response.status_code == 200
        events = response.json()
        assert isinstance(events, list)
        
        # Should have seeded events
        if len(events) > 0:
            event = events[0]
            assert "id" in event
            assert "school_slug" in event
            assert "school_name" in event
            assert "event_type" in event
            assert "event_date" in event
            assert "event_time" in event
            assert "booking_required" in event
            print(f"SUCCESS: Retrieved {len(events)} open events")
        else:
            print("SUCCESS: Open events endpoint works (empty list)")
    
    def test_filter_events_by_school(self):
        """GET /api/open-events?school_slug=xxx - filters by school"""
        response = requests.get(f"{BASE_URL}/api/open-events?school_slug=tunbridge-wells-girls-grammar-school")
        assert response.status_code == 200
        events = response.json()
        
        for event in events:
            assert event['school_slug'] == "tunbridge-wells-girls-grammar-school"
        
        print(f"SUCCESS: {len(events)} events for TWGGS")
    
    def test_create_and_delete_open_event(self):
        """POST /api/open-events - creates new event, then DELETE"""
        # Create test event
        test_event = {
            "school_slug": "dartford-grammar-school",
            "school_name": "Dartford Grammar School",
            "event_type": "TEST Open Evening",
            "event_date": "1 January 2099",
            "event_time": "5:00pm to 8:00pm",
            "headteacher_speaks": "6:00pm",
            "booking_required": False,
            "notes": "TEST EVENT - DELETE ME",
            "source_url": "https://example.com/test"
        }
        
        # Create event
        create_response = requests.post(f"{BASE_URL}/api/open-events", json=test_event)
        assert create_response.status_code == 200
        created_event = create_response.json()
        
        # Verify created data
        assert created_event["school_slug"] == test_event["school_slug"]
        assert created_event["school_name"] == test_event["school_name"]
        assert created_event["event_type"] == test_event["event_type"]
        assert "id" in created_event
        event_id = created_event["id"]
        
        print(f"SUCCESS: Created event with ID: {event_id}")
        
        # Verify it appears in list
        list_response = requests.get(f"{BASE_URL}/api/open-events")
        events = list_response.json()
        event_ids = [e["id"] for e in events]
        assert event_id in event_ids, "Created event not found in list"
        
        # Delete the test event
        delete_response = requests.delete(f"{BASE_URL}/api/open-events/{event_id}")
        assert delete_response.status_code == 200
        
        # Verify it's gone
        verify_response = requests.get(f"{BASE_URL}/api/open-events")
        remaining_events = verify_response.json()
        remaining_ids = [e["id"] for e in remaining_events]
        assert event_id not in remaining_ids, "Event still exists after delete"
        
        print(f"SUCCESS: Created and deleted event successfully")
    
    def test_delete_nonexistent_event(self):
        """DELETE /api/open-events/{id} - returns 404 for invalid ID"""
        fake_id = str(uuid.uuid4())
        response = requests.delete(f"{BASE_URL}/api/open-events/{fake_id}")
        assert response.status_code == 404
        print("SUCCESS: 404 returned for nonexistent event")


class TestCutOffScoresAPI:
    """Test Cut-off Scores endpoints"""
    
    def test_get_all_cut_off_scores(self):
        """GET /api/cut-off-scores - returns list of all scores"""
        response = requests.get(f"{BASE_URL}/api/cut-off-scores")
        assert response.status_code == 200
        scores = response.json()
        assert isinstance(scores, list)
        
        if len(scores) > 0:
            score = scores[0]
            assert "id" in score
            assert "school_slug" in score
            assert "school_name" in score
            assert "entry_year" in score
            print(f"SUCCESS: Retrieved {len(scores)} cut-off score records")
        else:
            print("SUCCESS: Cut-off scores endpoint works (empty list)")
    
    def test_filter_scores_by_year(self):
        """GET /api/cut-off-scores?entry_year=2026 - filters by year"""
        response = requests.get(f"{BASE_URL}/api/cut-off-scores?entry_year=2026")
        assert response.status_code == 200
        scores = response.json()
        
        for score in scores:
            assert score['entry_year'] == "2026"
        
        print(f"SUCCESS: {len(scores)} scores for 2026 entry")
    
    def test_filter_scores_by_school(self):
        """GET /api/cut-off-scores?school_slug=xxx - filters by school"""
        response = requests.get(f"{BASE_URL}/api/cut-off-scores?school_slug=judd-school")
        assert response.status_code == 200
        scores = response.json()
        
        for score in scores:
            assert score['school_slug'] == "judd-school"
        
        print(f"SUCCESS: {len(scores)} scores for Judd School")
    
    def test_create_and_delete_cut_off_score(self):
        """POST /api/cut-off-scores - creates new score, then DELETE"""
        # Create test score
        test_score = {
            "school_slug": "dartford-grammar-school",
            "school_name": "Dartford Grammar School",
            "entry_year": "2099",
            "inner_area_score": 400,
            "outer_area_score": 410,
            "governors_score": None,
            "pupil_premium_score": None,
            "furthest_distance_inner": "3.5 miles",
            "furthest_distance_outer": "10.0 miles",
            "total_offers": 150,
            "inner_area_places": 120,
            "outer_area_places": 30,
            "mean_score_inner": 405.5,
            "mean_score_outer": 415.2,
            "notes": "TEST SCORE - DELETE ME",
            "source_url": "https://example.com/test"
        }
        
        # Create score
        create_response = requests.post(f"{BASE_URL}/api/cut-off-scores", json=test_score)
        assert create_response.status_code == 200
        created_score = create_response.json()
        
        # Verify created data
        assert created_score["school_slug"] == test_score["school_slug"]
        assert created_score["entry_year"] == test_score["entry_year"]
        assert created_score["inner_area_score"] == test_score["inner_area_score"]
        assert "id" in created_score
        score_id = created_score["id"]
        
        print(f"SUCCESS: Created score with ID: {score_id}")
        
        # Verify it appears in list
        list_response = requests.get(f"{BASE_URL}/api/cut-off-scores")
        scores = list_response.json()
        score_ids = [s["id"] for s in scores]
        assert score_id in score_ids, "Created score not found in list"
        
        # Delete the test score
        delete_response = requests.delete(f"{BASE_URL}/api/cut-off-scores/{score_id}")
        assert delete_response.status_code == 200
        
        # Verify it's gone
        verify_response = requests.get(f"{BASE_URL}/api/cut-off-scores")
        remaining_scores = verify_response.json()
        remaining_ids = [s["id"] for s in remaining_scores]
        assert score_id not in remaining_ids, "Score still exists after delete"
        
        print(f"SUCCESS: Created and deleted cut-off score successfully")
    
    def test_delete_nonexistent_score(self):
        """DELETE /api/cut-off-scores/{id} - returns 404 for invalid ID"""
        fake_id = str(uuid.uuid4())
        response = requests.delete(f"{BASE_URL}/api/cut-off-scores/{fake_id}")
        assert response.status_code == 404
        print("SUCCESS: 404 returned for nonexistent score")


class TestScrapeSchoolPage:
    """Test scrape helper endpoint"""
    
    def test_scrape_valid_url(self):
        """POST /api/scrape-school-page - extracts data from URL"""
        # Use a known school page
        scrape_request = {
            "url": "https://www.twggs.kent.sch.uk/548/open-events",
            "school_slug": "tunbridge-wells-girls-grammar-school",
            "school_name": "Tunbridge Wells Girls' Grammar School"
        }
        
        response = requests.post(f"{BASE_URL}/api/scrape-school-page", json=scrape_request)
        assert response.status_code == 200
        result = response.json()
        
        assert "success" in result
        assert "url" in result
        assert "school_slug" in result
        
        if result["success"]:
            assert "extracted_data" in result
            data = result["extracted_data"]
            assert "dates_found" in data or "times_found" in data or "text_preview" in data
            print(f"SUCCESS: Scraped page, found {len(data.get('dates_found', []))} dates")
        else:
            print(f"INFO: Scrape returned error (expected for some pages): {result.get('error', 'unknown')}")
    
    def test_scrape_invalid_url(self):
        """POST /api/scrape-school-page - handles invalid URL gracefully"""
        scrape_request = {
            "url": "https://invalid-url-that-doesnt-exist-12345.com",
            "school_slug": "test",
            "school_name": "Test School"
        }
        
        response = requests.post(f"{BASE_URL}/api/scrape-school-page", json=scrape_request)
        assert response.status_code == 200
        result = response.json()
        
        assert result["success"] == False
        assert "error" in result
        print(f"SUCCESS: Invalid URL handled gracefully: {result['error'][:50]}...")


class TestOpenEventsDataQuality:
    """Test data quality for seeded open events"""
    
    def test_events_have_required_fields(self):
        """Verify all events have required fields populated"""
        response = requests.get(f"{BASE_URL}/api/open-events")
        assert response.status_code == 200
        events = response.json()
        
        for event in events:
            # Required fields should not be empty
            assert event['school_slug'], f"Event {event['id']} missing school_slug"
            assert event['school_name'], f"Event {event['id']} missing school_name"
            assert event['event_type'], f"Event {event['id']} missing event_type"
            assert event['event_date'], f"Event {event['id']} missing event_date"
            assert event['event_time'], f"Event {event['id']} missing event_time"
        
        print(f"SUCCESS: All {len(events)} events have required fields")


class TestCutOffScoresDataQuality:
    """Test data quality for seeded cut-off scores"""
    
    def test_scores_have_required_fields(self):
        """Verify all scores have required fields populated"""
        response = requests.get(f"{BASE_URL}/api/cut-off-scores")
        assert response.status_code == 200
        scores = response.json()
        
        for score in scores:
            # Required fields should not be empty
            assert score['school_slug'], f"Score {score['id']} missing school_slug"
            assert score['school_name'], f"Score {score['id']} missing school_name"
            assert score['entry_year'], f"Score {score['id']} missing entry_year"
            
            # At least one score field should be populated
            has_score = any([
                score.get('inner_area_score'),
                score.get('outer_area_score'),
                score.get('governors_score')
            ])
            assert has_score, f"Score {score['id']} has no score values"
        
        print(f"SUCCESS: All {len(scores)} scores have required fields")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
