# Security

Este es un proyecto académico (curso de Seguridad de Base de Datos), no un
proyecto open source con usuarios externos — pero como el tema del curso es
justo seguridad de BD, documentamos lo básico igual.

## Manejo de credenciales

- `.env` nunca se sube a git (ver `.gitignore`); `.env.example` solo tiene
  placeholders.
- Las passwords en `sql/01_logins_and_roles.sql` son placeholders
  (`ChangeMe_...`) a propósito — se cambian por passwords reales antes de la
  demo/defensa, y las reales nunca se commitean.
- Ningún login usa la password `sa` para operaciones de la aplicación;
  `inventory_app` y cada usuario humano tienen su propio login con el
  mínimo privilegio necesario (ver `CLAUDE.md`, sección "Roles y logins").
- `CHECK_POLICY = ON` en todos los `CREATE LOGIN` — SQL Server aplica su
  política de complejidad (incluyendo que la password no contenga el
  nombre del login).

## Dependencias

- `npm audit --omit=dev --audit-level=high` corre en cada PR (ver
  `.github/workflows/ci.yml`, job `audit`) y falla el build si aparece una
  vulnerabilidad real en dependencias de producción.
- Dependabot (`.github/dependabot.yml`) abre PRs semanales de actualización
  de dependencias npm y de GitHub Actions contra `develop`.

## Reportar un problema

Si encuentras un problema de seguridad en este repo (privado, de uso
interno del equipo), avisa directamente a los integrantes del grupo — no
aplica un proceso de disclosure público.
