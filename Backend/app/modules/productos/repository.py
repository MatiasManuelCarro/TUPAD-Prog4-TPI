from sqlalchemy import func
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(
        self,
        session: Session,
    ):
        super().__init__(
            session,
            Producto,
        )

    def get_activo_by_id(
        self,
        producto_id: int,
    ) -> Producto | None:
        return self.session.exec(
            select(Producto)
            .where(Producto.id == producto_id)
            .where(Producto.activo.is_(True))
        ).first()

    def search(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[int, list[Producto]]:
        filtros = [
            Producto.activo.is_(True)
        ]

        if search:
            filtros.append(
                Producto.nombre.ilike(
                    f"%{search}%"
                )
            )

        if categoria_id is not None:
            filtros.append(
                Producto.categoria_id == categoria_id
            )

        if disponible is not None:
            filtros.append(
                Producto.disponible == disponible
            )

        total = self.session.exec(
            select(func.count())
            .select_from(Producto)
            .where(*filtros)
        ).one()

        productos = list(
            self.session.exec(
                select(Producto)
                .where(*filtros)
                .offset(skip)
                .limit(limit)
            ).all()
        )

        return total, productos