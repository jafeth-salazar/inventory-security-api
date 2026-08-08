export interface SesionSql {
  sessionId: string;
  usuario: string;
}

export const SQL_SESSION_PORT = Symbol('SQL_SESSION_PORT');

export interface SqlSessionPort {
  /**
   * Intenta abrir una conexión a InventorySecurityDB con las credenciales
   * exactas del usuario. Si SQL Server rechaza el login, lanza
   * CredencialesInvalidasError — no hay lista de usuarios en la app.
   */
  authenticate(usuario: string, password: string): Promise<SesionSql>;

  closeSession(sessionId: string): Promise<void>;
}
