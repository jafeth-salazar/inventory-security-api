/* ============================================================
   Inventory Security API — Logins, usuarios y roles
   Proyecto Final - Seguridad de Base de Datos (tema: Inventario)

   Un login representativo por rol de control de acceso pedido en
   el enunciado (se pueden clonar más adelante si el profesor pide
   ver los 4 operadores / 3 supervisores / 2 auditores reales):
     Operador del sistema                -> solo escritura
     Supervisor                          -> escritura y lectura
     Auditor                             -> solo lectura
     Administrador de la base de datos   -> administrador
     Operador de backup                  -> backup operator
   Más inventory_app: login técnico del backend NestJS, que según
   la Parte 3.4 del enunciado debe conectarse con perfil auditor.

   IMPORTANTE: las passwords de este script son placeholders.
   Cámbielas antes de la demo/defensa y nunca suba passwords reales
   a git. La de inventory_app debe coincidir con DB_PASSWORD en tu .env.
   ============================================================ */

-- ----------------------------------------------------------
-- 0. BASE DE DATOS
-- ----------------------------------------------------------
IF DB_ID(N'InventorySecurityDB') IS NULL
    CREATE DATABASE InventorySecurityDB;
GO

-- ----------------------------------------------------------
-- 1. SERVER LOGINS
-- ----------------------------------------------------------
USE master;
GO

CREATE LOGIN inv_operador WITH PASSWORD = 'ChangeMe_Operador_2026!', CHECK_POLICY = ON;
CREATE LOGIN inv_supervisor WITH PASSWORD = 'ChangeMe_Supervisor_2026!', CHECK_POLICY = ON;
CREATE LOGIN inv_auditor WITH PASSWORD = 'ChangeMe_Auditor_2026!', CHECK_POLICY = ON;
CREATE LOGIN inv_dba WITH PASSWORD = 'ChangeMe_DBA_2026!', CHECK_POLICY = ON;
CREATE LOGIN inv_backup_operator WITH PASSWORD = 'ChangeMe_Backup_2026!', CHECK_POLICY = ON;

-- Cuenta técnica del backend NestJS (perfil auditor, ver Parte 3.4 del enunciado)
CREATE LOGIN inventory_app WITH PASSWORD = 'ChangeMe_InventoryApp_2026!', CHECK_POLICY = ON;
GO

-- ----------------------------------------------------------
-- 2. DATABASE USERS (1:1 con los logins anteriores)
-- ----------------------------------------------------------
USE InventorySecurityDB;
GO

CREATE USER inv_operador FOR LOGIN inv_operador;
CREATE USER inv_supervisor FOR LOGIN inv_supervisor;
CREATE USER inv_auditor FOR LOGIN inv_auditor;
CREATE USER inv_dba FOR LOGIN inv_dba;
CREATE USER inv_backup_operator FOR LOGIN inv_backup_operator;
CREATE USER inventory_app FOR LOGIN inventory_app;
GO

-- ----------------------------------------------------------
-- 3. SCHEMA de auditoría (placeholder; las tablas espejo se
--    agregan en la Parte 2.2 del enunciado)
-- ----------------------------------------------------------
IF SCHEMA_ID(N'audit') IS NULL
    EXEC('CREATE SCHEMA audit AUTHORIZATION dbo');
GO

-- ----------------------------------------------------------
-- 4. ROLES DE BASE DE DATOS (mínimo privilegio)
-- ----------------------------------------------------------
CREATE ROLE db_operador_rol;
CREATE ROLE db_supervisor_rol;
CREATE ROLE db_auditor_rol;
GO

-- Operador: solo escritura sobre las tablas transaccionales.
-- Se otorga a nivel de schema dbo para cubrir las tablas del modelo
-- físico aún no creadas (Parte 1). DENY explícito de lectura/borrado
-- para dejar la política documentada, no solo por ausencia de GRANT.
GRANT INSERT, UPDATE ON SCHEMA::dbo TO db_operador_rol;
DENY SELECT, DELETE ON SCHEMA::dbo TO db_operador_rol;

-- Supervisor: lectura y escritura completas + ver datos sin máscara.
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO db_supervisor_rol;
GRANT UNMASK TO db_supervisor_rol;

-- Auditor: solo lectura (dbo + schema de auditoría) + ver datos sin máscara.
GRANT SELECT ON SCHEMA::dbo TO db_auditor_rol;
GRANT SELECT ON SCHEMA::audit TO db_auditor_rol;
GRANT UNMASK TO db_auditor_rol;
GO

-- Nota: en SQL Server 2022 se puede otorgar UNMASK por columna
-- (GRANT UNMASK ON dbo.Tabla(Columna) TO rol) en vez de a nivel de BD
-- una vez que el modelo físico y las máscaras estén definidos.

-- ----------------------------------------------------------
-- 5. MEMBRESÍAS
-- ----------------------------------------------------------
ALTER ROLE db_operador_rol ADD MEMBER inv_operador;
ALTER ROLE db_supervisor_rol ADD MEMBER inv_supervisor;
ALTER ROLE db_auditor_rol ADD MEMBER inv_auditor;

-- inventory_app: la API solo debe leer las tablas de auditoría (perfil auditor).
ALTER ROLE db_auditor_rol ADD MEMBER inventory_app;

-- Administrador de la base de datos: control total sobre esta BD
-- (db_owner, no sysadmin de servidor, para no exceder lo pedido).
ALTER ROLE db_owner ADD MEMBER inv_dba;

-- Operador de backup: rol fijo de SQL Server para respaldos.
ALTER ROLE db_backupoperator ADD MEMBER inv_backup_operator;
GO
