// Usuarios de ejemplo
export const USUARIOS_DEMO_ADMIN = [
    {
        id: "67c4a5e1b3d8f2a9c4e6f1a2",
        nombresCompletos: "Sebastián Sotomayor",
        nombreUsuario: "juanss",
        email: "juan@dev.com",
        rol: "ADMIN",
        estadoCuenta: true,
        fechaRegistro: "2026-02-15T10:30:00",
        telefono: "3001234567",
        biografia: "Administrador del sistema, parchao"
    },
    {
        id: "67c4a5e1b3d8f2a9c4e6f1a3",
        nombresCompletos: "Yanpol",
        nombreUsuario: "void0",
        email: "yanpolyeymye@karenvaleria.com",
        rol: "MOD",
        estadoCuenta: true,
        fechaRegistro: "2026-03-01T14:20:00",
        telefono: "0",
        biografia: "Amo a mis novias"
    },
    {
        id: "67c4a5e1b3d8f2a9c4e6f1a4",
        nombresCompletos: "Sebastian Romero",
        nombreUsuario: "sexbastian",
        email: "sebastis@socio.com",
        rol: "SOCIO",
        estadoCuenta: false,
        fechaRegistro: "2026-01-20T09:15:00",
        telefono: "0",
        biografia: "El mejor en front njd"
    },
    {
        id: "67c4a5e1b3d8f2a9c4e6f1a5",
        nombresCompletos: "Danfel Serati",
        nombreUsuario: "danfelcino",
        email: "danfel@cerati.com",
        rol: "MIEMBRO",
        estadoCuenta: true,
        fechaRegistro: "2026-03-20T16:45:00",
        telefono: "0",
        biografia: "Escribi mal cerati y ahora no se como cambiarlo"
    }
];

// Función para simular paginación
export const paginarDemo = (usuarios, page, size) => {
    const start = page * size;
    const end = start + size;
    const content = usuarios.slice(start, end);
    
    return {
        content: content,
        pageable: {
            pageNumber: page,
            pageSize: size,
            sort: { sorted: false, empty: true, unsorted: true },
            offset: start,
            paged: true,
            unpaged: false
        },
        totalElements: usuarios.length,
        totalPages: Math.ceil(usuarios.length / size),
        last: end >= usuarios.length,
        first: page === 0,
        size: size,
        number: page,
        sort: { sorted: false, empty: true, unsorted: true },
        numberOfElements: content.length,
        empty: content.length === 0
    };
};

// Función para crear usuario en modo demo
export const crearUsuarioDemo = async (datos) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const nuevoUsuario = {
                id: Date.now().toString(),
                nombresCompletos: datos.nombresCompletos,
                nombreUsuario: datos.nombreUsuario,
                email: datos.email,
                rol: datos.rol?.toUpperCase() || "MIEMBRO",
                estadoCuenta: true,
                fechaRegistro: new Date().toISOString(),
                telefono: datos.telefono || null,
                biografia: datos.biografia || null
            };
            
            // Agregar al array de demo (para que aparezca en la lista)
            USUARIOS_DEMO_ADMIN.unshift(nuevoUsuario);
            
            resolve({
                exitoso: true,
                mensaje: "Usuario creado exitosamente (modo demo)",
                datos: nuevoUsuario
            });
        }, 800);
    });
};

// Función para actualizar estado en modo demo
export const actualizarEstadoUsuarioDemo = async (usuarioId, activo) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usuario = USUARIOS_DEMO_ADMIN.find(u => u.id === usuarioId);
            if (!usuario) {
                reject({ exitoso: false, mensaje: "Usuario no encontrado" });
                return;
            }
            usuario.estadoCuenta = activo;
            resolve({ exitoso: true, mensaje: `Usuario ${activo ? 'activado' : 'desactivado'} correctamente` });
        }, 500);
    });
};

// Función para eliminar usuario en modo demo
export const eliminarUsuarioDemo = async (usuarioId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = USUARIOS_DEMO_ADMIN.findIndex(u => u.id === usuarioId);
            if (index === -1) {
                reject({ exitoso: false, mensaje: "Usuario no encontrado" });
                return;
            }
            USUARIOS_DEMO_ADMIN.splice(index, 1);
            resolve({ exitoso: true, mensaje: "Usuario eliminado correctamente" });
        }, 500);
    });
};

// Función para listar usuarios en modo demo (con paginación)
export const listarUsuariosDemo = async (page, size) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(paginarDemo(USUARIOS_DEMO_ADMIN, page, size));
        }, 500);
    });
};