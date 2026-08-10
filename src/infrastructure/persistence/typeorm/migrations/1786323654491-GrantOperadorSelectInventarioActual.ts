import { MigrationInterface, QueryRunner } from 'typeorm';

// Parte 2.1 del enunciado: Operador es "solo escritura", por eso
// sql/01_logins_and_roles.sql le hace DENY SELECT sobre todo el schema dbo.
// Pero RegistrarEntradaInventario/RegistrarSalidaInventario necesitan leer
// InventarioActual para calcular el nuevo stock antes de escribir — sin esto
// el Operador no puede completar la única tarea para la que existe.
//
// En SQL Server un DENY siempre gana sobre un GRANT, sin importar el nivel
// de detalle — un GRANT a nivel de tabla NO puede "perforar" un DENY a nivel
// de schema. Por eso hay que revocar el DENY de SELECT a nivel de schema y
// reemplazarlo por 7 DENY explícitos (uno por cada tabla que no es
// InventarioActual) + un GRANT puntual sobre InventarioActual. El DENY de
// DELETE a nivel de schema no se toca, sigue igual.
//
// No puede ir en sql/ porque las tablas todavía no existen cuando corre
// db-init (se crean en la migración CreateInventoryTables, que corre
// después, manualmente).
export class GrantOperadorSelectInventarioActual1786323654491 implements MigrationInterface {
  name = 'GrantOperadorSelectInventarioActual1786323654491';

  private readonly otrasTablas = [
    'Bodegas',
    'Categorias',
    'Proveedores',
    'Productos',
    'OrdenesCompra',
    'EntradasInventario',
    'SalidasInventario',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `REVOKE SELECT ON SCHEMA::dbo FROM db_operador_rol;`,
    );

    for (const tabla of this.otrasTablas) {
      await queryRunner.query(
        `DENY SELECT ON dbo.${tabla} TO db_operador_rol;`,
      );
    }

    await queryRunner.query(
      `GRANT SELECT ON dbo.InventarioActual TO db_operador_rol;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `REVOKE SELECT ON dbo.InventarioActual FROM db_operador_rol;`,
    );

    for (const tabla of this.otrasTablas) {
      await queryRunner.query(
        `REVOKE SELECT ON dbo.${tabla} FROM db_operador_rol;`,
      );
    }

    await queryRunner.query(`DENY SELECT ON SCHEMA::dbo TO db_operador_rol;`);
  }
}
