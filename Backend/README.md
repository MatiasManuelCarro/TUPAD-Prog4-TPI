# TP9 - Frontend

Frontend desarrollado por **Matias Manuel Carro** con React y TypeScript para el Trabajo Práctico de la Unidad 9 de Programación IV.

La aplicación consume el backend del Food Store e incorpora autenticación, manejo de sesión, autorización por roles y protección de rutas.

## Funcionalidades

- Registro de usuarios.
- Inicio y cierre de sesión.
- Persistencia de los datos del usuario con Zustand.
- Autenticación mediante cookie HttpOnly.
- Protección de rutas según sesión y rol.
- Roles `admin` y `user`.
- Listado de categorías y productos.
- Visualización de las categorías asociadas a cada producto.
- CRUD de categorías para administradores.
- CRUD de productos para administradores.
- Administración de usuarios.
- Activación y desactivación de usuarios.
- Manejo global de sesiones no válidas mediante Axios.

## Roles

### Usuario

El rol `user` puede:

- Consultar categorías.
- Consultar productos.
- Ver las categorías asociadas a los productos.

No dispone de acciones para crear, editar o eliminar elementos del catálogo.

### Administrador

El rol `admin` puede:

- Consultar categorías y productos.
- Crear, editar y eliminar categorías.
- Crear, editar y eliminar productos.
- Acceder a la administración de usuarios.
- Activar y desactivar usuarios.

## Rutas

| Ruta            | Acceso              |
| --------------- | ------------------- |
| `/login`        | Pública             |
| `/register`     | Pública             |
| `/unauthorized` | Pública             |
| `/categories`   | Usuario autenticado |
| `/products`     | Usuario autenticado |
| `/admin/users`  | Solo administrador  |

Las rutas protegidas utilizan el componente `ProtectedRoute`.

## Autenticación

La autenticación utiliza JWT almacenado por el backend en una cookie HttpOnly.

El frontend no accede directamente al token.

La sesión se gestiona mediante Zustand con `useAuthStore`, que mantiene:

- Usuario autenticado.
- Estado de carga.
- Inicio de sesión.
- Cierre de sesión.
- Comprobación de sesión.

Al iniciar la aplicación se consulta `/api/v1/auth/me` para comprobar si existe una sesión válida.

## Axios

Las peticiones HTTP utilizan una instancia común de Axios:

```text
src/api/axiosInstance.ts
```

La instancia está configurada con:

- URL base del backend.
- `withCredentials: true`.
- Interceptor de respuestas para errores `401`.

Esto permite que el navegador envíe automáticamente la cookie de autenticación.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Zustand
- React Router
- TanStack Query
- TanStack Form
- TanStack Table

## Estructura principal

```text
src/
├── api/
│   └── axiosInstance.ts
├── components/
│   ├── categorias/
│   ├── productos/
│   ├── ui/
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── lib/
│   └── queryClient.ts
├── pages/
│   ├── AdminUsersPage.tsx
│   ├── CategoriasPage.tsx
│   ├── LoginPage.tsx
│   ├── ProductsPage.tsx
│   ├── RegisterPage.tsx
│   └── UnauthorizedPage.tsx
├── services/
│   ├── categoria.ts
│   ├── productos.ts
│   └── usuarios.ts
├── store/
│   └── authStore.ts
├── types/
│   ├── auth.types.ts
│   ├── categoria.ts
│   └── producto.ts
├── App.tsx
└── main.tsx
```

## Requisitos

- Node.js
- pnpm
- Backend del TP9 en ejecución

## Instalación

Instalar las dependencias:

```bash
pnpm install
```

## Ejecución

Iniciar el frontend:

```bash
pnpm dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

El backend debe estar disponible en:

```text
http://localhost:8000
```

## Build

Para comprobar la compilación del proyecto:

```bash
pnpm build
```

## Pruebas realizadas

Se verificó el funcionamiento de:

- Registro e inicio de sesión.
- Inicio de sesión como `user` y `admin`.
- Persistencia de sesión al recargar la página.
- Cierre de sesión.
- Protección de rutas.
- Restricción de `/admin/users` según rol.
- Interfaz condicional según rol.
- CRUD de categorías.
- CRUD de productos.
- Visualización de categorías asociadas a productos.
- Activación y desactivación de usuarios.
- Bloqueo del inicio de sesión de usuarios desactivados.
- Reactivación de usuarios.
