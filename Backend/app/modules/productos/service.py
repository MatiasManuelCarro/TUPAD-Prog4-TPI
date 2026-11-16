from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class CategoriaNoEncontrada(Exception):
    pass


class ProductoService:
    def __init__(
        self,
        uow: ProductoUnitOfWork,
    ):
        self.uow = uow

    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> ProductosPaginados:
        with self.uow as uow:
            total, productos = uow.productos.search(
                skip=skip,
                limit=limit,
                search=search,
                categoria_id=categoria_id,
                disponible=disponible,
            )

            return ProductosPaginados(
                total=total,
                items=[
                    ProductoRead.model_validate(producto)
                    for producto in productos
                ],
            )

    def obtener_por_id(
        self,
        producto_id: int,
    ) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_activo_by_id(
                producto_id
            )

            if producto is None:
                raise ProductoNoEncontrado(
                    f"Producto {producto_id} no encontrado"
                )

            return ProductoRead.model_validate(
                producto
            )

    def crear(
        self,
        data: ProductoCreate,
    ) -> ProductoRead:
        with self.uow as uow:
            categoria = uow.categorias.get_activo_by_id(
                data.categoria_id
            )

            if categoria is None:
                raise CategoriaNoEncontrada(
                    f"Categoría {data.categoria_id} no encontrada"
                )

            producto = Producto(
                nombre=data.nombre,
                descripcion=data.descripcion,
                precio_base=data.precio_base,
                imagen_url=data.imagen_url,
                stock=data.stock,
                disponible=data.disponible,
                categoria_id=data.categoria_id,
            )

            producto = uow.productos.add(
                producto
            )

            producto.categoria = categoria

            return ProductoRead.model_validate(
                producto
            )

    def actualizar(
        self,
        producto_id: int,
        data: ProductoUpdate,
    ) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_activo_by_id(
                producto_id
            )

            if producto is None:
                raise ProductoNoEncontrado(
                    f"Producto {producto_id} no encontrado"
                )

            cambios = data.model_dump(
                exclude_unset=True
            )

            if "categoria_id" in cambios:
                categoria = uow.categorias.get_activo_by_id(
                    cambios["categoria_id"]
                )

                if categoria is None:
                    raise CategoriaNoEncontrada(
                        f"Categoría {cambios['categoria_id']} no encontrada"
                    )

                producto.categoria = categoria

            producto.sqlmodel_update(cambios)

            producto = uow.productos.add(
                producto
            )

            return ProductoRead.model_validate(
                producto
            )

    def actualizar_stock(
        self,
        producto_id: int,
        data: ProductoStockUpdate,
    ) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_activo_by_id(
                producto_id
            )

            if producto is None:
                raise ProductoNoEncontrado(
                    f"Producto {producto_id} no encontrado"
                )

            producto.stock = data.stock
            producto.disponible = data.disponible

            producto = uow.productos.add(
                producto
            )

            return ProductoRead.model_validate(
                producto
            )

    def eliminar(
        self,
        producto_id: int,
    ) -> None:
        with self.uow as uow:
            producto = uow.productos.get_activo_by_id(
                producto_id
            )

            if producto is None:
                raise ProductoNoEncontrado(
                    f"Producto {producto_id} no encontrado"
                )

            producto.activo = False

            uow.productos.add(
                producto
            )