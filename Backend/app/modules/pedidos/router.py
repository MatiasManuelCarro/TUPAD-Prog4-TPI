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
from app.core.dependencies import (
    CurrentActiveUserDep,
    require_role,
)
from app.modules.pedidos.schemas import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    CancelacionNoPermitida,
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoDisponible,
    ProductoNoEncontrado,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.models import Usuario

router = APIRouter(
    prefix="/pedidos",
    tags=["pedidos"],
)


def get_pedido_service() -> PedidoService:
    uow = PedidoUnitOfWork(session_factory)

    return PedidoService(uow)


PedidoServiceDep = Annotated[
    PedidoService,
    Depends(get_pedido_service),
]

AdminUserDep = Annotated[
    Usuario,
    Depends(require_role("admin")),
]


@router.get(
    "/admin/todos",
    response_model=PedidosPaginados,
)
def listar_pedidos_admin(
    service: PedidoServiceDep,
    admin: AdminUserDep,
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
) -> PedidosPaginados:
    return service.listar_admin(
        skip=skip,
        limit=limit,
    )


@router.patch(
    "/admin/{pedido_id}/estado",
    response_model=PedidoRead,
)
def cambiar_estado_pedido(
    data: CambioEstado,
    service: PedidoServiceDep,
    admin: AdminUserDep,
    pedido_id: int = Path(
        ...,
        gt=0,
    ),
) -> PedidoRead:
    try:
        return service.cambiar_estado(
            pedido_id=pedido_id,
            data=data,
        )

    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    except TransicionInvalida as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.get(
    "/mios",
    response_model=list[PedidoRead],
)
def listar_mis_pedidos(
    service: PedidoServiceDep,
    current_user: CurrentActiveUserDep,
) -> list[PedidoRead]:
    return service.listar_mios(
        usuario_id=current_user.id,
    )


@router.get(
    "/admin/resumen",
    response_model=ResumenPedidos,
)
def obtener_resumen_pedidos(
    service: PedidoServiceDep,
    admin: AdminUserDep,
) -> ResumenPedidos:
    return service.obtener_resumen()


@router.patch(
    "/{pedido_id}/cancelar",
    response_model=PedidoRead,
)
def cancelar_pedido(
    service: PedidoServiceDep,
    current_user: CurrentActiveUserDep,
    pedido_id: int = Path(
        ...,
        gt=0,
    ),
) -> PedidoRead:
    try:
        return service.cancelar(
            pedido_id=pedido_id,
            usuario_id=current_user.id,
        )

    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    except PedidoAjeno as error:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(error),
        ) from error

    except CancelacionNoPermitida as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.get(
    "/{pedido_id}",
    response_model=PedidoRead,
)
def obtener_pedido(
    service: PedidoServiceDep,
    current_user: CurrentActiveUserDep,
    pedido_id: int = Path(
        ...,
        gt=0,
    ),
) -> PedidoRead:
    try:
        return service.obtener_por_id(
            pedido_id=pedido_id,
            usuario_id=current_user.id,
        )

    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post(
    "",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(
    data: PedidoCreate,
    service: PedidoServiceDep,
    current_user: CurrentActiveUserDep,
) -> PedidoRead:
    try:
        return service.crear(
            usuario_id=current_user.id,
            data=data,
        )

    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    except ProductoNoDisponible as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    except StockInsuficiente as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    except ProductoRepetido as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error
