const users = [
  { email: 'oficial@fsst.com', password: 'admin123', role: 'compliance_officer', name: 'María González' },
  { email: 'viewer@fsst.com',  password: 'viewer123', role: 'viewer', name: 'Carlos Ramírez' }
];

const clients = [
  { id: 'C-001', name: 'ACME Corporation',   type: 'Empresa',  doc: '900123456-7', risk: 'BAJO',  status: 'Activo',        email: 'contact@acme.com',          phone: '+1 555 0100', operations: 24,  alerts: 0 },
  { id: 'C-002', name: 'María Rodríguez',    type: 'Persona',  doc: '12345678-9',  risk: 'MEDIO', status: 'Activo',        email: 'maria.r@email.com',         phone: '+1 555 0101', operations: 18,  alerts: 1 },
  { id: 'C-003', name: 'Tech Solutions SA',  type: 'Empresa',  doc: '900234567-8', risk: 'ALTO',  status: 'Bajo Revisión', email: 'info@techsol.com',          phone: '+1 555 0102', operations: 48,  alerts: 2 },
  { id: 'C-004', name: 'Juan Pérez',         type: 'Persona',  doc: '23456789-0',  risk: 'BAJO',  status: 'Activo',        email: 'juan.p@email.com',          phone: '+1 555 0103', operations: 12,  alerts: 0 },
  { id: 'C-005', name: 'Global Traders Inc', type: 'Empresa',  doc: '900345678-9', risk: 'ALTO',  status: 'Activo',        email: 'contact@globaltraders.com', phone: '+1 555 0104', operations: 156, alerts: 3 },
  { id: 'C-006', name: 'Ana Martínez',       type: 'Persona',  doc: '34567890-1',  risk: 'MEDIO', status: 'Activo',        email: 'ana.m@email.com',           phone: '+1 555 0105', operations: 9,   alerts: 1 },
  { id: 'C-007', name: 'Finance Corp',       type: 'Empresa',  doc: '900456789-0', risk: 'MEDIO', status: 'Activo',        email: 'info@financecorp.com',      phone: '+1 555 0106', operations: 35,  alerts: 0 },
  { id: 'C-008', name: 'Carlos González',    type: 'Persona',  doc: '45678901-2',  risk: 'BAJO',  status: 'Activo',        email: 'carlos.g@email.com',        phone: '+1 555 0107', operations: 7,   alerts: 0 },
];

const alerts = [
  { id: 'ALT-1034', priority: 'ALTA',  client: 'Global Traders Inc', clientId: 'C-005', type: 'Monto Inusual',          description: 'Transferencia de $250,000 USD supera el umbral habitual del cliente', date: '15/04/26 14:30', time: 'Hace 2h',     status: 'Activa',           risk: 'ALTO'  },
  { id: 'ALT-1033', priority: 'ALTA',  client: 'Tech Solutions SA',  clientId: 'C-003', type: 'Múltiples Operaciones',  description: '8 transferencias en las últimas 4 horas totalizando $680,000 USD',    date: '15/04/26 11:15', time: 'Hace 3h',     status: 'En Investigación', risk: 'ALTO'  },
  { id: 'ALT-1032', priority: 'MEDIA', client: 'ACME Corporation',   clientId: 'C-001', type: 'Patrón de Operaciones',  description: 'Patrón de operaciones irregular detectado en las últimas 48 horas',  date: '15/04/26 09:20', time: 'Hace 5h',     status: 'Activa',           risk: 'BAJO'  },
  { id: 'ALT-1031', priority: 'BAJA',  client: 'María Rodríguez',   clientId: 'C-002', type: 'Verificación Pendiente', description: 'Verificación de identidad pendiente para operaciones mayores a $50,000', date: '15/04/26 08:45', time: 'Hace 6h',     status: 'Activa',           risk: 'MEDIO' },
  { id: 'ALT-1030', priority: 'ALTA',  client: 'Import/Export LLC',  clientId: 'C-006', type: 'Patrón Sospechoso',      description: 'Secuencia de operaciones coincide con patrón de lavado identificado',  date: '14/04/26 16:10', time: 'Ayer',        status: 'Activa',           risk: 'MEDIO' },
  { id: 'ALT-1029', priority: 'MEDIA', client: 'Sandra Díaz',        clientId: 'C-007', type: 'Cliente de Riesgo',      description: 'Cliente clasificado como riesgo MEDIO realizó operación superior a $50,000', date: '14/04/26 14:30', time: 'Ayer', status: 'Resuelta',         risk: 'MEDIO' },
  { id: 'ALT-1028', priority: 'MEDIA', client: 'Commerce Solutions', clientId: 'C-008', type: 'Cambio de Patrón',       description: 'Cambio significativo en patrón de operaciones respecto a histórico',  date: '14/04/26 10:15', time: 'Ayer',        status: 'En Investigación', risk: 'MEDIO' },
  { id: 'ALT-1027', priority: 'BAJA',  client: 'Juan Pérez',         clientId: 'C-004', type: 'Monto Elevado',          description: 'Operación de $35,000 requiere revisión adicional',                   date: '13/04/26 15:20', time: 'Hace 2 días', status: 'Resuelta',         risk: 'BAJO'  },
];

const operations = [
  { id: 'OP-8821', clientId: 'C-005', client: 'Global Traders Inc', type: 'Transferencia', amount: '$250,000', currency: 'USD', date: '15/04/26 14:30', status: 'Alerta',   origin: 'Cta. 001-445', destination: 'Offshore Bank', alert: true  },
  { id: 'OP-8820', clientId: 'C-003', client: 'Tech Solutions SA',  type: 'Transferencia', amount: '$85,000',  currency: 'USD', date: '15/04/26 11:15', status: 'Revisión', origin: 'Cta. 002-331', destination: 'Cta. Int.',     alert: true  },
  { id: 'OP-8819', clientId: 'C-001', client: 'ACME Corporation',   type: 'Depósito',      amount: '$45,000',  currency: 'USD', date: '15/04/26 10:00', status: 'Aprobada', origin: 'Externo',       destination: 'Cta. 003-112', alert: false },
  { id: 'OP-8818', clientId: 'C-002', client: 'María Rodríguez',    type: 'Retiro',        amount: '$12,500',  currency: 'USD', date: '15/04/26 09:20', status: 'Aprobada', origin: 'Cta. 004-667', destination: 'Efectivo',      alert: false },
  { id: 'OP-8817', clientId: 'C-005', client: 'Global Traders Inc', type: 'Cambio Div.',   amount: '$180,000', currency: 'EUR', date: '15/04/26 08:45', status: 'Aprobada', origin: 'USD',           destination: 'EUR',           alert: false },
  { id: 'OP-8816', clientId: 'C-007', client: 'Finance Corp',       type: 'Transferencia', amount: '$67,000',  currency: 'USD', date: '14/04/26 16:10', status: 'Aprobada', origin: 'Cta. 007-223', destination: 'Cta. Ext.',     alert: false },
  { id: 'OP-8815', clientId: 'C-004', client: 'Juan Pérez',         type: 'Depósito',      amount: '$35,000',  currency: 'USD', date: '14/04/26 14:30', status: 'Revisión', origin: 'Externo',       destination: 'Cta. 004-889', alert: true  },
  { id: 'OP-8814', clientId: 'C-003', client: 'Tech Solutions SA',  type: 'Transferencia', amount: '$120,000', currency: 'USD', date: '14/04/26 12:00', status: 'Alerta',   origin: 'Cta. 002-331', destination: 'Cta. Ext.',     alert: true  },
];

const reports = [
  { id: 'RPT-0245', description: 'Transacciones de Clientes Alto Riesgo',  period: '01-15 Abril 2026',  filters: 'Riesgo: Alto, Tipo: Todos',  date: '15/04/2026 10:30', format: 'PDF'  },
  { id: 'RPT-0244', description: 'Todas las Transacciones del Mes',         period: '01-30 Marzo 2026',  filters: 'Todos los clientes',         date: '01/04/2026 09:15', format: 'XLSX' },
  { id: 'RPT-0243', description: 'Transacciones con Alertas',               period: 'Q1 2026',           filters: 'Solo con alertas',           date: '31/03/2026 14:20', format: 'PDF'  },
  { id: 'RPT-0242', description: 'Empresas - Transacciones Grandes',        period: 'Marzo 2026',        filters: 'Tipo: Empresa, Monto > $50K', date: '28/03/2026 11:00', format: 'CSV'  },
  { id: 'RPT-0241', description: 'Análisis de Riesgo General',              period: 'Feb 2026',          filters: 'Todos los niveles',          date: '01/03/2026 08:30', format: 'PDF'  },
];

module.exports = { users, clients, alerts, operations, reports };
