from typing import TYPE_CHECKING

from sqlalchemy import Column, String
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.models import Producto


class Categoria(SQLModel, table=True):
    id: int | None = Field(
        default=None,
        primary_key=True,
    )

    nombre: str = Field(
        min_length=2,
        max_length=100,
        sa_column=Column(
            String(100),
            unique=True,
            nullable=False,
        ),
    )

    descripcion: str | None = Field(
        default=None,
    )

    activo: bool = Field(
        default=True,
        nullable=False,
    )

    productos: list["Producto"] = Relationship(
        back_populates="categoria",
    )