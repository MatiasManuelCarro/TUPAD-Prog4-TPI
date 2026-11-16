from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.dependencies import (
    CurrentActiveUserDep,
    SessionDep,
)
from app.core.security import create_access_token
from app.modules.auth.schemas import MessageResponse
from app.modules.auth.service import (
    AuthService,
    CredencialesInvalidas,
    UsuarioDesactivado,
)
from app.modules.usuarios.schemas import (
    UserCreate,
    UserPublic,
)
from app.modules.usuarios.service import (
    UsuarioDuplicado,
    UsuarioService,
)


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: UserCreate,
    session: SessionDep,
) -> UserPublic:
    service = UsuarioService(session)

    try:
        return service.registrar(data)

    except UsuarioDuplicado as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.post(
    "/token",
    response_model=MessageResponse,
)
def login(
    response: Response,
    form_data: Annotated[
        OAuth2PasswordRequestForm,
        Depends(),
    ],
    session: SessionDep,
) -> MessageResponse:
    service = AuthService(session)

    try:
        usuario = service.autenticar(
            username=form_data.username,
            password=form_data.password,
        )

    except CredencialesInvalidas as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        ) from error

    except UsuarioDesactivado as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    access_token = create_access_token(
        {
            "sub": str(usuario.id),
        }
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return MessageResponse(
        message="Login exitoso",
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
)
def logout(
    response: Response,
) -> MessageResponse:
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax",
    )

    return MessageResponse(
        message="Sesión cerrada correctamente",
    )


@router.get(
    "/me",
    response_model=UserPublic,
)
def me(
    current_user: CurrentActiveUserDep,
) -> UserPublic:
    return UserPublic.model_validate(
        current_user
    )