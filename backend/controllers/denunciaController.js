import * as DenunciaModel from '../models/denunciaModel.js';

export const enviarDenuncia = async (req, res) => {
    try {
        const { tipo, asunto, descripcion, archivo_url } = req.body;
        if (!tipo || !asunto || !descripcion) {
            return res.status(400).json({ error: 'Tipo, asunto y descripción son obligatorios.' });
        }
        const denuncia = await DenunciaModel.crearDenuncia({ tipo, asunto, descripcion, archivo_url });
        res.status(201).json({ mensaje: 'Denuncia enviada correctamente.', id: denuncia.id });
    } catch (error) {
        console.error('Error en enviarDenuncia:', error);
        res.status(500).json({ error: 'Error al registrar la denuncia.' });
    }
};

export const listarDenuncias = async (req, res) => {
    try {
        const denuncias = await DenunciaModel.getAllDenuncias();
        res.status(200).json(denuncias);
    } catch (error) {
        console.error('Error en listarDenuncias:', error);
        res.status(500).json({ error: 'Error al obtener las denuncias.' });
    }
};
