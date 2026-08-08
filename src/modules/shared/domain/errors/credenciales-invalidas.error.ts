export class CredencialesInvalidasError extends Error {
  constructor() {
    super('Usuario o contraseña incorrectos.');
    this.name = 'CredencialesInvalidasError';
  }
}
