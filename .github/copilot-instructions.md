# Instrucciones para GitHub Copilot en el proyecto Kovara Banking

## Descripción General del Proyecto

Este es un proyecto de banca en línea desarrollado con Next.js y TypeScript, utilizando el App Router. La interfaz de usuario se construye con **shadcn/ui** y **Tailwind CSS**. La gestión de formularios se realiza a través de **React Hook Form** y la validación de esquemas con **Zod**. El backend está impulsado por **Appwrite**.

## Arquitectura y Flujo de Datos

-   **App Router de Next.js**: La estructura de la aplicación se basa en el App Router, con rutas y componentes definidos en el directorio `src/app`. Las rutas principales se dividen en `(auth)` para la autenticación y `(root)` para la aplicación principal.
-   **Componentes**: Los componentes reutilizables de la interfaz de usuario se encuentran en `src/components/ui`, siguiendo el patrón de **shadcn/ui**. Los componentes específicos de las páginas se localizan junto a sus rutas correspondientes.
-   **Gestión de Estado**: El estado de los formularios se gestiona localmente con `React Hook Form`. Las interacciones con el servidor se manejan a través de **Server Actions** de Next.js, definidas en `src/lib/actions`.
-   **Backend**: La lógica del backend se centraliza en **Appwrite**. La configuración del cliente de Appwrite se encuentra en `src/lib/server/appwrite.ts`.

## Flujos de Trabajo del Desarrollador

-   **Ejecutar el Servidor de Desarrollo**: Para iniciar la aplicación en modo de desarrollo, utiliza el siguiente comando:
    ```bash
    npm run dev
    ```
-   **Validación de Formularios**: Los esquemas de validación se definen con **Zod** en el directorio `src/schemas`. Por ejemplo, `signUpSchema.ts` contiene las reglas para el formulario de registro.
-   **Componentes de Formularios**: Utiliza el componente personalizado `FormFieldInput` para los campos de entrada en los formularios, como se ve en `SignUpForm.tsx`.

## Convenciones y Patrones Específicos del Proyecto

-   **Formularios**: Todos los formularios deben usar `React Hook Form` y `zodResolver` para la validación. Los componentes de formulario, como `FormFieldInput` y `FormDatePicker`, están diseñados para integrarse con `form.control`.
-   **Acciones del Servidor**: La lógica del lado del servidor, como el registro de usuarios (`signUp`), se implementa como Server Actions en `src/lib/actions/user.actions.ts`.
-   **Estilos**: Los estilos se aplican principalmente con clases de **Tailwind CSS**. Los componentes de **shadcn/ui** ya vienen con estilos predefinidos que se pueden personalizar.

## Integraciones y Dependencias Externas

-   **Appwrite**: Es el backend principal para la autenticación y la base de datos. Toda la comunicación con Appwrite se gestiona a través de las funciones en `src/lib/server/appwrite.ts`.
-   **shadcn/ui**: La mayoría de los componentes de la interfaz de usuario provienen de esta biblioteca.
-   **React Hook Form y Zod**: Son la base para la creación y validación de formularios en toda la aplicación.

## Archivos y Directorios Clave

-   `src/app/(auth)/sign-up/SignUpForm.tsx`: Un excelente ejemplo de cómo se implementan los formularios.
-   `src/lib/actions/user.actions.ts`: Contiene la lógica de negocio del lado del servidor para las operaciones de usuario.
-   `src/lib/server/appwrite.ts`: Define la conexión y configuración del cliente de Appwrite.
-   `src/schemas/signUpSchema.ts`: Muestra cómo se definen los esquemas de validación con Zod.
-   `src/components/ui/`: Directorio de los componentes de la interfaz de usuario de shadcn.
