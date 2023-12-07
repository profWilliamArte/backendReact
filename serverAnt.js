const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tallerreact",
});

// Función para verificar la existencia de la base de datos y la tabla
function verificarExistencia(databaseName, tableName, callback) {
    db.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [databaseName], (err, result) => {
        if (err) {
            return callback("Error de conexión con la base de datos");
        }
        if (result.length === 0) {
            return callback("La base de datos no existe");
        }

        db.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`, [databaseName, tableName], (err, result) => {
            if (err) {
                return callback("Error de conexión con la base de datos");
            }
            if (result.length === 0) {
                return callback("La tabla no existe");
            }

            callback(null);
        });
    });
}

// Ruta para validar el login
app.post('/login', async (req, res) => {
    try {
        const databaseName = "tallerreact";
        const tableName = "login";

        verificarExistencia(databaseName, tableName, (error) => {
            if (error) {
                return res.json(error);
            }

            const sql = "SELECT * FROM login WHERE correo = ? AND clave = ?";
            const [email, password] = [req.body.email, req.body.password];
            db.query(sql, [email, password], (err, data) => {
                if (err) {
                    return res.json("Error de conexión con la base de datos");
                }
                if (data.length > 0) {
                    return res.json("Correo y clave validado !!!!");
                } else {
                    return res.json("No encontrado");
                }
            });
        });
    } catch (error) {
        return res.json("Error en el servidor");
    }
});

// Ruta para obtener el listado de clientes
app.get('/clientes', async (req, res) => {
    try {
        const databaseName = "tallerreact";
        const tableName = "clientes";

        verificarExistencia(databaseName, tableName, (error) => {
            if (error) {
                return res.json(error);
            }

            const sql = "SELECT * FROM clientes";
            db.query(sql, (err, data) => {
                if (err) {
                    return res.json("Error de conexión con la base de datos");
                }
                if (data.length > 0) {
                    return res.json(data);
                } else {
                    return res.json("La tabla no tiene información");
                }
            });
        });
    } catch (error) {
        return res.json("Error en el servidor");
    }
});

// Ruta para obtener el listado de vehículos
app.get('/vehiculos', async (req, res) => {
    try {
        const databaseName = "tallerreact";
        const tableName = "vehiculos";

        verificarExistencia(databaseName, tableName, (error) => {
            if (error) {
                return res.json(error);
            }

            const sql = "SELECT * FROM vehiculos";
            db.query(sql, (err, data) => {
                if (err) {
                    return res.json("Error de conexión con la base de datos");
                }
                if (data.length > 0) {
                    return res.json(data);
                } else {
                    return res.json("La tabla no tiene información");
                }
            });
        });
    } catch (error) {
        return res.json("Error en el servidor");
    }
});

app.listen(8081, () => {
    console.log("Servidor listo");
});
