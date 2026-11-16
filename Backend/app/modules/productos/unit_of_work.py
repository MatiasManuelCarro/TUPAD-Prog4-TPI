from collections.abc import Callable

from sqlmodel import Session

from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.repository import ProductoRepository


class ProductoUnitOfWork(UnitOfWork):
    def __init__(
        self,
        session_factory: Callable[[], Session],
    ):
        super().__init__(session_factory)

    def __enter__(self):
        super().__enter__()

        self.productos = ProductoRepository(
            self.session
        )

        self.categorias = CategoriaRepository(
            self.session
        )

        return self