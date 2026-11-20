# Food Store - Frontend

Frontend del Trabajo Práctico Integrador **Food Store**,  desarrollado por **Matias Manuel Carro** con React y TypeScript.

La aplicación incluye el flujo de cliente y el panel de administración, consumiendo la API REST del backend mediante Axios.

## Tecnologías

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

## Módulos principales

El frontend está organizado por funcionalidades dentro de `src/features/`.

### Auth

Gestión de autenticación y sesión.

Incluye:

- Inicio de sesión.
- Registro de usuarios.
- Consulta de sesión.
- Cierre de sesión.
- Control de roles `user` y `admin`.

### Products

Gestión de productos y catálogo.

Incluye:

- Catálogo público.
- Búsqueda y filtros.
- Paginación.
- Tarjetas de productos.
- Administración de productos.
- Gestión de stock y disponibilidad.

### Categories

Gestión de categorías.

Incluye:

- Listado de categorías.
- Creación.
- Edición.
- Eliminación.
- Tabla administrativa con paginación.

### Pedidos

Gestión del flujo de compra y pedidos.

Incluye:

- Carrito.
- Checkout.
- Creación de pedidos.
- Consulta de pedidos del usuario.
- Cancelación de pedidos.
- Administración de pedidos.
- Cambio de estados.
- Resumen administrativo.

### Usuarios

Administración de usuarios.

Incluye:

- Listado de usuarios.
- Activación.
- Desactivación.

## Componentes compartidos

Los elementos reutilizables se encuentran principalmente en `src/shared/`.

Incluyen componentes como:

- `Button`
- `Input`
- `Card`
- `Modal`
- `BadgeEstado`
- `Paginacion`
- `Skeleton`
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `Toast`

También se utiliza `MainLayout` como estructura compartida de la aplicación.

## Estado y acceso a datos

La aplicación utiliza:

- **TanStack Query** para consultas, mutaciones, caché e invalidaciones de datos del servidor.
- **Zustand** para estado global del cliente, como autenticación, carrito, tema y notificaciones.
- **Axios** para la comunicación con la API.
- **TanStack Form** para los formularios.
- **TanStack Table** para las tablas administrativas.

La sesión utiliza una cookie HttpOnly administrada por el backend. El frontend no almacena el JWT.

## Rutas principales

### Públicas

- `/`
- `/login`
- `/register`
- `/carrito`
- `/unauthorized`

### Usuario autenticado

- `/checkout`
- `/mis-pedidos`

### Administrador

- `/admin/resumen`
- `/admin/categorias`
- `/admin/productos`
- `/admin/pedidos`
- `/admin/usuarios`

## Configuración

Crear un archivo `.env` a partir de `.env.example`.

```env
VITE_API_URL=http://localhost:8000/api/v1
```