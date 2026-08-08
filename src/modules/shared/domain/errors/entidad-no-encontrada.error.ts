export class EntidadNoEncontradaError extends Error {
  constructor(entidad: string, id: string) {
    super(`${entidad} con id "${id}" no existe.`);
    this.name = 'EntidadNoEncontradaError';
  }
}
