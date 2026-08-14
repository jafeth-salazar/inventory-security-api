import { MigrationInterface, QueryRunner } from 'typeorm';

// Parte 2.2 del enunciado: un schema `audit` con una tabla "espejo" por cada
// tabla transaccional de Inventario, llenada automáticamente por triggers.
// `audit` ya existe (creado por sql/01_logins_and_roles.sql con
// AUTHORIZATION dbo) — mismo owner que `dbo`, así que aplica ownership
// chaining: un operador con solo GRANT INSERT en dbo puede disparar el
// trigger y el INSERT INTO audit.* de adentro funciona sin que necesite
// ningún permiso explícito sobre el schema audit.
export class CreateAuditSchemaAndTriggers1786216252527 implements MigrationInterface {
  name = 'CreateAuditSchemaAndTriggers1786216252527';

  private readonly tablas: Array<{
    nombre: string;
    columnas: string;
    columnasSelect: string;
  }> = [
    {
      nombre: 'Bodegas',
      columnas:
        'id uniqueidentifier NULL, nombre nvarchar(100) NULL, ubicacion nvarchar(200) NULL',
      columnasSelect: 'id, nombre, ubicacion',
    },
    {
      nombre: 'Categorias',
      columnas: 'id uniqueidentifier NULL, nombre nvarchar(100) NULL',
      columnasSelect: 'id, nombre',
    },
    {
      nombre: 'Proveedores',
      columnas:
        'id uniqueidentifier NULL, nombre nvarchar(150) NULL, telefono nvarchar(50) NULL, correo nvarchar(150) NULL, direccion nvarchar(200) NULL',
      columnasSelect: 'id, nombre, telefono, correo, direccion',
    },
    {
      nombre: 'Productos',
      columnas:
        'id uniqueidentifier NULL, nombre nvarchar(150) NULL, descripcion nvarchar(500) NULL, precio_unitario decimal(12,2) NULL, categoria_id uniqueidentifier NULL, proveedor_id uniqueidentifier NULL',
      columnasSelect:
        'id, nombre, descripcion, precio_unitario, categoria_id, proveedor_id',
    },
    {
      nombre: 'OrdenesCompra',
      columnas:
        'id uniqueidentifier NULL, proveedor_id uniqueidentifier NULL, fecha datetime2 NULL, total decimal(12,2) NULL',
      columnasSelect: 'id, proveedor_id, fecha, total',
    },
    {
      nombre: 'EntradasInventario',
      columnas:
        'id uniqueidentifier NULL, producto_id uniqueidentifier NULL, bodega_id uniqueidentifier NULL, orden_compra_id uniqueidentifier NULL, cantidad int NULL, fecha datetime2 NULL',
      columnasSelect:
        'id, producto_id, bodega_id, orden_compra_id, cantidad, fecha',
    },
    {
      nombre: 'SalidasInventario',
      columnas:
        'id uniqueidentifier NULL, producto_id uniqueidentifier NULL, bodega_id uniqueidentifier NULL, cantidad int NULL, motivo nvarchar(100) NULL, fecha datetime2 NULL',
      columnasSelect: 'id, producto_id, bodega_id, cantidad, motivo, fecha',
    },
    {
      nombre: 'InventarioActual',
      columnas:
        'id uniqueidentifier NULL, producto_id uniqueidentifier NULL, bodega_id uniqueidentifier NULL, cantidad_actual int NULL',
      columnasSelect: 'id, producto_id, bodega_id, cantidad_actual',
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'audit')
        EXEC('CREATE SCHEMA audit AUTHORIZATION dbo');
    `);

    for (const tabla of this.tablas) {
      // IdAuditoria/Movimiento/Usuario_Aud/Fecha_aud/EquipoOrigen/IPOrigen son
      // las columnas comunes a las 8 tablas — TypeOrmAuditoriaRepository las
      // separa vía COLUMNAS_AUDITORIA. Si se agrega/renombra una acá, hay que
      // actualizar ese set también.
      await queryRunner.query(`
        CREATE TABLE audit.${tabla.nombre} (
          IdAuditoria BIGINT IDENTITY(1,1) PRIMARY KEY,
          ${tabla.columnas},
          Movimiento VARCHAR(30) NOT NULL,
          Usuario_Aud VARCHAR(50) NULL,
          Fecha_aud DATETIME NOT NULL,
          EquipoOrigen VARCHAR(50) NULL,
          IPOrigen VARCHAR(50) NULL
        );
      `);

      await queryRunner.query(`
        CREATE TRIGGER dbo.TR_${tabla.nombre}_Audit
        ON dbo.${tabla.nombre}
        AFTER INSERT, UPDATE, DELETE
        AS
        BEGIN
          SET NOCOUNT ON;

          DECLARE @Movimiento VARCHAR(30);
          DECLARE @Usuario VARCHAR(50) = ORIGINAL_LOGIN();
          DECLARE @Fecha DATETIME = GETDATE();
          DECLARE @IP VARCHAR(50) = CAST(SESSION_CONTEXT(N'IPOrigen') AS VARCHAR(50));
          DECLARE @Equipo VARCHAR(50) = CAST(SESSION_CONTEXT(N'EquipoOrigen') AS VARCHAR(50));

          IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
          BEGIN
            SET @Movimiento = 'Actualizacion';
            INSERT INTO audit.${tabla.nombre} (${tabla.columnasSelect}, Movimiento, Usuario_Aud, Fecha_aud, EquipoOrigen, IPOrigen)
            SELECT ${tabla.columnasSelect}, @Movimiento, @Usuario, @Fecha, @Equipo, @IP FROM inserted;
          END
          ELSE IF EXISTS (SELECT 1 FROM inserted)
          BEGIN
            SET @Movimiento = 'Insercción';
            INSERT INTO audit.${tabla.nombre} (${tabla.columnasSelect}, Movimiento, Usuario_Aud, Fecha_aud, EquipoOrigen, IPOrigen)
            SELECT ${tabla.columnasSelect}, @Movimiento, @Usuario, @Fecha, @Equipo, @IP FROM inserted;
          END
          ELSE
          BEGIN
            SET @Movimiento = 'Eliminación';
            INSERT INTO audit.${tabla.nombre} (${tabla.columnasSelect}, Movimiento, Usuario_Aud, Fecha_aud, EquipoOrigen, IPOrigen)
            SELECT ${tabla.columnasSelect}, @Movimiento, @Usuario, @Fecha, @Equipo, @IP FROM deleted;
          END
        END
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const tabla of [...this.tablas].reverse()) {
      await queryRunner.query(`DROP TRIGGER dbo.TR_${tabla.nombre}_Audit`);
      await queryRunner.query(`DROP TABLE audit.${tabla.nombre}`);
    }

    await queryRunner.query(`
      IF EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'audit')
        DROP SCHEMA audit;
    `);
  }
}
