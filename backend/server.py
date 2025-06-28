from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from datetime import datetime, timedelta
import jwt
import bcrypt
import os
import base64
import uuid
from typing import Optional, List, Dict
import json
from cryptography.fernet import Fernet
import secrets
from fastapi.responses import JSONResponse
import random

# Environment variables
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_urlsafe(32))
ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY')
if ENCRYPTION_KEY is None:
    ENCRYPTION_KEY = Fernet.generate_key()
else:
    ENCRYPTION_KEY = ENCRYPTION_KEY.encode()

# MongoDB setup
client = MongoClient(MONGO_URL)
db = client.secure_vault
users_collection = db.users
files_collection = db.files
folders_collection = db.folders

# FastAPI setup
app = FastAPI(title="Secure File Vault", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
cipher_suite = Fernet(ENCRYPTION_KEY)

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class CreateFolder(BaseModel):
    name: str
    parent_id: Optional[str] = None

class FileResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    size: int
    folder_id: Optional[str]
    created_at: datetime
    is_image: bool

class FolderResponse(BaseModel):
    id: str
    name: str
    parent_id: Optional[str]
    created_at: datetime
    file_count: int

# Utility functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def verify_jwt_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    return verify_jwt_token(credentials.credentials)

def encrypt_file_data(data: bytes) -> str:
    return cipher_suite.encrypt(data).decode()

def decrypt_file_data(encrypted_data: str) -> bytes:
    return cipher_suite.decrypt(encrypted_data.encode())

def is_image_file(filename: str) -> bool:
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'}
    return any(filename.lower().endswith(ext) for ext in image_extensions)

# In-memory OTP store for demo
otp_store: Dict[str, str] = {}

# API Routes

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Secure File Vault"}

@app.post("/api/auth/register")
async def register(user_data: UserRegister):
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    users_collection.insert_one(user_doc)
    
    # Create JWT token
    token = create_jwt_token(user_id)
    
    return {
        "message": "User registered successfully",
        "token": token,
        "user": {
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name
        }
    }

@app.post("/api/auth/login")
async def login(login_data: UserLogin):
    # Find user
    user = users_collection.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    token = create_jwt_token(user["id"])
    
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }
    }

@app.get("/api/auth/me")
async def get_current_user_profile(user_id: str = Depends(get_current_user)):
    user = users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"]
    }

@app.post("/api/folders")
async def create_folder(folder_data: CreateFolder, user_id: str = Depends(get_current_user)):
    folder_id = str(uuid.uuid4())
    
    folder_doc = {
        "id": folder_id,
        "name": folder_data.name,
        "parent_id": folder_data.parent_id,
        "user_id": user_id,
        "created_at": datetime.utcnow()
    }
    
    folders_collection.insert_one(folder_doc)
    
    return {
        "message": "Folder created successfully",
        "folder": {
            "id": folder_id,
            "name": folder_data.name,
            "parent_id": folder_data.parent_id,
            "created_at": folder_doc["created_at"]
        }
    }

@app.get("/api/folders")
async def get_folders(user_id: str = Depends(get_current_user)):
    folders = list(folders_collection.find({"user_id": user_id}))
    
    folder_responses = []
    for folder in folders:
        file_count = files_collection.count_documents({"folder_id": folder["id"], "user_id": user_id})
        folder_responses.append(FolderResponse(
            id=folder["id"],
            name=folder["name"],
            parent_id=folder.get("parent_id"),
            created_at=folder["created_at"],
            file_count=file_count
        ))
    
    return folder_responses

@app.post("/api/files/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder_id: Optional[str] = Form(None),
    user_id: str = Depends(get_current_user)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Read file content
    file_content = await file.read()
    
    # Encrypt file content
    encrypted_content = encrypt_file_data(file_content)
    
    # Create file document
    file_id = str(uuid.uuid4())
    file_doc = {
        "id": file_id,
        "filename": file.filename,
        "file_type": file.content_type or "application/octet-stream",
        "size": len(file_content),
        "encrypted_content": encrypted_content,
        "folder_id": folder_id,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "is_image": is_image_file(file.filename)
    }
    
    files_collection.insert_one(file_doc)
    
    return {
        "message": "File uploaded successfully",
        "file": FileResponse(
            id=file_id,
            filename=file.filename,
            file_type=file.content_type or "application/octet-stream",
            size=len(file_content),
            folder_id=folder_id,
            created_at=file_doc["created_at"],
            is_image=is_image_file(file.filename)
        )
    }

@app.get("/api/files")
async def get_files(folder_id: Optional[str] = None, user_id: str = Depends(get_current_user)):
    query = {"user_id": user_id}
    if folder_id:
        query["folder_id"] = folder_id
    else:
        query["folder_id"] = None  # Root files
    
    files = list(files_collection.find(query).sort("created_at", -1))
    
    file_responses = []
    for file_doc in files:
        file_responses.append(FileResponse(
            id=file_doc["id"],
            filename=file_doc["filename"],
            file_type=file_doc["file_type"],
            size=file_doc["size"],
            folder_id=file_doc.get("folder_id"),
            created_at=file_doc["created_at"],
            is_image=file_doc.get("is_image", False)
        ))
    
    return file_responses

@app.get("/api/files/{file_id}/download")
async def download_file(file_id: str, user_id: str = Depends(get_current_user)):
    file_doc = files_collection.find_one({"id": file_id, "user_id": user_id})
    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Decrypt file content
    decrypted_content = decrypt_file_data(file_doc["encrypted_content"])
    
    # Convert to base64 for frontend
    base64_content = base64.b64encode(decrypted_content).decode()
    
    return {
        "filename": file_doc["filename"],
        "file_type": file_doc["file_type"],
        "content": base64_content,
        "size": file_doc["size"],
        "is_image": file_doc.get("is_image", False)
    }

@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str, user_id: str = Depends(get_current_user)):
    result = files_collection.delete_one({"id": file_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {"message": "File deleted successfully"}

@app.delete("/api/folders/{folder_id}")
async def delete_folder(folder_id: str, user_id: str = Depends(get_current_user)):
    # Check if folder has files
    file_count = files_collection.count_documents({"folder_id": folder_id, "user_id": user_id})
    if file_count > 0:
        raise HTTPException(status_code=400, detail="Cannot delete folder with files")
    
    result = folders_collection.delete_one({"id": folder_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Folder not found")
    
    return {"message": "Folder deleted successfully"}

@app.options("/api/auth/register")
async def options_register():
    return JSONResponse(status_code=200, content={})

@app.options("/api/auth/login")
async def options_login():
    return JSONResponse(status_code=200, content={})

@app.post("/api/auth/google")
async def google_login(credential: str = Body(..., embed=True)):
    # In production, verify the Google token using google-auth
    # Here, we mock verification and extract email from a fake payload
    # You should use: from google.oauth2 import id_token, and verify with google.auth.transport.requests.Request()
    # For now, accept any credential and use a fake email
    fake_email = f"user_{credential[:6]}@gmail.com"
    user = users_collection.find_one({"email": fake_email})
    if not user:
        user_id = str(uuid.uuid4())
        user_doc = {
            "id": user_id,
            "email": fake_email,
            "name": "Google User",
            "password": "",
            "created_at": datetime.utcnow()
        }
        users_collection.insert_one(user_doc)
        user = user_doc
    token = create_jwt_token(user["id"])
    return {"message": "Google login successful", "token": token, "user": {"id": user["id"], "email": user["email"], "name": user["name"]}}

@app.post("/api/auth/send-otp")
async def send_otp(phone: str = Body(..., embed=True)):
    otp = str(random.randint(100000, 999999))
    otp_store[phone] = otp
    print(f"[DEBUG] OTP for {phone}: {otp}")  # In production, send via SMS
    return {"message": "OTP sent (check backend logs in demo)", "phone": phone}

@app.post("/api/auth/verify-otp")
async def verify_otp(phone: str = Body(..., embed=True), otp: str = Body(..., embed=True)):
    if otp_store.get(phone) == otp:
        # Create or get user by phone
        user = users_collection.find_one({"email": f"{phone}@phone.local"})
        if not user:
            user_id = str(uuid.uuid4())
            user_doc = {
                "id": user_id,
                "email": f"{phone}@phone.local",
                "name": phone,
                "password": "",
                "created_at": datetime.utcnow()
            }
            users_collection.insert_one(user_doc)
            user = user_doc
        token = create_jwt_token(user["id"])
        del otp_store[phone]
        return {"message": "OTP verified", "token": token, "user": {"id": user["id"], "email": user["email"], "name": user["name"]}}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)