# AGENTS.md — Frontend-Photobogota

## Comandos clave

```bash
pnpm install              # Instala dependencias (usa pnpm, no npm)
pnpm run dev              # Servidor dev en localhost:5173 con HMR
pnpm run build            # Build producción → dist/
pnpm run preview          # Preview build producción
pnpm run lint             # ESLint (flat config)
pnpm run doctor           # React Doctor (análisis estático)
```

## Arquitectura esencial

- **Stack**: React 19 + Vite + React Router v7 + Bootstrap 5
- **Proxy API**: `/api` y `/uploads` → `http://localhost:8080` (ver `vite.config.js`)
- **Alias**: `@` → `src/`
- **Auth**: Context `AuthProvider` + `ProtectedRoute` con roles: `MIEMBRO` (default), `SOCIO`, `MOD`, `ADMIN`
- **Rutas principales**: `/`, `/login`, `/mapa`, `/spot/:id`, `/perfil`, `/crear-spot`, `/solicitud-socio/*`, `/admin/*`, `/moderador/*`
- **Env**: `VITE_API_URL` (ej: `http://localhost:8080/api/v1`)

## Flujo de trabajo CI/CD

- **Push a `main`**: `pnpm install --frozen-lockfile --ignore-scripts` → `pnpm run build` → deploy a `gh-pages`
- **PR a `main`**: React Doctor escanea cambios (solo advisory, no bloquea)
- **Node**: 20.x, pnpm 9

## Convenciones del repo

- **ESLint**: flat config con `react-hooks`, `react-refresh`, `jsx-a11y`; `no-unused-vars` ignora `^[A-Z_]`
- **Sin tests** configurados (no hay script `test`)
- **Commits**: ramas `feature/*`, PR a `main`
- **Mock data** en `src/mocks/` para desarrollo sin backend

## Gotchas

- Usar **pnpm** (lockfile `pnpm-lock.yaml`, workspace `pnpm-workspace.yaml`)
- Build usa `base: "/Frontend-Photobogota/"` para GitHub Pages
- Proxy Vite solo en dev; en prod el backend debe servir estáticos o configurar CORS
- `react-doctor` solo corre en CI; local: `pnpm run doctor`

## Estado react-doctor (2026-08)

**0 issues** (`pnpm run doctor` → "No issues found!"). Se resolvieron también los últimos 7:

- `require-pnpm-hardening`: se añadió `trustPolicy: no-downgrade` + `blockExoticSubdeps: true` a `pnpm-workspace.yaml`. El error `semver@6.3.1 High-risk trust downgrade` era un falso positivo (Babel fija semver ^6.3.1, sin provenance, frente a semver 7.x moderno con attestation); se resolvió con `trustPolicyExclude: [semver@6.3.1]`, no rompiendo el install.
- Falsos positivos restantes: se suprimieron con comentarios `// oxlint-disable-next-line react-doctor/<regla>` (INVISIBLES para ESLint, no requieren stub):
  - `prefer-dynamic-import` (GraficosRecharts.jsx): recharts ya carga vía `React.lazy` (chunk propio en el build).
  - `js-set-map-lookups` (LogRow.jsx): `String.prototype.includes` busca subcadena; un `Set` no aplica.
  - `no-set-state-after-await-in-effect` (PerfilTabs.jsx): el flag `cancelado` + cleanup ya cubren todos los setters tras `await`.
  - `no-create-object-url-without-revoke` ×3 (CrearPromocion, CreacionSpotForm, ReportarModal): ya revocan en unmount y al quitar archivo.

> Nota: para suprimir reglas de react-doctor en un archivo, usar `// oxlint-disable-next-line react-doctor/<rule>` (el doctor usa oxlint y respeta ese directive; ESLint lo ignora). NO usar `eslint-disable react-doctor/...` salvo que la regla esté registrada como stub no-op en `eslint.config.js` (ver sección `nested-interactive`).

### Refactor completado (2026-08)

Los 9 "Large component" se dividieron en componentes hijos en la misma carpeta (regla resuelta; los padres quedan <300 líneas, lógica/estado en el padre):

- `AdminLogsViewer.jsx` → `LogRow`, `LogHeader`, `LogControls`, `LogsView`
- `ListaUsuarios.jsx` → `FilaUsuario`, `PaginacionUsuarios`
- `EditarPerfilModal.jsx` → `PerfilModalHeader`, `PerfilFormCampos`, `PassFormCampos`
- `EliminarCuenta.jsx` → `VistaCodigo`, `VistaProgramada`, `VistaFormulario`
- `PerfilTabs.jsx` → `TabPublicaciones`, `TabResenas`, `TabGuardados`, `TabLocales`, `TabPromociones`, `TabComercial`, `SinContenido`, `LoadingBlock`
- `SolicitudEnviada.jsx` → `DetallesSolicitud`
- `CreacionSpotForm.jsx` → `ImageUploader`, `SeccionImagenes`, `creacionSpotReducer.js`, `usePublicacionSpot.js`
- `SpotInformacionBasica.jsx` → `UbicacionLugar`
- `SpotContent.jsx` → `SpotInfo`, `NuevaResenaCard`, `ResenasLista`, `MapaVista`

### `nested-interactive ×20` resuelto (2026-08)

Cards/wrappers que eran `role="button"` y contenían controles enfocables (botones/inputs/enlaces) se reestructuraron: el wrapper dejó de ser interactivo y cada acción quedó en un control real accesible:

- `TeamCard.jsx`: card deja de ser botón; se añadió botón "Ver perfil" en el frente (volteo accesible); sociales/audio quedan como controles propios.
- `SpotCard.jsx`: card deja de ser botón; el título ahora es `<button>` que navega; reportar/guardar intactos.
- `ReviewCard.jsx`: card deja de ser botón; navegan el botón del título y "Ver spot".
- `ImageUploader.jsx` / `CrearPromocion.jsx`: carrusel y miniaturas dejan de ser botones; navegan botones prev/next y eliminar.
- `MiPerfil.jsx`: el overlay de notificaciones deja de ser botón; Escape se maneja en el panel `role="dialog"`.

Los wrappers conservan `onClick` como conveniencia de mouse con `eslint-disable` documentado. React Doctor expone su propia regla `react-doctor/no-static-element-interactions` (×7) que NO silencia `jsx-a11y`; para suprimirla se añade su nombre al comentario `eslint-disable`. Como ESLint no conoce la regla, en `eslint.config.js` hay un stub no-op (`create()` vacío, severidad "off") y `reportUnusedDisableDirectives: "off"`. No añadir más `eslint-disable react-doctor/...` sin esa regla registrada.

### `Custom modal` resuelto (2026-08)

El overlay de notificaciones de `MiPerfil.jsx` se migró a un `<dialog>` nativo: `useRef` + `showModal()` vía effect, `onCancel` (Escape) y `onClose` sincronizan el estado del reducer, botón de cierre × accesible, click en el backdrop cierra, y `::backdrop` con blur + `aria-labelledby`. Se añadieron estilos `perfil-notif-*` (antes no existían) en `MiPerfil.css`. El click del backdrop requiere `eslint-disable` con la regla `react-doctor/no-noninteractive-element-interactions` (stub no-op también registrado en `eslint.config.js`).