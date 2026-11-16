from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(
        self,
        session: Session,
    ):
        super().__init__(
            session,
            Pedido,
        )

    def get_by_usuario(
        self,
        usuario_id: int,
    ) -> list[Pedido]:
        return list(
            self.session.exec(
                select(Pedido)
                .where(
                    Pedido.usuario_id == usuario_id
                )
                .options(
                    selectinload(Pedido.items)
                )
            ).all()
        )

    def get_by_id_with_items(
        self,
        pedido_id: int,
    ) -> Pedido | None:
        return self.session.exec(
            select(Pedido)
            .where(
                Pedido.id == pedido_id
            )
            .options(
                selectinload(Pedido.items)
            )
        ).first()

    def search(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[int, list[Pedido]]:
        total = self.session.exec(
            select(func.count())
            .select_from(Pedido)
        ).one()

        pedidos = list(
            self.session.exec(
                select(Pedido)
                .options(
                    selectinload(Pedido.items)
                )
                .order_by(
                    Pedido.created_at.desc()
                )
                .offset(skip)
                .limit(limit)
            ).all()
        )

        return total, pedidos