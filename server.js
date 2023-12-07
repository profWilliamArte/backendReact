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

// Ruta para los resumenes
app.get('/resumen', async (req, res) => {
    try {
        const databaseName = "tallerreact";
        const tableName = "resumen";

        verificarExistencia(databaseName, tableName, (error) => {
            if (error) {
                return res.json(error);
            }

            const sql = "SELECT * FROM resumen limit 1";
            db.query(sql, (err, data) => {
                if (err) {
                    return res.json("Error de conexión con la base de datos");
                }
                if (data.length > 0) {
                    const response = {
                        resumen: data // Assign the data array to the "vehiculos" key
                    };
                    res.set('resumen', 'true'); // Set the custom header
                    return res.json(response);
                } else {
                    return res.json("No se encontraron clientes con los criterios de búsqueda proporcionados");
                }
            });
        });
    } catch (error) {
        return res.json("Error en el servidor");
    }
});

// Ruta para obtener clientes filtrados por nombre, apellido, genero, email
app.get('/clientes', async (req, res) => {
    try {
        const databaseName = "tallerreact";
        const tableName = "clientes";

        verificarExistencia(databaseName, tableName, (error) => {
            if (error) {
                return res.json(error);
            }

            const { nombre, apellido, genero, email } = req.query; // Obtener los parámetros de la solicitud

            let conditions = [];
            let params = [];

            if (nombre) {
                conditions.push("nombre = ?");
                params.push(nombre);
            }
            if (apellido) {
                conditions.push("apellido = ?");
                params.push(apellido);
            }
            if (genero) {
                conditions.push("genero = ?");
                params.push(genero);
            }
            if (email) {
                conditions.push("email = ?");
                params.push(email);
            }
            

            let sql = "SELECT * FROM clientes";
            if (conditions.length > 0) {
                sql += " WHERE " + conditions.join(" AND ");
            }

            db.query(sql, params, (err, data) => {
                if (err) {
                    return res.json("Error de conexión con la base de datos");
                }
                if (data.length > 0) {
                    const response = {
                        clientes: data // Assign the data array to the "vehiculos" key
                    };
                    res.set('clientes', 'true'); // Set the custom header
                    return res.json(response);
                } else {
                    return res.json("No se encontraron clientes con los criterios de búsqueda proporcionados");
                }
            });
        });
    } catch (error) {
        return res.json("Error en el servidor");
    }
});

// Ruta para obtener los vehiculos filtrados por marca, modelo, anio y vin
app.get('/vehiculos', async (req, res) => {
    try {
        const databaseName = "tallerreact";
        const tableName = "vehiculos";

        verificarExistencia(databaseName, tableName, (error) => {
            if (error) {
                return res.json(error);
            }

            const { id, marca, modelo, anio, vin } = req.query; // Obtener los parámetros de la solicitud

            let conditions = [];
            let params = [];
            if (id) { 
                conditions.push("id = ?");
                params.push(id);
            }
            if (marca) { 
                conditions.push("marca = ?");
                params.push(marca);
            }
            if (modelo) {
                conditions.push("modelo = ?");
                params.push(modelo);
            }
            if (anio) {
                conditions.push("anio = ?");
                params.push(anio);
            }
            if (vin) {
                conditions.push("vin = ?");
                params.push(vin);
            }
            

            let sql = "SELECT * FROM vehiculos";
            if (conditions.length > 0) {
                sql += " WHERE " + conditions.join(" AND ");
            }

            db.query(sql, params, (err, data) => {
                if (err) {
                    return res.json("Error de conexión con la base de datos");
                }
                if (data.length > 0) {
                    if (data.length > 1) {
                        const response = {
                            vehiculos: data // Assign the data array to the "vehiculos" key
                        };
                        res.set('vehiculo', 'true'); // Set the custom header
                        return res.json(response);
                    }else{
                        return res.json(data);
                    }

                } else {
                    return res.json("No se encontraron clientes con los criterios de búsqueda proporcionados");
                }
            });
        });
    } catch (error) {
        return res.json("Error en el servidor");
    }
});

// Insertar
app.post('/InsertarVehiculo', async (req, res) =>{
    try {
        const databaseName = "tallerreact";
        const tableName = "vehiculos";

        verificarExistencia(databaseName, tableName, (error) => {
        if (error) {
            return res.json(error);
        }

        const sql = "INSERT INTO vehiculos(marca, modelo, anio, vin) VALUES (?)";
        const values = [
            req.body.marca,
            req.body.modelo,
            req.body.anio,
            req.body.vin,
        ]
        db.query(sql,[values], (err, data) => {
            if(err){
                return res.json({Error: "Error"})
            }
            return res.json(data)    
        });
    });
    } catch (error) {
        return res.json("Error en el servidor");
    }
});
// Eliminar
app.delete('/DeleteVehiculo/:id', async (req, res) =>{
    try {
        const databaseName = "tallerreact";
        const tableName = "vehiculos";

        verificarExistencia(databaseName, tableName, (error) => {
        if (error) {
            return res.json(error);
        }
        const sql = "DELETE FROM vehiculos WHERE id=?";
        const id=req.params.id;
        db.query(sql,[id], (err, data) => {
            if(err){
                return res.json({Error: "Error"})
            }
            return res.json(data)    
        })
    });
    } catch (error) {
        return res.json("Error en el servidor");
    }
})


// Actualizar
app.put('/ActualizarVehiculo/:id', async (req, res) =>{
    try {
        const databaseName = "tallerreact";
        const tableName = "vehiculos";

        verificarExistencia(databaseName, tableName, (error) => {
        if (error) {
            return res.json(error);
        }
        const sql = "UPDATE vehiculos SET marca=?, modelo=?, anio=?, vin=? WHERE id=?";
        const values = [
            req.body.marca,
            req.body.modelo,
            req.body.anio,
            req.body.vin,
        ]
        const id=req.params.id;
        db.query(sql,[...values, id], (err, data) => {
            if(err){
                return res.json({Error: "Error"})
            }
            return res.json(data)    
        })

    });
    } catch (error) {
        return res.json("Error en el servidor");
    }


})


















 


app.listen(8081, () => {
    console.log("Servidor listo");
});
