from app.core.security import verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository
from sqlmodel import Session


class CredencialesInvalidas(Exception):
    pass


class UsuarioDesactivado(Exception):
    pass


class AuthService:
    def __init__(
        self,
        session: Session,
    ):
        self.usuarios = UsuarioRepository(session)

    def autenticar(
        self,
        username: str,
        password: str,
    ) -> Usuario:
        usuario = self.usuarios.get_by_username(username)

        if usuario is None:
            raise CredencialesInvalidas(
                "Usuario o contraseña incorrectos"
            )

        if usuario.disabled:
            raise UsuarioDesactivado(
                "Cuenta de usuario desactivada"
            )

        if not verify_password(
            password,
            usuario.hashed_password,
        ):
            raise CredencialesInvalidas(
                "Usuario o contraseña incorrectos"
            )

        return usuario