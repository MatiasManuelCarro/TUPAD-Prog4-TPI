from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_all_tables
from app.modules.auth.router import router as auth_router
from app.modules.categorias.router import router as categorias_router
from app.modules.productos.router import router as productos_router
from app.modules.usuarios.router import router as usuarios_router

# Importar los modelos para registrar las tablas y relaciones
# en SQLModel.metadata antes de create_all_tables().
from app.modules.categorias.models import Categoria
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario


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