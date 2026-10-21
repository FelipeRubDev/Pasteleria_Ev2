**Pastelería 1000 Sabores**

---

## Descripción del Proyecto

Sitio web de una pastelería. Incluye catálogo dinámico, carrito persistente, validación de formularios y un panel de administración con control de accesos por rol.

---

## Características Principales

### Módulo Cliente (Público)
* **Catálogo Dinámico:** 8 productos en 5 categorías.
* **Detalle de Producto:** cada ficha se abre con el id en la URL, por ejemplo `detalle-producto.html?id=TC001`.
* **Carrito de Compras Persistente:** agregar, cambiar cantidad, eliminar y calcular el total en pesos. Se mantiene al recargar.
* **Validación de Formularios:** dominio del correo limitado a `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`, y RUN validado con `pattern` sin puntos ni guión.
* **Región y Comuna:** selectores en cascada, la comuna se carga según la región elegida.

### Módulo de Administración
* **Simulación de Roles:** Administrador, Vendedor y Cliente, asignados según el texto del correo.
* **Control de Accesos:** el Vendedor no ve las acciones exclusivas de Administrador.
* **Alerta de Stock Crítico:** indicador rojo cuando el stock es igual o menor al umbral configurado.
* **Gestor de Inventario:** reabastecer stock, eliminar productos y agregar productos nuevos.

---

## Tecnologías Utilizadas

* **HTML5**
* **CSS3**
* **JavaScript**
* **Bootstrap 5.3.3** 

---

## Cuentas de Prueba

El ingreso no valida contraseña, solo el dominio del correo.

* `admin@duoc.cl` entra como Administrador.
* `profesor@profesor.duoc.cl` entra como Vendedor.
* `cliente@gmail.com` entra como Cliente.
