/* Función para crear la estructura general de las páginas */
function layout(user, pageTitle, activePage, content) {

  /* Variable para mostrar el rol */
  let rol = "";

  /* Validar tipo de usuario */
  if(user.role == "compliance_officer"){
    rol = "Oficial";
  }else{
    rol = "Visualizador";
  }

  /* Retorna el HTML */
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/layout.css">
</head>
<body>

<div class="contenedor">

<div class="menu">
<h2>Sistema SVA</h2>

<a href="/dashboard" class="${activePage == '/dashboard' ? 'activo' : ''}">Dashboard</a>
<a href="/dashboard/clients" class="${activePage == '/dashboard/clients' ? 'activo' : ''}">Clientes</a>
<a href="/dashboard/operations" class="${activePage == '/dashboard/operations' ? 'activo' : ''}">Operaciones</a>
<a href="/dashboard/alerts" class="${activePage == '/dashboard/alerts' ? 'activo' : ''}">Alertas</a>
<a href="/dashboard/reports" class="${activePage == '/dashboard/reports' ? 'activo' : ''}">Reportes</a>

<br>
<a href="/logout">Cerrar sesión</a>
</div>

<div class="contenido">
<h1>${pageTitle}</h1>
<p>Usuario: ${user.name}</p>
<p>Rol: ${rol}</p>
<hr>

${content}

</div>
</div>

</body>
</html>
`;
}

/* Exportar función */
module.exports = { layout };