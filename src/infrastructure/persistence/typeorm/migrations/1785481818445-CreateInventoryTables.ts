import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryTables1785481818445 implements MigrationInterface {
  name = 'CreateInventoryTables1785481818445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Bodegas" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_0b688bc9590a36383765c300407" DEFAULT NEWID(), "nombre" nvarchar(100) NOT NULL, "ubicacion" nvarchar(200), CONSTRAINT "PK_0b688bc9590a36383765c300407" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Categorias" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_474e737d774d0ee93e86dd1ae1f" DEFAULT NEWID(), "nombre" nvarchar(100) NOT NULL, CONSTRAINT "PK_474e737d774d0ee93e86dd1ae1f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Proveedores" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_50d6aa0120796042d1ab720cd2b" DEFAULT NEWID(), "nombre" nvarchar(150) NOT NULL, "telefono" nvarchar(50), "correo" nvarchar(150), "direccion" nvarchar(200), CONSTRAINT "PK_50d6aa0120796042d1ab720cd2b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "OrdenesCompra" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_53d707f09748b8b34390b3014db" DEFAULT NEWID(), "proveedor_id" uniqueidentifier NOT NULL, "fecha" datetime2 NOT NULL CONSTRAINT "DF_87c9cc3242f1d03daa8d77bbee3" DEFAULT getdate(), "total" decimal(12,2) NOT NULL, CONSTRAINT "PK_53d707f09748b8b34390b3014db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Productos" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_4680901d0dbc98fac6a8588cda8" DEFAULT NEWID(), "nombre" nvarchar(150) NOT NULL, "descripcion" nvarchar(500), "precio_unitario" decimal(12,2) NOT NULL, "categoria_id" uniqueidentifier NOT NULL, "proveedor_id" uniqueidentifier, CONSTRAINT "PK_4680901d0dbc98fac6a8588cda8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "EntradasInventario" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_b7fb3f11e5b2a1c7b2a560a729b" DEFAULT NEWID(), "producto_id" uniqueidentifier NOT NULL, "bodega_id" uniqueidentifier NOT NULL, "orden_compra_id" uniqueidentifier, "cantidad" int NOT NULL, "fecha" datetime2 NOT NULL CONSTRAINT "DF_7b52177d318df8b2c37d3721d46" DEFAULT getdate(), CONSTRAINT "PK_b7fb3f11e5b2a1c7b2a560a729b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "InventarioActual" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_001124f0c01f9ee76c52e8d7b07" DEFAULT NEWID(), "producto_id" uniqueidentifier NOT NULL, "bodega_id" uniqueidentifier NOT NULL, "cantidad_actual" int NOT NULL CONSTRAINT "DF_fb3c770571df0fab86bc06baa96" DEFAULT 0, CONSTRAINT "UQ_InventarioActual_producto_bodega" UNIQUE ("producto_id", "bodega_id"), CONSTRAINT "PK_001124f0c01f9ee76c52e8d7b07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "SalidasInventario" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_6cb03a6261b379beac9b2a23002" DEFAULT NEWID(), "producto_id" uniqueidentifier NOT NULL, "bodega_id" uniqueidentifier NOT NULL, "cantidad" int NOT NULL, "motivo" nvarchar(100), "fecha" datetime2 NOT NULL CONSTRAINT "DF_f5d51bf236baf4938632cbe42b7" DEFAULT getdate(), CONSTRAINT "PK_6cb03a6261b379beac9b2a23002" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrdenesCompra" ADD CONSTRAINT "FK_823992ad0dd439a149a64711acb" FOREIGN KEY ("proveedor_id") REFERENCES "Proveedores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Productos" ADD CONSTRAINT "FK_2c4365ce6fd4f9839b127cd94ec" FOREIGN KEY ("categoria_id") REFERENCES "Categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Productos" ADD CONSTRAINT "FK_6020662d32570e82047408d9bfe" FOREIGN KEY ("proveedor_id") REFERENCES "Proveedores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EntradasInventario" ADD CONSTRAINT "FK_8cd0526edd5c8b89e2b9c1054be" FOREIGN KEY ("producto_id") REFERENCES "Productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EntradasInventario" ADD CONSTRAINT "FK_342a193c49515f039bccf5a8f79" FOREIGN KEY ("bodega_id") REFERENCES "Bodegas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EntradasInventario" ADD CONSTRAINT "FK_7eb174d6a7e956c570db5040308" FOREIGN KEY ("orden_compra_id") REFERENCES "OrdenesCompra"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "InventarioActual" ADD CONSTRAINT "FK_cae9bdea09b6250dd466284dcec" FOREIGN KEY ("producto_id") REFERENCES "Productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "InventarioActual" ADD CONSTRAINT "FK_6bfff8a43e03ef3d77c0330a595" FOREIGN KEY ("bodega_id") REFERENCES "Bodegas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "SalidasInventario" ADD CONSTRAINT "FK_71846323fe1b9e196323603ed49" FOREIGN KEY ("producto_id") REFERENCES "Productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "SalidasInventario" ADD CONSTRAINT "FK_185c7a6efd9d79cbc55c4a5d5f7" FOREIGN KEY ("bodega_id") REFERENCES "Bodegas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SalidasInventario" DROP CONSTRAINT "FK_185c7a6efd9d79cbc55c4a5d5f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SalidasInventario" DROP CONSTRAINT "FK_71846323fe1b9e196323603ed49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "InventarioActual" DROP CONSTRAINT "FK_6bfff8a43e03ef3d77c0330a595"`,
    );
    await queryRunner.query(
      `ALTER TABLE "InventarioActual" DROP CONSTRAINT "FK_cae9bdea09b6250dd466284dcec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EntradasInventario" DROP CONSTRAINT "FK_7eb174d6a7e956c570db5040308"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EntradasInventario" DROP CONSTRAINT "FK_342a193c49515f039bccf5a8f79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EntradasInventario" DROP CONSTRAINT "FK_8cd0526edd5c8b89e2b9c1054be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Productos" DROP CONSTRAINT "FK_6020662d32570e82047408d9bfe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Productos" DROP CONSTRAINT "FK_2c4365ce6fd4f9839b127cd94ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrdenesCompra" DROP CONSTRAINT "FK_823992ad0dd439a149a64711acb"`,
    );
    await queryRunner.query(`DROP TABLE "SalidasInventario"`);
    await queryRunner.query(`DROP TABLE "InventarioActual"`);
    await queryRunner.query(`DROP TABLE "EntradasInventario"`);
    await queryRunner.query(`DROP TABLE "Productos"`);
    await queryRunner.query(`DROP TABLE "OrdenesCompra"`);
    await queryRunner.query(`DROP TABLE "Proveedores"`);
    await queryRunner.query(`DROP TABLE "Categorias"`);
    await queryRunner.query(`DROP TABLE "Bodegas"`);
  }
}
