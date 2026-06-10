import pool from '../db/connection.js';
import csv from 'csv-parser';
import { Readable } from 'stream';
import multer from 'multer'; // 1. IMPORTAMOS EL ATRAPADOR

// 2. CONFIGURAMOS EL ATRAPADOR (Para que guarde el archivo temporalmente en la RAM)
const upload = multer({ storage: multer.memoryStorage() });

export const procesarCargaMasiva = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo CSV." });
        }

        const clientesNuevos = [];
        const stream = Readable.from(req.file.buffer);

        stream
            .pipe(csv({
                mapHeaders: ({ header }) => header
                    .replace(/^\uFEFF/, '') // Quita caracteres ocultos de Excel
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '_')
            }))
            .on('data', (fila) => {
                clientesNuevos.push(fila);
            })
            .on('end', async () => {
                // Iniciamos una transacción en la base de datos para asegurar integridad
                const clienteDB = await pool.connect();
                
                try {
                    await clienteDB.query('BEGIN'); // Empezamos la transacción

                    for (const cliente of clientesNuevos) {
                        // 1. Limpieza de datos (Si viene vacío en el CSV, lo volvemos nulo)
                        const rfc = cliente.rfc?.trim() || null;
                        const curp = cliente.curp?.trim() || null;
                        const nombre_completo = cliente.nombre_completo?.trim() || null;
                        const fecha_nacimiento = cliente.fecha_nacimiento?.trim() || null;
                        const nacionalidad = cliente.nacionalidad?.trim() || null;
                        const pais_nacimiento = cliente.pais_nacimiento?.trim() || null;
                        const genero = cliente.genero?.trim() || null;
                        const estado_civil = cliente.estado_civil?.trim() || null;
                        const tel_celular = cliente.tel_celular?.trim() || null;
                        const tel_fijo = cliente.tel_fijo?.trim() || null;
                        const correo = cliente.correo?.trim() || null;

                        if (!rfc || !curp || !nombre_completo) {
                            console.log('Fila inválida omitida:', cliente);
                            continue;
                        }

                        // 2. Transformación a Booleanos (PLD)
                        // Si el CSV dice "true", "si", "sí" o "1", lo tomamos como verdadero
                        const es_pep = /^(true|si|sí|1)$/i.test(cliente.es_pep?.trim());
                        const actua_cuenta_propia = /^(true|si|sí|1)$/i.test(cliente.actua_cuenta_propia?.trim());

                        // 3. Inserción SQL (Le añadimos ON CONFLICT para ignorar duplicados)
                        const query = `
                            INSERT INTO clientes (
                                rfc, curp, nombre_completo, fecha_nacimiento, nacionalidad, pais_nacimiento, 
                                genero, estado_civil, tel_celular, tel_fijo, correo, es_pep, actua_cuenta_propia
                            ) VALUES (
                                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
                            )
                            ON CONFLICT (rfc) DO NOTHING;
                        `;
                        
                        await clienteDB.query(query, [
                            rfc, curp, nombre_completo, fecha_nacimiento, nacionalidad, pais_nacimiento,
                            genero, estado_civil, tel_celular, tel_fijo, correo, es_pep, actua_cuenta_propia
                        ]);
                    }

                    await clienteDB.query('COMMIT'); // Guardamos todo de golpe si no hubo errores
                    
                    res.status(200).json({ 
                        mensaje: `¡Ingesta exitosa! Se importaron ${clientesNuevos.length} clientes a la bóveda.` 
                    });

                } catch (dbError) {
                    await clienteDB.query('ROLLBACK'); // Si un cliente falla, cancelamos toda la carga (Integridad)
                    console.error("Error al insertar el lote CSV en DB:", dbError);
                    res.status(500).json({ error: "Fallo durante la inserción. Revisa el formato de los datos." });
                } finally {
                    clienteDB.release(); // Liberamos la conexión
                }
            });

    } catch (error) {
        console.error("Error crítico:", error);
        res.status(500).json({ error: "Fallo interno procesando el archivo binario." });
    }
};

export const procesarCargaOperaciones = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo CSV." });
        }

        const operacionesNuevas = [];
        const stream = Readable.from(req.file.buffer);

        stream
            .pipe(csv({
                mapHeaders: ({ header }) => header
                    .replace(/^\uFEFF/, '') // Quita caracteres ocultos de Excel
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '_')
            }))
            .on('data', (fila) => {
                operacionesNuevas.push(fila);
            })
            .on('end', async () => {
                // Iniciamos una transacción en la base de datos para asegurar integridad
                const clienteDB = await pool.connect();

                try {
                    await clienteDB.query('BEGIN'); // Empezamos la transacción

                    for (const operacion of operacionesNuevas) {
                        // 1. Limpieza de datos (Si viene vacío en el CSV, lo volvemos nulo)
                        const contrato_id = operacion.contrato_id?.trim() || null;
                        const monto = operacion.monto?.trim() || null;
                        const tipo_movimiento = operacion.tipo_movimiento?.trim() || null;
                        const fecha_operacion = operacion.fecha_operacion?.trim() || null;

                        if (!contrato_id || !monto || !tipo_movimiento || !fecha_operacion) {
                            console.log('Fila inválida omitida:', operacion);
                            continue;
                        }

                        // 2. Inserción SQL de operaciones
                        const query = `
                            INSERT INTO operaciones (
                                contrato_id, monto, tipo_movimiento, fecha_operacion
                            ) VALUES (
                                $1, $2, $3, $4
                            );
                        `;

                        await clienteDB.query(query, [
                            contrato_id, monto, tipo_movimiento, fecha_operacion
                        ]);
                    }

                    await clienteDB.query('COMMIT'); // Guardamos todo de golpe si no hubo errores

                    res.status(200).json({
                        mensaje: `¡Ingesta exitosa! Se importaron ${operacionesNuevas.length} operaciones a la bóveda.`
                    });

                } catch (dbError) {
                    await clienteDB.query('ROLLBACK'); // Si una operación falla, cancelamos toda la carga (Integridad)
                    console.error("Error al insertar el lote CSV de operaciones en DB:", dbError);
                    res.status(500).json({ error: "Fallo durante la inserción de operaciones. Revisa el formato de los datos." });
                } finally {
                    clienteDB.release(); // Liberamos la conexión
                }
            });

    } catch (error) {
        console.error("Error crítico:", error);
        res.status(500).json({ error: "Fallo interno procesando el archivo de operaciones." });
    }
};

// 3. EXPORTAMOS EL MIDDLEWARE PARA QUE TUS RUTAS LO ENCUENTREN
// Nota: 'archivo_csv' es exactamente el nombre que tu frontend manda en el FormData
export const uploadMiddleware = upload.single('archivo_csv');