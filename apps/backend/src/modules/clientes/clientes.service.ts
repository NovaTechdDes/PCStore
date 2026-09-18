import { getPool, sql } from "../../config/db"
import { ActualizarClienteDTO, CrearClienteDTO, FiltrosClientesDTO } from "./clientes.schema";

export const clientesFiltrados = async(filtros: FiltrosClientesDTO) => {
    const pool = await getPool();
    const request = pool.request();

    const condiciones: string[] = [];

    if(filtros.todos !== 'true'){
        condiciones.push("c.Activo = 1")
    };

    if(filtros.buscar){
        request.input('buscar', sql.NVarChar(255), `%${filtros.buscar}%`);
        condiciones.push(
            "(c.Nombre LIKE @buscar OR c.Cuit LIKE @buscar OR c.Telefono LIKE @buscar OR c.Email LIKE @buscar)"
        )
    };

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''

    const result = await request.query(`
        SELECT c.*
        FROM Clientes c
        ${where}
        ORDER BY c.Nombre
    `);

    return result.recordset;
};

export const obtenerUltimoCliente = async() => {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT TOP 1 * FROM Clientes ORDER BY Id DESC`);
    return result.recordset[0] ?? null;
};

export const obtenerClientePorId = async (id: Number) => {
    const pool = await getPool();

    const clienteResult = await pool.request().input('id', sql.Int, id).query(`
        SELECT c.*
        FROM Clientes c
        WHERE c.Id = @id;    
    `)

    const cliente = clienteResult?.recordset[0];
    if(!cliente){
        return null;
    };

    return cliente;
};

export const crearCliente = async (data: CrearClienteDTO) => {
    const pool = await getPool();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const existe = await new sql.Request(transaction)
        .input('nombre', sql.NVarChar(255), data.nombre)
        .query(`
            SELECT  id FROM Clientes WHERE nombre = @nombre
        `);

        if(existe.recordset.length > 0){
            throw {
                status: 409,
                msg: "Ya existe un cliente con ese nombre"
            }
        };

        const clienteResult = await new sql.Request(transaction)
        .input('nombre', sql.NVarChar(255), data.nombre)
        .input('cuit', sql.NVarChar(20), data.cuit)
        .input('condicionIva', sql.NVarChar(50), data.condicionIva)
        .input('condicionFacturacion', sql.Int, data.condicionFacturacion)
        .input('localidad', sql.NVarChar(100), data.localidad)
        .input('direccion', sql.NVarChar(200), data.direccion)
        .input('telefono', sql.NVarChar(50), data.telefono)
        .input('email', sql.NVarChar(150), data.email)
        .input('observaciones', sql.NVarChar(255), data.observaciones)
        .query(`
            INSERT INTO Clientes (Nombre, Cuit, CondicionIva, CondicionFacturacion, Localidad, Direccion, Telefono, Email, Observaciones)
            VALUES (@nombre, @cuit, @condicionIva, @condicionFacturacion, @localidad, @direccion, @telefono, @email, @observaciones);
            SELECT SCOPE_IDENTITY() AS Id;
        `);

        const cliente = clienteResult.recordset[0]

        await transaction.commit();
        return cliente;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const actualizarCliente = async (id: Number, data: ActualizarClienteDTO) => {
    const pool = await getPool();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        const existe = await new sql.Request(transaction)
        .input('nombre', sql.NVarChar(255), data.nombre)
        .input('id', sql.Int, id)
        .query(`
            SELECT  id FROM Clientes WHERE Nombre = @nombre AND id <> @id
        `);

        if(existe.recordset.length > 0){
            throw {
                status: 409,
                msg: "Ya existe un cliente con ese nombre"
            }
        };


        const clienteResult = await new sql.Request(transaction)
        .input('id', sql.Int, id)
        .input('nombre', sql.NVarChar(255), data.nombre)
        .input('cuit', sql.NVarChar(20), data.cuit)
        .input('condicionIva', sql.NVarChar(50), data.condicionIva)
        .input('condicionFacturacion', sql.Int, data.condicionFacturacion)
        .input('localidad', sql.NVarChar(100), data.localidad)
        .input('direccion', sql.NVarChar(200), data.direccion)
        .input('telefono', sql.NVarChar(50), data.telefono)
        .input('email', sql.NVarChar(150), data.email)
        .input('observaciones', sql.NVarChar(255), data.observaciones)
        .query(`
            UPDATE Clientes SET
            Nombre = COALESCE(@nombre, Nombre),
            Cuit = COALESCE(@cuit, Cuit),
            CondicionIva = COALESCE(@condicionIva, CondicionIva),
            CondicionFacturacion = COALESCE(@condicionFacturacion, CondicionFacturacion),
            Localidad = COALESCE(@localidad, Localidad),
            Direccion = COALESCE(@direccion, Direccion),
            Telefono = COALESCE(@telefono, Telefono),
            Email = COALESCE(@email, Email),
            Observaciones = COALESCE(@observaciones, Observaciones)
            OUTPUT INSERTED.*
            WHERE Id = @id;
        `);

        await transaction.commit();
        return clienteResult.recordset[0];
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// ===== Baja Logica =====

export const eliminarCliente = async (id: number) => {
    const pool = await getPool();
    const transaction = pool.transaction();

    try {
        await transaction.begin();
        const result = await new sql.Request(transaction).input('id', sql.Int, id)
        .query("UPDATE Clientes SET Activo = 0 OUTPUT INSERTED.* WHERE Id = @id");

        if(!result.rowsAffected[0]){
            throw {
                status: 404,
                msg: "No se encontro el cliente"
            }
        }
        
        await transaction.commit();
        return result.recordset[0];
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};