// Datos iniciales
const PRODUCTOS_BASE = [
    { id: "TC001", nombre: "Torta Cuadrada de Chocolate", categoria: "Tortas Cuadradas", precio: 45000, stock: 8, stockCritico: 3, desc: "Deliciosa torta de chocolate con capas de ganache y avellanas.", img: "img/torta_cuadrada_choc.jpg" },
    { id: "TC002", nombre: "Torta Cuadrada de Frutas", categoria: "Tortas Cuadradas", precio: 50000, stock: 6, stockCritico: 2, desc: "Frutas frescas y crema chantilly sobre suave bizcocho.", img: "img/torta_cua_frutas.jpg" },
    { id: "TT001", nombre: "Torta Circular de Vainilla", categoria: "Tortas Circulares", precio: 40000, stock: 5, stockCritico: 2, desc: "Bizcocho clásico relleno con crema pastelera.", img: "img/torta_circ_vainilla.jpg" },
    { id: "TT002", nombre: "Torta Circular de Manjar", categoria: "Tortas Circulares", precio: 42000, stock: 2, stockCritico: 2, desc: "Torta tradicional chilena con manjar y nueces.", img: "img/torta_circ_manjar.jpg" },
    { id: "P1001", nombre: "Mousse de Chocolate", categoria: "Postres Individuales", precio: 5000, stock: 15, stockCritico: 5, desc: "Postre individual cremoso de alta calidad.", img: "img/mousse_choc.jpg" },
    { id: "P1002", nombre: "Tiramisú Clásico", categoria: "Postres Individuales", precio: 5500, stock: 12, stockCritico: 4, desc: "Postre italiano con capas de café y mascarpone.", img: "img/tiramisu.jpg" },
    { id: "PSA001", nombre: "Torta Sin Azúcar de Naranja", categoria: "Productos Sin Azúcar", precio: 48000, stock: 4, stockCritico: 2, desc: "Torta ligera endulzada naturalmente.", img: "img/torta_naranja.jpg" },
    { id: "PV001", nombre: "Torta Vegana de Chocolate", categoria: "Productos Vegana", precio: 50000, stock: 3, stockCritico: 2, desc: "Torta de chocolate sin ingredientes de origen animal.", img: "img/torta_veg_choc.jpg" }
];

// Datos en localStorage
function leerDatos(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

function buscarProducto(id) {
    for (const p of leerDatos("productos")) {
        if (p.id === id) return p;
    }
    return null;
}

// Al cargar la página: sembrar productos y pintar solo lo que existe en cada página
document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("productos")) {
        guardarDatos("productos", PRODUCTOS_BASE);
    }

    actualizarInsigniaCarrito();

    if (document.getElementById("contenedor-catalogo")) cargarCatalogoProductos();
    if (document.getElementById("prod-nombre")) cargarDetalleProducto();
    if (document.getElementById("items-carrito")) cargarVistaCarrito();
    if (document.getElementById("tabla-productos-admin")) cargarProductosAdmin();
    if (window.location.pathname.includes("admin/")) aplicarControlDeAccesoRol();
});

// Carrito
function actualizarInsigniaCarrito() {
    let totalItems = 0;
    for (const item of leerDatos("carrito")) {
        totalItems = totalItems + item.cantidad;
    }

    const insignia = document.getElementById("cart-count");
    if (insignia) insignia.textContent = totalItems;
}

function guardarCarrito(carrito) {
    guardarDatos("carrito", carrito);
    actualizarInsigniaCarrito();
}

function agregarProductoAlCarrito(idProducto, cantidad, mensaje) {
    const producto = buscarProducto(idProducto);
    if (!producto) return;

    const carrito = leerDatos("carrito");

    // Si el producto ya está con el mismo mensaje, se suma la cantidad
    let itemExistente = null;
    for (const item of carrito) {
        if (item.id === idProducto && item.mensaje === mensaje) itemExistente = item;
    }

    if (itemExistente) {
        itemExistente.cantidad = itemExistente.cantidad + cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            img: producto.img,
            cantidad: cantidad,
            mensaje: mensaje
        });
    }

    guardarCarrito(carrito);
    alert("¡" + producto.nombre + " añadido al carrito con éxito!");
}

// El botón del catálogo agrega 1 unidad sin mensaje
function agregarDesdeCatalogo(idProducto) {
    agregarProductoAlCarrito(idProducto, 1, "");
}

function cargarVistaCarrito() {
    const contenedor = document.getElementById("items-carrito");
    const totalElem = document.getElementById("total-carrito");
    if (!contenedor) return;

    const carrito = leerDatos("carrito");
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-secondary py-4">Tu carrito de compras está vacío.</p>';
        if (totalElem) totalElem.textContent = "$0";
        return;
    }

    let total = 0;

    for (let idx = 0; idx < carrito.length; idx++) {
        const item = carrito[idx];
        const subtotal = item.precio * item.cantidad;
        total = total + subtotal;

        let htmlMensaje = "";
        if (item.mensaje) {
            htmlMensaje = '<small class="text-secondary d-block">Mensaje: "' + item.mensaje + '"</small>';
        }

        contenedor.innerHTML += `
            <div class="d-flex align-items-center justify-content-between border-bottom py-3 gap-2 flex-wrap">
                <img src="${item.img}" alt="${item.nombre}" class="img-carrito rounded">
                <div class="flex-grow-1">
                    <h5 class="mb-1">${item.nombre}</h5>
                    ${htmlMensaje}
                    <span class="precio">$${item.precio.toLocaleString("es-CL")}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-outline-secondary btn-sm" onclick="cambiarCantidadCarrito(${idx}, -1)">-</button>
                    <span class="fw-bold">${item.cantidad}</span>
                    <button class="btn btn-outline-secondary btn-sm" onclick="cambiarCantidadCarrito(${idx}, 1)">+</button>
                </div>
                <div class="text-end">
                    <span class="precio d-block">$${subtotal.toLocaleString("es-CL")}</span>
                    <button class="btn btn-link btn-sm text-danger" onclick="eliminarDelCarrito(${idx})">Eliminar</button>
                </div>
            </div>
        `;
    }

    if (totalElem) totalElem.textContent = "$" + total.toLocaleString("es-CL");
}

function cambiarCantidadCarrito(idx, cambio) {
    const carrito = leerDatos("carrito");
    carrito[idx].cantidad = carrito[idx].cantidad + cambio;
    if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);

    guardarCarrito(carrito);
    cargarVistaCarrito();
}

function eliminarDelCarrito(idx) {
    const carrito = leerDatos("carrito");
    carrito.splice(idx, 1);
    guardarCarrito(carrito);
    cargarVistaCarrito();
}

function procesarPago() {
    if (leerDatos("carrito").length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    alert("¡Gracias por tu compra! Tu pedido ha sido registrado.");
    localStorage.removeItem("carrito");
    location.reload();
}

// Catalogo y detalle producto
function cargarCatalogoProductos() {
    const contenedor = document.getElementById("contenedor-catalogo");
    if (!contenedor) return;

    const productos = leerDatos("productos");
    contenedor.innerHTML = "";

    // Lista de categorías sin repetir
    const categorias = [];
    for (const p of productos) {
        if (!categorias.includes(p.categoria)) categorias.push(p.categoria);
    }

    for (const cat of categorias) {
        let html = '<h2 class="border-bottom pb-2 my-4">' + cat + '</h2><div class="row g-4">';

        for (const prod of productos) {
            if (prod.categoria !== cat) continue;

            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${prod.img}" alt="${prod.nombre}" class="card-img-top imagen-producto">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${prod.nombre}</h5>
                            <p class="card-text text-secondary flex-grow-1">${prod.desc}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="precio fs-5">$${prod.precio.toLocaleString("es-CL")}</span>
                                <div>
                                    <button class="btn btn-primary btn-sm" onclick="agregarDesdeCatalogo('${prod.id}')">+ Carrito</button>
                                    <a href="detalle-producto.html?id=${prod.id}" class="btn btn-outline-secondary btn-sm">Detalle</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += "</div>";
        contenedor.innerHTML += html;
    }
}

function cargarDetalleProducto() {
    // Leer el id desde la URL, por ejemplo: detalle-producto.html?id=TC001
    const params = new URLSearchParams(window.location.search);
    const prod = buscarProducto(params.get("id"));

    if (!prod) {
        document.getElementById("prod-nombre").textContent = "Producto no encontrado";
        return;
    }

    document.getElementById("prod-nombre").textContent = prod.nombre;
    document.getElementById("prod-precio").textContent = "$" + prod.precio.toLocaleString("es-CL");
    document.getElementById("prod-desc").textContent = prod.desc;
    document.getElementById("prod-img").src = prod.img;

    document.getElementById("btn-agregar-carrito").onclick = function () {
        const cant = parseInt(document.getElementById("prod-cantidad").value, 10) || 1;
        const msj = document.getElementById("prod-mensaje").value.trim();
        agregarProductoAlCarrito(prod.id, cant, msj);
    };
}

// Formularios (Ingreso, registro, contacto)
const COMUNAS_POR_REGION = {
    "Arica y Parinacota": ["Arica"],
    "Tarapacá": ["Iquique"],
    "Antofagasta": ["Antofagasta"],
    "Atacama": ["Copiapó"],
    "Coquimbo": ["La Serena"],
    "Valparaíso": ["Valparaíso"],
    "Región Metropolitana": ["Santiago", "Maipú", "Puente Alto", "La Florida", "San Bernardo", "Peñalolén", "Pudahuel", "Las Condes", "Ñuñoa", "Providencia"],
    "O'Higgins": ["Rancagua"],
    "Maule": ["Talca"],
    "Ñuble": ["Chillán"],
    "Biobío": ["Concepción"],
    "La Araucanía": ["Temuco"],
    "Los Ríos": ["Valdivia"],
    "Los Lagos": ["Puerto Montt"],
    "Aysén": ["Coyhaique"],
    "Magallanes": ["Punta Arenas"]
};

function cargarComunas() {
    const region = document.getElementById("reg-region").value;
    const select = document.getElementById("reg-comuna");

    select.innerHTML = '<option value="">Selecciona una comuna</option>';
    for (const comuna of COMUNAS_POR_REGION[region] || []) {
        select.innerHTML += '<option value="' + comuna + '">' + comuna + "</option>";
    }

    select.disabled = !region;
}

const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

function esCorreoValido(correo) {
    if (!correo.includes("@")) return false;

    const dominio = correo.trim().split("@")[1];
    return DOMINIOS_PERMITIDOS.includes(dominio);
}

function validarIngreso() {
    const correo = document.getElementById("ing-correo").value;

    if (!esCorreoValido(correo)) {
        alert("Dominio de correo no permitido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return false;
    }

    // El rol se define según el correo
    let rol = "Cliente";
    if (correo.includes("admin")) rol = "Administrador";
    else if (correo.includes("profesor")) rol = "Vendedor";

    guardarDatos("usuarioLogueado", { correo: correo, rol: rol });
    alert("¡Bienvenido! Sesión iniciada como: " + rol);

    if (rol === "Cliente") window.location.href = "index.html";
    else window.location.href = "admin/index.html";
    return false;
}

function validarRegistro() {
    const correo = document.getElementById("reg-correo").value;
    const clave = document.getElementById("reg-clave").value;
    const claveConfirma = document.getElementById("reg-clave-confirma").value;

    if (!esCorreoValido(correo)) {
        alert("Correo no permitido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return false;
    }
    if (clave !== claveConfirma) {
        alert("Las contraseñas no coinciden.");
        return false;
    }

    const usuarios = leerDatos("usuarios");
    usuarios.push({
        nombre: document.getElementById("reg-nombre").value.trim(),
        run: document.getElementById("reg-run").value.trim(),
        correo: correo,
        region: document.getElementById("reg-region").value,
        comuna: document.getElementById("reg-comuna").value,
        telefono: document.getElementById("reg-telefono").value.trim(),
        rol: "Cliente"
    });
    guardarDatos("usuarios", usuarios);

    alert("¡Cuenta creada exitosamente!");
    window.location.href = "ingreso.html";
    return false;
}

function validarContacto() {
    const correo = document.getElementById("cnt-correo").value;

    if (!esCorreoValido(correo)) {
        alert("Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return false;
    }

    alert("¡Mensaje enviado con éxito!");
    return false;
}

//Panel de administración
function aplicarControlDeAccesoRol() {
    const sesion = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");

    if (!sesion) {
        alert("Debes iniciar sesión para entrar al panel.");
        window.location.href = "../ingreso.html";
        return;
    }

    const banner = document.getElementById("mensaje-rol-usuario");
    if (banner) banner.textContent = "Sesión activa como: " + sesion.rol;

    // El Vendedor no ve las acciones exclusivas de Administrador
    if (sesion.rol === "Vendedor") {
        for (const el of document.querySelectorAll(".solo-admin")) {
            el.style.display = "none";
        }
    }
}

function cargarProductosAdmin() {
    const tabla = document.getElementById("tabla-productos-admin");
    if (!tabla) return;

    tabla.innerHTML = "";

    for (const p of leerDatos("productos")) {
        let htmlStock;
        if (p.stock <= p.stockCritico) {
            htmlStock = '<span class="badge bg-danger">⚠️ ' + p.stock + ' (Stock Crítico)</span>';
        } else {
            htmlStock = '<span class="badge bg-success">' + p.stock + ' unidades</span>';
        }

        tabla.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>$${p.precio.toLocaleString("es-CL")}</td>
                <td>${htmlStock}</td>
                <td class="solo-admin">
                    <button class="btn btn-primary btn-sm" onclick="reabastecerStockAdmin('${p.id}')">+ Stock</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProductoAdmin('${p.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    }
}

function reabastecerStockAdmin(id) {
    const productos = leerDatos("productos");

    let indice = -1;
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) indice = i;
    }
    if (indice === -1) return;

    const entrada = prompt('Nuevo stock para "' + productos[indice].nombre + '" (actual: ' + productos[indice].stock + '):', productos[indice].stock);
    if (entrada === null) return;

    const nuevoStock = parseInt(entrada, 10);
    if (isNaN(nuevoStock) || nuevoStock < 0) {
        alert("Ingrese un número válido mayor o igual a 0.");
        return;
    }

    productos[indice].stock = nuevoStock;
    guardarDatos("productos", productos);
    alert("Stock actualizado a " + nuevoStock + " unidades.");
    cargarProductosAdmin();
}

function eliminarProductoAdmin(id) {
    if (!confirm("¿Desea eliminar este producto?")) return;

    const productos = leerDatos("productos").filter(p => p.id !== id);
    guardarDatos("productos", productos);
    cargarProductosAdmin();
}

function guardarProductoAdmin() {
    const code = document.getElementById("adm-code").value.trim();

    if (buscarProducto(code)) {
        alert("Error: ya existe un producto con ese código.");
        return false;
    }

    const productos = leerDatos("productos");
    productos.push({
        id: code,
        nombre: document.getElementById("adm-nombre").value.trim(),
        categoria: document.getElementById("adm-categoria").value,
        precio: Number(document.getElementById("adm-precio").value),
        stock: Number(document.getElementById("adm-stock").value),
        stockCritico: Number(document.getElementById("adm-stock-critico").value),
        desc: "Nuevo producto registrado",
        img: document.getElementById("adm-img").value.trim()
    });
    guardarDatos("productos", productos);

    alert("¡Producto registrado con éxito!");
    window.location.href = "productos.html";
    return false;
}
