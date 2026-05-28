const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { layout } = require('../views/layout');
const { clients, alerts } = require('../data');

router.get('/', requireAuth, (req, res) => {
  const user = req.session.user;
  const isOfficer = user.role === 'compliance_officer';

  const recentAlerts = alerts.slice(0, 3);
  const topClients = clients.sort((a, b) => b.operations - a.operations).slice(0, 5);

  const kpiCards = isOfficer ? `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon blue"><i data-lucide="users"></i></div>
        <div class="kpi-badge up">+12%</div>
        <p class="kpi-label">Total Clientes</p>
        <p class="kpi-value">1,247</p>
        <div class="kpi-chart-placeholder"><i data-lucide="trending-up"></i> Gráfico de tendencia</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon red"><i data-lucide="alert-triangle"></i></div>
        <div class="kpi-badge down">-8%</div>
        <p class="kpi-label">Alertas Activas</p>
        <p class="kpi-value">37</p>
        <div class="kpi-chart-placeholder"><i data-lucide="trending-up"></i> Gráfico de tendencia</div>
      </div>
    </div>` : `
    <div class="kpi-grid four">
      <div class="kpi-card">
        <div class="kpi-icon blue"><i data-lucide="users"></i></div>
        <p class="kpi-label">Clientes Asignados</p>
        <p class="kpi-value">24</p>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon orange"><i data-lucide="eye"></i></div>
        <p class="kpi-label">Bajo Monitoreo</p>
        <p class="kpi-value">8</p>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon green"><i data-lucide="check-circle"></i></div>
        <p class="kpi-label">Revisiones Hoy</p>
        <p class="kpi-value">12</p>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon red"><i data-lucide="alert-triangle"></i></div>
        <p class="kpi-label">Alertas Pendientes</p>
        <p class="kpi-value">5</p>
      </div>
    </div>`;

  const accessBadge = isOfficer
    ? `<div class="access-badge success"><span class="check-circle">✓</span><span><strong>Acceso completo:</strong> Tienes permisos de Oficial de Cumplimiento con acceso a todas las funciones del sistema.</span></div>`
    : `<div class="access-badge info"><span><i data-lucide="eye"></i></span><span><strong>Modo Solo Lectura:</strong> Puedes visualizar información pero no realizar cambios en el sistema.</span></div>`;

  const clientRows = topClients.map(c => `
    <div class="client-op-card" onclick="window.location='/dashboard/clients/${c.id}'">
      <div class="client-op-header">
        <div class="client-op-info">
          <div class="client-avatar ${c.type === 'Empresa' ? 'blue' : 'green'}">
            <i data-lucide="${c.type === 'Empresa' ? 'building-2' : 'user-circle'}"></i>
          </div>
          <div>
            <p class="client-op-name">${c.name}</p>
            <p class="client-op-id">ID: ${c.id}</p>
          </div>
        </div>
        <i data-lucide="arrow-right" class="arrow-icon"></i>
      </div>
      <div class="client-op-stats">
        <div class="stat-box"><p class="stat-label">Operaciones</p><p class="stat-val">${c.operations}</p></div>
        <div class="stat-box"><p class="stat-label">Riesgo</p><p class="risk-badge ${c.risk.toLowerCase()}">${c.risk}</p></div>
        <div class="stat-box"><p class="stat-label">Alertas</p><p class="stat-val ${c.alerts > 0 ? 'red-val' : 'green-val'}">${c.alerts}</p></div>
      </div>
    </div>`).join('');

  const alertCards = recentAlerts.map(a => `
    <div class="alert-mini-card">
      <div class="alert-mini-header">
        <div>
          <p class="alert-mini-id">Alerta #${a.id}</p>
          <p class="alert-mini-client">${a.client}</p>
        </div>
        <span class="risk-badge ${a.risk.toLowerCase()}">${a.risk}</span>
      </div>
      <p class="alert-mini-desc">${a.description}</p>
      <a href="/dashboard/alerts" class="link-more">Ver detalles <i data-lucide="arrow-right"></i></a>
    </div>`).join('');

  const content = `
    ${accessBadge}
    ${kpiCards}
    <div class="two-col-grid">
      <div class="card">
        <div class="card-header blue-gradient">
          <i data-lucide="activity"></i>
          <h3>Operaciones por Cliente</h3>
        </div>
        <div class="card-scroll">${clientRows}</div>
        <div class="card-footer"><a href="/dashboard/operations" class="link-more blue">Ver todos <i data-lucide="arrow-right"></i></a></div>
      </div>
      <div class="card">
        <div class="card-header red-gradient">
          <i data-lucide="alert-triangle"></i>
          <h3>Alertas Recientes</h3>
          <span class="badge-count">37 activas</span>
        </div>
        <div class="card-body alert-cards-grid">${alertCards}</div>
        <div class="card-footer"><a href="/dashboard/alerts" class="link-more red">Ver todas <i data-lucide="arrow-right"></i></a></div>
      </div>
    </div>`;

  res.send(layout(user, 'Dashboard Principal', '/dashboard', content));
});

module.exports = router;
