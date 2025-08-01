---
applyTo: "**"
---

# Instrucciones para la API de Plaid en el proyecto Kovara Banking

Esta guía proporciona el contexto y los patrones de código para interactuar con la API de Plaid dentro de este proyecto. La lógica principal se encuentra en `src/services/actions/plaid.ts`.
Estas instrucciones están diseñadas para ser utilizadas por desarrolladores familiarizados con la API de Plaid y su integración con Dwolla.

## Cómo usar la documentación oficial de Plaid

Para obtener instrucciones detalladas y actualizadas sobre cómo usar la API de Plaid, se debe consultar la documentación oficial optimizada para LLMs.

- **Índice de Documentación**: El índice principal de todos los documentos se encuentra en [https://plaid.com/llms.txt](https://plaid.com/llms.txt).
- **Obtener un Documento Específico**: Para obtener la versión en Markdown de una página de documentación, añade `index.html.md` al final de la URL. Por ejemplo, la documentación de Auth está en `https://plaid.com/docs/auth/index.html.md`.

## 1. Flujo de Trabajo General

El objetivo es vincular de forma segura la cuenta bancaria de un usuario y prepararla para transacciones a través de nuestro socio, Dwolla.

1.  **Crear Link Token (`createLinkToken`)**: Se genera un `link_token` temporal para que el usuario pueda iniciar el flujo de Plaid Link en el frontend.
2.  **Intercambiar Token Público (`exchangePublicToken`)**: Esta es la función principal de orquestación que:
    a. Intercambia el `public_token` del frontend por un `access_token` permanente.
    b. Obtiene los detalles de la cuenta del usuario.
    c. Crea un `processor_token` para compartir los detalles de la cuenta de forma segura con Dwolla.
    d. Llama a una acción de Dwolla para crear una fuente de fondos (`addFundingSource`).
    e. Guarda la información de la nueva cuenta bancaria en nuestra base de datos de Appwrite (`createBankAccount`).
    f. Revalida la caché de Next.js para actualizar la interfaz de usuario.

## 2. Implementación y Ejemplos de Código

### `createLinkToken(user)`

**Propósito**: Generar un `link_token` para inicializar Plaid Link en el cliente.
**API de Plaid**: `plaidClient.linkTokenCreate`

```typescript
// src/services/actions/plaid.ts
export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error creating link token:", error);
  }
};
```

### `exchangePublicToken({ publicToken, user })`

**Propósito**: Completar el flujo de vinculación, obtener tokens, crear la fuente de fondos en Dwolla y guardar los datos en la base de datos.
**APIs de Plaid**: `itemPublicTokenExchange`, `accountsGet`, `processorTokenCreate`.

```typescript
// src/services/actions/plaid.ts
const exchangePublicToken = async ({ publicToken, user }: ExchangePublicTokenProps) => {
  try {
    // 1. Intercambiar public_token por access_token
    const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // 2. Obtener los datos de la cuenta
    const accountsResponse = await plaidClient.accountsGet({ access_token: accessToken });
    const accountData = accountsResponse.data.accounts[0];

    // 3. Crear un processor_token para Dwolla
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };
    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // 4. Crear la fuente de fondos en Dwolla
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    if (!fundingSourceUrl) throw new Error("Failed to create funding source URL");

    // 5. Guardar la nueva cuenta en la base de datos
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    // 6. Revalidar caché para que la UI se actualice
    revalidatePath("/");

    return parseStringify({ publicTokenExchange: "complete" });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error exchanging public token:", error);
  }
};
```

## 3. Referencias a Documentación Específica

Para obtener detalles más profundos sobre cada parte del proceso, consulta los siguientes archivos de instrucciones:

- **Inicio Rápido y Conceptos Básicos**: `plaid_quickstart_docs.instructions.md`
- **Flujo de Autenticación (Auth)**: `plaid_auth_docs.instructions.md`
- **Inicialización de Plaid Link**: `plaid_link_docs.instructions.md`
- **Integración con Dwolla**: `plaid_dwolla_integration.instructions.md`
- **Guía de Transferencias (ACH)**: `plaid_transfer_guide.instructions.md`

## 4. Consideraciones Clave

- **Nomenclatura**: Las solicitudes a la API de Plaid a menudo requieren claves en `snake_case`. Presta atención a los tipos de datos del SDK de Plaid (ej. `LinkTokenCreateRequest`).
- **Manejo de Errores**: Todas las llamadas a la API de Plaid deben estar envueltas en bloques `try...catch`. Utiliza `Sentry.captureException(error)` para registrar estos errores, siguiendo las directrices de `sentry.instructions.md`.
- **Variables de Entorno**: El cliente de Plaid (`src/services/server/plaid.ts`) requiere que `PLAID_CLIENT_ID` y `PLAID_SECRET` estén