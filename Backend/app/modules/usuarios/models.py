from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, String
from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
    from app.modules.pedidos.models import Pedido


class Usuario(SQLModel, table=True):
    id: int | None = Field(
        default=None,
        primary_key=True,
    )

    username: str = Field(
        sa_column=Column(
            String,
            unique=True,
            nullable=False,
        )
    )

    full_name: str = Field(
        nullable=False,
    )

    email: str = Field(
        sa_column=Column(
            String,
            unique=True,
            nullable=False,
        )
    )

    hashed_password: str = Field(
        nullable=False,
    )

    role: str = Field(
        default="user",
        nullable=False,
    )

    disabled: bool = Field(
        default=False,
        nullable=False,
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )

    pedidos: list["Pedido"] = Relationship(
        back_populates="usuario",
    )