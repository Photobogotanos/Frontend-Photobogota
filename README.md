# Photobogotá

Una plataforma moderna de fotografía y exploración de lugares en Bogotá. Conecta fotógrafos, descubre nuevos spots fotográficos y comparte tus mejores capturas con una comunidad apasionada.

## Características Principales

- **Sistema de Autenticación** - Registro, login y recuperación de contraseña seguros
- **Mapa Interactivo** - Explora spots fotográficos en un mapa de Bogotá con Leaflet
- **Galería de Publicaciones** - Comparte y visualiza publicaciones con imágenes
- **Sistema de Comentarios** - Interactúa con GIFs e imágenes integradas
- **Perfil de Usuario** - Personaliza tu perfil con foto, descripción y reseñas
- **Programa de Socios** - Solicita y gestiona membresías especiales
- **Notificaciones en Tiempo Real** - Mantente actualizado con actividades relevantes
- **Diseño Responsivo** - Experiencia optimizada para dispositivos móviles y desktop

## Tecnologías

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Mapas**: Leaflet + React Leaflet
- **UI Components**: React Bootstrap + Bootstrap 5
- **Enrutamiento**: React Router DOM v7
- **Animaciones**: Framer Motion
- **Selección de Fechas**: React Flatpickr
- **Alertas**: SweetAlert2
- **Iconos**: React Icons
- **Validación**: ESLint

## Requisitos Previos

- Node.js 16+ 
- npm o yarn

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Photobogotanos/Frontend-Photobogota.git
   cd Frontend-Photobogota
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con HMR
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter ESLint

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Formularios de autenticación
│   ├── comentarios/    # Sistema de comentarios
│   ├── layout/         # Header, footer, menús
│   ├── mapa/           # Integración de mapas
│   ├── notificaciones/ # Centro de notificaciones
│   ├── pagina-inicio/  # Página principal
│   ├── perfil/         # Perfil de usuario
│   ├── socio/          # Programa de socios
│   └── spots/          # Todo relacionado de spots
├── pages/              # Páginas de la aplicación
├── layouts/            # Layouts principales
├── routes/             # Configuración de rutas
├── services/           # Servicios API
├── assets/             # Fuentes e imágenes
├── utils/              # Funciones de utilidad
├── App.jsx             # Componente raíz
└── main.jsx            # Punto de entrada
```

## Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto (si es necesario):

```env
VITE_API_URL=http://localhost:3000
```

## Rutas Principales

- `/` - Página de inicio
- `/auth/login` - Login
- `/auth/register` - Registro
- `/home-mapa` - Mapa interactivo
- `/lugares/:id` - Detalle de un lugar
- `/perfil` - Mi perfil
- `/publicar` - Registrar Spot
- `/socio` - Programa de socios

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo licencia MIT - ver el archivo LICENSE para más detalles.

## Contacto

Para preguntas o sugerencias, contacta a través de la plataforma, abre un issue en el repositorio o a nuestro correo [photobogota123@gmail.com]. 
