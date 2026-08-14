// Sesión compartida entre auditoria.html e inventario.html — sessionStorage
// (no localStorage) para que el token no sobreviva más allá de la pestaña,
// coherente con que el JWT es de vida corta (15 min) y el DataSource de la
// sesión SQL se pierde igual cuando el proceso de la API se reinicia.
const Sesion = (() => {
  function token() {
    return sessionStorage.getItem('accessToken');
  }

  function usuarioActual() {
    return sessionStorage.getItem('usuarioActual');
  }

  function haySesion() {
    return Boolean(token());
  }

  function limpiar() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('usuarioActual');
  }

  async function login(usuario, password) {
    const respuesta = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    });
    if (!respuesta.ok) {
      throw new Error('Usuario o contraseña incorrectos.');
    }
    const cuerpo = await respuesta.json();
    sessionStorage.setItem('accessToken', cuerpo.accessToken);
    sessionStorage.setItem('usuarioActual', usuario);
  }

  async function logout() {
    const actual = token();
    limpiar();
    if (actual) {
      // Cierra la sesión SQL en el servidor (closeSession) — si esto falla
      // (token ya vencido, etc.) no importa, igual ya limpiamos el estado
      // local y el usuario puede volver a loguearse.
      await fetch('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${actual}` },
      }).catch(() => {});
    }
  }

  async function fetchAutenticado(url, opciones = {}) {
    const respuesta = await fetch(url, {
      ...opciones,
      headers: {
        ...(opciones.headers ?? {}),
        Authorization: `Bearer ${token()}`,
      },
    });
    // El JWT vence a los 15 min, o la API pudo reiniciarse y perder la
    // sesión SQL en memoria — cualquiera de los dos casos vuelve un 401.
    // Se limpia el estado local y se avisa a la página para que vuelva a
    // mostrar el login, en vez de quedar con la app rota pidiendo datos
    // que nunca van a llegar.
    if (respuesta.status === 401) {
      limpiar();
      window.dispatchEvent(new CustomEvent('sesion:vencida'));
    }
    return respuesta;
  }

  // Wiring genérico del panel de login/sesión — auditoria.html e
  // inventario.html comparten los mismos ids (#panel-login, #usuario,
  // #password, #btn-login, #mensaje-error, #panel-sesion, #usuario-actual,
  // #btn-logout), así que esta función evita duplicar la misma lógica en
  // cada página. `alEntrar`/`alSalir` son los únicos puntos específicos de
  // cada página (qué mostrar/cargar una vez logueado, y qué ocultar al salir).
  function inicializarPanelLogin({ alEntrar, alSalir }) {
    const $ = (id) => document.getElementById(id);

    function mostrarSesionActiva(usuario) {
      $('usuario-actual').textContent = usuario;
      $('panel-login').style.display = 'none';
      $('panel-sesion').style.display = 'flex';
    }

    function mostrarLogin(mensaje) {
      $('panel-login').style.display = 'block';
      $('panel-sesion').style.display = 'none';
      $('mensaje-error').textContent = mensaje ?? '';
    }

    async function manejarLogin() {
      $('mensaje-error').textContent = '';
      const usuario = $('usuario').value.trim();
      const password = $('password').value;
      if (!usuario || !password) {
        $('mensaje-error').textContent = 'Usuario y password son obligatorios.';
        return;
      }
      try {
        await login(usuario, password);
        mostrarSesionActiva(usuario);
        await alEntrar(usuario);
      } catch (error) {
        $('mensaje-error').textContent = error.message;
      }
    }

    async function manejarLogout() {
      await logout();
      $('password').value = '';
      mostrarLogin();
      alSalir();
    }

    $('btn-login').addEventListener('click', manejarLogin);
    $('btn-logout').addEventListener('click', manejarLogout);
    window.addEventListener('sesion:vencida', () => {
      mostrarLogin('Tu sesión venció — iniciá sesión de nuevo.');
      alSalir();
    });

    if (haySesion()) {
      mostrarSesionActiva(usuarioActual());
      alEntrar(usuarioActual());
    }
  }

  return {
    token,
    usuarioActual,
    haySesion,
    login,
    logout,
    fetchAutenticado,
    inicializarPanelLogin,
  };
})();
