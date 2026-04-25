const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { layout } = require('../views/layout');
const { reports } = require('../data');

router.get('/', requireAuth, (req, res) => {
  const user = req.session.user;

  if (user.role !== 'compliance_officer') {
    const content = `
      <div class="access-denied-box">
        <div class="access-denied-icon"><i data-lucide="eye"></i></div>
        <h2>Acceso Restringido</h2>
        <p>Los reportes solo están disponibles para Oficiales de Cumplimiento</p>
        <a href="/dashboard" class="btn-primary">Volver al Dashboard</a>
      </div>`;
    return res.send(layout(user, 'Reportes', '/dashboard/reports', content));
  }

  const reportRows = reports.map((r, idx) => `
    <tr class="${idx % 2 === 0 ? '' : 'alt-row'}">
      <td><span class="mono-bold">${r.id}</span></td>
      <td class="font-medium">${r.description}</td>
      <td>${r.period}</td>
      <td class="sub-text">${r.filters}</td>
      <td>${r.date}</td>
      <td><span class="status-badge active">${r.format}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-sm blue"><i data-lucide="file-text"></i> Ver</button>
          <button class="btn-sm green"><i data-lucide="download"></i> Descargar</button>
        </div>
      </td>
    </tr>`).join('');

  const content = `
    <div class="card gradient-header-card">
      <div class="card-header blue-to-indigo">
        <div class="flex-row gap-3">
          <div class="icon-block"><i data-lucide="bar-chart-2"></i></div>
          <div>
            <h2 class="white">Reportes de Transacciones</h2>
            <p class="white-sub">Genera reportes detallados de todas las transacciones actuales de los clientes</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header gray-gradient">
        <i data-lucide="filter"></i><h3>Generador de Reportes</h3>
      </div>
      <div class="card-body">
        <div class="form-grid-3 mb-4">
          <div class="form-group">
            <label><i data-lucide="calendar" class="icon-xs"></i> Fecha Inicio</label>
            <input type="date">
          </div>
          <div class="form-group">
            <label><i data-lucide="calendar" class="icon-xs"></i> Fecha Fin</label>
            <input type="date">
          </div>
          <div class="form-group">
            <label><i data-lucide="users" class="icon-xs"></i> Tipo de Cliente</label>
            <select><option>Todos</option><option>Personas Naturales</option><option>Empresas</option></select>
          </div>
          <div class="form-group">
            <label><i data-lucide="shield" class="icon-xs"></i> Nivel de Riesgo</label>
            <select><option>Todos</option><option>Alto</option><option>Medio</option><option>Bajo</option></select>
          </div>
          <div class="form-group">
            <label>Tipo de Transacción</label>
            <select><option>Todas</option><option>Transferencias</option><option>Depósitos</option><option>Retiros</option><option>Cambio de Divisas</option></select>
          </div>
          <div class="form-group">
            <label>Formato de Salida</label>
            <select><option>PDF</option><option>Excel (XLSX)</option><option>CSV</option></select>
          </div>
        </div>

        <div class="options-box">
          <h4>Opciones Adicionales</h4>
          <div class="checkbox-grid">
            <label class="checkbox-label"><input type="checkbox" checked> Incluir alertas relacionadas</label>
            <label class="checkbox-label"><input type="checkbox" checked> Incluir gráficos estadísticos</label>
            <label class="checkbox-label"><input type="checkbox"> Agrupar por cliente</label>
            <label class="checkbox-label"><input type="checkbox"> Solo transacciones con alertas</label>
          </div>
        </div>

        <button class="btn-primary mt-4">
          <i data-lucide="bar-chart-2"></i> Generar Reporte
        </button>
      </div>
    </div>

    <div class="stats-grid four">
      <div class="stat-card">
        <div class="stat-icon blue"><i data-lucide="file-text"></i></div>
        <p class="stat-label">Reportes Generados</p>
        <p class="stat-number">45</p>
        <p class="stat-trend gray">Este mes</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i data-lucide="users"></i></div>
        <p class="stat-label">Clientes Incluidos</p>
        <p class="stat-number">1,247</p>
        <p class="stat-trend gray">Total activos</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><i data-lucide="alert-triangle"></i></div>
        <p class="stat-label">Con Alertas</p>
        <p class="stat-number">16</p>
        <p class="stat-trend gray">Clientes marcados</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i data-lucide="check-circle"></i></div>
        <p class="stat-label">Transacciones</p>
        <p class="stat-number">8,942</p>
        <p class="stat-trend gray">Últimos 30 días</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header gray-gradient">
        <i data-lucide="file-text"></i><h3>Reportes Generados Recientemente</h3>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Descripción</th><th>Período</th>
              <th>Filtros Aplicados</th><th>Fecha Creación</th><th>Formato</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>${reportRows}</tbody>
        </table>
      </div>
      <div class="table-footer">
        <p>Mostrando ${reports.length} de 45 reportes</p>
        <div class="pagination">
          <button class="page-btn">← Anterior</button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">Siguiente →</button>
        </div>
      </div>
    </div>

    <div class="info-box blue">
      <div class="info-icon"><i data-lucide="bar-chart-2"></i></div>
      <div>
        <p class="info-title">Reportes de Transacciones Actuales</p>
        <p class="info-text">Esta sección permite generar reportes detallados de todas las transacciones actuales de los clientes. Puedes filtrar por rango de fechas, tipo de cliente, nivel de riesgo y tipo de transacción.</p>
      </div>
    </div>`;

  res.send(layout(user, 'Reportes', '/dashboard/reports', content));
});

module.exports = router;
