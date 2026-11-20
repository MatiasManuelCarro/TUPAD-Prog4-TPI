# Food Store

## Realizado por Matias Manuel Carro 

Trabajo Práctico Integrador de **Programación 4** de la **Tecnicatura Universitaria en Programación a Distancia.**

Food Store es una aplicación web para la gestión de pedidos de un negocio de comidas. Permite a los clientes registrarse, consultar el catálogo, gestionar un carrito, realizar pedidos y consultar su estado. También dispone de un panel de administración para gestionar categorías, productos, stock, pedidos y usuarios.

---

# Repositorio

Repositorio público:

```text
https://github.com/MatiasManuelCarro/TUPAD-Prog4-TPI
```

---

# Video de demostración

Video de demostración:

```text

```

---


## Tecnologías utilizadas

### Backend

- Python 3.13
- FastAPI
- SQLModel
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT
- Passlib + bcrypt
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- TanStack Query
- TanStack Form
- TanStack Table
- Zustand
- React Router

## Estructura general

```text
TUPAD-Prog4-TPI/
├── Backend/
├── Frontend/
└── README.md
```

El backend y el frontend son proyectos independientes que se comunican mediante HTTP.

La API utiliza el prefijo:

```text
/api/v1
```

La autenticación utiliza JWT almacenado en una cookie HttpOnly.

---

# Requisitos

Para ejecutar el proyecto se necesita:

- Python 3.11, 3.12 o 3.13
- PostgreSQL 15 o superior
- Node.js 20.19 o superior
- pnpm 9 o superior

---

# Backend

## 1. Crear la base de datos

Crear en PostgreSQL una base de datos llamada:

```text
foodstore_db
```

Por ejemplo:

```sql
CREATE DATABASE foodstore_db;
```

## 2. Acceder al backend

Desde la raíz del proyecto:

```powershell
cd Backend
```

## 3. Crear el entorno virtual

En Windows:

```powershell
py -3.13 -m venv .venv
```

Activarlo:

```powershell
.\.venv\Scripts\Activate.ps1
```

Comprobar la versión:

```powershell
python --version
```

## 4. Instalar dependencias

```powershell
python -m pip install -r requirements.txt
```

## 5. Configurar variables de entorno

Copiar:

```text
.env.example
```

como:

```text
.env
```

Variables utilizadas:

```env
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/foodstore_db

SECRET_KEY=cambiar-esta-clave-de-al-menos-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

FRONTEND_ORIGIN=http://localhost:5173
```

Modificar `DATABASE_URL` de acuerdo con el usuario y contraseña de PostgreSQL configurados en el equipo.

## 6. Crear las tablas

La aplicación crea las tablas definidas con SQLModel al iniciar.

Ejecutar:

```powershell
python -m uvicorn app.main:app --reload
```

Una vez creadas las tablas, detener el servidor con:

```text
Ctrl + C
```

## 7. Cargar los datos iniciales

Desde la raiz de backend y con el entorno virtual activado.
Ejecutar:

```powershell
python -m app.db.seed
```

El seed es idempotente y carga:

- Usuario administrador
- Categorías iniciales
- Productos iniciales con stock

### Usuario administrador

```text
Usuario: admin
Contraseña: Admin1234!
```

Estas credenciales son solo para prueba durante el desarrollo del proyecto.


## 8. Ejecutar el backend

```powershell
python -m uvicorn app.main:app --reload
```

La API estará disponible en:

```text
http://127.0.0.1:8000
```

### Documentación Swagger

```text
http://127.0.0.1:8000/docs
```

### Documentación ReDoc

```text
http://127.0.0.1:8000/redoc
```

---

# Frontend

## 1. Acceder al frontend

Desde la raíz del proyecto:

```powershell
cd Frontend
```

## 2. Instalar dependencias

```powershell
pnpm install
```

## 3. Configurar variables de entorno

Copiar:

```text
.env.example
```

como:

```text
.env
```

Configurar:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 4. Comprobar el build

```powershell
pnpm build
```

## 5. Ejecutar el frontend

```powershell
pnpm dev
```

Por defecto, la aplicación estará disponible en:

```text
http://localhost:5173
```

---

# Funcionalidades

## Cliente

Un usuario con rol `user` puede:

- Registrarse e iniciar sesión.
- Consultar el catálogo de productos.
- Buscar y filtrar productos.
- Gestionar un carrito.
- Confirmar pedidos.
- Elegir forma de pago.
- Indicar una dirección de entrega.
- Consultar sus propios pedidos.
- Consultar el detalle de sus pedidos.
- Cancelar sus pedidos mientras estén en estado `PENDIENTE`.

## Administrador

Un usuario con rol `admin` puede:

- Gestionar categorías.
- Gestionar productos.
- Modificar stock y disponibilidad.
- Consultar todos los pedidos.
- Filtrar pedidos por estado.
- Avanzar o cancelar pedidos según su estado.
- Consultar el resumen del negocio.
- Listar usuarios.
- Activar y desactivar usuarios.

---

# Estados de los pedidos

Los pedidos utilizan los siguientes estados:

```text
PENDIENTE
EN_PREPARACION
ENTREGADO
CANCELADO
```

Transiciones permitidas:

```text
PENDIENTE
├── EN_PREPARACION
└── CANCELADO

EN_PREPARACION
├── ENTREGADO
└── CANCELADO

ENTREGADO
└── Estado terminal

CANCELADO
└── Estado terminal
```

Al crear un pedido, el stock de los productos se descuenta dentro de la misma transacción.

Cuando un pedido es cancelado, el stock de sus productos se restituye.

El nombre y el precio de cada producto se copian al detalle del pedido para conservar los datos originales de la compra.

---

# API principal

Todos los endpoints utilizan el prefijo:

```text
/api/v1
```

## Autenticación

```text
POST /auth/register
POST /auth/token
POST /auth/logout
GET  /auth/me
```

## Usuarios

```text
GET  /admin/usuarios
POST /admin/usuarios/{usuario_id}/activar
POST /admin/usuarios/{usuario_id}/desactivar
```

## Categorías

```text
GET    /categorias
POST   /categorias
GET    /categorias/{categoria_id}
PUT    /categorias/{categoria_id}
DELETE /categorias/{categoria_id}
```

## Productos

```text
GET    /productos
POST   /productos
GET    /productos/{producto_id}
PUT    /productos/{producto_id}
DELETE /productos/{producto_id}
PATCH  /productos/{producto_id}/stock
```

## Pedidos

```text
GET   /pedidos
POST  /pedidos
GET   /pedidos/resumen
GET   /pedidos/{pedido_id}
PATCH /pedidos/{pedido_id}/estado
PATCH /pedidos/{pedido_id}/cancelar
```

---

# Reglas principales de pedidos

- Un pedido debe contener al menos un producto.
- Un mismo producto no puede repetirse dentro del pedido.
- Solo pueden comprarse productos activos y disponibles.
- Debe existir stock suficiente.
- El stock se descuenta al realizar el pedido.
- El pedido se crea inicialmente en estado `PENDIENTE`.
- Las transiciones de estado están controladas por una máquina de estados.
- La cancelación restituye el stock.
- Un cliente solo puede consultar y cancelar sus propios pedidos.
- El administrador puede consultar todos los pedidos.
- El total y las líneas de un pedido no se modifican después de su creación.
- Las formas de pago disponibles son `EFECTIVO` y `TRANSFERENCIA`.

---

# Health checks

La API dispone además de endpoints de comprobación:

```text
GET /api/v1/health
GET /api/v1/health/db
```

El primero comprueba que la aplicación está disponible y el segundo comprueba la conexión con la base de datos.

---


# Entrega

El archivo ZIP de entrega no debe incluir archivos generados ni configuraciones locales.

Se excluyen:

```text
.env
.venv/
node_modules/
__pycache__/
.pyc
```

Los archivos de ejemplo que sí deben conservarse son:

```text
Backend/.env.example
Frontend/.env.example
```

---

# Autor

Matias Manuel Carro

Tecnicatura Universitaria en Programación a Distancia  
Programación 4
