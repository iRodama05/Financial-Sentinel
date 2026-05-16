import * as OperacionModel from '../models/operacionModel.js';

export const crearOperacion = async (req, res) => {
    try {
        const nuevaOp = await OperacionModel.registrarTransaccion(req.body);
        res.status(201).json(nuevaOp);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la operación" });
    }
};

export const getRecientes = async (req, res) => {
    try {
        const operaciones = await OperacionModel.listarUltimasOperaciones();
        res.status(200).json(operaciones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener operaciones" });
    }
};