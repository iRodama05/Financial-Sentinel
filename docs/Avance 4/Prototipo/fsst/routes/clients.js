const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { layout } = require('../views/layout');
const { clients } = require('../data');

router.get('/', requireAuth, (req, res) => {
  const user = req.session.user;
  const isReadOnly = user.role === 'viewer';

  const readOnlyBanner = isReadOnly ? `
    <div class="access-badge info">
      <i data-lucide="eye"></i>
      <span><strong>Modo Solo Lectura:</strong> Puedes visualizar clientes pero no modificarlos ni crear nuevos.</span>
    </div>` : '';

  const clientRows = clients.map((c, idx) => `
    <tr class="${idx % 2 === 0 ? '' : 'alt-row'}">
      <td><span class="mono-bold">${c.id}</span></td>
      <td>
        <div class="cell-with-icon">
          <i data-lucide="${c.type === 'Empresa' ? 'building-2' : 'user-circle'}" class="${c.type === 'Empresa' ? 'icon-blue' : 'icon-green'}"></i>
          <span class="font-medium">${c.name}</span>
        </div>
      </td>
      <td>${c.type}</td>
      <td><span class="mono">${c.doc}</span></td>
      <td><span class="risk-badge ${c.risk.toLowerCase()}">${c.risk}</span></td>
      <td><span class="status-badge ${c.status === 'Activo' ? 'active' : 'review'}">${c.status}</span></td>
      <td>
        <div class="action-btns">
          <a href="/dashboard/clients/${c.id}" class="btn-sm blue"><i data-lucide="eye"></i> Ver</a>
          ${!isReadOnly ? `<button class="btn-sm gray"><i data-lucide="edit"></i> Editar</button>` : ''}
        </div>
      </td>
    </tr>`).join('');

  const addBtn = !isReadOnly ? `
    <button class="btn-primary" onclick="document.getElementById('addModal').classList.add('open')">
      <i data-lucide="user-plus"></i> Nuevo Cliente
    </button>` : '';

  const modal = !isReadOnly ? `
    <div class="modal-overlay" id="addModal">
      <div class="modal">
        <div class="modal-header blue">
          <h3><i data-lucide="user-plus"></i> Nuevo Cliente</h3>
          <button onclick="document.getElementById('addModal').classList.remove('open')"><i data-lucide="x"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label>Tipo de Cliente</label>
              <select><option>Persona Natural</option><option>Empresa</option></select>
            </div>
            <div class="form-group">
              <label>Identificación</label>
              <input type="text" placeholder="Número de documento">
            </div>
          </div>
          <div class="form-group">
            <label>Nombre / Razón Social</label>
            <input type="text" placeholder="Nombre completo o razón social">
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>Email</label>
              <input type="email" placeholder="correo@ejemplo.com">
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" placeholder="+1 555 0000">
            </div>
          </div>
          <div class="form-group">
            <label>Dirección</label>
            <input type="text" placeholder="Dirección completa">
          </div>
          <div class="form-group">
            <label>Nivel de Riesgo Inicial</label>
            <select><option>BAJO</option><option>MEDIO</option><option>ALTO</option></select>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" onclick="document.getElementById('addModal').classList.remove('open')">Cancelar</button>
            <button class="btn-primary" onclick="document.getElementById('addModal').classList.remove('open')">Guardar Cliente</button>
          </div>
        </div>
      </div>
    </div>` : '';

  const content = `
    ${readOnlyBanner}
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" placeholder="Buscar clientes..." id="clientSearch">
        </div>
        <div class="select-wrap">
          <i data-lucide="filter"></i>
          <select>
            <option>Todos los estados</option>
            <option>Activos</option>
            <option>Bajo revisión</option>
          </select>
        </div>
      </div>
      ${addBtn}
    </div>

    <div class="stats-grid four">
      <div class="stat-card">
        <div class="stat-icon blue"><i data-lucide="users"></i></div>
        <span class="stat-chip blue">Total</span>
        <p class="stat-label">Total Clientes</p>
        <p class="stat-number">1,247</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i data-lucide="check-circle"></i></div>
        <span class="stat-chip green">95%</span>
        <p class="stat-label">Activos</p>
        <p class="stat-number">1,189</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><i data-lucide="alert-circle"></i></div>
        <span class="stat-chip orange">3%</span>
        <p class="stat-label">Bajo Revisión</p>
        <p class="stat-number">42</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon red"><i data-lucide="shield-alert"></i></div>
        <span class="stat-chip red">1%</span>
        <p class="stat-label">Con Alertas</p>
        <p class="stat-number">16</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header gray-gradient">
        <i data-lucide="users"></i>
        <h3>Lista de Clientes</h3>
      </div>
      <div class="table-wrap">
        <table class="data-table" id="clientsTable">
          <thead>
            <tr>
              <th>ID</th><th>Nombre / Razón Social</th><th>Tipo</th>
              <th>Identificación</th><th>Nivel Riesgo</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>${clientRows}</tbody>
        </table>
      </div>
      <div class="table-footer">
        <p>Mostrando 1–${clients.length} de 1,247 clientes</p>
        <div class="pagination">
          <button class="page-btn">← Anterior</button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn">Siguiente →</button>
        </div>
      </div>
    </div>
    ${modal}`;

  res.send(layout(user, 'Gestión de Clientes', '/dashboard/clients', content));
});

router.get('/:id', requireAuth, (req, res) => {
  const user = req.session.user;
  const isReadOnly = user.role === 'viewer';
  const client = clients.find(c => c.id === req.params.id);

  if (!client) {
    return res.redirect('/dashboard/clients');
  }

  const ops = [
    { id: 'OP-8821', type: 'Transferencia', amount: '$250,000', currency: 'USD', date: '15/04/26 14:30', status: 'Alerta',   origin: 'Cta. 001-445', dest: 'Offshore Bank' },
    { id: 'OP-8817', type: 'Cambio Div.',   amount: '$180,000', currency: 'EUR', date: '15/04/26 08:45', status: 'Aprobada', origin: 'USD',           dest: 'EUR'           },
    { id: 'OP-8810', type: 'Depósito',      amount: '$45,000',  currency: 'USD', date: '14/04/26 10:00', status: 'Aprobada', origin: 'Externo',       dest: 'Cta. 001-445'  },
    { id: 'OP-8801', type: 'Retiro',        amount: '$12,000',  currency: 'USD', date: '13/04/26 09:20', status: 'Aprobada', origin: 'Cta. 001-445', dest: 'Efectivo'       },
    { id: 'OP-8795', type: 'Transferencia', amount: '$98,000',  currency: 'USD', date: '12/04/26 15:10', status: 'Revisión', origin: 'Cta. 001-445', dest: 'Cta. Ext.'      },
  ];

  const opsRows = ops.map((op, idx) => `
    <tr class="${idx % 2 === 0 ? '' : 'alt-row'}">
      <td><span class="mono-bold">${op.id}</span></td>
      <td>${op.type}</td>
      <td><span class="font-medium">${op.amount}</span></td>
      <td>${op.currency}</td>
      <td>${op.origin}</td>
      <td>${op.dest}</td>
      <td>${op.date}</td>
      <td><span class="status-badge ${op.status === 'Aprobada' ? 'active' : op.status === 'Alerta' ? 'alert' : 'review'}">${op.status}</span></td>
    </tr>`).join('');

  const content = `
    <a href="/dashboard/clients" class="back-link"><i data-lucide="arrow-left"></i> Volver</a>

    <div class="card">
      <div class="card-header blue-to-indigo">
        <div class="client-hero">
          <div class="client-hero-avatar">
            <i data-lucide="${client.type === 'Empresa' ? 'building-2' : 'user'}"></i>
          </div>
          <div>
            <h2>${client.name}</h2>
            <p>ID: ${client.id} · ${client.type}</p>
          </div>
        </div>
        ${!isReadOnly ? `<button class="btn-ghost"><i data-lucide="edit"></i> Editar Cliente</button>` : ''}
      </div>
      <div class="card-body">
        <div class="detail-grid">
          <div><p class="detail-label">Nivel de Riesgo</p><span class="risk-badge ${client.risk.toLowerCase()}">${client.risk}</span></div>
          <div><p class="detail-label">Estado</p><span class="status-badge ${client.status === 'Activo' ? 'active' : 'review'}">${client.status}</span></div>
          <div><p class="detail-label">Identificación</p><p class="mono-bold">${client.doc}</p></div>
        </div>
        <div class="detail-grid two-col mt-4">
          <div><p class="detail-label">Email</p><p>${client.email}</p></div>
          <div><p class="detail-label">Teléfono</p><p>${client.phone}</p></div>
        </div>
      </div>
    </div>

    <div class="stats-grid three">
      <div class="stat-card">
        <div class="stat-icon blue"><i data-lucide="activity"></i></div>
        <p class="stat-label">Total Operaciones</p>
        <p class="stat-number">${client.operations}</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon red"><i data-lucide="alert-triangle"></i></div>
        <p class="stat-label">Alertas Activas</p>
        <p class="stat-number">${client.alerts}</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i data-lucide="check-circle"></i></div>
        <p class="stat-label">Operaciones Aprobadas</p>
        <p class="stat-number">${client.operations - client.alerts}</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header gray-gradient">
        <i data-lucide="filter"></i><h3>Filtros</h3>
      </div>
      <div class="card-body">
        <div class="form-grid-3">
          <div class="form-group"><label>Fecha Inicio</label><input type="date"></div>
          <div class="form-group"><label>Fecha Fin</label><input type="date"></div>
          <div class="form-group"><label>Tipo de Operación</label>
            <select><option>Todas</option><option>Transferencia</option><option>Depósito</option><option>Retiro</option></select>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header gray-gradient">
        <i data-lucide="activity"></i><h3>Operaciones del Cliente</h3>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>ID</th><th>Tipo</th><th>Monto</th><th>Moneda</th>
            <th>Origen</th><th>Destino</th><th>Fecha</th><th>Estado</th>
          </tr></thead>
          <tbody>${opsRows}</tbody>
        </table>
      </div>
      <div class="table-footer">
        <p>Mostrando ${ops.length} operaciones</p>
      </div>
    </div>`;

  res.send(layout(user, 'Detalle de Cliente', '/dashboard/clients', content));
});

module.exports = router;
