from fastapi import APIRouter
from sqlalchemy import text

from app.core.dependencies import SessionDep

router = APIRouter(
    prefix="/health",
    tags=["health"],
)


@router.get("")
def health():
    return {"status": "ok"}


@router.get("/db")
def health_db(
    session: SessionDep,
):
    session.exec(
        text("SELECT 1")
    )

    return {"status": "ok"}