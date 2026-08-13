# inventory-security-api

Proyecto Final del curso de Seguridad de Base de Datos (tema: **Inventario**). Ver
`Proyecto Final 2DO 2026.md` para el enunciado completo. Este documento define cómo
se organiza el código, no el modelo de datos (eso vive en `sql/`).

## Qué es esta API realmente

No es un CRUD genérico: es la pieza de software que le permite al profesor **ver
en vivo que el control de acceso vive en SQL Server, no en el código**. Dos
responsabilidades:

1. **Inventario** — alta de productos, entradas/salidas de bodega, órdenes de
   compra, etc. (operadores y supervisores).
2. **Visor de auditoría** (Parte 3 del enunciado) — consulta de las tablas
   espejo del schema `audit`, con filtros por acción, rango de fechas y usuario.

Ambas responsabilidades comparten el mismo mecanismo de seguridad: **la API no
tiene su propio sistema de usuarios/roles**. Un usuario inicia sesión con sus
credenciales reales de SQL Server (`Jafeth`, `inv_auditor1`, `inventory_app`,
etc. — ver `sql/01_logins_and_roles.sql`), el backend abre la conexión a MSSQL
con esas credenciales exactas, y todo lo que esa conexión puede o no puede
hacer lo decide SQL Server (los `GRANT`/`DENY` que ya creamos). La API es un
proxy delgado, no un segundo punto de autorización.

Esto también es lo que hace que la auditoría (Parte 2.2) tenga sentido: los
triggers del schema `audit` capturan `SUSER_SNAME()` / `ORIGINAL_LOGIN()` para
llenar `Usuario_Aud`. Si todas las peticiones de la API llegaran con un único
login compartido, esa columna perdería su valor. Por eso cada request debe
ejecutarse con la conexión del usuario real que la originó.

## Stack

- **Node 22** (ver `.nvmrc`) · **NestJS 11** · TypeScript estricto
- **TypeORM** contra **SQL Server 2022** (`mcr.microsoft.com/mssql/server:2022-latest`)
- **Docker Compose** para levantar `api` + `db` (ver `docker-compose.yml`)
- Jest para unit/e2e

## Arquitectura: Clean Architecture + Hexagonal (Ports & Adapters)

Cada módulo es una vertical slice autocontenida bajo `src/modules/`, con
cuatro capas. La regla de dependencia es de afuera hacia adentro — nunca al
revés:

```
Presentation → Application → Domain
Infrastructure → Domain
```

- **`domain/`** — entidades, value objects y los *ports* (interfaces) que la
  capa de aplicación necesita. Cero imports de NestJS, TypeORM o `mssql`. Si
  una clase aquí importa un decorador de Nest, está en la carpeta equivocada.
- **`application/`** — casos de uso (una clase = una acción de negocio, p.ej.
  `RegistrarEntradaInventario`, `ListarBitacoraAuditoria`), servicios,
  listeners y jobs de NestJS. Dependen solo de los ports del dominio, nunca de
  una implementación concreta.
- **`infrastructure/`** — entidades TypeORM, adapters que implementan los
  ports contra la base de datos, y el módulo de Nest que conecta todo con
  inyección de dependencias (`{ provide: PRODUCTO_REPOSITORY, useClass:
  TypeOrmProductoRepository }`).
- **`presentation/`** — controllers REST y sus DTOs de request/response.
  Solo mapea HTTP ↔ casos de uso; no conoce TypeORM ni decide el rol de quien
  llama (eso lo resuelve SQL Server, ver más abajo).

```
src/
  modules/
    shared/
      domain/                # Value objects transversales (Dinero, Email, Telefono)
      infrastructure/
        sql-session/          # Ver "Sesión SQL dinámica" abajo
    auth/
      domain/
      application/            # Autenticar(usuario, password) -> Sesión
      infrastructure/
        auth.module.ts
      presentation/
        auth.controller.ts    # POST /auth/login (única ruta @Public())
    inventory/
      catalogo/                # Producto, Categoria, Proveedor, Bodega
        domain/
          ports/                 # ProductoRepositoryPort, BodegaRepositoryPort...
        application/
          use-cases/
        infrastructure/
          persistence/typeorm/   # Entidades TypeORM + repositorios concretos
        presentation/
          http/                  # Controllers + DTOs
        catalogo.module.ts
      movimientos/             # EntradaInventario, SalidaInventario, OrdenCompra, InventarioActual
        domain/
          ports/                 # EntradaInventarioRepositoryPort...
        application/
          use-cases/             # RegistrarEntradaInventario, RegistrarSalidaInventario...
        infrastructure/
          persistence/typeorm/   # Entidades TypeORM + repositorios concretos
                                  # (dependen de las entidades de ../catalogo)
        presentation/
          http/
        movimientos.module.ts
      inventory.module.ts     # Agrega CatalogoModule + MovimientosModule
    audit/
      domain/
      application/             # ListarBitacoraAuditoria (filtros: accion, rango fechas, usuario)
      infrastructure/
        persistence/typeorm/   # Solo lectura sobre el schema `audit`
        audit.module.ts
      presentation/
        http/
  infrastructure/
    persistence/typeorm/       # DataSource + migraciones + seed del CLI — cruza todos los
                                # módulos (una sola tabla de migraciones para toda la DB),
                                # por eso vive fuera de modules/ y no dentro de un módulo
  app.module.ts
  main.ts
```

### Un solo estilo — hexagonal

Todo módulo (`shared`, `auth`, `inventory`, `audit`) sigue el split
`domain/application/infrastructure/presentation` de arriba — no existe (ni va
a existir) una estructura "legacy" plana (`entities/`, `controllers/`, `dtos/`
sueltos en la raíz del módulo) para migrar. El proyecto arrancó directamente
con Hexagonal, así que esto no es una migración en curso sino la convención
desde el primer commit de cada módulo.

Cualquier módulo nuevo que se agregue a futuro sigue el mismo patrón.

### Sesión SQL dinámica (la pieza central)

Un `SqlSessionPort` en `shared/` con dos responsabilidades:

1. `authenticate(username, password)` — intenta abrir un `DataSource` de
   TypeORM contra `InventorySecurityDB` usando esas credenciales. Si SQL
   Server rechaza el login (usuario no existe, password incorrecta), la
   autenticación falla ahí mismo — no hay lista de usuarios que mantener en
   la app.
2. `getDataSource(sessionId)` — devuelve el `DataSource` ya autenticado
   asociado a la sesión activa.

El adapter (`infrastructure/sql-session/typeorm-sql-session.adapter.ts`)
guarda esos `DataSource` en memoria, indexados por un `sessionId` que viaja en
un JWT de vida corta emitido tras el login. Un `SqlSessionGuard` en cada
request resuelve el `sessionId` del JWT y expone el `DataSource` correcto al
resto de la petición. Logout / expiración del JWT cierra la conexión.

**Transporte: JWT Bearer, no API Key.** Una API key es un secreto único y
estático por cliente — sirve para servicio-a-servicio, no para representar a
una persona con un rol de SQL Server que puede cambiar (password rotada,
login deshabilitado, etc.). Aquí el flujo es:

1. `POST /auth/login` es la **única ruta pública** — recibe `usuario`/
   `password` reales de SQL Server y se los pasa tal cual a
   `SqlSessionPort.authenticate`.
2. Si el login contra SQL Server tiene éxito, se emite un JWT de vida corta
   con el `sessionId` adentro. El JWT nunca contiene la password ni el rol —
   el rol lo sigue decidiendo SQL Server en cada query.
3. Todas las demás rutas van detrás de un guard **global** (`APP_GUARD` +
   `SqlSessionGuard`), así no hay que acordarse de protegerlas una por una.
   Se marca la excepción del login con un decorador `@Public()`.
4. El guard lee `Authorization: Bearer <token>`, resuelve el `sessionId` y
   engancha el `DataSource` correspondiente al request. Los controllers y
   casos de uso nunca ven credenciales ni deciden el rol.

Consecuencia práctica: **las tablas TypeORM (entidades) se pueden compartir
entre roles**, pero cada repositorio concreto ejecuta sus queries con el
`DataSource` de la sesión activa, no con un pool fijo. Un operador que intente
un `SELECT` recibirá el error de permisos de SQL Server, no un 403 inventado
por el código.

### Enmascaramiento y roles: no los reimplementamos en la app

Dynamic Data Masking y los `GRANT UNMASK` ya están a nivel de base de datos
(`sql/01_logins_and_roles.sql`). La API nunca decide si un campo se enmascara:
simplemente refleja lo que SQL Server devuelve para esa conexión. Si un
supervisor ve el monto real y un operador ve `XXXX`, es porque el login tiene
o no tiene `UNMASK`, no porque el DTO tenga un `if (role === ...)`.

## Roles y logins (referencia)

Ver `sql/01_logins_and_roles.sql` para el script completo.

| Rol | Login(s) | Permiso | Usado por la API para... |
|---|---|---|---|
| Operador | `inv_operador1..4` | Solo escritura | Registrar entradas/salidas de inventario |
| Supervisor | `Jafeth`, `Adrian`, `Diego` | Lectura y escritura, ve datos sin máscara | Todo lo del operador + consultar catálogos reales |
| Auditor | `inv_auditor1..2` | Solo lectura, ve datos sin máscara | Visor de auditoría (Parte 3) |
| DBA | `inv_dba` | `db_owner` | No se usa desde la API; administración manual |
| Backup operator | `inv_backup_operator` | `db_backupoperator` | No se usa desde la API; respaldos manuales |
| App técnica | `inventory_app` | Igual que auditor | Health checks / procesos que no representan a un usuario humano |

## Convenciones

- **Ports primero**: ningún caso de uso llama a TypeORM directamente. Siempre
  a través de una interfaz definida en `domain/ports`.
- **Un caso de uso, una clase**: nombres en imperativo (`RegistrarEntrada`,
  no `InventoryService` con 15 métodos).
- **DTOs de infraestructura ≠ entidades de dominio**: los controllers mapean
  explícitamente; el dominio no conoce `class-validator` ni Swagger.

## Testing

Dos tipos de test, con propósitos distintos — no se mezclan:

- **Unit (`*.spec.ts`, junto al archivo que prueban)**: casos de uso de
  `application/` contra ports fake/in-memory (sin SQL Server, sin Docker).
  Rápidos, corren en cada push vía CI. Esto es lo que valida la lógica de
  negocio (p.ej. que una salida de inventario no deje stock negativo).
- **E2E (`test/*.e2e-spec.ts`)**: contra el contenedor `db` real. Aquí es
  donde se prueba lo que de verdad importa para este proyecto — que el
  control de acceso de SQL Server se cumple:
  - `inv_operador*` recibe error al intentar `SELECT`.
  - `inv_auditor*` no puede hacer `INSERT`/`UPDATE`/`DELETE`.
  - Los campos enmascarados se ven distintos según el rol conectado
    (operador ve máscara, supervisor/auditor ven el valor real).
  - Un login inválido no abre sesión (`SqlSessionPort.authenticate` falla).

  Requieren `docker compose up db` antes de correr `npm run test:e2e`. Por
  eso **no** están en el pipeline de CI todavía (la imagen de SQL Server 2022
  es pesada) — se corren localmente antes de cada PR importante. Se puede
  sumar a CI más adelante como job aparte si el tiempo lo permite.

## CI

`.github/workflows/ci.yml` corre en cada PR hacia `develop` o `main`
(`feature/* → develop` y `develop → main`), y en cada push a `main`
(confirmación post-merge). A propósito **no** corre en push directo a
`develop`: si `push` también disparara ahí, un commit directo a `develop`
mientras hay un PR abierto hacia `main` dispararía el workflow dos veces
(una por el push, otra por el "synchronize" del PR), duplicando los checks
en la UI — ya nos pasó una vez.

Cada verificación es su propio job, así aparecen como checks separados en
la UI de GitHub en vez de agruparse en uno solo:

- **`format`** — `prettier --check` (sin `--fix`, solo verifica).
- **`lint`** — `eslint --max-warnings=0`.
- **`build`** — `nest build`.
- **`test`** — `npm test` (unit).
- **`audit`** — `npm audit --omit=dev --audit-level=high`. Se limita a
  dependencias de producción a propósito: las devDependencies de
  ESLint/Jest arrastran vulnerabilidades transitivas conocidas (ReDoS en
  `brace-expansion`/`minimatch`) que no afectan el build ni el runtime.
  Dependabot (`.github/dependabot.yml`) complementa esto abriendo PRs
  semanales de actualización de dependencias contra `develop` — ojo: los
  PRs de *security update* (activados por un advisory real, no por el
  schedule) los abre GitHub siempre contra la rama por defecto (`main`),
  sin importar `target-branch`; es una limitación de Dependabot, no algo
  que podamos configurar.
- **`pr-template`** (solo en eventos `pull_request`) — valida que la
  descripción del PR realmente llenó `Changes Made` / `Testing
  Information` / `Notes` del template; falla si alguna sección quedó vacía
  o con el placeholder `-` sin editar.

Es la red de seguridad además de Husky — cubre el caso de alguien
commiteando con `--no-verify` o sin los hooks instalados.

## Git

- `main` — estable, solo vía PR desde `develop`.
- `develop` — rama de integración, solo vía PR desde ramas de feature.
- Flujo: `feature/lo-que-sea` → PR → `develop` → PR → `main`. Nada de
  commits directos a `develop` o `main`.
- Convención de commits: `tipo(scope): descripción` (ver historial para ejemplos).

## Comandos

```bash
npm run start:dev        # Nest en modo watch
npm run build             # nest build
npm run test               # unit tests
npm run test:e2e           # e2e (requiere `db` arriba)
docker compose up --build  # levanta db + db-init + api (ver abajo)
```

`docker compose up` levanta tres servicios en orden: `db` (SQL Server 2022) →
`db-init` (corre todos los `.sql` de `sql/` uno por uno contra `db`, en orden
alfabético, y termina) → `api` (espera a que `db-init` termine bien). No hace
falta correr `sqlcmd` a mano — cualquier script nuevo que se agregue en
`sql/` con el prefijo numérico correcto (`02_...`, `03_...`) se ejecuta solo
la próxima vez que se levante el stack. Los scripts en `sql/` deben ser
idempotentes (`IF NOT EXISTS ...`) porque `db-init` corre en cada `up`, no
solo la primera vez.

### Migraciones (TypeORM) y seeds

```bash
npm run migration:generate -- src/infrastructure/persistence/typeorm/migrations/NombreDescriptivo
npm run migration:run
npm run migration:revert
npm run seed
```

- `src/infrastructure/persistence/typeorm/data-source.ts` es el `DataSource`
  exclusivo del CLI (migraciones/seeds) — la app en runtime nunca lo usa,
  sigue el modelo de sesión SQL dinámica de más arriba.
- Se conecta con `DB_MIGRATION_USER`/`DB_MIGRATION_PASSWORD` (`inv_dba`,
  `db_owner`) porque crear/alterar tablas es DDL, y `inventory_app` (perfil
  auditor) no tiene esos permisos.
- Estos comandos corren contra `DB_HOST` tal como esté en `.env`. Si corrés
  el CLI desde el host (fuera de Docker) en vez de dentro del contenedor
  `api`, sobreescribí la variable: `DB_HOST=localhost npm run migration:run`
  (el puerto 1433 ya está publicado por `docker-compose.yml`).
- `seed.ts` inserta datos de ejemplo (categorías, bodegas, un proveedor,
  productos, una orden de compra, entradas/salidas e inventario actual) —
  solo para desarrollo/demo, no correr contra datos reales.
- Estas tablas todavía no se crean automáticamente al hacer `docker compose
  up` (a diferencia de `sql/`, que sí corre solo vía `db-init`) — por ahora
  es un paso manual. Evaluar si vale la pena automatizarlo con un servicio
  tipo `migrate` en el compose cuando el modelo esté más estable.

## Variables de entorno

Ver `.env.example`. `DB_USER`/`DB_PASSWORD` en `.env` son solo para el
health-check/arranque de la app (`inventory_app`); las credenciales reales de
cada usuario humano se capturan en el login de la aplicación, no en `.env`.

## Auditoría (Parte 2.2)

El schema `audit` (creado en `sql/01_logins_and_roles.sql` con
`AUTHORIZATION dbo`, mismo owner que `dbo`) tiene una tabla espejo por cada
tabla transaccional de `inventory`, creadas junto con sus triggers en la
migración `CreateAuditSchemaAndTriggers` — no en `sql/`, porque `db-init`
corre esos scripts antes de que las tablas transaccionales existan (esas se
crean vía migración, ver arriba).

Cada tabla transaccional tiene un trigger `dbo.TR_<Tabla>_Audit` (`AFTER
INSERT, UPDATE, DELETE`, set-based con `inserted`/`deleted`, sin cursores)
que inserta en `audit.<Tabla>` el estado resultante de la fila más
`Movimiento`, `Usuario_Aud` (`ORIGINAL_LOGIN()`), `Fecha_aud`, y
`EquipoOrigen`/`IPOrigen`.

**EquipoOrigen/IPOrigen en una API de 3 capas**: SQL Server solo ve la
conexión del contenedor `api`, no la IP/equipo real de quien hizo el request
HTTP. Se resuelve con `SESSION_CONTEXT`: `AuthController.login` captura
`request.ip`/`User-Agent` real y lo pasa hasta
`TypeOrmSqlSessionAdapter.authenticate`, que corre `sp_set_session_context`
justo después de `dataSource.initialize()`. El `DataSource` de cada sesión
se fuerza a `pool: { min: 1, max: 1 }` (una sola conexión física) porque
`SESSION_CONTEXT` vive en la conexión, no en el `DataSource` — con un pool de
más de una conexión, una query podría caer en una conexión donde nunca se
seteó el contexto.

**Por qué un operador (sin ningún `GRANT` sobre `audit`) puede escribir en
`audit.*` igual**: por *ownership chaining* — como `dbo` y `audit` comparten
owner, el `INSERT INTO audit.*` de adentro del trigger no vuelve a chequear
permisos del usuario que disparó el trigger.

**Por qué los repositorios usan `.insert()` en vez de `.save()`, y generan
`id`/`fecha` en la app en vez de dejar que la BD los genere**: en mssql,
`repository.save()` en una entidad con relaciones (`@ManyToOne`) hace una
recarga por `SELECT ... WHERE id = ...` después de guardar — y ese `SELECT`
necesita permiso sobre la tabla. Un operador con `DENY SELECT` (solo
escritura) nunca lo tiene, así que `POST /entradas-inventario` le fallaba con
`500` aunque su `INSERT` estuviera perfectamente permitido. Además, dejar que
SQL Server genere `id` (`NEWID()`) o `fecha` (`getdate()`) obliga a TypeORM a
releerlos con `OUTPUT INSERTED.*`, que en una tabla con trigger exige el mismo
permiso `SELECT` (aun usando `OUTPUT ... INTO @variable` para no chocar con
"cannot have OUTPUT clause without INTO clause"). La solución: `id` se genera
con `randomUUID()` y `fecha` con `new Date()` **en el repositorio**, antes de
insertar, y se usa `repository.insert(...)` (sin recarga) en vez de
`repository.save(repository.create(...))`. Los `@PrimaryColumn`/`@Column` de
`id`/`fecha` ya no tienen `default:` — la app siempre manda el valor.

**Operador necesita `SELECT` sobre `InventarioActual`, no solo `INSERT` sobre
movimientos**: `RegistrarEntradaInventario`/`RegistrarSalidaInventario` leen
el stock actual antes de escribir. La migración `GrantOperadorSelectInventarioActual`
revoca el `DENY SELECT` a nivel de schema (`SCHEMA::dbo`) y lo reemplaza por 7
`DENY` puntuales (todas las tablas salvo `InventarioActual`) + un `GRANT
SELECT` solo sobre `InventarioActual` — porque en SQL Server un `DENY` de
schema siempre gana sobre un `GRANT` de tabla, no se puede "perforar" un DENY
amplio con un GRANT más específico.

**Ojo — `db-init` pisa esta migración en cada `docker compose up`**:
`sql/01_logins_and_roles.sql` vuelve a correr en cada `up` (es idempotente a
propósito) y su `DENY SELECT, DELETE ON SCHEMA::dbo TO db_operador_rol`
reinstala el DENY de schema completo, deshaciendo lo que
`GrantOperadorSelectInventarioActual` había dejado. TypeORM no lo detecta
(su tabla `migrations` sigue diciendo que ya corrió), así que después de
**cualquier** `docker compose up`/`up --build` hay que volver a aplicar esa
migración a mano:
```bash
DB_HOST=localhost npm run migration:revert   # solo si el operador vuelve a fallar
DB_HOST=localhost npm run migration:run
```
Esto es una instancia más de la limitación ya conocida (ver abajo): las
migraciones no corren solas con `docker compose up`.

## Enmascaramiento (Parte 2.3)

Dynamic Data Masking, aplicado en la migración `AddDynamicDataMasking`
(después de que las tablas existen; no puede ir en `sql/` por la misma razón
que los triggers de auditoría). Solo se enmascaran los campos que el
enunciado pide explícitamente — nombres de personas/empresas, teléfonos,
correos y montos — y nada más:

| Tabla.Columna | Función | Por qué esa función |
|---|---|---|
| `Proveedores.nombre` | `partial(1, "XXXXXXXXXX", 0)` | Nombre de empresa: se conserva la inicial para que siga siendo identificable en una lista, el resto se oculta. |
| `Proveedores.telefono` | `partial(4, "-XXXX", 0)` | Formato `2222-9999`: se conserva el prefijo (4 dígitos), se oculta el resto. |
| `Proveedores.correo` | `email()` | Función nativa pensada para este formato — inicial + dominio enmascarado (`cXXX@XXXX.com`). |
| `Productos.precio_unitario` | `random(1, 1000)` | Monto: no tiene sentido conservar ningún fragmento (un precio parcial ya revela el real), y un valor aleatorio no correlaciona con el precio real. |
| `OrdenesCompra.total` | `default()` | Monto más sensible (total de una compra) — ocultamiento completo, ni siquiera un rango aleatorio. |

**Por qué NO se enmascararon otros campos**: `Bodegas.nombre`,
`Categorias.nombre`, `Productos.nombre`/`descripcion` no son nombres de
personas/empresas ni montos — son metadatos internos del catálogo. `cantidad`
en movimientos es una cantidad de unidades, no un monto de dinero. Los ids
(`uniqueidentifier`) no son datos enmascarables per Parte 2.3.

Los `GRANT UNMASK` de Supervisor/Auditor ya estaban en
`sql/01_logins_and_roles.sql` desde la Parte 2.1.

**Por qué existe el login `inv_demo_masking`**: con los roles mínimos del
enunciado, *nadie* ve realmente el valor enmascarado — Supervisor/Auditor/
`inventory_app` (miembro de `db_auditor_rol`) tienen `UNMASK`, `inv_dba` es
`db_owner` (bypassea el enmascaramiento), y Operador tiene `DENY SELECT` total
(ni siquiera ve la fila enmascarada, el error es de permiso, no de máscara).
`inv_demo_masking` (creado en `sql/01_logins_and_roles.sql`, sin `UNMASK`, con
`GRANT SELECT` solo sobre `Proveedores`/`Productos`/`OrdenesCompra` desde la
migración) existe únicamente para poder mostrar el `XXXX` en la presentación
sin tocar los roles que sí se evalúan. No tiene `INSERT`/`UPDATE`/`DELETE`.

## Visor de auditoría (Parte 3)

El módulo `audit/` (`ListarBitacoraAuditoria`) expone `GET /audit/tablas`
(lista blanca `TABLAS_AUDITORIA`, para el menú) y `GET /audit/:tabla?accion=&
desde=&hasta=&usuario=`. Es **un solo endpoint genérico**, no 8 endpoints
hardcodeados — el nombre de tabla llega por path param, se valida contra
`TABLAS_AUDITORIA` (400 si no matchea) antes de interpolarlo en el
`SELECT * FROM audit.${tabla}`, y los filtros siempre van parametrizados
(`@0, @1, ...`), nunca interpolados directo. Cada fila se separa en las 5
columnas de auditoría comunes (`movimiento`, `usuarioAud`, `fechaAud`,
`equipoOrigen`, `ipOrigen`) + un objeto `datos` con las columnas propias de
la tabla origen (distintas por tabla) — así el frontend renderiza cualquier
tabla sin necesitar 8 tipos distintos.

No hace falta un rol nuevo para "solo lectura de auditoría": la Parte 3.4 del
enunciado ya pide que la conexión se haga con un perfil auditor real
(`inv_auditor1`/`2`), y el mecanismo de sesión SQL dinámica ya lo soporta — si
alguien sin `GRANT SELECT ON SCHEMA::audit` (Operador, Supervisor) llama estos
endpoints, SQL Server rechaza la query igual que con cualquier otra tabla.

**`web/index.html`**: el "menú + filtros + tabla de resultados" que pide la
Parte 3 es una página estática sola (sin build, sin framework), servida por
el mismo proceso de Nest vía `@nestjs/serve-static` bajo `/auditoria`
(`ServeStaticModule.forRoot({ rootPath: '.../web', serveRoot: '/auditoria' })`
en `app.module.ts`) — se eligió ese prefijo, y no `/`, para no pisar la ruta
raíz de `AppController`. Vive fuera de `src/` (igual que `bruno/` o `sql/`)
porque no es parte de la arquitectura hexagonal del backend: le pega a la API
por `fetch()` como cualquier otro cliente HTTP, nunca importa código de
`src/modules/`. El `Dockerfile` copia `web/` a la imagen de runtime junto con
`dist/`.

## Pendiente de definir (no bloquea el setup actual)

- Estrategia de expiración/cierre de `DataSource` huérfanos en `SqlSessionPort`
  (timeout de sesión, límite de conexiones concurrentes por login).
- Branch protection en `main`/`develop`: el repo es privado bajo cuenta
  personal, y GitHub exige plan Pro (o repo público) para habilitarlo — por
  ahora no hay protección real del lado de GitHub, se depende de disciplina
  del equipo (feature branch → PR → develop → PR → main, sin push directo).
  Retomar si alguien del equipo activa el GitHub Student Developer Pack
  (da Pro gratis con correo institucional).
