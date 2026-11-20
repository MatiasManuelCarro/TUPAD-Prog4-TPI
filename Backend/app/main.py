from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Los modelos Categoria, Producto, Usuario, Pedido y DetallePedido estan
# para registrar todas las tablas y relaciones en SQLModel.metadata
# antes de ejecutar create_all_tables().
# El editor los marque como no utilizados pero estos imports son intencionales.
from app.core.config import settings
from app.core.database import create_all_tables
from app.modules.auth.router import router as auth_router
from app.modules.categorias.models import Categoria  # noqa: F401
from app.modules.categorias.router import router as categorias_router
from app.modules.health.router import router as health_router
from app.modules.pedidos.models import DetallePedido, Pedido  # noqa: F401
from app.modules.pedidos.router import router as pedidos_router
from app.modules.productos.models import Producto  # noqa: F401
from app.modules.productos.router import router as productos_router
from app.modules.usuarios.models import Usuario  # noqa: F401
from app.modules.usuarios.router import router as usuarios_router

app = FastAPI(
    title="Food Store API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_ORIGIN,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


create_all_tables()


app.include_router(
    auth_router,
    prefix="/api/v1",
)
app.include_router(
    usuarios_router,
    prefix="/api/v1",
)
app.include_router(
    categorias_router,
    prefix="/api/v1",
)
app.include_router(
    productos_router,
    prefix="/api/v1",
)
app.include_router(
    pedidos_router,
    prefix="/api/v1",
)
app.include_router(
    health_router,
    prefix="/api/v1",
)
