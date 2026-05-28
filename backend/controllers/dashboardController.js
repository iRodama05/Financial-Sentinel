import * as DashboardModel from '../models/dashboardModel.js';

export const getResumen = async (req, res) => {
    try {
        const resumen = await DashboardModel.obtenerResumenGeneral();
        res.status(200).json(resumen);
    } catch (error) {
        res.status(500).json({ error: "Error al generar el resumen del dashboard" });
    }
};