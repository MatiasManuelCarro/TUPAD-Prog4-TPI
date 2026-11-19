from app.core.database import engine
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario
from sqlmodel import Session, select


def seed() -> None:
    with Session(engine) as session:
        # =====================================================
        # ADMIN
        # =====================================================
        admin = session.exec(select(Usuario).where(Usuario.username == "admin")).first()

        if admin is None:
            admin = Usuario(
                username="admin",
                full_name="Administrador",
                email="admin@foodstore.com",
                hashed_password=hash_password("Admin1234!"),
                role="admin",
                disabled=False,
            )

            session.add(admin)

        # =====================================================
        # CATEGORÍAS
        # =====================================================
        categorias_iniciales = [
            {
                "nombre": "Hamburguesas",
                "descripcion": "Hamburguesas y combos",
            },
            {
                "nombre": "Pizzas",
                "descripcion": "Pizzas al molde y a la piedra",
            },
            {
                "nombre": "Empanadas",
                "descripcion": "Empanadas de diferentes sabores",
            },
            {
                "nombre": "Bebidas",
                "descripcion": "Bebidas sin alcohol",
            },
        ]

        categorias: dict[str, Categoria] = {}

        for datos in categorias_iniciales:
            categoria = session.exec(
                select(Categoria).where(Categoria.nombre == datos["nombre"])
            ).first()

            if categoria is None:
                categoria = Categoria(
                    nombre=datos["nombre"],
                    descripcion=datos["descripcion"],
                    activo=True,
                )

                session.add(categoria)
                session.flush()

            categorias[categoria.nombre] = categoria

        # =====================================================
        # PRODUCTOS
        # =====================================================
        productos_iniciales = [
            {
                "nombre": "Hamburguesa Clásica",
                "descripcion": "Hamburguesa clásica con queso",
                "precio_base": 8500.0,
                "imagen_url": "https://images.pexels.com/photos/20525708/pexels-photo-20525708.jpeg",
                "stock": 20,
                "disponible": True,
                "categoria": "Hamburguesas",
            },
            {
                "nombre": "Hamburguesa Doble",
                "descripcion": "Hamburguesa doble con queso",
                "precio_base": 10500.0,
                "imagen_url": "https://images.pexels.com/photos/37296924/pexels-photo-37296924.jpeg",
                "stock": 15,
                "disponible": True,
                "categoria": "Hamburguesas",
            },
            {
                "nombre": "Pizza Muzzarella",
                "descripcion": "Pizza de muzzarella",
                "precio_base": 12000.0,
                "imagen_url": "https://images.pexels.com/photos/37690810/pexels-photo-37690810.jpeg",
                "stock": 15,
                "disponible": True,
                "categoria": "Pizzas",
            },
            {
                "nombre": "Pizza Napolitana",
                "descripcion": "Pizza con tomate y ajo",
                "precio_base": 13500.0,
                "imagen_url": "https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg",
                "stock": 12,
                "disponible": True,
                "categoria": "Pizzas",
            },
            {
                "nombre": "Empanada de Carne",
                "descripcion": "Empanada de carne",
                "precio_base": 2500.0,
                "imagen_url": "https://images.pexels.com/photos/37327430/pexels-photo-37327430.jpeg",
                "stock": 30,
                "disponible": True,
                "categoria": "Empanadas",
            },
            {
                "nombre": "Empanada de Jamón y Queso",
                "descripcion": "Empanada de jamón y queso",
                "precio_base": 2500.0,
                "imagen_url": "https://images.pexels.com/photos/36905236/pexels-photo-36905236.jpeg",
                "stock": 30,
                "disponible": True,
                "categoria": "Empanadas",
            },
            {
                "nombre": "Gaseosa",
                "descripcion": "Gaseosa individual",
                "precio_base": 3000.0,
                "imagen_url": "https://images.pexels.com/photos/12936159/pexels-photo-12936159.jpeg",
                "stock": 25,
                "disponible": True,
                "categoria": "Bebidas",
            },
            {
                "nombre": "Agua Mineral",
                "descripcion": "Agua mineral individual",
                "precio_base": 2000.0,
                "imagen_url": "https://images.pexels.com/photos/7765745/pexels-photo-7765745.jpeg",
                "stock": 25,
                "disponible": True,
                "categoria": "Bebidas",
            },
        ]

        for datos in productos_iniciales:
            producto = session.exec(
                select(Producto).where(Producto.nombre == datos["nombre"])
            ).first()

            if producto is not None:
                continue

            categoria = categorias[datos["categoria"]]

            producto = Producto(
                categoria_id=categoria.id,
                nombre=datos["nombre"],
                descripcion=datos["descripcion"],
                precio_base=datos["precio_base"],
                imagen_url=datos["imagen_url"],
                stock=datos["stock"],
                disponible=datos["disponible"],
                activo=True,
            )

            session.add(producto)

        session.commit()

    print("Datos iniciales de Food Store cargados correctamente.")


if __name__ == "__main__":
    seed()
