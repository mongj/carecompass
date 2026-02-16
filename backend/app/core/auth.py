from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

from app.core.database import DbDependency
from app.models import User

security = HTTPBearer()

CLERK_PUBLIC_KEY = os.getenv("CLERK_PEM_PUBLIC_KEY")
CLERK_ISSUER = os.getenv("CLERK_JWT_ISSUER")


async def get_current_user_clerk_id(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
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
        clerk_id: str = payload.get("sub")
        if not clerk_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing subject claim",
                headers={"WWW-Authenticate": "Bearer"}
            )
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return clerk_id


async def get_current_user(
    clerk_id: Annotated[str, Depends(get_current_user_clerk_id)],
    db: DbDependency
) -> User:
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found. Please complete your profile first.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return user


CurrentUserClerkIdDependency = Annotated[str, Depends(get_current_user_clerk_id)]
CurrentUserDependency = Annotated[User, Depends(get_current_user)]
