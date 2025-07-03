# Sistema de Biblioteca CMM

Un sistema moderno de gestión de biblioteca construido con Next.js 15, TypeScript y Prisma.

## 🚀 Tecnologías

- **Frontend:**
  - Next.js 15.3.4 (con App Router)
  - React 19
  - TypeScript
  - Tailwind CSS
  - Zustand (Gestión de Estado)
  - SweetAlert2 (Notificaciones)
  - React Hook Form (Gestión de Formularios)

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - Base de datos PostgreSQL
  - NextAuth.js v5 (Autenticación)
  - Zod (Validación de Datos)
  - bcryptjs (Encriptación de Contraseñas)

## 📦 Estructura del Proyecto

```
├── prisma/                  # Esquema y migraciones de la base de datos
├── public/                  # Archivos estáticos
└── src/
    ├── actions/            # Acciones del servidor para autenticación
    ├── app/                # Páginas del App Router de Next.js
    ├── components/         # Componentes UI reutilizables
    ├── constants/          # Constantes de la aplicación
    ├── interfaces/         # Interfaces de TypeScript
    ├── lib/                # Bibliotecas de utilidades
    ├── seed/               # Datos semilla para la base de datos
    ├── store/             # Gestión de estado con Zustand
    ├── styles/            # Estilos globales
    └── utils/             # Funciones de utilidad
```

## 🔐 Autenticación

El sistema utiliza NextAuth.js v5 con las siguientes características:
- Autenticación por correo electrónico/contraseña
- Estrategia de sesión JWT
- Manejo seguro de cookies en producción
- Acceso basado en roles (Administrador/Usuario)
- Duración de sesión de 30 días

## 💾 Esquema de la Base de Datos

Actualmente implementa:

### Modelo de Usuario
- `id`: UUID (Clave Primaria)
- `name`: String (Nombre)
- `email`: String (Único)
- `phone`: String (Único)
- `password`: String (Encriptada)
- `city`: String (Ciudad)
- `role`: Enum (admin/user)

## 🎯 Características

1. **Sistema de Autenticación**
   - Funcionalidad de inicio/cierre de sesión
   - Rutas protegidas
   - Control de acceso basado en roles

2. **Interfaz de Usuario**
   - Navegación lateral responsiva
   - Menú superior con controles de usuario
   - Estados de carga y spinners
   - Componentes UI modernos

3. **Gestión de Estado**
   - Almacenes Zustand para:
     - Manejo de cierre de sesión
     - Gestión del estado del menú

## 🚀 Comenzando

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` con:
   ```
   DATABASE_URL="tu-url-de-postgresql"
   AUTH_SECRET="tu-secreto-de-autenticacion"
   ```

4. Configurar la base de datos:
   ```bash
   npx prisma db push
   npm run seed
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🛠️ Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con Turbopack
- `npm run build`: Construye para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta ESLint
- `npm run seed`: Puebla la base de datos

## 🔒 Características de Seguridad

- Encriptación de contraseñas con bcryptjs
- Validación de entrada con Zod
- Manejo seguro de sesiones
- Rutas API protegidas
- Consultas a base de datos tipo-seguras con Prisma

## 🎨 Componentes UI

El proyecto incluye varios componentes UI reutilizables:
- Barra lateral de navegación
- Menú superior con controles de usuario
- Indicadores de carga
- Campos de entrada
- Componente de título
- Barra de menú personalizada
- Estados de carga para gestión de sesiones

## 📱 Diseño Responsivo

La aplicación está construida con un enfoque de diseño responsivo utilizando Tailwind CSS y componentes modernos de UI de Shadcn.