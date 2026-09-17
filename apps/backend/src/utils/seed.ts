import { getPool, sql } from "../config/db";

export const inicializarProveedorAirComputer = async () => {
  try {
    const pool = await getPool();
    const existe = await pool
      .request()
      .input("nombre", sql.NVarChar(150), "AIR COMPUTER")
      .query(
        `SELECT Id, Nombre FROM Proveedores WHERE UPPER(Nombre) = UPPER(@nombre)`
      );

    if (existe.recordset.length > 0) {
      console.log("ℹ️ El proveedor 'AIR COMPUTER' ya existe.");
      return;
    }

    await pool
      .request()
      .input("nombre", sql.NVarChar(150), "AIR COMPUTER")
      .input("contacto", sql.NVarChar(100), "AIR COMPUTER")
      .input("telefono", sql.NVarChar(50), null)
      .input("email", sql.NVarChar(100), null)
      .query(
        `INSERT INTO Proveedores (Nombre, Contacto, Telefono, Email, Activo)
         VALUES (@nombre, @contacto, @telefono, @email, 1)`
      );

    console.log("✅ Proveedor 'AIR COMPUTER' creado exitosamente.");
  } catch (error) {
    console.error("❌ Error al inicializar el proveedor 'AIR COMPUTER':", error);
  }
};

export const inicializarMarcaLogitech = async () => {
  try {
    const pool = await getPool();
    const existe = await pool
      .request()
      .input("nombre", sql.NVarChar(100), "LOGITECH")
      .query(
        `SELECT Id, Nombre FROM Marcas WHERE UPPER(Nombre) = UPPER(@nombre)`
      );

    if (existe.recordset.length > 0) {
      console.log("ℹ️ La marca 'LOGITECH' ya existe.");
      return;
    }

    await pool
      .request()
      .input("nombre", sql.NVarChar(100), "LOGITECH")
      .query(
        `INSERT INTO Marcas (Nombre, Activo)
         VALUES (@nombre, 1)`
      );

    console.log("✅ Marca 'LOGITECH' creada exitosamente.");
  } catch (error) {
    console.error("❌ Error al inicializar la marca 'LOGITECH':", error);
  }
};

export const inicializarCategoriaMouses = async () => {
  try {
    const pool = await getPool();
    const existe = await pool
      .request()
      .input("nombre", sql.VarChar(100), "MOUSES")
      .query(
        `SELECT Id, Nombre FROM Categorias WHERE UPPER(Nombre) = UPPER(@nombre)`
      );

    if (existe.recordset.length > 0) {
      console.log("ℹ️ La categoría 'MOUSES' ya existe.");
      return;
    }

    await pool
      .request()
      .input("nombre", sql.VarChar(100), "MOUSES")
      .query(
        `INSERT INTO Categorias (Nombre)
         VALUES (@nombre)`
      );

    console.log("✅ Categoría 'MOUSES' creada exitosamente.");
  } catch (error) {
    console.error("❌ Error al inicializar la categoría 'MOUSES':", error);
  }
};

export const inicializarUnidadPorDefecto = async () => {
  try {
    const pool = await getPool();
    const existe = await pool
      .request()
      .input("nombre", sql.NVarChar(50), "UNIDAD")
      .query(
        `SELECT Id, Nombre FROM UnidadesMedida WHERE UPPER(Nombre) = UPPER(@nombre)`
      );

    if (existe.recordset.length > 0) {
      console.log("ℹ️ La unidad de medida 'Unidad' ya existe.");
      return;
    }

    await pool
      .request()
      .input("nombre", sql.NVarChar(50), "Unidad")
      .query(
        `INSERT INTO UnidadesMedida (Nombre)
         VALUES (@nombre)`
      );

    console.log("✅ Unidad de medida 'Unidad' creada exitosamente.");
  } catch (error) {
    console.error("❌ Error al inicializar la unidad de medida 'Unidad':", error);
  }
};

export const inicializarClienteConsumidorFinal = async () => {
  try {
    const pool = await getPool();
    const existe = await pool
      .request()
      .input("nombre", sql.NVarChar(150), "Consumidor Final")
      .input("cuit", sql.NVarChar(20), "00000000")
      .query(
        `SELECT Id, Nombre FROM Clientes WHERE UPPER(Nombre) = UPPER(@nombre) OR Cuit = @cuit`
      );

    if (existe.recordset.length > 0) {
      console.log("ℹ️ El cliente 'Consumidor Final' ya existe.");
      return;
    }

    await pool
      .request()
      .input("nombre", sql.NVarChar(150), "Consumidor Final")
      .input("cuit", sql.NVarChar(20), "00000000")
      .input("condicionIva", sql.NVarChar(50), "Consumidor Final")
      .input("condicionFacturacion", sql.Int, 2)
      .input("localidad", sql.NVarChar(100), "Chajari")
      .input("direccion", sql.NVarChar(200), "Chajari")
      .input("telefono", sql.NVarChar(50), "000000")
      .input("email", sql.NVarChar(150), "consumidorfinal@correo.com")
      .input("tipoCuenta", sql.NVarChar(50), "Consumidor Final")
      .query(
        `INSERT INTO Clientes (Nombre, Cuit, CondicionIva, CondicionFacturacion, Localidad, Direccion, Telefono, Email, TipoCuenta, Activo)
         VALUES (@nombre, @cuit, @condicionIva, @condicionFacturacion, @localidad, @direccion, @telefono, @email, @tipoCuenta, 1)`
      );

    console.log("✅ Cliente 'Consumidor Final' creado exitosamente.");
  } catch (error) {
    console.error("❌ Error al inicializar el cliente 'Consumidor Final':", error);
  }
};

export const inicializarDatosPorDefecto = async () => {
  await inicializarProveedorAirComputer();
  await inicializarMarcaLogitech();
  await inicializarCategoriaMouses();
  await inicializarUnidadPorDefecto();
  await inicializarClienteConsumidorFinal();
};

