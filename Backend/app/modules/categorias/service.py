from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaService:
    def __init__(
        self,
        uow: CategoriaUnitOfWork,
    ):
        self.uow = uow

    def crear(
        self,
        data: CategoriaCreate,
    ) -> CategoriaRead:
        with self.uow as uow:
            existente = uow.categorias.get_by_nombre(
                data.nombre
            )

            if existente is not None:
                raise NombreDuplicado(
                    "Ya existe una categoría con ese nombre"
                )

            categoria = Categoria(
                nombre=data.nombre,
                descripcion=data.descripcion,
            )

            categoria = uow.categorias.add(
                categoria
            )

            return CategoriaRead.model_validate(
                categoria
            )

    def listar(
        self,
    ) -> list[CategoriaRead]:
        with self.uow as uow:
            categorias = (
                uow.categorias.get_all_activos()
            )

            return [
                CategoriaRead.model_validate(categoria)
                for categoria in categorias
            ]

    def obtener_por_id(
        self,
        categoria_id: int,
    ) -> CategoriaRead:
        with self.uow as uow:
            categoria = (
                uow.categorias.get_activo_by_id(
                    categoria_id
                )
            )

            if categoria is None:
                raise CategoriaNoEncontrada(
                    f"Categoría {categoria_id} no encontrada"
                )

            return CategoriaRead.model_validate(
                categoria
            )

    def actualizar(
        self,
        categoria_id: int,
        data: CategoriaUpdate,
    ) -> CategoriaRead:
        with self.uow as uow:
            categoria = (
                uow.categorias.get_activo_by_id(
                    categoria_id
                )
            )

            if categoria is None:
                raise CategoriaNoEncontrada(
                    f"Categoría {categoria_id} no encontrada"
                )

            cambios = data.model_dump(
                exclude_unset=True
            )

            if "nombre" in cambios:
                existente = (
                    uow.categorias.get_by_nombre(
                        cambios["nombre"]
                    )
                )

                if (
                    existente is not None
                    and existente.id != categoria_id
                ):
                    raise NombreDuplicado(
                        "Ya existe una categoría con ese nombre"
                    )

            categoria.sqlmodel_update(cambios)

            uow.categorias.add(categoria)

            return CategoriaRead.model_validate(
                categoria
            )

    def eliminar(
        self,
        categoria_id: int,
    ) -> None:
        with self.uow as uow:
            categoria = (
                uow.categorias.get_activo_by_id(
                    categoria_id
                )
            )

            if categoria is None:
                raise CategoriaNoEncontrada(
                    f"Categoría {categoria_id} no encontrada"
                )

            categoria.activo = False

            uow.categorias.add(categoria)