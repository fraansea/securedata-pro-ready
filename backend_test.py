#!/usr/bin/env python3
import requests
import json
import base64
import os
import uuid
import time
import random
from datetime import datetime
import mimetypes
import string
import pytest
from fastapi.testclient import TestClient
from backend.server import app

# Get backend URL from frontend .env file
BACKEND_URL = "https://861ba7a0-9293-46da-92fd-dfe4cc04c2e2.preview.emergentagent.com/api"

# Test data
TEST_USER = {
    "name": "francis",
    "email": "francisgigi19@gmail.com",
    "password": "testpassword123"
}

# Global variables to store test data
auth_token = None
user_data = None
test_folder_id = None
test_file_id = None
uploaded_file_content = None

client = TestClient(app)

def generate_random_file(size_kb=10, file_type="txt"):
    """Generate a random file with specified size and type"""
    content = ''.join(random.choices(string.ascii_letters + string.digits, k=size_kb * 1024))
    return content.encode('utf-8')

def print_separator(title):
    """Print a separator with title for better readability"""
    print("\n" + "=" * 80)
    print(f" {title} ".center(80, "="))
    print("=" * 80 + "\n")

def test_health_check():
    """Test the health check endpoint"""
    print_separator("Testing Health Check")
    
    response = requests.get(f"{BACKEND_URL}/health")
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("✅ Health check passed")

def test_user_registration():
    """Test user registration"""
    global auth_token, user_data
    
    print_separator("Testing User Registration")
    
    response = requests.post(
        f"{BACKEND_URL}/auth/register",
        json=TEST_USER
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["user"]["email"] == TEST_USER["email"]
    
    # Save token and user data for subsequent tests
    auth_token = response.json()["token"]
    user_data = response.json()["user"]
    
    print("✅ User registration passed")

def test_user_login():
    """Test user login"""
    global auth_token
    
    print_separator("Testing User Login")
    
    login_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }
    
    response = requests.post(
        f"{BACKEND_URL}/auth/login",
        json=login_data
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["user"]["email"] == TEST_USER["email"]
    
    # Update token
    auth_token = response.json()["token"]
    
    print("✅ User login passed")

def test_get_current_user():
    """Test getting current user profile"""
    print_separator("Testing Get Current User")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    response = requests.get(
        f"{BACKEND_URL}/auth/me",
        headers=headers
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["email"] == TEST_USER["email"]
    assert response.json()["name"] == TEST_USER["name"]
    
    print("✅ Get current user passed")

def test_create_folder():
    """Test folder creation"""
    global test_folder_id
    
    print_separator("Testing Folder Creation")
    
    folder_data = {
        "name": f"Test Folder {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "parent_id": None
    }
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    response = requests.post(
        f"{BACKEND_URL}/folders",
        json=folder_data,
        headers=headers
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert "folder" in response.json()
    assert response.json()["folder"]["name"] == folder_data["name"]
    
    # Save folder ID for subsequent tests
    test_folder_id = response.json()["folder"]["id"]
    
    print("✅ Folder creation passed")

def test_list_folders():
    """Test listing folders"""
    print_separator("Testing Folder Listing")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    response = requests.get(
        f"{BACKEND_URL}/folders",
        headers=headers
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    # Verify our test folder is in the list
    folder_ids = [folder["id"] for folder in response.json()]
    assert test_folder_id in folder_ids
    
    print("✅ Folder listing passed")

def test_file_upload():
    """Test file upload with encryption"""
    global test_file_id, uploaded_file_content
    
    print_separator("Testing File Upload")
    
    # Generate a random text file
    file_content = generate_random_file(size_kb=5)
    uploaded_file_content = file_content
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Create a temporary file
    filename = f"test_file_{uuid.uuid4()}.txt"
    
    files = {
        'file': (filename, file_content, 'text/plain')
    }
    
    data = {
        'folder_id': test_folder_id
    }
    
    response = requests.post(
        f"{BACKEND_URL}/files/upload",
        headers=headers,
        files=files,
        data=data
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert "file" in response.json()
    assert response.json()["file"]["filename"] == filename
    assert response.json()["file"]["folder_id"] == test_folder_id
    
    # Save file ID for subsequent tests
    test_file_id = response.json()["file"]["id"]
    
    print("✅ File upload passed")

def test_list_files():
    """Test listing files"""
    print_separator("Testing File Listing")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Test listing files in a specific folder
    response = requests.get(
        f"{BACKEND_URL}/files?folder_id={test_folder_id}",
        headers=headers
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
    # Verify our test file is in the list
    file_ids = [file["id"] for file in response.json()]
    assert test_file_id in file_ids
    
    print("✅ File listing passed")

def test_download_file():
    """Test file download and decryption"""
    print_separator("Testing File Download")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    response = requests.get(
        f"{BACKEND_URL}/files/{test_file_id}/download",
        headers=headers
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {json.dumps(response.json(), indent=2)[:200]}...")  # Truncate for readability
    
    assert response.status_code == 200
    assert "content" in response.json()
    
    # Decode base64 content
    decoded_content = base64.b64decode(response.json()["content"])
    
    # Verify the content matches what we uploaded
    assert decoded_content == uploaded_file_content
    
    print("✅ File download and decryption passed")

def test_delete_file():
    """Test file deletion"""
    print_separator("Testing File Deletion")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    response = requests.delete(
        f"{BACKEND_URL}/files/{test_file_id}",
        headers=headers
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["message"] == "File deleted successfully"
    
    # Verify file is no longer in the list
    list_response = requests.get(
        f"{BACKEND_URL}/files?folder_id={test_folder_id}",
        headers=headers
    )
    
    file_ids = [file["id"] for file in list_response.json()]
    assert test_file_id not in file_ids
    
    print("✅ File deletion passed")

def test_delete_folder():
    """Test folder deletion"""
    print_separator("Testing Folder Deletion")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    response = requests.delete(
        f"{BACKEND_URL}/folders/{test_folder_id}",
        headers=headers
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["message"] == "Folder deleted successfully"
    
    # Verify folder is no longer in the list
    list_response = requests.get(
        f"{BACKEND_URL}/folders",
        headers=headers
    )
    
    folder_ids = [folder["id"] for folder in list_response.json()]
    assert test_folder_id not in folder_ids
    
    print("✅ Folder deletion passed")

def test_duplicate_registration():
    """Test duplicate user registration (should fail)"""
    print_separator("Testing Duplicate User Registration")
    
    response = requests.post(
        f"{BACKEND_URL}/auth/register",
        json=TEST_USER
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]
    
    print("✅ Duplicate registration test passed")

def test_invalid_login():
    """Test invalid login credentials"""
    print_separator("Testing Invalid Login")
    
    login_data = {
        "email": TEST_USER["email"],
        "password": "WrongPassword123!"
    }
    
    response = requests.post(
        f"{BACKEND_URL}/auth/login",
        json=login_data
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]
    
    print("✅ Invalid login test passed")

def test_unauthorized_access():
    """Test unauthorized access to protected endpoints"""
    print_separator("Testing Unauthorized Access")
    
    # Try to access a protected endpoint without a token
    response = requests.get(f"{BACKEND_URL}/folders")
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    assert response.status_code in [401, 403]  # Either unauthorized or forbidden
    
    print("✅ Unauthorized access test passed")

def test_register():
    response = client.post("/api/auth/register", json=TEST_USER)
    assert response.status_code in (200, 400)  # 400 if already registered
    if response.status_code == 200:
        data = response.json()
        assert data["user"]["email"] == TEST_USER["email"]
        assert "token" in data
    else:
        assert response.json()["detail"] == "Email already registered"

def test_login():
    response = client.post("/api/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == TEST_USER["email"]
    assert "token" in data

def run_all_tests():
    """Run all tests in sequence"""
    try:
        test_health_check()
        test_user_registration()
        test_user_login()
        test_get_current_user()
        test_create_folder()
        test_list_folders()
        test_file_upload()
        test_list_files()
        test_download_file()
        test_delete_file()
        test_delete_folder()
        test_duplicate_registration()
        test_invalid_login()
        test_unauthorized_access()
        test_register()
        test_login()
        
        print_separator("TEST SUMMARY")
        print("✅ All tests passed successfully!")
        
    except AssertionError as e:
        print(f"❌ Test failed: {e}")
    except Exception as e:
        print(f"❌ Error during testing: {e}")

if __name__ == "__main__":
    run_all_tests()