export interface SesionSql {
  sessionId: string;
  usuario: string;
}

// El origen real del request HTTP (no el del contenedor de la API), para que
// los triggers de auditoría puedan registrar EquipoOrigen/IPOrigen del
// usuario final vía SESSION_CONTEXT — ver "Sesión SQL dinámica" en CLAUDE.md.
export interface OrigenConexion {
  ip: string | null;
  equipo: string | null;
}

export const SQL_SESSION_PORT = Symbol('SQL_SESSION_PORT');

export interface SqlSessionPort {
  /**
   * Intenta abrir una conexión a InventorySecurityDB con las credenciales
   * exactas del usuario. Si SQL Server rechaza el login, lanza
   * CredencialesInvalidasError — no hay lista de usuarios en la app.
   */
  authenticate(
    usuario: string,
    password: string,
    origen: OrigenConexion,
  ): Promise<SesionSql>;

  closeSession(sessionId: string): Promise<void>;
}
