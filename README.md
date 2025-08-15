<p align="center">
	<img src="./public/logo/favicon-dark.svg" alt="Kovara Banking Logo" width="120" />
</p>

# Kovara Banking

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Version](https://img.shields.io/badge/version-0.1.0-blue) ![License](https://img.shields.io/badge/license-MIT-yellow)

---

## 🚀 Descripción

Kovara Banking es una aplicación web de banca en línea moderna, desarrollada con Next.js y TypeScript. Permite a los usuarios gestionar cuentas bancarias, visualizar transacciones y realizar transferencias, integrando servicios como Appwrite, Plaid y Dwolla (en modo Sandbox). La interfaz es responsiva y accesible, construida con shadcn/ui y Tailwind CSS, y cuenta con validación robusta de formularios y monitoreo de errores con Sentry.

### ⚙️ Características principales

- Autenticación y registro de usuarios
- Vinculación de cuentas bancarias (Plaid Sandbox)
- Transferencias simuladas (Dwolla Sandbox)
- Visualización de bancos, cuentas y transacciones
- Interfaz moderna y responsiva
- Validación de formularios con Zod y React Hook Form
- Monitoreo de errores con Sentry

### 🏷️ Tecnologías clave

`Next.js` `TypeScript` `Appwrite` `Plaid` `Dwolla` `shadcn/ui` `Tailwind CSS` `React Hook Form` `Zod` `Sentry`

---

## 🛠️ Instalación

### Requisitos previos

- Node.js >= 18.x
- npm >= 9.x

### Pasos

```bash
git clone https://github.com/aaronportobanco/kovara-banking.git
cd kovara-banking
npm install
npm run dev
```

### Variables de entorno

Configura los siguientes valores en un archivo `.env.local`:

```env
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_appwrite_project_id
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
DWOLLA_KEY=your_dwolla_key
DWOLLA_SECRET=your_dwolla_secret
```

---

## 📖 Uso

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
2. Accede a [http://localhost:3000](http://localhost:3000) en tu navegador.
3. Regístrate y vincula una cuenta bancaria de prueba (Sandbox).

#### Ejemplo de registro

```tsx
import { SignUpForm } from "@/app/(auth)/sign-up/SignUpForm";
// ...
<SignUpForm />;
```

#### Placeholder de screenshot

![Demo UI](./docs/screenshot-placeholder.png)

#### Flujo de trabajo típico

- Registro → Vinculación bancaria (Plaid Sandbox) → Visualización de cuentas → Transferencias simuladas

> **Nota:** Los servicios bancarios funcionan en modo Sandbox y no están listos para usuarios finales ni operaciones reales.

---

## ⚙️ Configuración

- Archivos principales: `next.config.ts`, `tailwind.config.ts`, `src/app/layout.tsx`, `.env.local`
- Personaliza los estilos en `src/app/globals.css` y componentes en `src/components/ui/`

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas!

1. Haz un fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios siguiendo los estándares de código (Prettier, ESLint)
4. Abre un Pull Request con una descripción clara

### Estándares de código

- Usa TypeScript y sigue las convenciones de Next.js
- Ejecuta `npm run lint` y `npm run format` antes de enviar PRs

### Sistema de issues

- Usa las plantillas de issues para reportar bugs o sugerir mejoras

---

## 🗺️ Roadmap

- [x] Autenticación y registro
- [x] Vinculación bancaria (Sandbox)
- [x] Visualización de cuentas y transacciones
- [ ] Transferencias reales
- [ ] Integración con bancos adicionales
- [ ] Mejoras de seguridad y auditoría
- [ ] Internacionalización

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](./LICENSE).

---

## 📬 Contacto

| Mantenedor       | Email                     | GitHub                                                 |
| ---------------- | ------------------------- | ------------------------------------------------------ |
| Aaron Portobanco | aaronportobanco@gmail.com | [@aaronportobanco](https://github.com/aaronportobanco) |

Síguenos en [Twitter](https://twitter.com/kovara_banking) <!-- Placeholder -->

---

> [!WARNING] 
> Esta app utiliza servicios bancarios en modo Sandbox y no está lista para usuarios finales ni operaciones reales.
