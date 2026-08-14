export class SesionNoEncontradaError extends Error {
  constructor() {
    super('La sesión ya no está activa. Inicie sesión de nuevo.');
    this.name = 'SesionNoEncontradaError';
  }
}
