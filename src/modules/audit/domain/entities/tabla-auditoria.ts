// Una tabla espejo por cada tabla transaccional (ver migración
// CreateAuditSchemaAndTriggers) — es la lista blanca de nombres válidos
// para /audit/:tabla, nunca se interpola un nombre de tabla que no esté acá.
export const TABLAS_AUDITORIA = [
  'Bodegas',
  'Categorias',
  'Proveedores',
  'Productos',
  'OrdenesCompra',
  'EntradasInventario',
  'SalidasInventario',
  'InventarioActual',
] as const;

export type TablaAuditoria = (typeof TABLAS_AUDITORIA)[number];

export function esTablaAuditoriaValida(valor: string): valor is TablaAuditoria {
  return (TABLAS_AUDITORIA as readonly string[]).includes(valor);
}
