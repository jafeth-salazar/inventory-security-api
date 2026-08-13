// Una fila de cualquier tabla audit.<Tabla> — las 5 columnas de auditoría
// son comunes a las 8 tablas espejo; `datos` guarda las columnas propias de
// la tabla origen (distintas por tabla), tal cual las devuelve SQL Server.
export class RegistroAuditoria {
  constructor(
    public readonly idAuditoria: number,
    public readonly movimiento: string,
    public readonly usuarioAud: string | null,
    public readonly fechaAud: Date,
    public readonly equipoOrigen: string | null,
    public readonly ipOrigen: string | null,
    public readonly datos: Record<string, unknown>,
  ) {}
}
