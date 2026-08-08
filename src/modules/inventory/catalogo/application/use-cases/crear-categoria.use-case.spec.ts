import { Categoria } from '../../domain/entities/categoria.entity';
import {
  CategoriaRepositoryPort,
  DatosCrearCategoria,
} from '../../domain/ports/categoria-repository.port';

import { CrearCategoria } from './crear-categoria.use-case';

class CategoriaRepositoryFake implements CategoriaRepositoryPort {
  crear(datos: DatosCrearCategoria): Promise<Categoria> {
    return Promise.resolve(new Categoria('id-generado', datos.nombre));
  }

  listar(): Promise<Categoria[]> {
    return Promise.resolve([]);
  }

  obtenerPorId(): Promise<Categoria | null> {
    return Promise.resolve(null);
  }

  actualizar(): Promise<Categoria> {
    throw new Error('no usado en este test');
  }

  eliminar(): Promise<void> {
    return Promise.resolve();
  }
}

describe('CrearCategoria', () => {
  it('crea una categoria a partir de los datos recibidos', async () => {
    const crearCategoria = new CrearCategoria(new CategoriaRepositoryFake());

    const categoria = await crearCategoria.ejecutar({ nombre: 'Electrónica' });

    expect(categoria).toEqual(new Categoria('id-generado', 'Electrónica'));
  });
});
