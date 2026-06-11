import * as BitacoraModel from '../models/bitacoraModel.js';

export const listarBitacora = async (req, res) => {
    try {
        const registros = await BitacoraModel.getAllBitacora();
        res.status(200).json(registros);
    } catch (error) {
        console.error('Error en listarBitacora:', error);
        res.status(500).json({ error: 'Error al obtener la bitácora' });
    }
};

export const listarBitacoraCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const registros = await BitacoraModel.getBitacoraByCliente(id);
        res.status(200).json(registros);
    } catch (error) {
        console.error('Error en listarBitacoraCliente:', error);
        res.status(500).json({ error: 'Error al obtener el historial del cliente' });
    }
};
