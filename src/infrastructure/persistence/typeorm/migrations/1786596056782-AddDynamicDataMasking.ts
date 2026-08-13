import { MigrationInterface, QueryRunner } from 'typeorm';

// Parte 2.3 del enunciado: enmascarar todo campo que muestre nombres de
// personas/empresas, teléfonos, correos o montos (precios, totales,
// impuestos). Se enmascaran solo esos campos — el resto (nombres de
// Bodegas/Categorias/Productos, cantidades, fechas, ids) no son datos de
// personas/empresas ni montos, así que quedan fuera a propósito.
//
// Se usan los 4 tipos nativos de Dynamic Data Masking de SQL Server para
// mostrar el rango completo, elegido según qué tiene más sentido por campo:
//   - email()   -> Proveedores.correo (formato de correo real)
//   - partial() -> Proveedores.nombre / telefono (se conserva un fragmento
//                  reconocible, el resto se oculta)
//   - random()  -> Productos.precio_unitario (rango plausible, nunca el
//                  precio real)
//   - default() -> OrdenesCompra.total (montos de compra, ocultamiento total)
//
// GRANT/DENY de UNMASK ya existen para Supervisor/Auditor en
// sql/01_logins_and_roles.sql. inv_demo_masking (creado en ese mismo script)
// recibe aquí SELECT SIN UNMASK sobre las 3 tablas — es el único login que
// realmente ve el valor enmascarado (XXXX), para poder demostrarlo en la
// presentación sin tocar los roles ya evaluados.
export class AddDynamicDataMasking1786596056782 implements MigrationInterface {
  name = 'AddDynamicDataMasking1786596056782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE dbo.Proveedores ALTER COLUMN nombre ADD MASKED WITH (FUNCTION = 'partial(1, "XXXXXXXXXX", 0)');`,
    );
    await queryRunner.query(
      `ALTER TABLE dbo.Proveedores ALTER COLUMN telefono ADD MASKED WITH (FUNCTION = 'partial(4, "-XXXX", 0)');`,
    );
    await queryRunner.query(
      `ALTER TABLE dbo.Proveedores ALTER COLUMN correo ADD MASKED WITH (FUNCTION = 'email()');`,
    );
    await queryRunner.query(
      `ALTER TABLE dbo.Productos ALTER COLUMN precio_unitario ADD MASKED WITH (FUNCTION = 'random(1, 1000)');`,
    );
    await queryRunner.query(
      `ALTER TABLE dbo.OrdenesCompra ALTER COLUMN total ADD MASKED WITH (FUNCTION = 'default()');`,
    );

    await queryRunner.query(
      `GRANT SELECT ON dbo.Proveedores TO inv_demo_masking;`,
    );
    await queryRunner.query(
      `GRANT SELECT ON dbo.Productos TO inv_demo_masking;`,
    );
    await queryRunner.query(
      `GRANT SELECT ON dbo.OrdenesCompra TO inv_demo_masking;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `REVOKE SELECT ON dbo.OrdenesCompra FROM inv_demo_masking;`,
    );
    await queryRunner.query(
      `REVOKE SELECT ON dbo.Productos FROM inv_demo_masking;`,
    );
    await queryRunner.query(
      `REVOKE SELECT ON dbo.Proveedores FROM inv_demo_masking;`,
    );

    await queryRunner.query(
      `ALTER TABLE dbo.OrdenesCompra ALTER COLUMN total DROP MASKED;`,
    );
    await queryRunner.query(
      `ALTER TABLE dbo.Productos ALTER COLUMN precio_unitario DROP MASKED;`,
    );
    await queryRunner.query(
      `ALTER TABLE dbo.Proveedores ALTER COLUMN correo DROP MASKED;`,
    );
    await queryRunner.query(
      `ALTER TABLE dbo.Proveedores ALTER COLUMN telefono DROP MASKED;`,
    );
    await queryRunner.query(
      `ALTER TABLE dbo.Proveedores ALTER COLUMN nombre DROP MASKED;`,
    );
  }
}
