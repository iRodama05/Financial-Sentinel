import * as OperacionModel from '../models/operacionModel.js';

// Fíjate en esta línea: aquí le decimos "export const listarOperaciones"
// Esto es lo que Node.js estaba buscando desesperadamente.
export const listarOperaciones = async (req, res) => {
    try {
        const operaciones = await OperacionModel.obtenerTodasOperaciones();
        res.status(200).json(operaciones);
    } catch (error) {
        console.error("Error al obtener operaciones en DB:", error);
        res.status(500).json({ error: "Error interno al consultar las operaciones." });
    }
};