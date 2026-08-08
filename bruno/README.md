# Colección Bruno — inventory-security-api

Colección de [Bruno](https://www.usebruno.com/) con los 33 endpoints reales de
la API (`Auth` + `Inventory/catalogo` + `Inventory/movimientos`). Existe para
probar manualmente, con logins reales de SQL Server, que el control de acceso
por rol vive en la base de datos y no en el código — complementa (no
reemplaza) los tests automatizados de `test/*.e2e-spec.ts`.

## Cómo abrirla

1. Instalá [Bruno](https://www.usebruno.com/downloads) (app de escritorio).
2. `Open Collection` → seleccioná esta carpeta `bruno/`.
3. Levantá la API (`docker compose up --build`, o `npm run start:dev`
   apuntando a una BD ya levantada).

## Elegí un entorno y completá tus credenciales

Hay 4 entornos (arriba a la derecha en Bruno): **Operador**, **Supervisor**,
**Auditor**, **App-Tecnica**. Cada uno tiene dos variables `usuario` y
`password` marcadas como **secretas** (`vars:secret`) — Bruno las guarda
cifradas localmente y **nunca las escribe en el archivo `.bru`**, así que es
seguro completarlas y el archivo sigue siendo commiteable sin filtrar nada.

Completá `usuario`/`password` con un login real de
`sql/01_logins_and_roles.sql`, por ejemplo:

| Entorno | Logins de ejemplo |
|---|---|
| Operador | `inv_operador1` … `inv_operador4` (solo escritura) |
| Supervisor | `Jafeth`, `Adrian`, `Diego` (lectura y escritura, sin máscara) |
| Auditor | `inv_auditor1`, `inv_auditor2` (solo lectura, sin máscara) |
| App-Tecnica | `inventory_app` (igual que auditor; procesos, no personas) |

## Login y token

`Auth/Login` guarda el `accessToken` de la respuesta en una variable de
runtime; el resto de los requests heredan `Bearer {{accessToken}}` desde la
autenticación de la colección (`auth: inherit`). No hay que copiar/pegar el
JWT a mano en ningún lado.

`Auth/Logout` cierra esa sesión SQL explícitamente (`closeSession`). Como
Bruno corre las carpetas completas en orden, si usás "Run Collection" sobre
toda la colección `Logout` se ejecuta junto con `Login` al principio (ambos
viven en la carpeta `Auth`) — para probar el flujo real de login → operar →
logout, corré `Auth/Login` una vez, las carpetas `Catalogo`/`Movimientos` en
orden, y `Auth/Logout` a mano al final de la sesión de pruebas.

## Orden pensado para correr de punta a punta

`Catalogo` (Categorias → Proveedores → Bodegas → Productos) y luego
`Movimientos` (Ordenes-Compra → Entradas-Inventario → Inventario-Actual →
Salidas-Inventario) están numerados para contar una historia real: se crea
una categoría, un proveedor, una bodega y un producto; se registra una orden
de compra y una entrada de 50 unidades; se lista el inventario actual
(debería reflejar 50); se registra una salida de 5 unidades. El request
`Salidas-Inventario/Crear salida de inventario` usa `cantidad: 5` a propósito
(menor a las 50 que entraron) para que el flujo feliz funcione — subile la
cantidad más allá del stock disponible si querés ver el `400
StockInsuficienteError` a propósito.

Los `Eliminar *` de cada carpeta de `Catalogo` NO son parte de este flujo
principal — son para pruebas sueltas de `DELETE`. Si los corrés después de
haber generado movimientos con esos mismos registros (producto, categoría,
proveedor, bodega), SQL Server va a rechazar el `DELETE` con un error de
llave foránea: es el comportamiento correcto de integridad referencial, no
un bug de la colección.

## Qué esperar según el rol

La API nunca decide el permiso — cada request se ejecuta con la conexión SQL
del usuario que hizo login, y SQL Server acepta o rechaza según sus
`GRANT`/`DENY` reales (ver tabla de roles en `CLAUDE.md`):

- **Operador**: los `POST` de movimientos (entradas/salidas) deberían
  funcionar; cualquier `GET`/`PATCH`/`DELETE` de catálogo debería fallar con
  el error crudo que devuelve el driver de SQL Server al rechazar el
  `SELECT`/`UPDATE`/`DELETE` — no un `403` inventado por la API.
- **Supervisor**: todo debería funcionar, y los campos enmascarados (si ya
  están habilitados) deberían verse sin máscara.
- **Auditor**/**App-Tecnica**: los `GET` deberían funcionar; cualquier
  `POST`/`PATCH`/`DELETE` debería fallar de la misma manera que con
  Operador, pero en sentido inverso (Auditor no tiene permiso de escritura).

Un login inválido en `Auth/Login` responde `401` con
`CredencialesInvalidasError` antes de llegar a ningún otro endpoint.
