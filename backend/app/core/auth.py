from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

from app.core.database import db_dependency
from app.models import User

security = HTTPBearer()

CLERK_PUBLIC_KEY = os.getenv("CLERK_PEM_PUBLIC_KEY")
CLERK_ISSUER = os.getenv("CLERK_JWT_ISSUER")


async def get_current_user_clerk_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    if not CLERK_PUBLIC_KEY or not CLERK_ISSUER:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error"
        )
    
    try:
        payload = jwt.decode(
            credentials.credentials,
            CLERK_PUBLIC_KEY,
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={"verify_aud": False}
        )
        clerk_id = payload.get("sub")
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return clerk_id


async def get_current_user(
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: db_dependency = None
) -> User:# Verify user exists in database
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found. Please complete your profile first.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return user
