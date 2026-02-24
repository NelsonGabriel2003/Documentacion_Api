/**
 * Bounty Bar API - Documentacion Formal
 * Endpoints del Sistema de Gestion de clientes y promociones
 */

const BASE_URL = 'https://tu-dominio.com/api'

const MODULES = [
  {
    id: 'auth',
    name: 'Autenticacion',
    prefix: '/auth',
    description: 'Modulo de autenticacion del sistema. Permite el registro de nuevos usuarios, inicio de sesion con generacion de token JWT, recuperacion de contrasena mediante codigo enviado por correo electronico o Telegram, y gestion del perfil del usuario autenticado.',
    endpoints: [
      {
        method: 'POST', path: '/login',
        desc: 'Iniciar sesion',
        detail: 'Autentica al usuario con correo y contrasena. Retorna un token JWT valido para acceder a endpoints protegidos. El token debe enviarse en el header Authorization de las solicitudes posteriores.',
        auth: 'public',
        body: { email: 'usuario@correo.com', password: 'miPassword123' },
        bodyFields: [
          { name: 'email', type: 'string', required: true, desc: 'Correo electronico registrado' },
          { name: 'password', type: 'string', required: true, desc: 'Contrasena del usuario (minimo 6 caracteres)' }
        ],
        response: { success: true, token: 'eyJhbGciOiJIUzI1NiIs...', user: { id: 1, name: 'Juan Perez', email: 'usuario@correo.com', phone: '0998765432', membership_level: 'bronce', current_points: 0, total_points: 0 } }
      },
      {
        method: 'POST', path: '/register',
        desc: 'Registrar nuevo usuario',
        detail: 'Crea una nueva cuenta de usuario con nivel de membresia bronce y 0 puntos iniciales. Valida formato de correo, longitud de contrasena (minimo 6 caracteres) y formato de telefono ecuatoriano (09XXXXXXXX). Retorna token JWT para login automatico.',
        auth: 'public',
        body: { name: 'Juan Perez', email: 'juan@correo.com', password: 'miPassword123', phone: '0998765432' },
        bodyFields: [
          { name: 'name', type: 'string', required: true, desc: 'Nombre completo del usuario' },
          { name: 'email', type: 'string', required: true, desc: 'Correo electronico (unico en el sistema)' },
          { name: 'password', type: 'string', required: true, desc: 'Contrasena (minimo 6 caracteres)' },
          { name: 'phone', type: 'string', required: true, desc: 'Telefono ecuatoriano (formato 09XXXXXXXX)' }
        ],
        response: { success: true, token: 'eyJhbGciOiJIUzI1NiIs...', user: { id: 2, name: 'Juan Perez', email: 'juan@correo.com', membership_level: 'bronce', current_points: 0 } }
      },
      {
        method: 'POST', path: '/check-recovery-methods',
        desc: 'Verificar metodos de recuperacion disponibles',
        detail: 'Consulta que metodos de recuperacion de contrasena tiene disponibles un usuario: correo electronico y/o Telegram. Se usa antes de solicitar el codigo para mostrar las opciones al usuario.',
        auth: 'public',
        body: { email: 'usuario@correo.com' },
        bodyFields: [
          { name: 'email', type: 'string', required: true, desc: 'Correo del usuario a verificar' }
        ],
        response: { success: true, methods: { email: true, telegram: false } }
      },
      {
        method: 'POST', path: '/forgot-password',
        desc: 'Solicitar codigo de recuperacion',
        detail: 'Genera un codigo alfanumerico de 6 caracteres con expiracion de 15 minutos y lo envia al correo o Telegram del usuario segun el metodo seleccionado.',
        auth: 'public',
        body: { email: 'usuario@correo.com', method: 'email' },
        bodyFields: [
          { name: 'email', type: 'string', required: true, desc: 'Correo del usuario' },
          { name: 'method', type: 'string', required: true, desc: 'Canal de envio: "email" o "telegram"' }
        ],
        response: { success: true, message: 'Codigo de recuperacion enviado' }
      },
      {
        method: 'POST', path: '/verify-code',
        desc: 'Verificar codigo de recuperacion',
        detail: 'Valida el codigo de 6 caracteres ingresado por el usuario. Si es correcto y no ha expirado, retorna un token temporal para cambiar la contrasena.',
        auth: 'public',
        body: { email: 'usuario@correo.com', code: 'ABC123' },
        bodyFields: [
          { name: 'email', type: 'string', required: true, desc: 'Correo del usuario' },
          { name: 'code', type: 'string', required: true, desc: 'Codigo de 6 caracteres recibido' }
        ],
        response: { success: true, token: 'reset_token_temporal...' }
      },
      {
        method: 'POST', path: '/reset-password',
        desc: 'Cambiar contrasena',
        detail: 'Establece una nueva contrasena usando el token temporal obtenido en el paso anterior. Requiere confirmacion de la contrasena.',
        auth: 'public',
        body: { token: 'reset_token_temporal...', newPassword: 'nuevaPassword456', confirmPassword: 'nuevaPassword456' },
        bodyFields: [
          { name: 'token', type: 'string', required: true, desc: 'Token temporal de recuperacion' },
          { name: 'newPassword', type: 'string', required: true, desc: 'Nueva contrasena (minimo 6 caracteres)' },
          { name: 'confirmPassword', type: 'string', required: true, desc: 'Confirmacion de la nueva contrasena' }
        ],
        response: { success: true, message: 'Contrasena actualizada exitosamente' }
      },
      {
        method: 'GET', path: '/me',
        desc: 'Obtener perfil del usuario autenticado',
        detail: 'Retorna los datos completos del usuario que envio el token JWT, incluyendo nivel de membresia, puntos actuales y totales.',
        auth: 'user',
        response: { success: true, user: { id: 1, name: 'Juan Perez', email: 'juan@correo.com', phone: '0998765432', membership_level: 'plata', current_points: 1200, total_points: 3500 } }
      },
      {
        method: 'PUT', path: '/me',
        desc: 'Actualizar perfil del usuario',
        detail: 'Permite al usuario actualizar su nombre y/o telefono. Valida que el telefono no este registrado por otro usuario. No permite cambiar correo ni contrasena desde este endpoint.',
        auth: 'user',
        body: { name: 'Juan Actualizado', phone: '0991234567' },
        bodyFields: [
          { name: 'name', type: 'string', required: false, desc: 'Nuevo nombre' },
          { name: 'phone', type: 'string', required: false, desc: 'Nuevo telefono (formato 09XXXXXXXX)' }
        ],
        response: { success: true, user: { id: 1, name: 'Juan Actualizado', phone: '0991234567' } }
      }
    ]
  },
  {
    id: 'products',
    name: 'Productos',
    prefix: '/products',
    description: 'Catalogo de productos del menu del establecimiento. Los usuarios pueden consultar productos y buscar por nombre. Los administradores pueden crear, editar y eliminar productos del catalogo. Cada producto tiene un precio, categoria, imagen y cantidad de puntos que otorga al ser comprado.',
    endpoints: [
      {
        method: 'GET', path: '/',
        desc: 'Listar todos los productos',
        detail: 'Retorna la lista completa de productos disponibles (donde disponible = true). Incluye nombre, descripcion, precio, categoria, URL de imagen y puntos otorgados por compra.',
        auth: 'public',
        response: { success: true, count: 2, data: [{ id: 1, name: 'Cerveza Artesanal', description: 'IPA local con notas citricas', price: 5.50, category: 'Cervezas', imageUrl: 'https://res.cloudinary.com/...', pointsGranted: 5, available: true }] }
      },
      {
        method: 'GET', path: '/categories',
        desc: 'Obtener categorias de productos',
        detail: 'Lista las categorias unicas existentes entre los productos registrados.',
        auth: 'public',
        response: { success: true, data: ['Cervezas', 'Cocteles', 'Snacks', 'Bebidas sin alcohol'] }
      },
      {
        method: 'GET', path: '/search',
        desc: 'Buscar productos por nombre',
        detail: 'Busqueda por coincidencia parcial (LIKE) en el nombre del producto. No distingue mayusculas de minusculas.',
        auth: 'public',
        query: [{ name: 'q', type: 'string', required: true, desc: 'Termino de busqueda (minimo 1 caracter)' }],
        response: { success: true, data: [{ id: 1, name: 'Cerveza Artesanal', price: 5.50, category: 'Cervezas' }] }
      },
      {
        method: 'GET', path: '/:id',
        desc: 'Obtener producto por ID',
        detail: 'Retorna todos los campos de un producto especifico, incluyendo su estado de disponibilidad.',
        auth: 'public',
        params: [{ name: 'id', type: 'integer', desc: 'Identificador unico del producto' }],
        response: { success: true, data: { id: 1, name: 'Cerveza Artesanal', description: 'IPA local con notas citricas', price: 5.50, category: 'Cervezas', imageUrl: 'https://res.cloudinary.com/...', pointsGranted: 5, available: true } }
      },
      {
        method: 'POST', path: '/',
        desc: 'Crear producto',
        detail: 'Crea un nuevo producto en el catalogo. Requiere nombre, precio y categoria como minimo. La imagen debe subirse previamente al endpoint /upload/image y usar la URL retornada. Se registra en el historial de auditoria y se envia notificacion global a los usuarios.',
        auth: 'admin',
        body: { name: 'Mojito Clasico', description: 'Ron, limon, hierba buena, azucar y soda', price: 7.00, category: 'Cocteles', image_url: 'https://res.cloudinary.com/...', points_granted: 7 },
        bodyFields: [
          { name: 'name', type: 'string', required: true, desc: 'Nombre del producto' },
          { name: 'description', type: 'string', required: false, desc: 'Descripcion detallada' },
          { name: 'price', type: 'number', required: true, desc: 'Precio en dolares' },
          { name: 'category', type: 'string', required: true, desc: 'Categoria del producto' },
          { name: 'image_url', type: 'string', required: false, desc: 'URL de la imagen (Cloudinary)' },
          { name: 'points_granted', type: 'integer', required: false, desc: 'Puntos otorgados por compra (default: 0)' }
        ],
        response: { success: true, message: 'Producto creado exitosamente', data: { id: 3, name: 'Mojito Clasico' } }
      },
      {
        method: 'PUT', path: '/:id',
        desc: 'Actualizar producto',
        detail: 'Modifica los campos de un producto existente. Solo se actualizan los campos enviados. Se registra en el historial de auditoria con los valores anteriores y nuevos.',
        auth: 'admin',
        params: [{ name: 'id', type: 'integer', desc: 'ID del producto a actualizar' }],
        body: { name: 'Mojito Premium', price: 8.50 },
        response: { success: true, message: 'Producto actualizado', data: { id: 3, name: 'Mojito Premium', price: 8.50 } }
      },
      {
        method: 'DELETE', path: '/:id',
        desc: 'Eliminar producto',
        detail: 'Elimina un producto del catalogo de forma permanente. Si tiene imagen en Cloudinary, tambien se elimina. Se registra en el historial de auditoria.',
        auth: 'admin',
        params: [{ name: 'id', type: 'integer', desc: 'ID del producto a eliminar' }],
        response: { success: true, message: 'Producto eliminado' }
      }
    ]
  },
  {
    id: 'rewards',
    name: 'Recompensas',
    prefix: '/rewards',
    description: 'Sistema de recompensas canjeables con puntos acumulados. Los usuarios pueden ver el catalogo de recompensas, canjear con sus puntos y obtener codigos unicos de 8 caracteres. El personal puede validar codigos y marcarlos como usados. Los administradores gestionan el catalogo de recompensas y supervisan los canjes pendientes.',
    endpoints: [
      { method: 'GET', path: '/', desc: 'Listar recompensas disponibles', detail: 'Retorna todas las recompensas con stock mayor a 0 y estado disponible. Incluye informacion de puntos requeridos, categoria y si es popular.', auth: 'public', response: { success: true, data: [{ id: 1, name: 'Cerveza Gratis', description: 'Una cerveza artesanal de la casa', pointsRequired: 500, category: 'Bebidas', stock: 10, isPopular: true, imageUrl: 'https://...' }] } },
      { method: 'GET', path: '/categories', desc: 'Categorias de recompensas', detail: 'Lista las categorias unicas de las recompensas existentes.', auth: 'public', response: { success: true, data: ['Bebidas', 'Comida', 'Merchandising', 'Experiencias'] } },
      { method: 'GET', path: '/:id', desc: 'Obtener recompensa por ID', detail: 'Retorna los datos completos de una recompensa especifica.', auth: 'public', params: [{ name: 'id', type: 'integer', desc: 'ID de la recompensa' }], response: { success: true, data: { id: 1, name: 'Cerveza Gratis', pointsRequired: 500, stock: 10, available: true } } },
      { method: 'POST', path: '/:id/redeem', desc: 'Canjear recompensa', detail: 'El usuario canjea una recompensa usando sus puntos acumulados. Se genera un codigo unico de 8 caracteres (formato BNT-XXXXXX). Se descuentan los puntos del saldo actual y se reduce el stock de la recompensa. El canje queda en estado "pendiente" hasta que el personal lo entregue.', auth: 'user', params: [{ name: 'id', type: 'integer', desc: 'ID de la recompensa a canjear' }], response: { success: true, message: 'Canje exitoso', data: { canjeId: 15, code: 'BNT-A1B2C3', pointsSpent: 500, reward: 'Cerveza Gratis' } } },
      { method: 'GET', path: '/user/my-redemptions', desc: 'Historial de canjes del usuario', detail: 'Lista todos los canjes realizados por el usuario autenticado, ordenados del mas reciente al mas antiguo.', auth: 'user', response: { success: true, data: [{ id: 15, reward: 'Cerveza Gratis', code: 'BNT-A1B2C3', pointsSpent: 500, status: 'pendiente', date: '2026-02-20T18:00:00Z' }] } },
      { method: 'GET', path: '/validate/:code', desc: 'Validar codigo de canje', detail: 'Usado por el personal para verificar si un codigo de canje es valido y consultar su estado antes de marcarlo como usado.', auth: 'user', params: [{ name: 'code', type: 'string', desc: 'Codigo de canje de 8 caracteres' }], response: { valid: true, redemption: { id: 15, reward: 'Cerveza Gratis', user: 'Juan Perez', status: 'pendiente' } } },
      { method: 'POST', path: '/use/:code', desc: 'Marcar codigo como usado', detail: 'El personal marca un codigo de canje como utilizado despues de entregar la recompensa al cliente.', auth: 'user', params: [{ name: 'code', type: 'string', desc: 'Codigo de canje' }], response: { success: true, redeemed: true } },
      { method: 'GET', path: '/pending', desc: 'Canjes pendientes de entrega', detail: 'Lista todos los canjes en estado "pendiente" para que el admin pueda dar seguimiento a las entregas.', auth: 'admin', response: { success: true, data: [{ id: 15, user: 'Juan Perez', reward: 'Cerveza Gratis', code: 'BNT-A1B2C3', status: 'pendiente', date: '2026-02-20T18:00:00Z' }] } },
      { method: 'POST', path: '/', desc: 'Crear recompensa', detail: 'Agrega una nueva recompensa al catalogo. Requiere nombre, puntos requeridos y stock. Se notifica a los usuarios de la nueva recompensa.', auth: 'admin', body: { name: 'Camiseta Bounty', description: 'Camiseta oficial del bar', points_required: 2000, category: 'Merchandising', stock: 50, image_url: 'https://...' }, bodyFields: [{ name: 'name', type: 'string', required: true, desc: 'Nombre de la recompensa' }, { name: 'points_required', type: 'integer', required: true, desc: 'Puntos necesarios para canjear' }, { name: 'stock', type: 'integer', required: true, desc: 'Cantidad disponible' }, { name: 'category', type: 'string', required: false, desc: 'Categoria' }, { name: 'description', type: 'string', required: false, desc: 'Descripcion' }, { name: 'image_url', type: 'string', required: false, desc: 'URL de imagen' }], response: { success: true, message: 'Recompensa creada', data: { id: 5, name: 'Camiseta Bounty' } } },
      { method: 'PUT', path: '/:id', desc: 'Actualizar recompensa', detail: 'Modifica los campos de una recompensa existente.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID de la recompensa' }], body: { name: 'Camiseta Bounty V2', stock: 30 }, response: { success: true, message: 'Recompensa actualizada', data: { id: 5 } } }
    ]
  },
  {
    id: 'services',
    name: 'Servicios',
    prefix: '/services',
    description: 'Servicios ofrecidos por el bar como reservas VIP, eventos privados y catering. Los usuarios pueden consultar los servicios disponibles y realizar reservas.',
    endpoints: [
      { method: 'GET', path: '/', desc: 'Listar servicios disponibles', detail: 'Retorna todos los servicios activos con su informacion completa.', auth: 'public', response: { success: true, data: [{ id: 1, name: 'Reserva VIP', description: 'Mesa VIP con atencion preferencial', category: 'Reservas', pointsRequired: 0, pointsGranted: 50 }] } },
      { method: 'GET', path: '/categories', desc: 'Categorias de servicios', detail: 'Lista las categorias unicas de servicios.', auth: 'public', response: { success: true, data: ['Reservas', 'Eventos', 'Catering'] } },
      { method: 'GET', path: '/:id', desc: 'Obtener servicio por ID', detail: 'Retorna los datos completos de un servicio.', auth: 'public', params: [{ name: 'id', type: 'integer', desc: 'ID del servicio' }], response: { success: true, data: { id: 1, name: 'Reserva VIP', description: 'Mesa VIP con atencion preferencial', available: true } } },
      { method: 'POST', path: '/:id/book', desc: 'Reservar servicio', detail: 'El usuario solicita una reserva para un servicio especifico con fecha, hora y notas adicionales.', auth: 'user', params: [{ name: 'id', type: 'integer', desc: 'ID del servicio' }], body: { date: '2026-03-15', time: '20:00', notes: 'Mesa para 6 personas' }, bodyFields: [{ name: 'date', type: 'string', required: true, desc: 'Fecha (YYYY-MM-DD)' }, { name: 'time', type: 'string', required: true, desc: 'Hora (HH:MM)' }, { name: 'notes', type: 'string', required: false, desc: 'Notas adicionales' }], response: { success: true, message: 'Reserva creada exitosamente' } },
      { method: 'POST', path: '/', desc: 'Crear servicio', detail: 'Registra un nuevo servicio. Se notifica a los usuarios.', auth: 'admin', body: { name: 'Evento Privado', description: 'Salon privado para eventos', category: 'Eventos', points_required: 0, points_granted: 100, image_url: 'https://...' }, bodyFields: [{ name: 'name', type: 'string', required: true, desc: 'Nombre del servicio' }, { name: 'description', type: 'string', required: false, desc: 'Descripcion' }, { name: 'category', type: 'string', required: true, desc: 'Categoria' }, { name: 'points_required', type: 'integer', required: false, desc: 'Puntos requeridos' }, { name: 'points_granted', type: 'integer', required: false, desc: 'Puntos otorgados' }], response: { success: true, message: 'Servicio creado', data: { id: 3 } } },
      { method: 'PUT', path: '/:id', desc: 'Actualizar servicio', detail: 'Modifica un servicio existente.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del servicio' }], body: { name: 'Evento Privado Premium' }, response: { success: true, message: 'Servicio actualizado' } }
    ]
  },
  {
    id: 'orders',
    name: 'Pedidos (Usuario)',
    prefix: '/orders',
    description: 'Gestion de pedidos del usuario. Permite crear pedidos con multiples productos, seguimiento en tiempo real del estado (pendiente, aprobado, preparando, completado, entregado), descarga de comprobantes PDF con codigo QR y cancelacion de pedidos pendientes. Los pedidos se cancelan automaticamente despues de 6 minutos sin respuesta del personal.',
    endpoints: [
      { method: 'POST', path: '/', desc: 'Crear pedido', detail: 'Crea un nuevo pedido con los items seleccionados. Genera automaticamente un codigo de pedido unico (BNT-YYYYMMDD-NNN), calcula subtotal/total, genera codigo QR y asigna los puntos a ganar segun el multiplicador del nivel de membresia del usuario.', auth: 'user', body: { items: [{ productId: 1, quantity: 2 }, { productId: 3, quantity: 1 }], tableNumber: '5', notes: 'Sin hielo por favor' }, bodyFields: [{ name: 'items', type: 'array', required: true, desc: 'Lista de productos con productId y quantity' }, { name: 'tableNumber', type: 'string', required: true, desc: 'Numero de mesa' }, { name: 'notes', type: 'string', required: false, desc: 'Observaciones del pedido' }], response: { success: true, data: { id: 10, orderCode: 'BNT-20260223-001', total: 18.00, pointsToEarn: 18, status: 'pendiente', qrData: 'data:image/png;base64,...' } } },
      { method: 'GET', path: '/', desc: 'Historial de pedidos', detail: 'Lista todos los pedidos del usuario autenticado ordenados del mas reciente al mas antiguo.', auth: 'user', response: { success: true, data: [{ id: 10, orderCode: 'BNT-20260223-001', total: 18.00, status: 'completado', date: '2026-02-23T19:00:00Z', pointsEarned: 18 }] } },
      { method: 'GET', path: '/active', desc: 'Pedidos activos', detail: 'Retorna solo los pedidos que aun no estan en estado final (completado, entregado, cancelado, rechazado). Se usa para polling de seguimiento en tiempo real cada 5 segundos.', auth: 'user', response: { success: true, data: [{ id: 11, orderCode: 'BNT-20260223-002', total: 12.50, status: 'preparando' }] } },
      { method: 'GET', path: '/:id', desc: 'Detalle del pedido', detail: 'Retorna la informacion completa de un pedido incluyendo todos los items, precios unitarios, subtotales y datos del QR.', auth: 'user', params: [{ name: 'id', type: 'integer', desc: 'ID del pedido' }], response: { success: true, data: { id: 10, orderCode: 'BNT-20260223-001', total: 18.00, status: 'completado', items: [{ name: 'Cerveza Artesanal', quantity: 2, price: 5.50, subtotal: 11.00 }], qrData: 'data:image/png;base64,...' } } },
      { method: 'GET', path: '/:id/pdf', desc: 'Descargar comprobante PDF', detail: 'Genera y descarga un comprobante PDF del pedido que incluye logo del negocio, codigo QR, detalle de productos, totales, puntos ganados y datos del negocio. Solo disponible para pedidos completados o entregados.', auth: 'user', params: [{ name: 'id', type: 'integer', desc: 'ID del pedido' }], response: 'Archivo PDF (Content-Type: application/pdf)' },
      { method: 'PUT', path: '/:id/cancel', desc: 'Cancelar pedido', detail: 'Cancela un pedido que este en estado "pendiente". No se pueden cancelar pedidos ya aprobados o en preparacion.', auth: 'user', params: [{ name: 'id', type: 'integer', desc: 'ID del pedido' }], body: { reason: 'Ya no deseo el pedido' }, bodyFields: [{ name: 'reason', type: 'string', required: false, desc: 'Motivo de cancelacion' }], response: { success: true, message: 'Pedido cancelado' } }
    ]
  },
  {
    id: 'admin-orders',
    name: 'Pedidos (Admin)',
    prefix: '/admin/orders',
    description: 'Gestion administrativa de pedidos. El personal aprueba, rechaza, completa y entrega pedidos. Incluye verificacion de codigos QR. Las notificaciones se envian automaticamente al usuario por Telegram (si esta vinculado) cuando cambia el estado del pedido.',
    endpoints: [
      { method: 'GET', path: '/pending', desc: 'Pedidos pendientes', detail: 'Lista todos los pedidos en estado "pendiente" que esperan aprobacion del personal, ordenados del mas antiguo al mas reciente.', auth: 'admin', response: { success: true, data: [{ id: 11, orderCode: 'BNT-20260223-002', userName: 'Maria Lopez', userPhone: '0991234567', table: '3', total: 12.50, status: 'pendiente', date: '2026-02-23T20:15:00Z', items: [{ name: 'Cerveza Artesanal', quantity: 2 }] }] } },
      { method: 'PUT', path: '/:id/approve', desc: 'Aprobar pedido', detail: 'Cambia el estado del pedido a "aprobado" y registra el personal que lo aprobo. Se notifica al usuario via Telegram.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del pedido' }], response: { success: true, message: 'Pedido aprobado', order: { id: 11, status: 'aprobado' } } },
      { method: 'PUT', path: '/:id/reject', desc: 'Rechazar pedido', detail: 'Rechaza el pedido con un motivo. Se notifica al usuario via Telegram con la razon del rechazo.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del pedido' }], body: { reason: 'Producto no disponible' }, bodyFields: [{ name: 'reason', type: 'string', required: true, desc: 'Motivo del rechazo' }], response: { success: true, message: 'Pedido rechazado', order: { id: 11, status: 'rechazado', rejectionReason: 'Producto no disponible' } } },
      { method: 'PUT', path: '/:id/complete', desc: 'Marcar como completado', detail: 'El pedido pasa a estado "completado". Se acreditan los puntos al usuario y se actualiza su nivel de membresia si corresponde.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del pedido' }], response: { success: true, message: 'Pedido completado', order: { id: 11, status: 'completado', pointsEarned: 12 } } },
      { method: 'PUT', path: '/:id/deliver', desc: 'Marcar como entregado', detail: 'Estado final del pedido. Confirma la entrega fisica al cliente.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del pedido' }], response: { success: true, message: 'Pedido entregado', order: { id: 11, status: 'entregado' } } },
      { method: 'POST', path: '/verify-qr', desc: 'Verificar codigo QR', detail: 'Valida un codigo QR escaneado contra los pedidos existentes. Se usa para confirmar la identidad del pedido fisicamente.', auth: 'admin', body: { qrCode: 'BNT-20260223-001', orderId: 10 }, bodyFields: [{ name: 'qrCode', type: 'string', required: true, desc: 'Codigo del QR escaneado' }, { name: 'orderId', type: 'integer', required: true, desc: 'ID del pedido' }], response: { valid: true, order: { id: 10, status: 'completado', user: 'Juan Perez' } } }
    ]
  },
  {
    id: 'profile',
    name: 'Perfil de Usuario',
    prefix: '/profile',
    description: 'Informacion detallada del perfil del usuario, incluyendo historial completo de movimientos de puntos, resumen de puntos ganados/canjeados, estadisticas de uso e informacion sobre los niveles de membresia disponibles. Los puntos actuales (puntos_actuales) se reinician automaticamente a 0 el dia 1 de cada mes; los puntos totales y el nivel de membresia no se modifican. Cada reinicio genera un movimiento de tipo "expirado" en el historial.',
    endpoints: [
      { method: 'GET', path: '/', desc: 'Perfil completo', detail: 'Retorna todos los datos del perfil incluyendo nivel de membresia, puntos y progreso hacia el siguiente nivel.', auth: 'user', response: { success: true, data: { id: 1, name: 'Juan Perez', email: 'juan@correo.com', phone: '0998765432', membershipLevel: 'plata', currentPoints: 1200, totalPoints: 3500, nextLevel: 'oro', pointsToNextLevel: 1500 } } },
      { method: 'PUT', path: '/', desc: 'Actualizar perfil', detail: 'Actualiza nombre y/o telefono del usuario.', auth: 'user', body: { name: 'Juan Perez M.', phone: '0991111111' }, response: { success: true, data: { id: 1, name: 'Juan Perez M.' } } },
      { method: 'GET', path: '/transactions', desc: 'Historial de movimientos', detail: 'Lista todos los movimientos de puntos del usuario: ganados por pedidos, canjeados por recompensas, expirados por reinicio mensual, bonos por vinculacion de Telegram, etc. El tipo "expirado" se genera automaticamente el dia 1 de cada mes cuando el sistema reinicia los puntos actuales a 0.', auth: 'user', response: { success: true, data: [{ id: 50, type: 'ganado', points: 18, description: 'Pedido BNT-20260223-001', referenceType: 'pedido', referenceId: 10, date: '2026-02-23T19:00:00Z' }, { id: 48, type: 'canjeado', points: -500, description: 'Canje: Cerveza Gratis', referenceType: 'canje', referenceId: 15, date: '2026-02-20T18:00:00Z' }, { id: 45, type: 'expirado', points: 200, description: 'Reinicio mensual de puntos - febrero de 2026', referenceType: 'sistema', referenceId: null, date: '2026-02-01T00:01:00Z' }] } },
      { method: 'GET', path: '/transactions/summary', desc: 'Resumen de puntos', detail: 'Resumen consolidado de puntos ganados, canjeados y saldo disponible.', auth: 'user', response: { success: true, data: { totalEarned: 3500, totalRedeemed: 2300, balance: 1200 } } },
      { method: 'GET', path: '/stats', desc: 'Estadisticas del usuario', detail: 'Metricas de comportamiento: total de pedidos, gasto acumulado, categoria favorita y fecha de registro.', auth: 'user', response: { success: true, data: { totalOrders: 25, totalSpent: 350.00, favoriteCategory: 'Cervezas', memberSince: '2025-06-15' } } },
      { method: 'GET', path: '/levels', desc: 'Niveles de membresia', detail: 'Informacion de los 4 niveles de membresia del sistema con sus umbrales de puntos y multiplicadores de ganancia.', auth: 'user', response: { success: true, data: [{ level: 'bronce', minPoints: 0, multiplier: 1.0, color: '#CD7F32' }, { level: 'plata', minPoints: 1000, multiplier: 1.1, color: '#C0C0C0' }, { level: 'oro', minPoints: 5000, multiplier: 1.2, color: '#FFD700' }, { level: 'platino', minPoints: 15000, multiplier: 1.5, color: '#8B5CF6' }] } }
    ]
  },
  {
    id: 'stats',
    name: 'Estadisticas (Admin)',
    prefix: '/stats',
    description: 'Dashboard administrativo con metricas completas del sistema: contadores, estadisticas de usuarios, puntos, canjes, metricas de ventas con graficos (ECharts) y gestion de canjes individuales por usuario.',
    endpoints: [
      { method: 'GET', path: '/dashboard', desc: 'Dashboard completo', detail: 'Retorna todas las estadisticas del sistema en una sola llamada: usuarios, productos, canjes, puntos, movimientos recientes y usuarios recientes.', auth: 'admin', response: { success: true, data: { totalUsuarios: 150, totalProductos: 25, totalRecompensas: 12, totalServicios: 5, totalCanjes: 89, puntosEmitidos: 125000, puntosCanjeados: 45000, usuariosPorNivel: [{ nivel_membresia: 'bronce', total: 80 }], canjesPorEstado: [{ estado: 'pendiente', total: 5 }] } } },
      { method: 'GET', path: '/summary', desc: 'Resumen de contadores', detail: 'Version reducida del dashboard con solo los contadores principales.', auth: 'admin', response: { success: true, data: { totalUsers: 150, totalProducts: 25, totalRedemptions: 89, pointsIssued: 125000 } } },
      { method: 'GET', path: '/metricas', desc: 'Metricas para graficos', detail: 'Datos estructurados para renderizar graficos con Apache ECharts: top productos vendidos, ventas por categoria, ingresos por periodo (ultimos 30 dias) y distribucion de usuarios por nivel de membresia.', auth: 'admin', response: { success: true, data: { topProductos: [{ nombre_producto: 'Cerveza Artesanal', total_vendido: 320, ingresos: 1760.00 }], ventasPorCategoria: [{ categoria: 'Cervezas', total_vendido: 500, ingresos: 2750.00 }], ingresosPorPeriodo: [{ fecha: '2026-02-20', total_pedidos: 15, ingresos: 225.50 }], usuariosPorNivel: [{ nivel_membresia: 'bronce', total: 80 }, { nivel_membresia: 'plata', total: 45 }] } } },
      { method: 'GET', path: '/users', desc: 'Estadisticas de usuarios', detail: 'Total de usuarios, distribucion por nivel y listado completo de usuarios con sus datos mapeados al formato del frontend.', auth: 'admin', response: { success: true, data: { totalUsers: 150, usersByLevel: [{ nivel_membresia: 'bronce', total: 80 }], recentUsers: [{ id: 1, name: 'Juan Perez', email: 'juan@correo.com', membership_level: 'plata', current_points: 1200, total_points: 3500 }] } } },
      { method: 'GET', path: '/points', desc: 'Estadisticas de puntos', detail: 'Total de puntos emitidos, canjeados y balance global del sistema.', auth: 'admin', response: { success: true, data: { pointsIssued: 125000, pointsRedeemed: 45000, pointsBalance: 80000 } } },
      { method: 'GET', path: '/redemptions', desc: 'Estadisticas de canjes', detail: 'Total de canjes, distribucion por estado y canjes recientes.', auth: 'admin', response: { success: true, data: { totalRedemptions: 89, redemptionsByStatus: [{ estado: 'pendiente', total: 5 }, { estado: 'usado', total: 84 }], recentRedemptions: [] } } },
      { method: 'GET', path: '/transactions', desc: 'Transacciones recientes', detail: 'Ultimos movimientos de puntos del sistema con informacion del usuario.', auth: 'admin', query: [{ name: 'limit', type: 'integer', required: false, desc: 'Cantidad de resultados (default: 10)' }], response: { success: true, data: [{ id: 100, type: 'ganado', points: 18, userName: 'Juan Perez', userEmail: 'juan@correo.com', date: '2026-02-23T19:00:00Z' }] } },
      { method: 'GET', path: '/users/:id/canjes', desc: 'Canjes de un usuario', detail: 'Historial de canjes de un usuario especifico con resumen de totales.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del usuario' }], response: { exito: true, usuario: { id: 1, nombre: 'Juan Perez', correo: 'juan@correo.com', puntosActuales: 1200, nivelMembresia: 'plata' }, canjes: [{ id: 15, recompensa: 'Cerveza Gratis', codigo: 'BNT-A1B2C3', puntosGastados: 500, estado: 'pendiente', fechaCanje: '2026-02-20T18:00:00Z' }], resumen: { totalCanjes: 5, puntosCanjeados: 2500 } } },
      { method: 'POST', path: '/canjes/:id/entregar', desc: 'Entregar canje', detail: 'Marca un canje como entregado/usado. Registra IP y user-agent del admin que realiza la entrega.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del canje' }], response: { exito: true, mensaje: 'Canje procesado exitosamente', canje: { id: 15, estado: 'usado', fechaUso: '2026-02-23T20:00:00Z' } } },
      { method: 'GET', path: '/canjes', desc: 'Todos los canjes', detail: 'Lista completa de canjes con filtro opcional por estado. Incluye resumen con totales. Soporta polling para actualizacion en tiempo real.', auth: 'admin', query: [{ name: 'status', type: 'string', required: false, desc: 'Filtrar por estado (pendiente/usado)' }, { name: 'limit', type: 'integer', required: false, desc: 'Limite de resultados (default: 50)' }], response: { exito: true, timestamp: '2026-02-23T20:00:00Z', resumen: { total: 89, pendientes: 5, usados: 84, puntosTotales: 45000 }, canjes: [] } },
      { method: 'GET', path: '/canjes/pendientes', desc: 'Canjes pendientes', detail: 'Solo los canjes en estado "pendiente" para notificaciones y dashboard.', auth: 'admin', response: { exito: true, timestamp: '2026-02-23T20:00:00Z', cantidad: 5, canjes: [{ id: 20, usuarioNombre: 'Maria Lopez', usuarioEmail: 'maria@correo.com', recompensa: 'Cerveza Gratis', codigo: 'BNT-X9Y8Z7', puntosGastados: 500, fechaCanje: '2026-02-23T19:30:00Z' }] } }
    ]
  },
  {
    id: 'staff',
    name: 'Personal',
    prefix: '/staff',
    description: 'Gestion del personal del bar (meseros, bartenders, encargados). Incluye control de turnos y vinculacion de cuentas de Telegram para recibir notificaciones de pedidos. El personal vinculado a Telegram recibe alertas en tiempo real de nuevos pedidos.',
    endpoints: [
      { method: 'GET', path: '/', desc: 'Listar personal', detail: 'Lista todo el personal registrado con su estado de turno y vinculacion de Telegram.', auth: 'user', response: { success: true, data: [{ id: 1, name: 'Carlos Ruiz', phone: '0991112233', email: 'carlos@bar.com', role: 'mesero', onShift: true, telegramLinked: true }] } },
      { method: 'GET', path: '/on-shift', desc: 'Personal en turno', detail: 'Solo el personal que esta actualmente en turno.', auth: 'user', response: { success: true, data: [{ id: 1, name: 'Carlos Ruiz', role: 'mesero' }] } },
      { method: 'GET', path: '/:id', desc: 'Obtener personal por ID', auth: 'user', params: [{ name: 'id', type: 'integer', desc: 'ID del personal' }], response: { success: true, data: { id: 1, name: 'Carlos Ruiz', phone: '0991112233', role: 'mesero', onShift: true } } },
      { method: 'PUT', path: '/:id/shift', desc: 'Cambiar estado de turno', detail: 'Activa o desactiva el turno de un miembro del personal.', auth: 'user', params: [{ name: 'id', type: 'integer', desc: 'ID del personal' }], body: { onShift: true }, response: { success: true, staff: { id: 1, onShift: true } } },
      { method: 'POST', path: '/', desc: 'Crear personal', detail: 'Registra un nuevo miembro del personal.', auth: 'admin', body: { name: 'Ana Garcia', phone: '0994445566', email: 'ana@bar.com', role: 'bartender' }, bodyFields: [{ name: 'name', type: 'string', required: true, desc: 'Nombre completo' }, { name: 'phone', type: 'string', required: true, desc: 'Telefono' }, { name: 'email', type: 'string', required: false, desc: 'Correo' }, { name: 'role', type: 'string', required: false, desc: 'Rol: mesero, bartender, encargado (default: mesero)' }], response: { success: true, data: { id: 3, name: 'Ana Garcia' } } },
      { method: 'PUT', path: '/:id', desc: 'Actualizar personal', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del personal' }], body: { name: 'Ana Garcia M.', role: 'encargada' }, response: { success: true, data: { id: 3 } } },
      { method: 'DELETE', path: '/:id', desc: 'Eliminar personal', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del personal' }], response: { success: true, message: 'Personal eliminado' } },
      { method: 'POST', path: '/:id/generate-code', desc: 'Generar codigo Telegram', detail: 'Genera un codigo temporal de 6 caracteres para vincular la cuenta de Telegram del personal. Expira en 10 minutos.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del personal' }], response: { success: true, code: 'ABCD12', expiresIn: 600 } },
      { method: 'DELETE', path: '/:id/telegram', desc: 'Desvincular Telegram', detail: 'Elimina la vinculacion de Telegram del personal.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID del personal' }], response: { success: true, message: 'Cuenta de Telegram desvinculada' } }
    ]
  },
  {
    id: 'photos',
    name: 'Fotos y Eventos',
    prefix: '/photos',
    description: 'Galeria de fotos y eventos del bar. Las fotos se muestran en el feed principal del usuario con un visor fullscreen con auto-avance cada 12 segundos. Las imagenes se almacenan en Cloudinary.',
    endpoints: [
      { method: 'GET', path: '/', desc: 'Listar fotos activas', detail: 'Retorna las fotos con estado activo para mostrar en la galeria publica.', auth: 'public', response: { success: true, count: 3, data: [{ id: 1, title: 'Noche de Karaoke', description: 'Evento del sabado pasado', imageUrl: 'https://res.cloudinary.com/...' }] } },
      { method: 'GET', path: '/:id', desc: 'Obtener foto por ID', auth: 'public', params: [{ name: 'id', type: 'integer', desc: 'ID de la foto' }], response: { success: true, data: { id: 1, title: 'Noche de Karaoke', imageUrl: 'https://res.cloudinary.com/...' } } },
      { method: 'GET', path: '/admin/all', desc: 'Todas las fotos (admin)', detail: 'Lista todas las fotos incluyendo las inactivas, con su public ID de Cloudinary.', auth: 'admin', response: { success: true, count: 5, data: [{ id: 1, title: 'Noche de Karaoke', isActive: true, cloudinaryPublicId: 'bar-bounty/foto1' }] } },
      { method: 'POST', path: '/', desc: 'Crear foto', detail: 'Sube una nueva foto al sistema. La imagen debe estar previamente subida a Cloudinary via /upload/image. Se envia notificacion global a todos los usuarios.', auth: 'admin', body: { title: 'Fiesta de Inauguracion', description: 'Gran apertura del bar', image_url: 'https://res.cloudinary.com/...', cloudinary_public_id: 'bar-bounty/foto1' }, bodyFields: [{ name: 'title', type: 'string', required: true, desc: 'Titulo de la foto' }, { name: 'description', type: 'string', required: false, desc: 'Descripcion' }, { name: 'image_url', type: 'string', required: true, desc: 'URL de Cloudinary' }, { name: 'cloudinary_public_id', type: 'string', required: false, desc: 'Public ID para poder eliminar la imagen' }], response: { success: true, message: 'Foto creada exitosamente', data: { id: 6 } } },
      { method: 'PUT', path: '/:id', desc: 'Actualizar foto', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID de la foto' }], body: { title: 'Titulo actualizado', is_active: false }, response: { success: true, message: 'Foto actualizada' } },
      { method: 'DELETE', path: '/:id', desc: 'Eliminar foto', detail: 'Elimina la foto de la base de datos y su imagen de Cloudinary. Se envia notificacion global.', auth: 'admin', params: [{ name: 'id', type: 'integer', desc: 'ID de la foto' }], response: { success: true, message: 'Foto eliminada' } }
    ]
  },
  {
    id: 'config',
    name: 'Configuracion',
    prefix: '/config',
    description: 'Configuracion dinamica del sistema almacenada en la tabla configuracion_negocio. Incluye multiplicadores de puntos, umbrales de membresia, colores, iconos y datos del negocio. Los cambios se reflejan inmediatamente en la aplicacion.',
    endpoints: [
      { method: 'GET', path: '/points', desc: 'Configuracion de puntos', detail: 'Retorna los valores de puntos por dolar y multiplicadores de cada nivel de membresia.', auth: 'public', response: { success: true, data: { puntos_por_dolar: 1, multiplicador_plata: 1.1, multiplicador_oro: 1.2, multiplicador_platino: 1.5 } } },
      { method: 'GET', path: '/membership', desc: 'Configuracion de membresia', detail: 'Umbrales de puntos necesarios para ascender de nivel.', auth: 'public', response: { success: true, data: { umbral_plata: 1000, umbral_oro: 5000, umbral_platino: 15000 } } },
      { method: 'GET', path: '/', desc: 'Todas las configuraciones', detail: 'Lista completa de todas las configuraciones del sistema organizadas por categoria.', auth: 'admin', response: { success: true, data: [{ clave: 'puntos_por_dolar', valor: '1', descripcion: 'Puntos otorgados por cada dolar gastado', categoria: 'puntos' }] } },
      { method: 'PUT', path: '/:key', desc: 'Actualizar configuracion', detail: 'Modifica el valor de una configuracion especifica por su clave.', auth: 'admin', params: [{ name: 'key', type: 'string', desc: 'Clave de la configuracion (ej: puntos_por_dolar)' }], body: { value: '2' }, bodyFields: [{ name: 'value', type: 'string', required: true, desc: 'Nuevo valor de la configuracion' }], response: { success: true, message: 'Configuracion actualizada' } }
    ]
  },
  {
    id: 'upload',
    name: 'Subida de Archivos',
    prefix: '/upload',
    description: 'Servicio de subida de imagenes a Cloudinary. Las imagenes se almacenan en la carpeta "bar-bounty" del servicio de Cloudinary configurado. Soporta formatos JPG, PNG y WebP.',
    endpoints: [
      { method: 'POST', path: '/image', desc: 'Subir imagen', detail: 'Sube una imagen a Cloudinary usando multipart/form-data. Retorna la URL publica y el public ID para referencia y eliminacion futura.', auth: 'admin', body: 'Multipart form-data con campo "image" (archivo JPG, PNG o WebP)', response: { success: true, url: 'https://res.cloudinary.com/demo/image/upload/v1/bar-bounty/imagen1.jpg', publicId: 'bar-bounty/imagen1' } },
      { method: 'DELETE', path: '/image/:publicId', desc: 'Eliminar imagen', detail: 'Elimina una imagen de Cloudinary por su public ID.', auth: 'admin', params: [{ name: 'publicId', type: 'string', desc: 'Public ID de Cloudinary (ej: bar-bounty/imagen1)' }], response: { success: true, message: 'Imagen eliminada de Cloudinary' } }
    ]
  },
  {
    id: 'search',
    name: 'Busqueda Global',
    prefix: '/search',
    description: 'Busqueda unificada que busca simultaneamente en productos, servicios y recompensas. Utiliza coincidencia parcial (ILIKE) para busquedas flexibles.',
    endpoints: [
      { method: 'GET', path: '/', desc: 'Buscar en todo el catalogo', detail: 'Busca el termino en nombres y descripciones de productos, servicios y recompensas. Retorna los resultados agrupados por tipo.', auth: 'public', query: [{ name: 'q', type: 'string', required: true, desc: 'Termino de busqueda' }], response: { success: true, data: { products: [{ id: 1, name: 'Cerveza Artesanal', price: 5.50 }], services: [], rewards: [{ id: 1, name: 'Cerveza Gratis', pointsRequired: 500 }] } } }
    ]
  },
  {
    id: 'comprobante',
    name: 'Comprobante Publico',
    prefix: '/comprobante',
    description: 'Acceso publico a comprobantes PDF mediante el codigo de pedido. Diseñado para ser accedido mediante el escaneo de codigos QR impresos en los comprobantes fisicos. No requiere autenticacion.',
    endpoints: [
      { method: 'GET', path: '/:codigo', desc: 'Descargar comprobante PDF', detail: 'Genera y retorna el comprobante PDF de un pedido usando su codigo unico. Solo funciona para pedidos en estado "completado" o "entregado". El PDF incluye logo del negocio, codigo QR, detalle de productos, totales y datos del establecimiento. Retorna 404 si el pedido no existe y 400 si no esta completado.', auth: 'public', params: [{ name: 'codigo', type: 'string', desc: 'Codigo unico del pedido (ej: BNT-20260223-001)' }], response: 'Archivo PDF (Content-Type: application/pdf) o pagina HTML de error' }
    ]
  },
  {
    id: 'notifications',
    name: 'Notificaciones Globales',
    prefix: '/notifications',
    description: 'Sistema de notificaciones push del administrador hacia los usuarios via polling. Cuando el admin crea, edita o elimina productos, recompensas, servicios o fotos, se inserta un registro en notificaciones_globales. El frontend consulta cada 30 segundos por nuevas notificaciones.',
    endpoints: [
      { method: 'GET', path: '/global', desc: 'Obtener notificaciones nuevas', detail: 'Retorna las notificaciones globales creadas despues de la fecha indicada en el parametro since. Limitado a 50 resultados ordenados del mas reciente al mas antiguo. Los tipos de notificacion incluyen: producto_creado, producto_actualizado, producto_eliminado, recompensa_creada, recompensa_actualizada, servicio_creado, servicio_actualizado, foto_creada, foto_eliminada, config_actualizada.', auth: 'public', query: [{ name: 'since', type: 'ISO 8601 date', required: false, desc: 'Fecha desde la cual buscar (default: 1970-01-01)' }], response: { success: true, data: [{ id: 12, tipo: 'foto_creada', titulo: 'Nueva foto', mensaje: 'Se publico "Noche de Karaoke"', fecha_creacion: '2026-02-23T20:00:00Z' }] } }
    ]
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    prefix: '/telegram',
    description: 'Integracion con Telegram para notificaciones en tiempo real. El bot permite a los usuarios vincular su cuenta, recibir codigos de recuperacion de contrasena y al personal recibir alertas de nuevos pedidos. Soporta modo webhook (produccion) y polling (desarrollo).',
    endpoints: [
      { method: 'POST', path: '/webhook', desc: 'Webhook de Telegram', detail: 'Endpoint llamado por los servidores de Telegram cuando el bot recibe un mensaje. Procesa comandos como /start, /vincular, /puntos, /menu y codigos de vinculacion.', auth: 'public', body: { update_id: 123456789, message: { chat: { id: 789012345 }, text: '/start' } }, response: '200 OK (sin cuerpo)' },
      { method: 'GET', path: '/status', desc: 'Estado del bot', detail: 'Consulta si el bot esta configurado en modo webhook o polling y si el webhook esta activo.', auth: 'public', response: { success: true, mode: 'webhook', webhook: { url: 'https://api.example.com/api/telegram/webhook', has_custom_certificate: false, pending_update_count: 0 } } },
      { method: 'POST', path: '/setup-webhook', desc: 'Configurar webhook', detail: 'Registra la URL del webhook en Telegram para recibir actualizaciones.', auth: 'public', response: { success: true, message: 'Webhook configurado', webhook: { url: 'https://api.example.com/api/telegram/webhook' } } },
      { method: 'DELETE', path: '/webhook', desc: 'Eliminar webhook', detail: 'Remueve el webhook de Telegram, haciendo que el bot cambie a modo polling.', auth: 'public', response: { success: true, message: 'Webhook eliminado, bot en modo polling' } }
    ]
  },
  {
    id: 'health',
    name: 'Health Check',
    prefix: '',
    description: 'Endpoint de verificacion de estado del servidor. Se usa para monitoreo y health checks de servicios como Railway, AWS o cualquier plataforma de despliegue.',
    endpoints: [
      { method: 'GET', path: '/health', desc: 'Estado del servidor', detail: 'Retorna confirmacion de que la API esta funcionando correctamente con timestamp actual.', auth: 'public', response: { success: true, message: 'API Sistema de Bounty funcionando correctamente', version: '1.0.0', timestamp: '2026-02-23T20:00:00Z' } }
    ]
  }
]

// =============================================
// RENDER
// =============================================

function getAuthLabel(auth) {
  return { public: 'Publico', user: 'JWT Token', admin: 'Admin' }[auth] || auth
}

function getAuthDesc(auth) {
  return {
    public: 'No requiere autenticacion. Acceso libre.',
    user: 'Requiere token JWT en header Authorization: Bearer <token>',
    admin: 'Requiere token JWT con rol de administrador (Authorization: Bearer <token>)'
  }[auth] || ''
}

function syntaxHighlight(json) {
  if (typeof json === 'string') return json
  const str = JSON.stringify(json, null, 2)
  return str.replace(/(".*?")(\s*:)?|(\b\d+\.?\d*\b)|(\btrue\b|\bfalse\b)|(\bnull\b)/g,
    (match, key, colon, num, bool, nil) => {
      if (key && colon) return `<span class="key">${key}</span>${colon}`
      if (key) return `<span class="string">${key}</span>`
      if (num) return `<span class="number">${num}</span>`
      if (bool) return `<span class="bool">${bool}</span>`
      if (nil) return `<span class="null-val">${nil}</span>`
      return match
    })
}

function renderParams(items, label) {
  if (!items || !items.length) return ''
  return `
    <p class="section-label">${label}</p>
    <table class="param-table">
      <tr><th>Nombre</th><th>Tipo</th><th></th><th>Descripcion</th></tr>
      ${items.map(p => `
        <tr>
          <td><span class="param-name">${p.name}</span></td>
          <td><span class="param-type">${p.type}</span></td>
          <td>${p.required === false ? '<span class="param-optional">opcional</span>' : '<span class="param-required">requerido</span>'}</td>
          <td>${p.desc || ''}</td>
        </tr>`).join('')}
    </table>`
}

function renderEndpointCard(ep, modulePrefix, index) {
  const fullPath = modulePrefix + ep.path
  const methodLower = ep.method.toLowerCase()
  const id = `ep-${modulePrefix.replace(/\//g, '-')}-${index}`
  const hasBody = ep.body && typeof ep.body === 'object' && ep.method !== 'GET'

  return `
    <div class="endpoint-card" id="${id}">
      <div class="endpoint-header" onclick="toggleEndpoint('${id}')">
        <span class="method-badge ${methodLower}">${ep.method}</span>
        <span class="endpoint-path">${fullPath}</span>
        <span class="endpoint-desc">${ep.desc}</span>
        <span class="auth-badge ${ep.auth}">${getAuthLabel(ep.auth)}</span>
        <span class="endpoint-chevron">&#9654;</span>
      </div>
      <div class="endpoint-body">
        ${ep.detail ? `<div class="endpoint-detail">${ep.detail}</div>` : ''}

        <div class="auth-detail ${ep.auth}">
          <strong>Autorizacion:</strong> ${getAuthDesc(ep.auth)}
        </div>

        <p class="section-label">URL completa</p>
        <div class="full-url"><span class="url-base">${BASE_URL}</span><span class="url-path">${fullPath}</span></div>

        ${ep.params ? renderParams(ep.params, 'Parametros de ruta') : ''}
        ${ep.query ? renderParams(ep.query, 'Parametros de consulta (query string)') : ''}

        ${hasBody ? `
          <p class="section-label">Cuerpo de la solicitud (JSON)</p>
          <div class="code-block">${syntaxHighlight(ep.body)}</div>
        ` : (typeof ep.body === 'string' ? `<p class="section-label">Cuerpo de la solicitud</p><div class="endpoint-detail">${ep.body}</div>` : '')}

        ${ep.bodyFields ? renderParams(ep.bodyFields, 'Campos del cuerpo') : ''}

        <p class="section-label">Respuesta esperada</p>
        <div class="code-block">${typeof ep.response === 'string' ? ep.response : syntaxHighlight(ep.response)}</div>
      </div>
    </div>`
}

function buildNav() {
  document.getElementById('nav-list').innerHTML = MODULES.map(m => `
    <li>
      <a href="#section-${m.id}" onclick="scrollToSection('${m.id}')">
        ${m.name}
        <span class="nav-count">${m.endpoints.length}</span>
      </a>
    </li>`).join('')
}

function renderAll() {
  const container = document.getElementById('endpoints-container')
  let total = 0, pub = 0, prot = 0, adm = 0

  container.innerHTML = MODULES.map(m => {
    const cards = m.endpoints.map((ep, i) => {
      total++
      if (ep.auth === 'public') pub++
      else if (ep.auth === 'admin') adm++
      else prot++
      return renderEndpointCard(ep, m.prefix, i)
    }).join('')

    return `
      <section class="module-section" id="section-${m.id}">
        <div class="module-header">
          <h2 class="module-title">${m.name}<span class="module-prefix">${m.prefix || '/'}</span></h2>
        </div>
        <p class="module-description">${m.description}</p>
        ${cards}
      </section>`
  }).join('')

  document.getElementById('total-endpoints').textContent = total
  document.getElementById('total-public').textContent = pub
  document.getElementById('total-protected').textContent = prot
  document.getElementById('total-admin').textContent = adm
}

// =============================================
// INTERACTIONS
// =============================================

function toggleEndpoint(id) {
  document.getElementById(id).classList.toggle('open')
}

function scrollToSection(id) {
  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  closeSidebar()
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open')
  document.getElementById('overlay').classList.toggle('active')
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open')
  document.getElementById('overlay').classList.remove('active')
}

// Scroll spy
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id.replace('section-', '')
      document.querySelectorAll('#nav-list a').forEach(a => a.classList.remove('active'))
      document.querySelector(`#nav-list a[href="#section-${id}"]`)?.classList.add('active')
    }
  })
}, { rootMargin: '-60px 0px -70% 0px' })

// Init
buildNav()
renderAll()
document.querySelectorAll('.module-section').forEach(s => observer.observe(s))
