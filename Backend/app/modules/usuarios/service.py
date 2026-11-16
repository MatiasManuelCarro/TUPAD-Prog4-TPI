from sqlmodel import Session

from app.core.security import hash_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.schemas import UserCreate, UserPublic


class UsuarioNoEncontrado(Exception):
    pass


class UsuarioDuplicado(Exception):
    pass


class AutoDesactivacionNoPermitida(Exception):
    pass


class UsuarioService:
    def __init__(
        self,
        session: Session,
    ):
        self.session = session
        self.usuarios = UsuarioRepository(session)

    def registrar(
        self,
        data: UserCreate,
    ) -> UserPublic:
        username_existente = self.usuarios.get_by_username(
            data.username
        )

        if username_existente is not None:
            raise UsuarioDuplicado(
                "Ya existe un usuario con ese username"
            )

        email_existente = self.usuarios.get_by_email(
            str(data.email)
        )

        if email_existente is not None:
            raise UsuarioDuplicado(
                "Ya existe un usuario con ese email"
            )

        usuario = Usuario(
            username=data.username,
            full_name=data.full_name,
            email=str(data.email),
            hashed_password=hash_password(data.password),
            role="user",
            disabled=False,
        )

        try:
            usuario = self.usuarios.add(usuario)
            self.session.commit()
            self.session.refresh(usuario)
        except Exception:
            self.session.rollback()
            raise

        return UserPublic.model_validate(usuario)

    def obtener_por_id(
        self,
        usuario_id: int,
    ) -> Usuario:
        usuario = self.usuarios.get_by_id(usuario_id)

        if usuario is None:
            raise UsuarioNoEncontrado(
                f"Usuario {usuario_id} no encontrado"
            )

        return usuario

    def obtener_por_username(
        self,
        username: str,
    ) -> Usuario | None:
        return self.usuarios.get_by_username(username)

    def listar(
        self,
    ) -> list[UserPublic]:
        usuarios = self.usuarios.get_all()

        return [
            UserPublic.model_validate(usuario)
            for usuario in usuarios
        ]

    def activar(
        self,
        usuario_id: int,
    ) -> UserPublic:
        usuario = self.obtener_por_id(usuario_id)

        usuario.disabled = False

        try:
            self.session.add(usuario)
            self.session.commit()
            self.session.refresh(usuario)
        except Exception:
            self.session.rollback()
            raise

        return UserPublic.model_validate(usuario)

    def desactivar(
        self,
        usuario_id: int,
        current_user_id: int,
    ) -> UserPublic:
        if usuario_id == current_user_id:
            raise AutoDesactivacionNoPermitida(
                "El administrador no puede desactivarse a sí mismo"
            )

        usuario = self.obtener_por_id(usuario_id)

        usuario.disabled = True

        try:
            self.session.add(usuario)
            self.session.commit()
            self.session.refresh(usuario)
        except Exception:
            self.session.rollback()
            raise

        return UserPublic.model_validate(usuario)