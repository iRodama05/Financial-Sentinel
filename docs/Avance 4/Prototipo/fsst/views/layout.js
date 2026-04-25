function layout(user, pageTitle, activePage, content) {
  const isOfficer = user.role === 'compliance_officer';
  const initial = user.name.charAt(0);

  const nav = [
    { href: '/dashboard',            icon: 'grid',          label: 'Dashboard',    roles: ['compliance_officer','viewer'] },
    { href: '/dashboard/clients',    icon: 'users',         label: 'Clientes',     roles: ['compliance_officer','viewer'] },
    { href: '/dashboard/operations', icon: 'activity',      label: 'Operaciones',  roles: ['compliance_officer','viewer'] },
    { href: '/dashboard/alerts',     icon: 'alert-triangle',label: 'Alertas',      roles: ['compliance_officer','viewer'] },
    { href: '/dashboard/reports',    icon: 'bar-chart-2',   label: 'Reportes',     roles: ['compliance_officer'] },
  ];

  const navItems = nav.map(item => {
    const hasAccess = item.roles.includes(user.role);
    const isActive = activePage === item.href;
    if (hasAccess) {
      return `<li>
        <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}">
          <i data-lucide="${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      </li>`;
    } else {
      return `<li>
        <div class="nav-item disabled">
          <i data-lucide="${item.icon}"></i>
          <span>${item.label}</span>
          <span class="lock-icon">🔒</span>
        </div>
      </li>`;
    }
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle} — FSST</title>
  <link rel="stylesheet" href="/css/main.css">
  <link rel="stylesheet" href="/css/layout.css">
</head>
<body>
  <div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">
          <i data-lucide="shield-alert"></i>
        </div>
        <div>
          <h2>FSST</h2>
          <p>Financial Sentinel</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>${navItems}</ul>
      </nav>

      <div class="sidebar-user">
        <div class="user-card">
          <div class="user-avatar">${initial}</div>
          <div class="user-info">
            <p class="user-name">${user.name}</p>
            <p class="user-email">${user.email}</p>
          </div>
        </div>
        <div class="user-role-badge ${isOfficer ? 'officer' : 'viewer'}">
          ${isOfficer ? '✓ Oficial de Cumplimiento' : '👁️ Visualizador'}
        </div>
        <a href="/logout" class="btn-logout">
          <i data-lucide="log-out"></i>
          Cerrar sesión
        </a>
      </div>
    </aside>

    <!-- Main -->
    <div class="main-wrap">
      <header class="topbar">
        <div class="topbar-title">
          <h1>${pageTitle}</h1>
          <p>${isOfficer ? 'Acceso completo al sistema' : 'Modo solo lectura'}</p>
        </div>
        <div class="topbar-actions">
          <div class="search-box">
            <i data-lucide="search"></i>
            <input type="text" placeholder="Buscar...">
          </div>
          <button class="notif-btn">
            <i data-lucide="bell"></i>
            <span class="notif-badge">3</span>
          </button>
        </div>
      </header>
      <main class="page-content">
        ${content}
      </main>
    </div>
  </div>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script>lucide.createIcons();</script>
  <script src="/js/main.js"></script>
</body>
</html>`;
}

module.exports = { layout };
