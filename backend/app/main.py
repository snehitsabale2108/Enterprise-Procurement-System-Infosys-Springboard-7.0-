from __future__ import annotations

from datetime import datetime, timedelta, timezone
from hashlib import sha256
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

ROLE_USERS: dict[str, dict[str, Any]] = {
    "employee@demo.local": {
        "id": 1,
        "name": "Employee User",
        "email": "employee@demo.local",
        "role": "employee",
        "password": "password123",
    },
    "manager@demo.local": {
        "id": 2,
        "name": "Manager User",
        "email": "manager@demo.local",
        "role": "manager",
        "password": "password123",
    },
    "senior.manager@demo.local": {
        "id": 3,
        "name": "Senior Manager User",
        "email": "senior.manager@demo.local",
        "role": "senior-manager",
        "password": "password123",
    },
    "head@demo.local": {
        "id": 4,
        "name": "Head User",
        "email": "head@demo.local",
        "role": "head",
        "password": "password123",
    },
    "procurement.officer@demo.local": {
        "id": 5,
        "name": "Procurement Officer User",
        "email": "procurement.officer@demo.local",
        "role": "procurement-officer",
        "password": "password123",
    },
    "finance@demo.local": {
        "id": 6,
        "name": "Finance User",
        "email": "finance@demo.local",
        "role": "finance",
        "password": "password123",
    },
    "admin@demo.local": {
        "id": 7,
        "name": "Admin User",
        "email": "admin@demo.local",
        "role": "admin",
        "password": "password123",
    },
    "supplier@demo.local": {
        "id": 8,
        "name": "Supplier User",
        "email": "supplier@demo.local",
        "role": "supplier",
        "password": "password123",
    },
}

ROLE_ROUTES = {
    "employee": "/employee",
    "manager": "/manager",
    "senior-manager": "/senior-manager",
    "head": "/head",
    "procurement-officer": "/procurement-officer",
    "finance": "/finance",
    "admin": "/admin",
    "supplier": "/supplier",
}

app = FastAPI(title="ProcurementMS Test Backend", version="1.0.0")
security = HTTPBearer(auto_error=False)
ACTIVE_TOKENS: dict[str, str] = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str


class LoginResponse(BaseModel):
    token: str
    role: str
    user: UserResponse
    expires_at: str


class MeResponse(BaseModel):
    user: UserResponse
    route: str


class RolesResponse(BaseModel):
    roles: list[str]


class HealthResponse(BaseModel):
    status: str


def build_token(user: dict[str, Any]) -> str:
    return sha256(f"{user['email']}:{user['role']}".encode("utf-8")).hexdigest()


def build_user_response(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
    }


def get_user_by_token(
    credentials: HTTPAuthorizationCredentials | None,
) -> dict[str, Any]:
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token"
        )

    for user in ROLE_USERS.values():
        expected_token = sha256(
            f"{user['email']}:{user['role']}".encode("utf-8")
        ).hexdigest()
        if credentials.credentials == expected_token:
            return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
    )


@app.get("/api/health", response_model=HealthResponse)
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/roles", response_model=RolesResponse)
def list_roles() -> dict[str, list[str]]:
    return {"roles": list(ROLE_ROUTES.keys())}


@app.post("/api/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> dict[str, Any]:
    user = ROLE_USERS.get(payload.email.lower())

    if user is None or payload.password != user["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    token = build_token(user)
    ACTIVE_TOKENS[token] = user["email"]
    expires_at = (datetime.now(timezone.utc) + timedelta(hours=8)).isoformat()

    return {
        "token": token,
        "role": user["role"],
        "user": build_user_response(user),
        "expires_at": expires_at,
    }


@app.get("/api/me", response_model=MeResponse)
def me(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict[str, Any]:
    user_email = (
        None if credentials is None else ACTIVE_TOKENS.get(credentials.credentials)
    )

    if user_email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )

    user = ROLE_USERS[user_email]
    return {
        "user": build_user_response(user),
        "route": ROLE_ROUTES[user["role"]],
    }
