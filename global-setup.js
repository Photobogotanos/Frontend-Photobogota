import { request } from "@playwright/test";

async function globalSetup() {
  const backendUrl = "https://photoapi.duckdns.org/api/v1/actuator/health"; 
  const requestContext = await request.newContext({
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "http://localhost:5173",   // ← local
    },
  });

  try {
    const response = await requestContext.get(backendUrl, {
      timeout: 15000,
    });

    if (!response.ok()) {
      throw new Error(`Healthcheck falló con status ${response.status()}`);
    }

    const body = await response.json();
    if (body.status !== "UP") {
      throw new Error(
        `El estado del backend no es UP: ${JSON.stringify(body)}`,
      );
    }

    console.log("Backend disponible y respondiendo ok.");
  } catch (error) {
    console.error(
      "\nERROR DE INFRAESTRUCTURA: El backend no está listo para los tests E2E.",
    );
    console.error(`Endpoint consultado: ${backendUrl}`);
    console.error(`Detalle: ${error.message}\n`);
    process.exit(1);
  } finally {
    await requestContext.dispose();
  }
}

export default globalSetup;