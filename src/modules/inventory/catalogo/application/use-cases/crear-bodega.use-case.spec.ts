import { Bodega } from '../../domain/entities/bodega.entity';
import {
  BodegaRepositoryPort,
  DatosCrearBodega,
} from '../../domain/ports/bodega-repository.port';

import { CrearBodega } from './crear-bodega.use-case';

class BodegaRepositoryFake implements BodegaRepositoryPort {
  crear(datos: DatosCrearBodega): Promise<Bodega> {
    return Promise.resolve(
      new Bodega('id-generado', datos.nombre, datos.ubicacion),
    );
  }

  listar(): Promise<Bodega[]> {
    return Promise.resolve([]);
  }

  obtenerPorId(): Promise<Bodega | null> {
    return Promise.resolve(null);
  }

  actualizar(): Promise<Bodega> {
    throw new Error('no usado en este test');
  }

  eliminar(): Promise<void> {
    return Promise.resolve();
  }
}

describe('CrearBodega', () => {
  it('crea una bodega a partir de los datos recibidos', async () => {
    const crearBodega = new CrearBodega(new BodegaRepositoryFake());

    const bodega = await crearBodega.ejecutar({
      nombre: 'Bodega Central',
      ubicacion: 'San José',
    });

    expect(bodega).toEqual(
      new Bodega('id-generado', 'Bodega Central', 'San José'),
    );
  });
});
