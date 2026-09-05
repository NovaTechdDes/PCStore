import { getPool } from "../../config/db"
import sql from "mssql"
import bcrypt from 'bcrypt'
import { ActualizarUsuarioDTO, CrearUsuarioDTO, LoginDTO } from "./usuarios.schema";
import jwt from 'jsonwebtoken'
import { env } from "../../config/env";

const SALT_ROUNDS = 10;
const columnasPublicas = 'Id, NombreUsuario, Rol, Activo, FechaCreacion';


export const listarUsuarios = async(soloActivas: boolean = true) => {
    const pool = await getPool();
    const query = soloActivas ? `SELECT ${columnasPublicas} FROM Usuarios WHERE Activo = 1 ORDER BY NombreUsuario` : `SELECT ${columnasPublicas} FROM Usuarios ORDER BY NombreUsuario`
    const result = await pool.request().query(query);
    return result.recordset
};

export const obtenerUsuarioPorId = async(id: Number) => {
    const pool = await getPool();
    const result = await pool.request().input('id', sql.Int, id).query(`SELECT ${columnasPublicas} FROM Usuarios WHERE Id = @id`);
    return result.recordset[0] ?? null;
};


export const crearUsuario = async(data: CrearUsuarioDTO) => {
    const pool = await getPool();

    const existe = await pool.request().input('nombreUsuario', sql.NVarChar(50), data.nombreUsuario).query(`SELECT Id FROM Usuarios WHERE NombreUsuario = @nombreUsuario`);

    if(existe.recordset.length > 0){
        throw { status: 409, msg: 'El Nombre de usuario ya existe'}
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const result = await pool.request()
                .input('nombreUsuario', sql.NVarChar(50), data.nombreUsuario)
                .input('passwordHash', sql.NVarChar(255), passwordHash)
                .input('rol', sql.NVarChar(30), data.rol)
    .query(
        `INSERT INTO Usuarios (NombreUsuario, PasswordHash, Rol)
         OUTPUT INSERTED.Id, INSERTED.NombreUsuario, INSERTED.Rol, INSERTED.Activo, INSERTED.FechaCreacion VALUES (@nombreUsuario, @passwordHash, @rol)   
        `
    )

    return result.recordset[0]
};

export const actualizarUsuario = async(id: number, data: ActualizarUsuarioDTO) => {
    const pool = await getPool();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('nombreUsuario', sql.NVarChar(50), data.nombreUsuario ?? null)
        .input('rol', sql.NVarChar(30), data.rol ?? null)
        .query(
            `UPDATE Usuarios SET
            NombreUsuario = COALESCE(@nombreUsuario, NombreUsuario),
            ROL = COALESCE(@Rol, Rol)
            OUTPUT INSERTED.Id, INSERTED.NombreUsuario, INSERTED.Rol, INSERTED.Activo, INSERTED.FechaCreacion
            WHERE Id = @id`
        )
    return result.recordset[0] ?? null
};

export const cambiarPassword = async(id: number, passWordActual: string, passWordNueva: string) => {
    const pool = await getPool();

    const usuario = await pool.request()
    .input('id', sql.Int, id).
    query('SELECT PasswrodHash FROM Usuarios WHERE Id = @Id');

    if((await usuario).recordset.length === 0){
        throw { status: 404, msg: 'Usuario no encontrado' }
    }

    const hashActual = usuario.recordset[0].PasswordHash;
    const coincide = await bcrypt.compare(passWordActual, hashActual);

    if(!coincide){
        throw {status: 401, msg: 'Contraseña actual incorrecta'};
    }

    const nuevoHash = await bcrypt.hash(passWordNueva, SALT_ROUNDS);

    await pool.request()
    .input('id', sql.Int, id)
    .input('passwordHash', sql.NVarChar(255), nuevoHash)
    .query('UPDATE Usuarios SET PasswordHash = @PasswordHash WHERE Id = @Id');

    return { ok: true };
};


export const eliminarUsuario = async(id: number) => {
    const pool = await getPool();
    const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`UPDATE Usuarios SET Activo = 0 WHERE Id = @id`);

    return result.recordset[0] ?? null;
}


export const login = async(data: LoginDTO) => {
    const pool = await getPool();

    const result = await pool.request()
    .input('NombreUsuario', sql.NVarChar(50), data.nombreUsuario)
    .query(
        `SELECT Id, NombreUsuario, Rol, PasswordHash
         FROM Usuarios
         WHERE NombreUsuario = @NombreUsuario AND Activo = 1`
    )

    const usuario = result.recordset[0];

    if(!usuario){
        throw { status: 401, msg: 'Nombre de usuario o contraseña incorrectos' }
    }

    const coincide = await bcrypt.compare(data.password, usuario.PasswordHash);

    if(!coincide){
        throw { status: 401, msg: 'Contraseña actual incorrecta' };
    };

    const token = jwt.sign(
        {id: usuario.Id, nombreUsuario: usuario.NombreUsuario, Rol: usuario.Rol},
        env.JWT_SECRET,
        {expiresIn: env.JWT_EXPIRES_IN} as jwt.SignOptions
    )

    return {
        token, 
        usuario: {
            id: usuario.Id,
            nombreUsuario: usuario.NombreUsuario,
            rol: usuario.Rol
        }
    }
}