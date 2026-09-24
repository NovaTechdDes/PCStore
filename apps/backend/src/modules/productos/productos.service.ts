import { getPool, sql } from "../../config/db";
import { obtenerValorClave } from "../configuracion/configuracion.service";
import {
  ActualizarProductoDTO,
  CrearProductoDTO,
  FiltrosProductoDTO,
} from "./productos.schema";
import fs from "node:fs";
import path from "path";

// 1. Calcular precio
export async function calcularPrecio(
  costo: number,
  costoDolar: number,
  iva: number,
  ganancia: number,
) {
  let base: number;

  if (costoDolar > 0) {
    const valorDolar = await obtenerValorClave("ValorDolar");
    base = costoDolar * valorDolar;
  } else {
    base = costo;
  }

  const precioConIva = base * (1 + iva / 100);
  const conGanancia = precioConIva * (1 + ganancia / 100);
  return Number(Math.round(conGanancia).toFixed(2));
}

// Listado Con filtros
export const listarProductos = async (filtros: FiltrosProductoDTO) => {
  const pool = await getPool();
  const request = pool.request();

  const condiciones: string[] = [];

  if (filtros.todos !== "true") {
    condiciones.push("p.Activo = 1");
  }

  if (filtros.marcaId) {
    request.input("marcaId", sql.Int, filtros.marcaId);
    condiciones.push("p.MarcaId = @marcaId");
  }

  if (filtros.proveedorId) {
    request.input("proveedorId", sql.Int, filtros.proveedorId);
    condiciones.push("p.ProveedorId = @proveedorId");
  }

  if (filtros.buscar) {
    request.input("buscar", sql.NVarChar(255), `%${filtros.buscar}%`);
    condiciones.push(
      "(p.Descripcion LIKE @buscar OR p.CodigoInterno LIKE @buscar OR p.CodigoBarra LIKE @buscar)",
    );
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";

  const result = await request.query(`
        SELECT p.*, m.Nombre AS MarcaNombre, c.Nombre as CategoriaNombre, pr.Nombre AS ProveedorNombre, u.Nombre AS UnidadNombre, img.RutaArchivo AS Imagen
        FROM Productos p
        LEFT JOIN Marcas m ON m.Id = p.MarcaId
        LEFT JOIN Proveedores pr ON pr.Id = p.ProveedorId
        LEFT JOIN Categorias c ON c.Id = p.CategoriaId
        LEFT JOIN UnidadesMedida u ON u.id = p.UnidadId
        OUTER APPLY (
          SELECT TOP 1 pi.RutaArchivo
          FROM ProductoImagenes pi
          WHERE pi.ProductoId = p.Id
          ORDER BY pi.EsPrincipal DESC, pi.Id ASC
        ) img
        ${where}
        ORDER BY p.Descripcion
    `);

  return result.recordset.map((p) => ({
    ...p,
    imagen: p.Imagen ?? null
  }));
};

export const obtenerProductoPorId = async (id: Number) => {
  const pool = await getPool();

  const productoResult = await pool.request().input("id", sql.Int, id).query(`
        SELECT p.*, m.Nombre as MarcaNombre, c.Nombre as CategoriaNombre, pr.Nombre AS ProveedorNombre, u.Nombre AS UnidadNombre
        FROM Productos p
        LEFT JOIN Marcas m ON m.Id = p.MarcaId
        LEFT JOIN Proveedores pr ON pr.Id = p.ProveedorId
        LEFT JOIN Categorias c ON c.Id = p.CategoriaId
        LEFT JOIN UnidadesMedida u ON u.Id = p.UnidadId
        WHERE p.Id = @id
    `);


  const producto = productoResult.recordset[0];
  if (!producto) return null;

  const caracteristicasResult = await pool
    .request()
    .input("id", sql.Int, id)
    .query(
      "SELECT Id, Clave, Valor FROM ProductoCaracteristicas WHERE ProductoId = @id",
    );

  const imagenesResult = await pool
    .request()
    .input("id", sql.Int, id)
    .query(
      "SELECT Id, RutaArchivo, EsPrincipal FROM ProductoImagenes WHERE ProductoId = @id",
    );

     const principal = imagenesResult.recordset.find((img: any) => img.EsPrincipal)?.RutaArchivo 
    ?? imagenesResult.recordset[0]?.RutaArchivo 
    ?? null;

  return {
    ...producto,
    caracteristicas: caracteristicasResult.recordset,
    imagenes: imagenesResult.recordset,
    imagen: principal,
  };
};

export const obtenerProductoPorCodigoInterno = async (codigo: string) => {
  const pool = await getPool();

  const productoResult = await pool.request().input("codigoInterno", sql.NVarChar(50), codigo).query(`
        SELECT p.CodigoInterno
        FROM Productos p
        WHERE p.CodigoInterno = @codigoInterno
    `);


  const producto = productoResult.recordset[0];
  if (!producto) return null;

    const imagenesResult = await pool
    .request()
    .input("id", sql.Int, producto.Id)
    .query(
      "SELECT Id, RutaArchivo, EsPrincipal FROM ProductoImagenes WHERE ProductoId = @id ORDER BY EsPrincipal DESC, Id ASC",
    );

  const principal = imagenesResult.recordset.find((img: any) => img.EsPrincipal)?.RutaArchivo 
    ?? imagenesResult.recordset[0]?.RutaArchivo 
    ?? null;
  return {
    ...producto,
    imagenes: imagenesResult.recordset,
    imagen: principal,
  };
};

export const obtenerProductoParaVenta = async (codigo: string) => {
  const pool = await getPool();
  

  const result = await pool.request().input('codigo', sql.NVarChar(50), codigo)
  .query(`
    SELECT TOP 1 p.Id, p.CodigoInterno, p.CodigoBarra, p.Descripcion, p.Precio, p.IVA, p.Stock, p.Activo, m.Nombre as MarcaNombre
    FROM Productos p
    LEFT JOIN Marcas m ON m.Id = p.MarcaId
    WHERE (p.codigoInterno = @codigo OR p.CodigoBarra = @codigo) and p.Activo = 1 ORDER BY 
    CASE WHEN p.CodigoInterno = @codigo THEN 1 ELSE  2 END ASC
  `);

  const producto = result.recordset[0];
  if(!producto) return null;
  
  return producto
}

export const crearProducto = async (
  data: CrearProductoDTO,
  archivo: Express.Multer.File | undefined,
  eliminarImagen: boolean
) => {
  const pool = await getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const precio = await calcularPrecio(
      data.costo,
      data.costoDolar,
      data.iva,
      data.ganancia,
    );

    //Verificar codigo interno unico
    const existe = await new sql.Request(transaction)
      .input("codigoInterno", sql.NVarChar(50), data.codigoInterno)
      .input("descripcion", sql.NVarChar(255), data.descripcion)
      .query(
        "SELECT Id From Productos WHERE CodigoInterno = @codigoInterno OR Descripcion = @descripcion",
      );

    if (existe.recordset.length > 0) {
      throw {
        status: 409,
        msg: "Ya existe un producto con ese codigo interno o descripcion",
      };
    }

    const productoResult = await new sql.Request(transaction)
      .input("codigoInterno", sql.NVarChar(50), data.codigoInterno)
      .input("codigoBarra", sql.NVarChar(50), data.codigoBarra ?? null)
      .input("cod_fabrica", sql.NVarChar(50), data.cod_fabrica ?? null)
      .input("descripcion", sql.NVarChar(255), data.descripcion)
      .input("marcaId", sql.Int, data.marcaId ?? null)
      .input("proveedorId", sql.Int, data.proveedorId ?? null)
      .input("categoriaId", sql.Int, data.categoriaId ?? null)
      .input("unidadId", sql.Int, data.unidadId ?? null)
      .input("manejaSeries", sql.Bit, data.manejaSeries ? 1 : 0)
      .input("costo", sql.Decimal(18, 2), data.costo)
      .input("costoDolar", sql.Decimal(18, 2), data.costoDolar)
      .input("iva", sql.Decimal(5, 2), data.iva)
      .input("ganancia", sql.Decimal(5, 2), data.ganancia)
      .input("precio", sql.Decimal(18, 2), precio)
      .input("stock", sql.Int, data.stock).query(`
                INSERT INTO Productos
                    (CodigoInterno, CodigoBarra, cod_fabrica, Descripcion, MarcaId, ProveedorId, CategoriaId, UnidadId, Costo, CostoDolar, IVA, Ganancia, Precio, Stock, Activo)
                    OUTPUT INSERTED.*
                    VALUES
                    (@codigoInterno, @codigoBarra, @cod_fabrica, @descripcion, @marcaId, @proveedorId, @categoriaId, @unidadId, @costo, @costoDolar, @iva, @ganancia, @precio, @stock, 1);
            `);

    const producto = productoResult.recordset[0];

    // Insertar Caracteristicas
    for (const c of data.caracteristicas) {
      await new sql.Request(transaction)
        .input("productoId", sql.Int, producto.Id)
        .input("clave", sql.NVarChar(50), c.clave)
        .input("valor", sql.NVarChar(150), c.valor).query(`
                    INSERT INTO ProductoCaracteristicas(ProductoId, Clave, Valor)
                    VALUES (@productoId, @clave, @valor)
                `);
    }

    //Insertar Imagenes
    console.log(archivo)
    if(archivo){
      const rutaRelativa = `/uploads/productos/${archivo.filename}`;
      await new sql.Request(transaction)
        .input("productoId", sql.Int, producto.Id)
        .input("ruta", sql.NVarChar(255), rutaRelativa)
        .input("esPrincipal", sql.Bit, 1)
        .query(
          "INSERT INTO ProductoImagenes (ProductoId, RutaArchivo, EsPrincipal) VALUES (@productoId, @ruta, @esPrincipal)",
        );
        
    }

     
    await transaction.commit();
    return obtenerProductoPorId(producto.Id);
  } catch (error) {
    await transaction.rollback();
    if(archivo) fs.unlink(archivo.path, () => {});
    throw error;
  }
};

export const actualizarProducto = async (
  id: number,
  data: ActualizarProductoDTO,
  archivo: Express.Multer.File | undefined,
  eliminarImagen: boolean,
) => {
  const pool = await getPool();

  const actual = await obtenerProductoPorId(id);
  if (!actual) return null;

  const costo = data.costo ?? actual.Costo;
  const costoDolar = data.costoDolar ?? actual.CostoDolar;
  const iva = data.iva ?? actual.IVA;
  const ganancia = data.ganancia ?? actual.Ganancia;

  const precio = await calcularPrecio(costo, costoDolar, iva, ganancia);

  const proveedorId = data.proveedorId !== undefined ? data.proveedorId : actual.ProveedorId;
  const marcaId = data.marcaId !== undefined ? data.marcaId : actual.MarcaId;
  const unidadId = data.unidadId !== undefined ? data.unidadId : actual.UnidadId;
  const categoriaId = data.categoriaId !== undefined ? data.categoriaId : actual.CategoriaId;

  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("codigoInterno", sql.NVarChar(50), data.codigoInterno ?? null)
    .input("codigoBarra", sql.NVarChar(50), data.codigoBarra ?? null)
    .input("cod_fabrica", sql.NVarChar(50), data.cod_fabrica ?? null)
    .input("descripcion", sql.NVarChar(255), data.descripcion ?? null)
    .input("marcaId", sql.Int, marcaId)
    .input("proveedorId", sql.Int, proveedorId)
    .input("unidadId", sql.Int, unidadId)
    .input("manejaSeries", sql.Bit, data.manejaSeries !== undefined ? (data.manejaSeries ? 1 : 0) : null)
    .input("CategoriaId", sql.Int, categoriaId)
    .input("costo", sql.Decimal(18, 2), costo)
    .input("costoDolar", sql.Decimal(18, 2), costoDolar)
    .input("iva", sql.Decimal(5, 2), iva)
    .input("ganancia", sql.Decimal(5, 2), ganancia)
    .input("precio", sql.Decimal(18, 2), precio).query(`
      UPDATE Productos SET
        CodigoInterno = COALESCE(@codigoInterno, CodigoInterno),
        CodigoBarra = COALESCE(@codigoBarra, CodigoBarra),
        cod_fabrica = COALESCE(@cod_fabrica, cod_fabrica),
        Descripcion = COALESCE(@descripcion, Descripcion),
        MarcaId = @marcaId,
        ProveedorId = @proveedorId,
        UnidadId = @unidadId,
        CategoriaId = @CategoriaId,
        ManejaSeries = COALESCE(@manejaSeries, ManejaSeries),
        Costo = @costo,
        CostoDolar = @costoDolar,
        IVA = @iva,
        Ganancia = @ganancia,
        Precio = @precio
      OUTPUT INSERTED.*
      WHERE Id = @id
    `);

    if(archivo){
      if(actual.imagenes && actual.imagenes.length > 0){
        for(const img of actual.imagenes){
          const rutaFisica = path.join(process.cwd(), img.RutaArchivo.replace(/^\//, ""));
          fs.unlink(rutaFisica, () => {});
        }

        await pool.request().input('productoId', sql.Int, id).query("DELETE FROM ProductoImagenes WHERE ProductoId = @productoId");
      }

      const rutaRelativa = `/uploads/productos/${archivo.filename}`;
      await pool.request()
        .input("productoId", sql.Int, id)
        .input("ruta", sql.NVarChar(255), rutaRelativa)
        .input("esPrincipal", sql.Bit, 1)
        .query("INSERT INTO ProductoImagenes (ProductoId, RutaArchivo, EsPrincipal) VALUES (@productoId, @ruta, @esPrincipal)");
    }else if (eliminarImagen){
      if (actual.imagenes && actual.imagenes.length > 0) {
      for (const img of actual.imagenes) {
        const rutaFisica = path.join(process.cwd(), img.RutaArchivo.replace(/^\//, ""));
        fs.unlink(rutaFisica, () => {});
      }
      await pool
        .request()
        .input("productoId", sql.Int, id)
        .query("DELETE FROM ProductoImagenes WHERE ProductoId = @productoId");
    }
    }

  return obtenerProductoPorId(id);
};


// ===== Baja lógica =====
export const eliminarProducto = async (id: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("UPDATE Productos SET Activo = 0 OUTPUT INSERTED.* WHERE Id = @id");
  return result.recordset[0] ?? null;
};

export async function agregarImagenes(
  id: number,
  archivos: Express.Multer.File[],
) {
  const pool = await getPool();

  const producto = await obtenerProductoPorId(id);
  if (!producto) {
    archivos.forEach((f) => fs.unlink(f.path, () => {}));
    throw { status: 404, msg: "Producto no encontrado" };
  }

  const tieneImagenPrincipal = producto.imagenes.some(
    (img: any) => img.EsPrincipal,
  );

  for (let i = 0; i < archivos.length; i++) {
    const rutaRelativa = `/uploads/productos/${archivos[i].filename}`;
    const esPrincipal = !tieneImagenPrincipal && i === 0;
    await pool
      .request()
      .input("productoId", sql.Int, id)
      .input("ruta", sql.NVarChar(255), rutaRelativa)
      .input("esPrincipal", sql.Bit, esPrincipal ? 1 : 0)
      .query(
        "INSERT INTO ProductoImagenes (ProductoId, RutaArchivo, EsPrincipal) VALUES (@productoId, @ruta, @esPrincipal)",
      );
  }

  return obtenerProductoPorId(id);
}

export async function eliminarImagen(imagenId: number) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("id", sql.Int, imagenId)
    .query("SELECT * FROM ProductoImagenes WHERE Id = @id");

  const imagen = result.recordset[0];
  if (!imagen) {
    throw { status: 404, msg: "Imagen no encontrada" };
  }

  await pool
    .request()
    .input("id", sql.Int, imagenId)
    .query("DELETE FROM ProductoImagenes WHERE Id = @id");

  const rutaFisica = path.join(
    process.cwd(),
    imagen.RutaArchivo.replace(/^\//, ""),
  );
  fs.unlink(rutaFisica, () => {});

  return { ok: true };
}
