from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    status,
)

from app.core.database import session_factory
from app.core.dependencies import require_role
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.service import (
    CategoriaNoEncontrada,
    CategoriaService,
    NombreDuplicado,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.usuarios.models import Usuario


router = APIRouter(
    prefix="/categorias",
    tags=["categorias"],
)


def get_categoria_service() -> CategoriaService:
    uow = CategoriaUnitOfWork(
        session_factory
    )

    return CategoriaService(uow)


CategoriaServiceDep = Annotated[
    CategoriaService,
    Depends(get_categoria_service),
]


AdminUserDep = Annotated[
    Usuario,
    Depends(require_role("admin")),
]


@router.get(
    "",
    response_model=list[CategoriaRead],
)
def listar_categorias(
    service: CategoriaServiceDep,
) -> list[CategoriaRead]:
    return service.listar()


@router.get(
    "/{categoria_id}",
    response_model=CategoriaRead,
)
def obtener_categoria(
    service: CategoriaServiceDep,
    categoria_id: int = Path(
        ...,
        gt=0,
    ),
) -> CategoriaRead:
    try:
        return service.obtener_por_id(
            categoria_id
        )

    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post(
    "",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_categoria(
    data: CategoriaCreate,
    service: CategoriaServiceDep,
    admin: AdminUserDep,
) -> CategoriaRead:
    try:
        return service.crear(data)

    except NombreDuplicado as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.put(
    "/{categoria_id}",
    response_model=CategoriaRead,
)
def actualizar_categoria(
    data: CategoriaUpdate,
    service: CategoriaServiceDep,
    admin: AdminUserDep,
    categoria_id: int = Path(
        ...,
        gt=0,
    ),
) -> CategoriaRead:
    try:
        return service.actualizar(
            categoria_id,
            data,
        )

    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    except NombreDuplicado as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.delete(
    "/{categoria_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_categoria(
    service: CategoriaServiceDep,
    admin: AdminUserDep,
    categoria_id: int = Path(
        ...,
        gt=0,
    ),
) -> None:
    try:
        service.eliminar(
            categoria_id
        )

    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error