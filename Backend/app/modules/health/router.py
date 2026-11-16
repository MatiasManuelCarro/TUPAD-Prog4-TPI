from app.core.database import SessionDep
from fastapi import APIRouter
from sqlalchemy import text

router = APIRouter(
    prefix="/health",
    tags=["health"],
)


@router.get("")
def health():
    return {"status": "ok"}


@router.get("/db")
def health_db(session: SessionDep):
    session.exec(text("SELECT 1"))

    return {"status": "ok"}