from collections.abc import Callable
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session

from app.core.database import session_factory
from app.core.security import decode_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.service import (
    UsuarioNoEncontrado,
    UsuarioService,
)


def get_session():
    with session_factory() as session:
        yield session


SessionDep = Annotated[
    Session,
    Depends(get_session),
]


def get_current_user(
    session: SessionDep,
    access_token: Annotated[
        str | None,
        Cookie(),
    ] = None,
) -> Usuario:
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado",
        )

    payload = decode_access_token(access_token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o vencido",
        )

    subject = payload.get("sub")

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )

    try:
        usuario_id = int(subject)
    except (TypeError, ValueError) as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        ) from error

    service = UsuarioService(session)

    try:
        return service.obtener_por_id(usuario_id)
    except UsuarioNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
        ) from error


CurrentUserDep = Annotated[
    Usuario,
    Depends(get_current_user),
]


def get_current_active_user(
    current_user: CurrentUserDep,
) -> Usuario:
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )

    return current_user


CurrentActiveUserDep = Annotated[
    Usuario,
    Depends(get_current_active_user),
]


def require_role(
    *roles_permitidos: str,
) -> Callable:
    def verificar_rol(
        current_user: CurrentActiveUserDep,
    ) -> Usuario:
        if current_user.role not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para realizar esta operación",
            )

        return current_user

    return verificar_rol