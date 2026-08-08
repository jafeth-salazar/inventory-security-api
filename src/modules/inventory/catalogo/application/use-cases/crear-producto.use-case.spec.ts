import { Producto } from '../../domain/entities/producto.entity';
import {
  DatosCrearProducto,
  ProductoRepositoryPort,
} from '../../domain/ports/producto-repository.port';

import { CrearProducto } from './crear-producto.use-case';

class ProductoRepositoryFake implements ProductoRepositoryPort {
  crear(datos: DatosCrearProducto): Promise<Producto> {
    return Promise.resolve(
      new Producto(
        'id-generado',
        datos.nombre,
        datos.descripcion,
        datos.precioUnitario,
        datos.categoriaId,
        datos.proveedorId,
      ),
    );
  }

  listar(): Promise<Producto[]> {
    return Promise.resolve([]);
  }

  obtenerPorId(): Promise<Producto | null> {
    return Promise.resolve(null);
  }

  actualizar(): Promise<Producto> {
    throw new Error('no usado en este test');
  }

  eliminar(): Promise<void> {
    return Promise.resolve();
  }
}

describe('CrearProducto', () => {
  it('crea un producto a partir de los datos recibidos', async () => {
    const crearProducto = new CrearProducto(new ProductoRepositoryFake());

    const producto = await crearProducto.ejecutar({
      nombre: 'Teclado mecánico',
      descripcion: null,
      precioUnitario: '25000.00',
      categoriaId: 'categoria-1',
      proveedorId: null,
    });

    expect(producto).toEqual(
      new Producto(
        'id-generado',
        'Teclado mecánico',
        null,
        '25000.00',
        'categoria-1',
        null,
      ),
    );
  });
});
