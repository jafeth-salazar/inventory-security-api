import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Marca una ruta como exenta del SqlSessionGuard global. Hoy solo la usa
// POST /auth/login — es la única ruta que no requiere una sesión SQL previa.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
