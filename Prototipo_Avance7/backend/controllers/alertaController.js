import * as AlertaModel from '../models/alertaModel.js';

export const listarAlertas = async (req, res) => {
    try {
        // CORRECCIÓN: Aquí estaba el desfase de nombres. 
        // Ahora llama a la función cruzada correcta del modelo.
        const alertas = await AlertaModel.obtenerTodasAlertas();
        res.status(200).json(alertas);
    } catch (error) {
        console.error("Error al obtener alertas:", error);
        res.status(500).json({ error: "Error interno al consultar las alertas." });
    }
};

export const dictaminarAlerta = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID de la URL
        const { estatus } = req.body; // Sacamos el nuevo estatus del JSON enviado

        if (!estatus) {
            return res.status(400).json({ error: "Debe proporcionar un nuevo estatus." });
        }

        // Solo permitir ciertos estatus
        const estatusValidos = ['Nueva', 'Investigando', 'Falsa Alarma', 'Reportada a CNBV'];
        if (!estatusValidos.includes(estatus)) {
            return res.status(400).json({ error: "Estatus no válido para el sistema." });
        }

        const alertaActualizada = await AlertaModel.actualizarEstatusAlerta(id, estatus);
        
        if (!alertaActualizada) {
            return res.status(404).json({ error: "No se encontró la alerta solicitada." });
        }

        res.status(200).json({ 
            mensaje: "Estatus actualizado correctamente", 
            alerta: alertaActualizada 
        });

    } catch (error) {
        console.error("Error al actualizar alerta:", error);
        res.status(500).json({ error: "Error interno al actualizar la alerta." });
    }
};