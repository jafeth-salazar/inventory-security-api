# inventory-security-api

Secure inventory management system for a Database Security course: MS SQL Server with role-based access, full audit trail, and dynamic data masking. A NestJS backend (auditor profile) exposes audit logs through a web app with filters by action, date, and user. Fully containerized with Docker.

Proyecto Final del curso de Seguridad de Base de Datos — ver `Proyecto Final 2DO 2026.md` para el enunciado completo y `CLAUDE.md` para la arquitectura y las convenciones del proyecto.

## Stack

- Node 22 (ver `.nvmrc`) · NestJS 11 · TypeScript estricto
- TypeORM contra SQL Server 2022
- Docker Compose (`api` + `db` + `db-init`)

## Cómo levantarlo

```bash
cp .env.example .env   # ajusta las passwords si quieres las tuyas
docker compose up --build
```

Esto levanta tres servicios en orden: `db` (SQL Server 2022) → `db-init`
(corre automáticamente todos los scripts de `sql/`, creando logins, roles y
permisos) → `api` (Nest, en `http://localhost:3000`). No hace falta correr
nada a mano.

Para desarrollo local sin Docker en el `api`:

```bash
npm install
npm run start:dev
```

## Comandos útiles

```bash
npm run lint         # eslint --fix
npm run format       # prettier --write
npm run build        # nest build
npm test              # unit tests
npm run test:e2e      # e2e (requiere el contenedor `db` arriba)

npm run migration:generate -- src/infrastructure/persistence/typeorm/migrations/NombreDescriptivo
npm run migration:run       # aplica migraciones pendientes contra `db`
npm run seed                 # datos de ejemplo, solo para desarrollo
```

Ver `CLAUDE.md` para el detalle de credenciales/modelo de sesión que usan
las migraciones.

## Más contexto

- `CLAUDE.md` — arquitectura hexagonal, convenciones de imports/tests, modelo de roles y sesión SQL, flujo de Git y CI.
- `sql/` — scripts de logins, roles y permisos (idempotentes, se corren solos con `docker compose up`).
- `.github/PULL_REQUEST_TEMPLATE.md` — estructura esperada de cada PR.
