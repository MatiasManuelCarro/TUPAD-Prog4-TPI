from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
    from app.modules.productos.models import Producto
    from app.modules.usuarios.models import Usuario


class Pedido(SQLModel, table=True):
    id: int | None = Field(
        default=None,
        primary_key=True,
    )

    usuario_id: int = Field(
        foreign_key="usuario.id",
        nullable=False,
    )

    estado: str = Field(
        default="PENDIENTE",
        nullable=False,
    )

    forma_pago: str = Field(
        nullable=False,
    )

    direccion_entrega: str = Field(
        min_length=5,
        max_length=200,
        nullable=False,
    )

    notas: str | None = Field(
        default=None,
    )

    total: float = Field(
        default=0,
        ge=0,
        nullable=False,
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )

    usuario: "Usuario" = Relationship(
        back_populates="pedidos",
    )

    items: list["DetallePedido"] = Relationship(
        back_populates="pedido",
    )


class DetallePedido(SQLModel, table=True):
    id: int | None = Field(
        default=None,
        primary_key=True,
    )

    pedido_id: int = Field(
        foreign_key="pedido.id",
        nullable=False,
    )

    producto_id: int = Field(
        foreign_key="producto.id",
        nullable=False,
    )

    cantidad: int = Field(
        ge=1,
        nullable=False,
    )

    nombre_producto: str = Field(
        nullable=False,
    )

    precio_unitario: float = Field(
        nullable=False,
    )

    subtotal: float = Field(
        nullable=False,
    )

    pedido: "Pedido" = Relationship(
        back_populates="items",
    )

    producto: "Producto" = Relationship(
        back_populates="detalles",
    )
