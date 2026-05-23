import * as ReporteModel from '../models/reporteModel.js';
import pool from '../db/connection.js';

export const generarReporteXML = async (req, res) => {
    try {
        const { alerta_id, cliente_id } = req.body;
        const usuario_id = 1; // ID simulado del Oficial en turno

        if (!cliente_id) {
            return res.status(400).json({ error: "Falta el cliente_id para asociar el reporte." });
        }

        // 1. Obtener datos del cliente para estructurar el XML
        const queryCliente = `SELECT nombre_completo, rfc FROM clientes WHERE id = $1`;
        const resultCli = await pool.query(queryCliente, [cliente_id]);
        const cliente = resultCli.rows[0] || { nombre_completo: 'Desconocido', rfc: 'XAXX010101000' };

        // 2. Armar la estructura del XML
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<ReporteRegulatorio>
    <Encabezado>
        <TipoReporte>OperacionInusual</TipoReporte>
        <FechaGeneracion>${new Date().toISOString()}</FechaGeneracion>
    </Encabezado>
    <SujetoObligado>
        <FolioAlerta>A-00${alerta_id}</FolioAlerta>
    </SujetoObligado>
    <ClientePerfil>
        <Nombre>${cliente.nombre_completo}</Nombre>
        <RFC>${cliente.rfc}</RFC>
    </ClientePerfil>
</ReporteRegulatorio>`;

        const descripcion = `Reporte regulatorio por Alerta A-00${alerta_id}`;
        
        // Calculamos el mes y año actual para la columna periodo
        const periodoActual = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date());

        // 3. Guardar en la nueva tabla dedicada
        await ReporteModel.crearReporteRegulatorio(alerta_id, cliente_id, usuario_id, descripcion, periodoActual, xmlString);

        res.status(200).json({ mensaje: "Reporte XML forjado con éxito en la tabla regulatoria." });
    } catch (error) {
        console.error("🔥 Error al generar XML:", error);
        res.status(500).json({ error: `Fallo interno en el servidor: ${error.message}` });
    }
};

export const listarReportes = async (req, res) => {
    try {
        const reportes = await ReporteModel.obtenerTodosReportes();
        res.status(200).json(reportes);
    } catch (error) {
        console.error("Error al listar reportes:", error);
        res.status(500).json({ error: "Error al leer la bóveda de reportes." });
    }
};