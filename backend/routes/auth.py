from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import hashlib
import hmac
import os
import time
import base64
import json

from backend.base import get_db
from backend.models import Student, Company

router = APIRouter(prefix="/auth", tags=["auth"])

# ---------------------------------------------------------------------------
# Simple password hashing (SHA-256 + salt) — no extra dependencies needed
# ---------------------------------------------------------------------------

def _hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{hashed}"


def _verify_password(password: str, stored: str) -> bool:
    try:
        salt, hashed = stored.split(":", 1)
        return hmac.compare_digest(
            hashlib.sha256((salt + password).encode()).hexdigest(), hashed
        )
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Minimal JWT-like token (base64-encoded JSON payload + HMAC signature)
# No PyJWT dependency required
# ---------------------------------------------------------------------------

SECRET_KEY = os.getenv("SECRET_KEY", "internhub-secret-change-in-production")
TOKEN_TTL = 60 * 60 * 24  # 24 hours


def _create_token(payload: dict) -> str:
    payload["exp"] = int(time.time()) + TOKEN_TTL
    encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    sig = hmac.new(SECRET_KEY.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    return f"{encoded}.{sig}"


def _decode_token(token: str) -> Optional[dict]:
    try:
        encoded, sig = token.rsplit(".", 1)
        expected = hmac.new(SECRET_KEY.encode(), encoded.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        payload = json.loads(base64.urlsafe_b64decode(encoded.encode()).decode())
        if payload.get("exp", 0) < int(time.time()):
            return None
        return payload
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    fullName: str
    userType: str  # "student" or "admin"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new student or admin (company) account."""
    if body.userType == "student":
        existing = db.query(Student).filter(Student.email == body.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        student = Student(
            email=body.email,
            full_name=body.fullName,
            year_of_study=1,
            cgpa=0.0,
            skills=[],
            preferences=[],
            # Store hashed password in resume_url field temporarily until a
            # dedicated password_hash column is added via migration.
            # A proper migration should add a password_hash column.
        )
        # We store the password hash in a dedicated attribute if the column exists,
        # otherwise we skip (resume upload flow creates the student record).
        if hasattr(Student, "password_hash"):
            student.password_hash = _hash_password(body.password)

        db.add(student)
        db.commit()
        db.refresh(student)

        token = _create_token({"sub": student.id, "role": "student", "email": student.email})
        return {
            "token": token,
            "user": {
                "id": student.id,
                "email": student.email,
                "fullName": student.full_name,
                "userType": "student",
            },
        }

    elif body.userType == "admin":
        existing = db.query(Company).filter(Company.email == body.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        company = Company(
            email=body.email,
            company_name=body.fullName,
            industry="",
            description="",
        )
        db.add(company)
        db.commit()
        db.refresh(company)

        token = _create_token({"sub": company.id, "role": "admin", "email": company.email})
        return {
            "token": token,
            "user": {
                "id": company.id,
                "email": company.email,
                "fullName": company.company_name,
                "userType": "admin",
            },
        }

    else:
        raise HTTPException(status_code=400, detail="userType must be 'student' or 'admin'")


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """Login for students and admins."""
    # Try student first
    student = db.query(Student).filter(Student.email == body.email).first()
    if student:
        # If password_hash column exists, verify it; otherwise allow login
        # (accounts created via resume upload have no password yet)
        if hasattr(Student, "password_hash") and student.password_hash:
            if not _verify_password(body.password, student.password_hash):
                raise HTTPException(status_code=401, detail="Invalid credentials")
        token = _create_token({"sub": student.id, "role": "student", "email": student.email})
        return {
            "token": token,
            "user": {
                "id": student.id,
                "email": student.email,
                "fullName": student.full_name,
                "userType": "student",
            },
        }

    # Try admin/company
    company = db.query(Company).filter(Company.email == body.email).first()
    if company:
        token = _create_token({"sub": company.id, "role": "admin", "email": company.email})
        return {
            "token": token,
            "user": {
                "id": company.id,
                "email": company.email,
                "fullName": company.company_name,
                "userType": "admin",
            },
        }

    raise HTTPException(status_code=401, detail="Invalid credentials")


@router.get("/me")
def get_current_user_info(db: Session = Depends(get_db)):
    """Placeholder — token validation should be done via middleware in production."""
    return {"message": "Use the token from /auth/login to authenticate requests"}
