from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    status,
)

from app.core.dependencies import (
    CurrentActiveUserDep,
    SessionDep,
    require_role,
)
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import (
    AutoDesactivacionNoPermitida,
    UsuarioNoEncontrado,
    UsuarioService,
)


router = APIRouter(
    prefix="/admin/usuarios",
    tags=["usuarios"],
)


AdminUserDep = Annotated[
    Usuario,
    Depends(require_role("admin")),
]


@router.get(
    "",
    response_model=list[UserPublic],
)
def listar_usuarios(
    session: SessionDep,
    admin: AdminUserDep,
) -> list[UserPublic]:
    service = UsuarioService(session)

    return service.listar()


@router.post(
    "/{usuario_id}/activar",
    response_model=UserPublic,
)
def activar_usuario(
    session: SessionDep,
    admin: AdminUserDep,
    usuario_id: int = Path(
        ...,
        gt=0,
    ),
) -> UserPublic:
    service = UsuarioService(session)

    try:
        return service.activar(usuario_id)

    except UsuarioNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post(
    "/{usuario_id}/desactivar",
    response_model=UserPublic,
)
def desactivar_usuario(
    session: SessionDep,
    admin: AdminUserDep,
    current_user: CurrentActiveUserDep,
    usuario_id: int = Path(
        ...,
        gt=0,
    ),
) -> UserPublic:
    service = UsuarioService(session)

    try:
        return service.desactivar(
            usuario_id=usuario_id,
            current_user_id=current_user.id,
        )

    except UsuarioNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    except AutoDesactivacionNoPermitida as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error
