#!/usr/bin/env python3
"""
Simple test script to verify backend API endpoints are working
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_auth():
    print("Testing authentication...")
    
    # Test login with existing test user
    login_data = {
        "email": "john@alumni.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Login: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print("✅ Login successful")
            print(f"Token received: {token[:50]}...")  # Show first 50 chars
            return token
        else:
            print(f"❌ Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_auth_me(token):
    if not token:
        print("❌ No token available for auth/me test")
        return False
    
    print("\nTesting auth/me endpoint...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Auth/me: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("✅ Auth/me successful")
            print(f"User: {data.get('user', {}).get('name')} ({data.get('user', {}).get('role')})")
            return True
        else:
            print(f"❌ Auth/me failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Auth/me error: {e}")
        return False

def test_opportunities(token):
    if not token:
        print("❌ No token available for opportunity tests")
        return
    
    print("\nTesting opportunities...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test create opportunity
    opportunity_data = {
        "title": "Test Internship",
        "type": "internship",
        "description": "A test internship opportunity"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/alumni/opportunities", 
                               json=opportunity_data, headers=headers)
        print(f"Create opportunity: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            opportunity_id = data.get('opportunity', {}).get('id')
            print("✅ Opportunity created successfully")
            return opportunity_id
        else:
            print(f"❌ Create opportunity failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Create opportunity error: {e}")
        return None

def test_get_opportunities(token):
    if not token:
        print("❌ No token available for get opportunities test")
        return
    
    print("\nTesting get opportunities...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/alumni/opportunities", headers=headers)
        print(f"Get opportunities: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            opportunities = data.get('opportunities', [])
            print(f"✅ Retrieved {len(opportunities)} opportunities")
            for opp in opportunities:
                print(f"  - {opp.get('title')} ({opp.get('type')})")
        else:
            print(f"❌ Get opportunities failed: {response.text}")
    except Exception as e:
        print(f"❌ Get opportunities error: {e}")

if __name__ == "__main__":
    print("🚀 Testing Alumni Connect Backend API")
    print("=" * 50)
    
    # Test authentication
    token = test_auth()
    
    # Test auth/me endpoint
    if token:
        test_auth_me(token)
    
    # Test opportunities
    opportunity_id = test_opportunities(token)
    test_get_opportunities(token)
    
    print("\n" + "=" * 50)
    print("✅ API testing complete!")