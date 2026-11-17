from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    Query,
    status,
)

from app.core.database import session_factory
from app.core.dependencies import require_role
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.service import (
    CategoriaNoEncontrada,
    ProductoNoEncontrado,
    ProductoService,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.usuarios.models import Usuario

router = APIRouter(
    prefix="/productos",
    tags=["productos"],
)


def get_producto_service() -> ProductoService:
    uow = ProductoUnitOfWork(
        session_factory
    )

    return ProductoService(uow)


ProductoServiceDep = Annotated[
    ProductoService,
    Depends(get_producto_service),
]


AdminUserDep = Annotated[
    Usuario,
    Depends(require_role("admin")),
]


@router.get(
    "",
    response_model=ProductosPaginados,
)
def listar_productos(
    service: ProductoServiceDep,
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    search: str | None = Query(
        default=None,
    ),
    categoria_id: int | None = Query(
        default=None,
        gt=0,
    ),
    disponible: bool | None = Query(
        default=None,
    ),
) -> ProductosPaginados:
    return service.listar(
        skip=skip,
        limit=limit,
        search=search,
        categoria_id=categoria_id,
        disponible=disponible,
    )


@router.get(
    "/{producto_id}",
    response_model=ProductoRead,
)
def obtener_producto(
    service: ProductoServiceDep,
    producto_id: int = Path(
        ...,
        gt=0,
    ),
) -> ProductoRead:
    try:
        return service.obtener_por_id(
            producto_id
        )

    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post(
    "",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_producto(
    data: ProductoCreate,
    service: ProductoServiceDep,
    admin: AdminUserDep,
) -> ProductoRead:
    try:
        return service.crear(data)

    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.put(
    "/{producto_id}",
    response_model=ProductoRead,
)
def actualizar_producto(
    data: ProductoUpdate,
    service: ProductoServiceDep,
    admin: AdminUserDep,
    producto_id: int = Path(
        ...,
        gt=0,
    ),
) -> ProductoRead:
    try:
        return service.actualizar(
            producto_id,
            data,
        )

    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.patch(
    "/{producto_id}/stock",
    response_model=ProductoRead,
)
def actualizar_stock_producto(
    data: ProductoStockUpdate,
    service: ProductoServiceDep,
    admin: AdminUserDep,
    producto_id: int = Path(
        ...,
        gt=0,
    ),
) -> ProductoRead:
    try:
        return service.actualizar_stock(
            producto_id,
            data,
        )

    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/{producto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_producto(
    service: ProductoServiceDep,
    admin: AdminUserDep,
    producto_id: int = Path(
        ...,
        gt=0,
    ),
) -> None:
    try:
        service.eliminar(
            producto_id
        )

    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error