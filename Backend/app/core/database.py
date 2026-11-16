from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
)


def session_factory() -> Session:
    return Session(
        engine,
        expire_on_commit=False,
    )


def create_all_tables() -> None:
    SQLModel.metadata.create_all(engine)