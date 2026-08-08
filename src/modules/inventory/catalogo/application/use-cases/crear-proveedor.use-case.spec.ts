import { Proveedor } from '../../domain/entities/proveedor.entity';
import {
  DatosCrearProveedor,
  ProveedorRepositoryPort,
} from '../../domain/ports/proveedor-repository.port';

import { CrearProveedor } from './crear-proveedor.use-case';

class ProveedorRepositoryFake implements ProveedorRepositoryPort {
  crear(datos: DatosCrearProveedor): Promise<Proveedor> {
    return Promise.resolve(
      new Proveedor(
        'id-generado',
        datos.nombre,
        datos.telefono,
        datos.correo,
        datos.direccion,
      ),
    );
  }

  listar(): Promise<Proveedor[]> {
    return Promise.resolve([]);
  }

  obtenerPorId(): Promise<Proveedor | null> {
    return Promise.resolve(null);
  }

  actualizar(): Promise<Proveedor> {
    throw new Error('no usado en este test');
  }

  eliminar(): Promise<void> {
    return Promise.resolve();
  }
}

describe('CrearProveedor', () => {
  it('crea un proveedor a partir de los datos recibidos', async () => {
    const crearProveedor = new CrearProveedor(new ProveedorRepositoryFake());

    const proveedor = await crearProveedor.ejecutar({
      nombre: 'Distribuidora ABC',
      telefono: '2222-3333',
      correo: null,
      direccion: null,
    });

    expect(proveedor).toEqual(
      new Proveedor(
        'id-generado',
        'Distribuidora ABC',
        '2222-3333',
        null,
        null,
      ),
    );
  });
});
