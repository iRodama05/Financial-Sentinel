import * as ClientModel from '../models/clientModel.js';
import * as PerfilModel from '../models/perfilModel.js';

export const registrarCliente = async (req, res) => {
    try {
        const datos = req.body;

        if (!datos.rfc || !datos.curp || !datos.nombre_completo) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        // Creamos el cliente
        const nuevoCliente = await ClientModel.createCliente(datos);
        
        // Creamos su perfil de riesgo inmediatamente
        await PerfilModel.crearPerfilBase(nuevoCliente.id);

        res.status(201).json({ 
            mensaje: "Cliente y Perfil creados exitosamente", 
            cliente: nuevoCliente 
        });

    } catch (error) {
        console.error("Error en registrarCliente:", error);
        
        // Manejo específico del error UNIQUE de PostgreSQL (código 23505) || <Sección con IA>
        if (error.code === '23505') {
            return res.status(409).json({ 
                error: "Violación de restricción única: El RFC o CURP ya existe en la base de datos." 
            });
        }

        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
};

// <Inicia IA>
export const listarClientes = async (req, res) => {
    try {
        const clientes = await ClientModel.getAllClientes();
        res.status(200).json(clientes);
    } catch (error) {
        console.error("Error en listarClientes:", error);
        res.status(500).json({ error: "Error al obtener los clientes" });
    }
};
// <Termina IA>