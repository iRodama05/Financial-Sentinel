/* Usuarios */
const users = [
    { email: 'oficial@fsst.com', password: 'admin123', role: 'compliance_officer', name: 'Maria Lopez' },
    { email: 'viewer@fsst.com', password: 'viewer123', role: 'viewer', name: 'Carlos Ruiz' }
];

/* Clientes */
const clients = [
    { id: 'C-001', name: 'Empresa Uno', type: 'Empresa', doc: '12345', risk: 'BAJO', status: 'Activo', email: 'empresa1@mail.com', phone: '1111111111', operations: 10, alerts: 0 },
    { id: 'C-002', name: 'Juan Perez', type: 'Persona', doc: '22222', risk: 'MEDIO', status: 'Activo', email: 'juan@mail.com', phone: '2222222222', operations: 8, alerts: 1 },
    { id: 'C-003', name: 'Empresa Dos', type: 'Empresa', doc: '33333', risk: 'ALTO', status: 'Revisión', email: 'empresa2@mail.com', phone: '3333333333', operations: 15, alerts: 2 },
    { id: 'C-004', name: 'Maria Garcia', type: 'Persona', doc: '44444', risk: 'BAJO', status: 'Activo', email: 'maria@mail.com', phone: '4444444444', operations: 6, alerts: 0 }
];

/* Alertas */
const alerts = [
    { id: 'A-001', client: 'Empresa Dos', type: 'Monto alto', risk: 'ALTO', date: '10/04/26', status: 'Activa' },
    { id: 'A-002', client: 'Juan Perez', type: 'Revisión', risk: 'MEDIO', date: '11/04/26', status: 'Pendiente' },
    { id: 'A-003', client: 'Maria Garcia', type: 'Operacion rara', risk: 'BAJO', date: '12/04/26', status: 'Resuelta' }
];

/* Operaciones */
const operations = [
    { id: 'OP-001', client: 'Empresa Uno', amount: '$5000' },
    { id: 'OP-002', client: 'Juan Perez', amount: '$3000' }
];

/* Reportes */
const reports = [
    { id: 'R-001', description: 'Reporte mensual', period: 'Abril', date: '15/04/26', format: 'PDF' },
    { id: 'R-002', description: 'Reporte general', period: 'Marzo', date: '01/04/26', format: 'XLSX' }
];

/* Exportar datos */
module.exports = { users, clients, alerts, operations, reports };