# Gastos App

Aplicación móvil para control de gastos personales desarrollada con Ionic + Angular y Supabase.

## 🚀 Características

- Control de gastos por categorías
- Visualización de gastos mensuales
- Gráficos y estadísticas
- Modo claro/oscuro
- Diseño responsive
- Arquitectura hexagonal

## 🛠️ Tecnologías

- Ionic 8
- Angular 19
- Supabase
- Chart.js
- TypeScript

## 📋 Requisitos Previos

- Node.js (v18+)
- pnpm
- Ionic CLI
- Angular CLI
- Git
- Cuenta en Supabase

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <url-repositorio>
cd gastos-app
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
   - Crear archivo `src/environments/environment.ts`
   - Agregar las siguientes variables:
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SUPABASE_ANON_KEY'
};
```

4. Configurar Supabase:
   - Crear las siguientes tablas:
     - `expenses`: id, user_id, category_id, amount, description, date
     - `categories`: id, user_id, name, color, is_default
   - Activar RLS (Row Level Security)
   - Configurar políticas de seguridad por usuario

## 🚀 Ejecución

### Desarrollo
```bash
pnpm start
```

### Producción
```bash
pnpm build
```

### iOS
```bash
pnpm cap add ios
pnpm cap open ios
```

### Android
```bash
pnpm cap add android
pnpm cap open android
```

## 📁 Estructura del Proyecto

```
src/app/
├── contexts/
│   ├── expenses/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   └── categories/
│       ├── domain/
│       ├── application/
│       └── infrastructure/
├── pages/
│   ├── home/
│   ├── login/
│   ├── register/
│   ├── add-expense/
│   ├── history/
│   └── categories/
└── shared/
    ├── components/
    └── pipes/
```

## 🎨 Guía de Estilo

### Colores
- Primario: `#3E8ED0`
- Secundario: `#F4A261`
- Fondo claro: `#FFFFFF`
- Fondo oscuro: `#121212`

### Tipografía
- Familia: Roboto
- Tamaños:
  - Título: 24px
  - Subtítulo: 18px
  - Texto destacado: 16px
  - Texto normal: 14px
  - Texto pequeño: 12px

## 📄 Licencia

MIT 
