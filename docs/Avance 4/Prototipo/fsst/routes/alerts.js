const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { layout } = require('../views/layout');
const { alerts } = require('../data');

router.get('/', requireAuth, (req, res) => {
  const user = req.session.user;
  const isReadOnly = user.role === 'viewer';

  const rows = alerts.map((a, idx) => `
    <tr class="${idx % 2 === 0 ? '' : 'alt-row'}">
      <td><span class="mono-bold">${a.id}</span></td>
      <td>
        <p class="font-medium">${a.client}</p>
        <p class="sub-text">ID: ${a.clientId}</p>
      </td>
      <td class="font-medium">${a.type}</td>
      <td class="truncate-cell">${a.description}</td>
      <td><span class="risk-badge ${a.risk.toLowerCase()}">${a.risk}</span></td>
      <td>
        <p>${a.date}</p>
        <p class="sub-text flex-row gap-1"><i data-lucide="clock" class="icon-xs"></i>${a.time}</p>
      </td>
      <td><span class="status-badge ${a.status === 'Activa' ? 'alert' : a.status === 'En Investigación' ? 'review' : 'active'}">${a.status}</span></td>
      <td>
        <div class="action-btns col">
          <button class="btn-sm blue"><i data-lucide="eye"></i> Ver Detalle</button>
          ${!isReadOnly && a.status !== 'Resuelta' ? `<button class="btn-sm green"><i data-lucide="check"></i> Cambiar Estado</button>` : ''}
        </div>
      </td>
    </tr>`).join('');

  const content = `
    ${isReadOnly ? `<div class="access-badge info"><i data-lucide="eye"></i><span><strong>Modo Solo Lectura:</strong> Puedes visualizar alertas pero no gestionarlas.</span></div>` : ''}

    <div class="card">
      <div class="card-header gray-gradient">
        <i data-lucide="filter"></i><h3>Filtros</h3>
      </div>
      <div class="card-body">
        <div class="form-grid-3">
          <div class="form-group">
            <label>Nivel de Riesgo</label>
            <select><option>Todos</option><option>Alto</option><option>Medio</option><option>Bajo</option></select>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select><option>Todas</option><option>Activa</option><option>En Investigación</option><option>Resuelta</option></select>
          </div>
          <div class="form-group">
            <label>Fecha</label>
            <select><option>Hoy</option><option>Últimos 7 días</option><option>Últimos 30 días</option></select>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-grid three">
      <div class="stat-card">
        <div class="stat-icon red"><i data-lucide="alert-triangle"></i></div>
        <p class="stat-label">Total Activas</p>
        <p class="stat-number">37</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue"><i data-lucide="clock"></i></div>
        <p class="stat-label">En Investigación</p>
        <p class="stat-number">7</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i data-lucide="check-circle"></i></div>
        <p class="stat-label">Resueltas Hoy</p>
        <p class="stat-number green-number">8</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header orange-gradient">
        <i data-lucide="alert-triangle"></i>
        <h3>Todas las Alertas</h3>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Cliente</th><th>Tipo</th><th>Descripción</th>
              <th>Nivel Riesgo</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="table-footer">
        <p>Mostrando ${alerts.length} de 37 alertas activas</p>
        <div class="pagination">
          <button class="page-btn">← Anterior</button>
          <button class="page-btn active orange">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">Siguiente →</button>
        </div>
      </div>
    </div>

    ${isReadOnly ? `
    <div class="info-box gray">
      <div class="info-icon gray"><i data-lucide="x-circle"></i></div>
      <div>
        <p class="info-title">Acciones Restringidas</p>
        <p class="info-text">No tienes permisos para gestionar alertas. Contacta a un Oficial de Cumplimiento para tomar acciones sobre estas alertas.</p>
      </div>
    </div>` : ''}`;

  res.send(layout(user, 'Alertas', '/dashboard/alerts', content));
});

module.exports = router;
