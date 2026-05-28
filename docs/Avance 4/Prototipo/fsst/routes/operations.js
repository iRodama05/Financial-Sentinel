const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { layout } = require('../views/layout');
const { clients } = require('../data');

router.get('/', requireAuth, (req, res) => {
  const user = req.session.user;
  const isReadOnly = user.role === 'viewer';

  const clientsSummary = [
    { id: 'C-005', name: 'Global Traders Inc', type: 'Empresa', operations: 156, lastOp: 'Hace 2h',  total: '$2,450,000', risk: 'ALTO',  alerts: 3, trend: 'up'     },
    { id: 'C-003', name: 'Tech Solutions SA',  type: 'Empresa', operations: 48,  lastOp: 'Hace 3h',  total: '$980,000',   risk: 'ALTO',  alerts: 2, trend: 'up'     },
    { id: 'C-001', name: 'ACME Corporation',   type: 'Empresa', operations: 24,  lastOp: 'Hoy',      total: '$450,000',   risk: 'BAJO',  alerts: 0, trend: 'stable' },
    { id: 'C-002', name: 'María Rodríguez',    type: 'Persona', operations: 18,  lastOp: 'Hace 5h',  total: '$320,000',   risk: 'MEDIO', alerts: 1, trend: 'up'     },
    { id: 'C-004', name: 'Juan Pérez',         type: 'Persona', operations: 12,  lastOp: 'Ayer',     total: '$180,000',   risk: 'BAJO',  alerts: 0, trend: 'stable' },
    { id: 'C-007', name: 'Finance Corp',       type: 'Empresa', operations: 35,  lastOp: 'Hace 1h',  total: '$680,000',   risk: 'MEDIO', alerts: 0, trend: 'up'     },
    { id: 'C-006', name: 'Ana Martínez',       type: 'Persona', operations: 9,   lastOp: 'Hace 8h',  total: '$125,000',   risk: 'MEDIO', alerts: 1, trend: 'stable' },
  ];

  const cards = clientsSummary.map(c => `
    <div class="op-client-card" onclick="window.location='/dashboard/clients/${c.id}'">
      <div class="op-client-top">
        <div class="client-op-info">
          <div class="client-avatar ${c.type === 'Empresa' ? 'blue' : 'green'} lg">
            <i data-lucide="${c.type === 'Empresa' ? 'building-2' : 'user-circle'}"></i>
          </div>
          <div>
            <h4>${c.name}</h4>
            <p class="sub">ID: ${c.id} · ${c.type}</p>
            <p class="sub">Última operación: ${c.lastOp}</p>
          </div>
        </div>
        <div class="op-client-right">
          <span class="risk-badge ${c.risk.toLowerCase()}">${c.risk}</span>
          <i data-lucide="arrow-right" class="arrow-icon"></i>
        </div>
      </div>
      <div class="op-stats-grid">
        <div class="stat-box"><p class="stat-label">Operaciones</p><p class="stat-val">${c.operations}</p></div>
        <div class="stat-box"><p class="stat-label">Monto Total</p><p class="stat-val">${c.total}</p></div>
        <div class="stat-box"><p class="stat-label">Alertas</p><p class="stat-val ${c.alerts > 0 ? 'red-val' : 'green-val'}">${c.alerts}</p></div>
        <div class="stat-box"><p class="stat-label">Tendencia</p><p class="stat-val">${c.trend === 'up' ? '↑' : '→'}</p></div>
      </div>
      ${c.alerts > 0 ? `<div class="alert-inline"><i data-lucide="alert-triangle"></i> Este cliente tiene ${c.alerts} alerta${c.alerts > 1 ? 's' : ''} activa${c.alerts > 1 ? 's' : ''}</div>` : ''}
    </div>`).join('');

  const content = `
    ${isReadOnly ? `<div class="access-badge info"><i data-lucide="eye"></i><span><strong>Modo Solo Lectura:</strong> Puedes visualizar operaciones pero no modificarlas.</span></div>` : ''}

    <div class="card mb-4">
      <div class="card-body flex-row gap-3">
        <div class="kpi-icon blue"><i data-lucide="activity"></i></div>
        <div>
          <h2 class="page-subtitle">Operaciones por Cliente</h2>
          <p class="sub">Selecciona un cliente para ver el detalle de sus operaciones</p>
        </div>
      </div>
    </div>

    <div class="stats-grid four">
      <div class="stat-card">
        <div class="stat-icon blue"><i data-lucide="activity"></i></div>
        <p class="stat-label">Total Operaciones</p>
        <p class="stat-number">302</p>
        <p class="stat-trend green">+23% vs. ayer</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i data-lucide="trending-up"></i></div>
        <p class="stat-label">Monto Total</p>
        <p class="stat-number">$5.2M</p>
        <p class="stat-trend green">+15% vs. ayer</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><i data-lucide="alert-triangle"></i></div>
        <p class="stat-label">Con Alertas</p>
        <p class="stat-number">4</p>
        <p class="stat-trend gray">Clientes con alertas</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon indigo"><i data-lucide="building-2"></i></div>
        <p class="stat-label">Clientes Activos</p>
        <p class="stat-number">7</p>
        <p class="stat-trend gray">Con operaciones hoy</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header gray-gradient">
        <i data-lucide="activity"></i><h3>Clientes con Operaciones</h3>
      </div>
      <div class="card-body op-cards-list">${cards}</div>
    </div>

    <div class="info-box blue">
      <div class="info-icon"><i data-lucide="activity"></i></div>
      <div>
        <p class="info-title">Vista de Operaciones por Cliente</p>
        <p class="info-text">Esta vista muestra un resumen de las operaciones agrupadas por cliente. Haz clic en cualquier cliente para ver el detalle completo de sus operaciones individuales, filtros avanzados y historial de alertas.</p>
      </div>
    </div>`;

  res.send(layout(user, 'Operaciones', '/dashboard/operations', content));
});

module.exports = router;
