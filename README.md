# Sistema de Biblioteca CMM

Un sistema moderno y completo de gestión de biblioteca construido con Next.js 15, TypeScript y Prisma. Diseñado para gestionar inventarios, ventas, pedidos y usuarios en múltiples sedes.

## 🚀 Tecnologías

- **Frontend:**
  - Next.js 15.3.4 (con App Router)
  - React 19
  - TypeScript
  - Tailwind CSS
  - Zustand (Gestión de Estado)
  - SweetAlert2 (Notificaciones y Confirmaciones)
  - React Hook Form (Gestión de Formularios)
  - Sonner (Notificaciones Toast)
  - Lucide React (Iconografía)

- **Backend:**
  - Next.js API Routes y Server Actions
  - Prisma ORM v6.11.0
  - Base de datos PostgreSQL
  - NextAuth.js v5 (Autenticación)
  - Zod (Validación de Datos)
  - bcryptjs (Encriptación de Contraseñas)

- **UI/UX:**
  - Shadcn/UI Components
  - Radix UI Primitives
  - Next Themes (Gestión de Temas)
  - CSS Variables para Theming
  - Diseño Completamente Responsivo

## 📦 Estructura del Proyecto

```
├── prisma/                  # Esquema y migraciones de la base de datos
│   ├── schema.prisma       # Definición del modelo de datos
│   └── migrations/         # Historial de migraciones
├── public/                 # Archivos estáticos
│   ├── logo-azul.avif     # Logo de la aplicación
│   └── not-found.avif     # Imagen para páginas 404
└── src/
    ├── actions/           # Server Actions organizadas por módulo
    │   ├── auth/          # Autenticación (login, logout)
    │   ├── account/       # Gestión de cuentas de usuario
    │   ├── inventory/     # Gestión de inventarios y sedes
    │   ├── orders/        # Gestión de pedidos y órdenes
    │   ├── product/       # Gestión de productos/libros
    │   ├── sales/         # Registro de ventas
    │   ├── users/         # Administración de usuarios
    │   ├── notifications/ # Sistema de notificaciones
    │   └── warehouse/     # Gestión de almacén
    ├── app/              # Páginas del App Router
    │   ├── api/          # API Routes
    │   ├── auth/         # Páginas de autenticación
    │   └── dashboard/    # Panel de control con rutas protegidas
    ├── components/       # Componentes UI organizados por módulo
    │   ├── ui/           # Componentes base reutilizables
    │   ├── account/      # Componentes de gestión de cuenta
    │   ├── inventory/    # Componentes de inventario
    │   ├── orders/       # Componentes de pedidos
    │   ├── product/      # Componentes de productos
    │   ├── sales/        # Componentes de ventas
    │   ├── users/        # Componentes de usuarios
    │   ├── sidebar/      # Navegación lateral
    │   ├── top-menu/     # Menú superior
    │   └── warehouse/    # Componentes de almacén
    ├── constants/        # Constantes de la aplicación
    ├── interfaces/       # Interfaces de TypeScript
    ├── lib/             # Bibliotecas de utilidades
    ├── seed/            # Datos semilla para la base de datos
    ├── store/           # Gestión de estado con Zustand
    ├── styles/          # Estilos globales
    └── utils/           # Funciones de utilidad
```
## 🔐 Autenticación y Autorización

El sistema utiliza NextAuth.js v5 con las siguientes características:
- **Autenticación**: Correo electrónico/contraseña con validación robusta
- **Sesiones**: Estrategia JWT con duración configurable de 30 días
- **Roles**: Sistema de autorización basado en roles (Admin/Leader/User)
- **Seguridad**: Manejo seguro de cookies en producción
- **Rutas Protegidas**: Middleware de protección de rutas por rol
- **Gestión de Estado**: Integración con Zustand para estado de autenticación

## 💾 Esquema de la Base de Datos

### Modelos Principales

#### Usuario (User)
- `id`: UUID (Clave Primaria)
- `name`: String (Nombre completo)
- `email`: String (Único, validado)
- `phone`: String (Único, validado)
- `password`: String (Encriptada con bcrypt)
- `city`: String (Ciudad/Sede de asignación)
- `role`: Enum (admin/leader/user)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Sede
- `id`: UUID (Clave Primaria)
- `city`: String (Nombre de la ciudad)
- `leaderName`: String (Nombre del líder de sede)
- `inventory`: Relación con inventario
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Libro (Book)
- `id`: UUID (Clave Primaria)
- `name`: String (Nombre del libro)
- `category`: Enum (Categoría/Seminario)
- `inventory`: Relación con inventario
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Inventario (Inventory)
- `id`: UUID (Clave Primaria)
- `sedeId`: UUID (FK a Sede)
- `bookId`: UUID (FK a Libro)
- `stock`: Integer (Cantidad disponible)
- `minStock`: Integer (Stock mínimo)
- `maxStock`: Integer (Stock máximo)
- Índice único compuesto (sedeId, bookId)

#### Orden (Order)
- `id`: UUID (Clave Primaria)
- `origin`: UUID (Sede origen)
- `destination`: UUID (Sede destino)
- `book`: UUID (Libro solicitado)
- `quantity`: Integer (Cantidad)
- `limitDate`: DateTime (Fecha límite)
- `status`: Enum (pending/dispatched/received)
- `createdBy`: UUID (Usuario creador)
- `dispatchDate`: DateTime (Fecha de despacho)
- `receiveDate`: DateTime (Fecha de recepción)

#### Notificación (Notification)
- `id`: UUID (Clave Primaria)
- `title`: String (Título)
- `description`: String (Descripción)
- `type`: Enum (Tipo de notificación)
- `isRead`: Boolean (Leída/No leída)
- `userId`: UUID (Usuario destinatario)
- `createdAt`: DateTime

## 🎯 Características Principales

### 1. **Sistema de Autenticación Completo**
   - Registro e inicio de sesión seguro
   - Recuperación de contraseñas
   - Gestión de sesiones persistentes
   - Control de acceso basado en roles
   - Middleware de protección de rutas

### 2. **Gestión de Inventarios Multi-Sede**
   - Inventario distribuido por sedes
   - Niveles de stock configurables (mín/máx)
   - Alertas automáticas de stock bajo
   - Búsqueda y filtrado avanzado
   - Edición masiva de inventarios

### 3. **Sistema de Pedidos**
   - Creación de órdenes entre sedes
   - Estados de seguimiento (pendiente/despachado/recibido)
   - Fechas límite y alertas
   - Historial completo de transacciones
   - Validación automática de stock

### 4. **Registro de Ventas**
   - Registro de ventas por sede
   - Descuento automático del inventario
   - Confirmaciones de seguridad
   - Validación de stock disponible
   - Reportes de ventas

### 5. **Sistema de Notificaciones**
   - Notificaciones en tiempo real
   - Marcado como leído/no leído
   - Filtrado por tipo y estado
   - Eliminación individual y masiva
   - Notificaciones push

### 6. **Administración de Usuarios**
   - CRUD completo de usuarios
   - Asignación de roles
   - Gestión de perfiles
   - Cambio de contraseñas
   - Filtrado y búsqueda

### 7. **Gestión de Productos**
   - Catálogo de libros por categorías
   - Edición de nombres y categorías
   - Asociación con inventarios
   - Búsqueda y filtrado

## 🎨 Componentes UI Modulares

El sistema incluye una biblioteca completa de componentes UI reutilizables basados en Shadcn/UI:

### Componentes Base

#### CustomTooltip
Wrapper para tooltips con configuración simplificada.
```typescript
interface Props {
  children: React.ReactNode;  // Elemento que activa el tooltip
  text: string;              // Texto a mostrar
  withSpan?: boolean;        // Envolver en span (default: false)
}
```

#### CustomDialog
Modal/diálogo personalizable con múltiples opciones de tamaño.
```typescript
interface Props {
  title: string;                    // Título del diálogo
  children: React.ReactNode;        // Contenido principal
  trigger: React.ReactNode;         // Elemento que abre el diálogo
  description?: string;             // Descripción opcional
  footer?: React.ReactNode;         // Footer personalizado
  open?: boolean;                   // Control externo de apertura
  onOpenChange?: (open: boolean) => void; // Callback de cambio de estado
  size?: "default" | "lg" | "xl";   // Tamaño del diálogo
  maxHeight?: 100 | 90 | 80 | 70 | 60 | 50; // Altura máxima en vh
}
```

#### LoadingSpinner
Indicador de carga configurable.
```typescript
interface Props {
  size?: number;        // Tamaño en píxeles (default: 20)
  color?: string;       // Color personalizado
}
```

#### Status
Componente para mostrar estados con colores.
```typescript
interface Props {
  status: "pending" | "dispatched" | "received" | "low" | "normal" | "high";
  text?: string;        // Texto personalizado
}
```

#### Title
Título de página con estilos consistentes.
```typescript
interface Props {
  title: string;        // Texto del título
  className?: string;   // Clases CSS adicionales
}
```

#### DatePicker
Selector de fechas con calendario.
```typescript
interface Props {
  selected?: Date;                    // Fecha seleccionada
  onSelect: (date: Date) => void;     // Callback de selección
  placeholder?: string;               // Placeholder del input
  disabled?: boolean;                 // Estado deshabilitado
}
```

#### Empty
Componente para estados vacíos.
```typescript
interface Props {
  message?: string;     // Mensaje personalizado
  icon?: React.ReactNode; // Icono personalizado
}
```

### Componentes de Formulario

- **Input**: Campo de entrada con validación
- **Button**: Botones con variantes de estilo
- **Select**: Selectors personalizados
- **Calendar**: Calendario interactivo
- **Table**: Tablas con paginación y ordenamiento

### Componentes de Layout

- **Sidebar**: Navegación lateral responsiva
- **TopMenu**: Menú superior con controles de usuario
- **Menubar**: Barra de menú personalizable

## 🚀 Comenzando

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd library-cmm-system
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env.local`:
   ```env
   # Base de datos
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/library_cmm"
   
   # Autenticación
   AUTH_SECRET="tu-secreto-de-autenticacion-super-seguro"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Opcional: Para producción
   NODE_ENV="development"
   ```

4. **Configurar la base de datos**
   ```bash
   # Generar cliente Prisma
   npx prisma generate
   
   # Aplicar migraciones
   npx prisma db push
   
   # Poblar con datos iniciales
   npm run seed
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con Turbopack
npm run dev:db       # Prisma Studio para gestión de BD

# Producción
npm run build        # Construcción para producción
npm run start        # Servidor de producción

# Base de datos
npm run prisma:deploy # Generar cliente Prisma
npm run seed         # Poblar base de datos

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🔒 Características de Seguridad

- **Encriptación**: Contraseñas hasheadas con bcryptjs (salt rounds: 12)
- **Validación**: Esquemas Zod para validación de entrada en cliente y servidor
- **Sesiones**: JWT seguros con rotación automática
- **CSRF**: Protección contra ataques de falsificación de solicitudes
- **SQL Injection**: Prevención total mediante Prisma ORM
- **Rate Limiting**: Limitación de solicitudes por IP
- **Sanitización**: Limpieza automática de datos de entrada
- **Cookies Seguras**: Configuración segura para producción

## 📊 Gestión de Estado

### Zustand Stores

#### LogoutStore
```typescript
interface LogoutState {
  isLoggingOut: boolean;
  setIsLoggingOut: (loading: boolean) => void;
}
```

#### MenuStore
```typescript
interface MenuState {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}
```

## 🌐 Rutas y Navegación

### Rutas Públicas
- `/` - Página de inicio
- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro

### Rutas Protegidas (Dashboard)

#### Admin/Leader
- `/dashboard/users` - Gestión de usuarios
- `/dashboard/inventory` - Gestión de inventarios
- `/dashboard/orders` - Gestión de pedidos
- `/dashboard/sales` - Registro de ventas
- `/dashboard/notifications` - Centro de notificaciones

#### Usuarios
- `/dashboard/account` - Gestión de cuenta personal
- `/dashboard/notifications` - Notificaciones personales

## 📱 Diseño Responsivo

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Sistema de breakpoints de Tailwind CSS
- **Componentes Adaptativos**: UI que se adapta automáticamente
- **Touch Friendly**: Interacciones optimizadas para touch
- **Performance**: Carga rápida en dispositivos móviles

## � Despliegue

### Variables de Entorno para Producción

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
AUTH_SECRET="secreto-ultra-seguro-para-producción"
NEXTAUTH_URL="https://tu-dominio.com"
```

### Comandos de Despliegue

```bash
# Construcción optimizada
npm run build

# Verificar construcción
npm run start

# Aplicar migraciones en producción
npx prisma migrate deploy
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -m 'Agregar nueva característica'`)
4. Push al branch (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.