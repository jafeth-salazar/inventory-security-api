# Seguridad de Base de Datos
**Profesor:** Maynor Barboza Acuna

## Proyecto Final

### Objetivo

Se pretende realizar un proyecto donde se ponga en practica los conocimientos adquiridos durante el curso de Seguridad de Base de Datos. Para eso se debe utilizar todas las técnicas aprendidas durante el cuatrimestre.

Para lo cual se propondrá el diseño de una base de datos relacional ficticia, a la cual se le aplicaran las diferentes técnicas y controles de seguridad vistos en clase.

La base de datos será en MS SQL Server. Pero además habrá que desarrollar una herramienta de consulta.

El proyecto deberá ser expuesto en clase al profesor y demás compañeros. Es grupal.

### Enunciado

Se darán dos modelos de base de datos que en forma grupal los estudiantes deberán desarrollar. Los modelos son solo propuestas que incluyen el mínimo de tablas que deben utilizar.

A partir de este enunciado se debe realizar:

---

### Primera parte: Base de Datos Transaccional

1. **Modelo relacional:** Donde se completen todas las tablas con sus respectivas campos, pk, fk y sus relaciones. Es libre de crear mas tablas si las consideran necesarias, pero el mínimo que debe existir son las propuestas.
2. **Modelo Físico en SQL Server:** La base de datos se debe crear en SQL server. Con sus respectivos objetos.

---

### Segunda parte: Conceptos de seguridad en BD

**1. Control de acceso:** La base de datos debe contar como mínimo con los siguientes usuarios, pueden existir mas pero estos como mínimo. Recuerde debe configurar los usuarios con el mínimo privilegio requerido.

| Usuario | Permiso |
|---|---|
| Operadores del sistema (4) | Solo escritura |
| Supervisores (3) | Escritura y lectura |
| Auditores (2) | Solo Lectura |
| Administrador de la base de datos | Administrador |
| Operador de back up | Backup Operator |

**2. Auditoria:** Se debe desarrollar un esquema paralelo al modelo de datos que permita auditar todas las tablas de la base de datos. De tal manera que se lleve una tabla "espejo" de cada una de las transaccionales. Pero que además permita guardar la siguiente información adicional.

| Campo | Tipo | Valor ejemplo |
|---|---|---|
| Movimiento | Varchar(30) | Insercción / Eliminación |
| Usuario_Aud | Varchar(50) | Usuario que hizo la acción |
| Fecha_aud | Datetime | Fecha y hora de la acción |
| EquipoOrigen | Varchar(50) | PC desde donde se realizó |
| IPOrigen | Varchar(50) | Dirección IP |

**3. Enmascaramiento:** Se debe desarrollar un esquema de enmascaramiento de datos de tal manera que solo los usuarios auditores y supervisores puedan ver los datos sin mascara. Los datos a enmascarar son todos aquellos que muestren nombres de personas o empresas, teléfonos, correos, además de valores de montos como totales, subtotales, impuestos, etc.

Debe estar preparado para defender entre otras cosas:
   1. El tipo de mascara usado en los campos.
   2. Por qué enmascararon el campo.
   3. O por qué no lo consideró enmascarar.

---

### Tercera parte: Aplicación para consultar tablas de auditoria

Debe elaborar una aplicación que permita consultar las **tablas de auditoria** considerando los siguientes aspectos:

1. Debe contener un menú para ir a las diferentes tablas.
2. Debe permitir filtrar por al menos:
   1. Tipo de acción.
   2. Rango de fechas.
   3. Usuario.
3. La aplicación y la herramienta que se seleccione es de libre elección, puede ser:
   1. Web.
   2. Una herramienta de BI como Power BI o Tableau.
   3. Escritorio.
4. La conexión a la aplicación se debe hacer con un perfil de usuario auditor.

---

### Cuarta parte: Presentación de la aplicación

El grupo debe hacer una presentación a la clase, que incluya:

1. Mostrar el modelo relacional de la base de datos.
2. Mostrar el modelo físico.
3. Demostrar con ejemplos los accesos de diferentes usuarios.
4. Generar movimientos que demuestren el uso de la auditoria.
5. Mostrar los campos enmascarados.
6. Hacer un demo de la aplicación de auditoria.
7. Mostrar los aspectos claves de las políticas de seguridad definidas.
8. Puede combinar el uso de una presentación, con la aplicación y la base de datos.

---

## Consideraciones y evaluación

**Modalidad:** Grupal.

**Recursos a utilizar**
- SQL Server
- Word
- Power point
- Draw.io

**Valor:** El valor del trabajo es de 40 % de la nota.

**Fecha de entrega:** Viernes 14 de agosto.

**A entregar:**
1. Back up de la base de datos full.
2. Documento Word con aspectos básicos del proyecto.
   1. Portada
   2. Modelo relacional
   3. Aspectos generales de la aplicación.

### Evaluación

| Item | Nota |
|---|---|
| **#1** | |
| Modelo Relacional | 10 |
| Base de datos Física | 10 |
| **#2** | |
| Usuarios | 5 |
| Auditoria | 10 |
| Enmascaramiento | 10 |
| **#3** | |
| Funcionalidad | 10 |
| Usabilidad | 10 |
| Seguridad | 10 |
| Cumplimiento de requerimientos (objetivo) | 10 |
| Calidad | 10 |
| **#4** | |
| Claridad y dominio del tema | 5 |
| Organización y estructura | 5 |
| Calidad visual | 5 |
| Comunicación oral | 5 |
| Gestión del tiempo | 5 |
| **%** | **40** |
| **Puntos** | **125** |

### Temas por grupo

| Tema | Grupo |
|---|---|
| Inventarios | |
| Ventas | |
| Matricula estudiantes | |
| Inventarios | |
| Ventas | |

---

## Modelos de base de datos a utilizar

### Sistema de Matrículas y Pagos

**1. Estudiantes**
- Propósito: almacenar la información básica de cada estudiante.
- Relación: 1 estudiante puede tener muchas matrículas → 1:N con Matrículas. 1 estudiante puede tener varios encargados (opcional según diseño).

**2. Encargados**
- Propósito: almacenar los datos del padre/madre/tutor responsable del estudiante.
- Relación: 1 encargado puede estar asociado a uno o varios estudiantes → 1:N con Estudiantes. También se puede vincular a la tabla Matrículas como responsable directo.

**3. Grados**
- Propósito: registrar los niveles o grados que ofrece la institución (preescolar, primaria, etc.).
- Relación: 1 grado puede estar asociado a muchas matrículas → 1:N con Matrículas. 1 grado puede tener varios cursos → 1:N con Cursos.

**4. Matrículas**
- Propósito: registrar la inscripción del estudiante a un grado para un año lectivo.
- Relación: Cada matrícula pertenece a un estudiante → N:1 con Estudiantes. Cada matrícula pertenece a un grado → N:1 con Grados. Cada matrícula genera muchos pagos → 1:N con Pagos.

**5. Pagos**
- Propósito: almacenar las mensualidades o pagos realizados por un estudiante.
- Relación: Cada pago pertenece a una matrícula → N:1 con Matrículas. Puede relacionarse con Métodos de Pago.

**6. Cursos**
- Propósito: registrar las materias que forman parte de un grado.
- Relación: Cada curso pertenece a un grado → N:1 con Grados. Opcional: relación con docentes en una tabla asignaciones.

**7. Docentes**
- Propósito: almacenar información de los profesores responsables de impartir cursos.
- Relación: 1 docente puede impartir muchos cursos → 1:N con Cursos. También puede relacionarse con Asistencia o Notas si se extiende el sistema.

### Sistema de Inventario

**1. Productos**
- Propósito: almacenar todos los artículos que maneja la empresa.
- Relaciones: Se relaciona con Categorías (N:1). Se relaciona con Entradas_Inventario y Salidas_Inventario (1:N). Se relaciona con Proveedores (N:1).

**2. Categorías**
- Propósito: agrupar los productos por tipo o familia.
- Relaciones: Relación con Productos (1:N).

**3. Proveedores**
- Propósito: registrar información de proveedores de productos o materias primas.
- Relaciones: Relación con Productos (1:N). Relación con Órdenes_Compra (1:N).

**4. Entradas_Inventario**
- Propósito: registrar movimientos de entrada (compra, devolución, producción terminada).
- Relaciones: Se relaciona con Productos (N:1). Se relaciona con Órdenes_Compra (N:1).

**5. Salidas_Inventario**
- Propósito: registrar movimientos de salida (venta, consumo interno, merma).
- Relaciones: Relación con Productos (N:1). Puede relacionarse con Clientes u Órdenes_Venta (N:1) si aplica.

**6. Órdenes_Compra**
- Propósito: registrar las compras realizadas para reabastecer inventario.
- Relaciones: Relación con Proveedores (N:1). Relación con Entradas_Inventario (1:N).

**7. Inventario_Actual**
- Propósito: almacenar la existencia actual de cada producto en cada bodega o ubicación.
- Relaciones: Relación con Productos (1:1 por bodega o 1:N si hay multi-bodega). Relación con Bodegas si se requiere multiubicación.

**8. Bodegas**
- Propósito: administrar las ubicaciones físicas donde se almacena mercancía.
- Relaciones: Relación con Inventario_Actual (1:N). Relación con Entradas_Inventario y Salidas_Inventario (1:N).

### Sistema de Ventas

**1. Tabla: CLIENTE**
- Propósito: Almacenar los datos personales y de contacto del cliente.
- Relaciones: Relación 1:N con VENTA (un cliente puede tener muchas ventas).

**2. Tabla: PRODUCTO**
- Propósito: Registrar todos los productos disponibles para la venta.
- Relaciones: Relación 1:N con DETALLE_VENTA (un producto puede aparecer en muchas ventas). Relación 1:N con INVENTARIO (un producto tiene un registro de stock).

**3. Tabla: VENTA**
- Propósito: Registrar cada transacción o venta realizada.
- Relaciones: Relación N:1 con CLIENTE (cada venta pertenece a un cliente). Relación 1:N con DETALLE_VENTA (una venta tiene varios productos). Relación N:1 con USUARIO (la venta la registra un usuario/cajero).

**4. Tabla: DETALLE_VENTA**
- Propósito: Especificar los productos vendidos en cada venta (líneas de detalle).
- Relaciones: Relación N:1 con VENTA. Relación N:1 con PRODUCTO.

**5. Tabla: INVENTARIO**
- Propósito: Controlar existencias y movimientos de stock de cada producto.
- Relaciones: Relación N:1 con PRODUCTO. Puede relacionarse con MOVIMIENTO_INVENTARIO si se amplía.

**6. Tabla: USUARIO**
- Propósito: Registrar las cuentas del personal que usa el sistema (cajeros, administradores, bodegueros).
- Relaciones: Relación 1:N con VENTA (cada venta la realiza un usuario).

**7. Tabla: METODO_PAGO**
- Propósito: Almacenar los tipos de pago disponibles (efectivo, tarjeta, transferencia, etc.)
- Relaciones: Relación 1:N con VENTA (una venta usa un método de pago).

**8. Tabla: PROVEEDOR**
- Propósito: Registrar los proveedores de los productos.
- Relaciones: Relación 1:N con PRODUCTO (un proveedor puede suministrar muchos productos).
