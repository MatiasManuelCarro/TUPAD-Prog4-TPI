from app.core.database import engine
from app.core.security import hash_password
from app.modules.categorias.model import Categoria
from app.modules.productos.model import (
    Producto,
    ProductoCategoria,
)
from app.modules.usuarios.model import (
    Rol,
    Usuario,
    UsuarioRol,
)
from sqlmodel import Session, select


def seed():
    with Session(engine) as session:

        # =====================================================
        # ROLES
        # =====================================================

        rol_admin = session.exec(
            select(Rol).where(
                Rol.nombre == "admin"
            )
        ).first()

        if rol_admin is None:
            rol_admin = Rol(
                nombre="admin",
                descripcion="Administrador del sistema",
            )

            session.add(rol_admin)
            session.flush()

        rol_user = session.exec(
            select(Rol).where(
                Rol.nombre == "user"
            )
        ).first()

        if rol_user is None:
            rol_user = Rol(
                nombre="user",
                descripcion="Usuario del sistema",
            )

            session.add(rol_user)
            session.flush()

        # =====================================================
        # USUARIO ADMINISTRADOR
        # =====================================================

        admin = session.exec(
            select(Usuario).where(
                Usuario.email == "admin@tp9.com"
            )
        ).first()

        if admin is None:
            admin = Usuario(
                nombre="Administrador",
                apellido="TP9",
                email="admin@tp9.com",
                celular=None,
                password_hash=hash_password(
                    "Admin1234"
                ),
            )

            session.add(admin)
            session.flush()

        relacion_admin = session.exec(
            select(UsuarioRol)
            .where(
                UsuarioRol.usuario_id == admin.id
            )
            .where(
                UsuarioRol.rol_id == rol_admin.id
            )
        ).first()

        if relacion_admin is None:
            session.add(
                UsuarioRol(
                    usuario_id=admin.id,
                    rol_id=rol_admin.id,
                    asignado_por_id=None,
                    expires_at=None,
                )
            )

        # =====================================================
        # USUARIO COMÚN
        # =====================================================

        user = session.exec(
            select(Usuario).where(
                Usuario.email == "user@tp9.com"
            )
        ).first()

        if user is None:
            user = Usuario(
                nombre="Usuario",
                apellido="TP9",
                email="user@tp9.com",
                celular=None,
                password_hash=hash_password(
                    "User1234"
                ),
            )

            session.add(user)
            session.flush()

        relacion_user = session.exec(
            select(UsuarioRol)
            .where(
                UsuarioRol.usuario_id == user.id
            )
            .where(
                UsuarioRol.rol_id == rol_user.id
            )
        ).first()

        if relacion_user is None:
            session.add(
                UsuarioRol(
                    usuario_id=user.id,
                    rol_id=rol_user.id,
                    asignado_por_id=None,
                    expires_at=None,
                )
            )

        # =====================================================
        # CATEGORÍAS
        # =====================================================

        categorias_iniciales = [
            {
                "nombre": "Hamburguesas",
                "descripcion": "Hamburguesas smash",
            },
            {
                "nombre": "Pizzas",
                "descripcion": (
                    "Pizzas al molde y a la piedra"
                ),
            },
            {
                "nombre": "Empanadas",
                "descripcion": (
                    "Empanadas al horno o fritas"
                ),
            },
            {
                "nombre": "Bebidas",
                "descripcion": "Bebidas sin alcohol",
            },
        ]

        categorias: dict[str, Categoria] = {}

        for datos_categoria in categorias_iniciales:
            categoria = session.exec(
                select(Categoria).where(
                    Categoria.nombre
                    == datos_categoria["nombre"]
                )
            ).first()

            if categoria is None:
                categoria = Categoria(
                    nombre=datos_categoria["nombre"],
                    descripcion=(
                        datos_categoria["descripcion"]
                    ),
                )

                session.add(categoria)
                session.flush()

            categorias[categoria.nombre] = categoria

        # =====================================================
        # PRODUCTOS
        # =====================================================

        productos_iniciales = [
            {
                "nombre": "Hamburguesa",
                "descripcion": (
                    "Hamburguesas. Opcionales: "
                    "queso, tomate o lechuga"
                ),
                "precio_base": 15000,
                "disponible": True,
            },
            {
                "nombre": "Pizza",
                "descripcion": (
                    "Pizzas al molde o a la piedra"
                ),
                "precio_base": 22000,
                "disponible": True,
            },
            {
                "nombre": "Empanada de JyQ",
                "descripcion": (
                    "Con mucho jamón y queso"
                ),
                "precio_base": 2000,
                "disponible": True,
            },
            {
                "nombre": "Empanada de Carne",
                "descripcion": "Carne cortada a cuchillo",
                "precio_base": 2500,
                "disponible": True,
            },
            {
                "nombre": "Empanada de Humita",
                "descripcion": "Con mucho choclo",
                "precio_base": 1500,
                "disponible": True,
            },
            {
                "nombre": "Gaseosa",
                "descripcion": "Gaseosa bien helada",
                "precio_base": 3000,
                "disponible": True,
            },
        ]

        productos: dict[str, Producto] = {}

        for datos_producto in productos_iniciales:
            producto = session.exec(
                select(Producto).where(
                    Producto.nombre
                    == datos_producto["nombre"]
                )
            ).first()

            if producto is None:
                producto = Producto(
                    nombre=datos_producto["nombre"],
                    descripcion=(
                        datos_producto["descripcion"]
                    ),
                    precio_base=(
                        datos_producto["precio_base"]
                    ),
                    imagenes_url=None,
                    disponible=(
                        datos_producto["disponible"]
                    ),
                )

                session.add(producto)
                session.flush()

            productos[producto.nombre] = producto

        # =====================================================
        # RELACIONES PRODUCTO - CATEGORÍA
        # =====================================================

        relaciones_iniciales = [
            {
                "producto": "Hamburguesa",
                "categoria": "Hamburguesas",
                "es_principal": True,
            },
            {
                "producto": "Pizza",
                "categoria": "Pizzas",
                "es_principal": True,
            },
            {
                "producto": "Empanada de JyQ",
                "categoria": "Empanadas",
                "es_principal": True,
            },
            {
                "producto": "Empanada de Carne",
                "categoria": "Empanadas",
                "es_principal": True,
            },
            {
                "producto": "Empanada de Humita",
                "categoria": "Empanadas",
                "es_principal": True,
            },
            {
                "producto": "Gaseosa",
                "categoria": "Bebidas",
                "es_principal": True,
            },
        ]

        for datos_relacion in relaciones_iniciales:
            producto = productos[
                datos_relacion["producto"]
            ]

            categoria = categorias[
                datos_relacion["categoria"]
            ]

            relacion = session.exec(
                select(ProductoCategoria)
                .where(
                    ProductoCategoria.producto_id
                    == producto.id
                )
                .where(
                    ProductoCategoria.categoria_id
                    == categoria.id
                )
            ).first()

            if relacion is None:
                session.add(
                    ProductoCategoria(
                        producto_id=producto.id,
                        categoria_id=categoria.id,
                        es_principal=(
                            datos_relacion[
                                "es_principal"
                            ]
                        ),
                    )
                )

        # =====================================================
        # COMMIT FINAL
        # =====================================================

        session.commit()

    print(
        "Datos iniciales de TP9 cargados correctamente."
    )


if __name__ == "__main__":
    seed()