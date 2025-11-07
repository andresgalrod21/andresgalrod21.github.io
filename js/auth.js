// Manejo de login y registro contra el backend FastAPI

function setMessage(text, isError=false) {
  const msg = document.getElementById('msg');
  if (!msg) return;
  msg.textContent = text || '';
  msg.className = isError ? 'msg error' : 'msg';
}

function switchTab(to) {
  const loginTab = document.getElementById('tabLogin');
  const registerTab = document.getElementById('tabRegister');
  const loginPanel = document.getElementById('loginForm');
  const registerPanel = document.getElementById('registerForm');
  if (to === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginPanel.classList.add('active');
    registerPanel.classList.remove('active');
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerPanel.classList.add('active');
    loginPanel.classList.remove('active');
  }
}

async function login(email, password) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Credenciales inválidas');
    }
    const data = await res.json();
    if (data && data.access_token) {
      localStorage.setItem('token', data.access_token);
      // Decidir redirección por rol consultando /auth/me y guardar email real
      try {
        const resMe = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        if (resMe.ok) {
          const me = await resMe.json();
          if (me && me.email) {
            localStorage.setItem('user_email', me.email);
          }
          const role = (me && me.role) ? me.role : 'user';
          if (role === 'admin') {
            window.location.href = 'welcome-admin.html';
          } else {
            window.location.href = 'welcome-user.html';
          }
        } else {
          // Fallback: asumir usuario
          localStorage.setItem('user_email', email);
          window.location.href = 'welcome-user.html';
        }
      } catch (err) {
        // Fallback por error de red
        localStorage.setItem('user_email', email);
        window.location.href = 'welcome-user.html';
      }
    } else {
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (e) {
    setMessage(e.message || 'Error al iniciar sesión', true);
  }
}

async function register(email, password) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'No se pudo registrar');
    }
    setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
    switchTab('login');
  } catch (e) {
    setMessage(e.message || 'Error al registrar', true);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tabLogin').addEventListener('click', () => switchTab('login'));
  document.getElementById('tabRegister').addEventListener('click', () => switchTab('register'));

  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) { setMessage('Completa email y password', true); return; }
    setMessage('Procesando login...');
    login(email, password);
  });

  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const password2 = document.getElementById('regPassword2').value.trim();
    if (!email || !password) { setMessage('Completa email y password', true); return; }
    if (!password2) { setMessage('Confirma la contraseña', true); return; }
    if (password !== password2) { setMessage('Las contraseñas no coinciden', true); return; }
    setMessage('Creando cuenta...');
    register(email, password);
  });

  // Toggle visibilidad de contraseñas
  const loginPwd = document.getElementById('loginPassword');
  const loginToggle = document.getElementById('loginPasswordToggle');
  if (loginPwd && loginToggle) {
    loginToggle.addEventListener('click', () => {
      const isText = loginPwd.type === 'text';
      loginPwd.type = isText ? 'password' : 'text';
      loginToggle.textContent = isText ? '👁' : '🙈';
      loginToggle.setAttribute('aria-label', isText ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });
  }
  const regPwd = document.getElementById('regPassword');
  const regToggle = document.getElementById('regPasswordToggle');
  if (regPwd && regToggle) {
    regToggle.addEventListener('click', () => {
      const isText = regPwd.type === 'text';
      regPwd.type = isText ? 'password' : 'text';
      regToggle.textContent = isText ? '👁' : '🙈';
      regToggle.setAttribute('aria-label', isText ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });
  }
  const regPwd2 = document.getElementById('regPassword2');
  const regToggle2 = document.getElementById('regPassword2Toggle');
  if (regPwd2 && regToggle2) {
    regToggle2.addEventListener('click', () => {
      const isText = regPwd2.type === 'text';
      regPwd2.type = isText ? 'password' : 'text';
      regToggle2.textContent = isText ? '👁' : '🙈';
      regToggle2.setAttribute('aria-label', isText ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });
  }
});