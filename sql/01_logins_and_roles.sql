/* ============================================================
   Inventory Security API — Logins, usuarios y roles
   Proyecto Final - Seguridad de Base de Datos (tema: Inventario)

   Cubre el mínimo de control de acceso pedido en el enunciado:
     Operadores del sistema (4)         -> solo escritura
     Supervisores (3)                   -> escritura y lectura
     Auditores (2)                      -> solo lectura
     Administrador de la base de datos  -> administrador
     Operador de backup                 -> backup operator
   Más inventory_app: login técnico del backend NestJS, que según
   la Parte 3.4 del enunciado debe conectarse con perfil auditor.

   Los supervisores llevan el nombre de los integrantes del grupo.

   Este script es idempotente a propósito: lo corre automáticamente el
   servicio `db-init` de docker-compose cada vez que se levanta el stack,
   así que cada CREATE/ALTER va detrás de un IF NOT EXISTS.

   IMPORTANTE: las passwords de este script son placeholders.
   Cámbielas antes de la demo/defensa y nunca suba passwords reales
   a git. La de inventory_app debe coincidir con DB_PASSWORD en tu .env.

   Ojo con CHECK_POLICY = ON: SQL Server rechaza cualquier password que
   contenga el nombre del login (parte de la política de complejidad de
   Windows). Por eso los supervisores NO usan su propio nombre dentro
   de su password (p.ej. Jafeth no puede tener "Jafeth" en la suya).
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

-- Operadores del sistema (solo escritura)
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_operador1')
    CREATE LOGIN inv_operador1 WITH PASSWORD = 'ChangeMe_Operador1_2026!', CHECK_POLICY = ON;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_operador2')
    CREATE LOGIN inv_operador2 WITH PASSWORD = 'ChangeMe_Operador2_2026!', CHECK_POLICY = ON;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_operador3')
    CREATE LOGIN inv_operador3 WITH PASSWORD = 'ChangeMe_Operador3_2026!', CHECK_POLICY = ON;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_operador4')
    CREATE LOGIN inv_operador4 WITH PASSWORD = 'ChangeMe_Operador4_2026!', CHECK_POLICY = ON;

-- Supervisores (lectura y escritura) — integrantes del grupo
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'Jafeth')
    CREATE LOGIN Jafeth WITH PASSWORD = 'ChangeMe_Supervisor1_2026!', CHECK_POLICY = ON;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'Adrian')
    CREATE LOGIN Adrian WITH PASSWORD = 'ChangeMe_Supervisor2_2026!', CHECK_POLICY = ON;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'Diego')
    CREATE LOGIN Diego WITH PASSWORD = 'ChangeMe_Supervisor3_2026!', CHECK_POLICY = ON;

-- Auditores (solo lectura)
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_auditor1')
    CREATE LOGIN inv_auditor1 WITH PASSWORD = 'ChangeMe_Auditor1_2026!', CHECK_POLICY = ON;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_auditor2')
    CREATE LOGIN inv_auditor2 WITH PASSWORD = 'ChangeMe_Auditor2_2026!', CHECK_POLICY = ON;

-- Administrador de la base de datos
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_dba')
    CREATE LOGIN inv_dba WITH PASSWORD = 'ChangeMe_DBA_2026!', CHECK_POLICY = ON;

-- Operador de backup
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_backup_operator')
    CREATE LOGIN inv_backup_operator WITH PASSWORD = 'ChangeMe_Backup_2026!', CHECK_POLICY = ON;

-- Cuenta técnica del backend NestJS (perfil auditor, ver Parte 3.4 del enunciado)
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inventory_app')
    CREATE LOGIN inventory_app WITH PASSWORD = 'ChangeMe_InventoryApp_2026!', CHECK_POLICY = ON;

-- Login exclusivo para demostrar el enmascaramiento (Parte 2.3) en la
-- presentación: SELECT sin UNMASK sobre las tablas con máscara (ver
-- migración AddDynamicDataMasking). No es uno de los roles mínimos del
-- enunciado — todos esos (Supervisor/Auditor/DBA/inventory_app) ya tienen
-- UNMASK o no tienen SELECT en absoluto (Operador), así que ninguno vería
-- realmente el valor enmascarado en una demo en vivo.
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'inv_demo_masking')
    CREATE LOGIN inv_demo_masking WITH PASSWORD = 'ChangeMe_DemoMasking_2026!', CHECK_POLICY = ON;
GO

-- ----------------------------------------------------------
-- 2. DATABASE USERS (1:1 con los logins anteriores)
-- ----------------------------------------------------------
USE InventorySecurityDB;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_operador1')
    CREATE USER inv_operador1 FOR LOGIN inv_operador1;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_operador2')
    CREATE USER inv_operador2 FOR LOGIN inv_operador2;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_operador3')
    CREATE USER inv_operador3 FOR LOGIN inv_operador3;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_operador4')
    CREATE USER inv_operador4 FOR LOGIN inv_operador4;

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'Jafeth')
    CREATE USER Jafeth FOR LOGIN Jafeth;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'Adrian')
    CREATE USER Adrian FOR LOGIN Adrian;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'Diego')
    CREATE USER Diego FOR LOGIN Diego;

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_auditor1')
    CREATE USER inv_auditor1 FOR LOGIN inv_auditor1;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_auditor2')
    CREATE USER inv_auditor2 FOR LOGIN inv_auditor2;

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_dba')
    CREATE USER inv_dba FOR LOGIN inv_dba;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_backup_operator')
    CREATE USER inv_backup_operator FOR LOGIN inv_backup_operator;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inventory_app')
    CREATE USER inventory_app FOR LOGIN inventory_app;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'inv_demo_masking')
    CREATE USER inv_demo_masking FOR LOGIN inv_demo_masking;
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
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'db_operador_rol' AND type = 'R')
    CREATE ROLE db_operador_rol;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'db_supervisor_rol' AND type = 'R')
    CREATE ROLE db_supervisor_rol;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'db_auditor_rol' AND type = 'R')
    CREATE ROLE db_auditor_rol;
GO

-- Operadores: solo escritura sobre las tablas transaccionales.
-- Se otorga a nivel de schema dbo para cubrir las tablas del modelo
-- físico aún no creadas (Parte 1). DENY explícito de lectura/borrado
-- para dejar la política documentada, no solo por ausencia de GRANT.
-- GRANT/DENY son idempotentes: repetirlos no falla.
GRANT INSERT, UPDATE ON SCHEMA::dbo TO db_operador_rol;
DENY SELECT, DELETE ON SCHEMA::dbo TO db_operador_rol;

-- Supervisores: lectura y escritura completas + ver datos sin máscara.
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO db_supervisor_rol;
GRANT UNMASK TO db_supervisor_rol;

-- Auditores: solo lectura (dbo + schema de auditoría) + ver datos sin máscara.
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
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_operador_rol' AND m.name = N'inv_operador1')
    ALTER ROLE db_operador_rol ADD MEMBER inv_operador1;
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_operador_rol' AND m.name = N'inv_operador2')
    ALTER ROLE db_operador_rol ADD MEMBER inv_operador2;
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_operador_rol' AND m.name = N'inv_operador3')
    ALTER ROLE db_operador_rol ADD MEMBER inv_operador3;
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_operador_rol' AND m.name = N'inv_operador4')
    ALTER ROLE db_operador_rol ADD MEMBER inv_operador4;

IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_supervisor_rol' AND m.name = N'Jafeth')
    ALTER ROLE db_supervisor_rol ADD MEMBER Jafeth;
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_supervisor_rol' AND m.name = N'Adrian')
    ALTER ROLE db_supervisor_rol ADD MEMBER Adrian;
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_supervisor_rol' AND m.name = N'Diego')
    ALTER ROLE db_supervisor_rol ADD MEMBER Diego;

IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_auditor_rol' AND m.name = N'inv_auditor1')
    ALTER ROLE db_auditor_rol ADD MEMBER inv_auditor1;
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_auditor_rol' AND m.name = N'inv_auditor2')
    ALTER ROLE db_auditor_rol ADD MEMBER inv_auditor2;

-- inventory_app: la API solo debe leer las tablas de auditoría (perfil auditor).
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_auditor_rol' AND m.name = N'inventory_app')
    ALTER ROLE db_auditor_rol ADD MEMBER inventory_app;

-- Administrador de la base de datos: control total sobre esta BD
-- (db_owner, no sysadmin de servidor, para no exceder lo pedido).
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_owner' AND m.name = N'inv_dba')
    ALTER ROLE db_owner ADD MEMBER inv_dba;

-- Operador de backup: rol fijo de SQL Server para respaldos.
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members drm
               JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
               JOIN sys.database_principals m ON drm.member_principal_id = m.principal_id
               WHERE r.name = N'db_backupoperator' AND m.name = N'inv_backup_operator')
    ALTER ROLE db_backupoperator ADD MEMBER inv_backup_operator;
GO
