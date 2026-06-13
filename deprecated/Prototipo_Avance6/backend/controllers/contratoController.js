import * as ContratoModel from '../models/contratoModel.js';

export const listarContratos = async (req, res) => {
    try {
        const { cliente_id } = req.query; // Si pasan ?cliente_id=X filtramos
        let contratos;

        if (cliente_id) {
            contratos = await ContratoModel.obtenerContratosPorCliente(cliente_id);
        } else {
            contratos = await ContratoModel.obtenerTodosLosContratos();
        }

        res.status(200).json(contratos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener contratos" });
    }
};