// Interfaz dedicada para crear usuarios (admin)

(function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  async function getMe() {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('No se pudo leer perfil');
    return res.json();
  }

  async function createUser(email, password, role) {
    const res = await fetch(`${BACKEND_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const me = await getMe();
      if (me.role !== 'admin') {
        window.location.href = 'welcome-user.html';
        return;
      }
      document.getElementById('adminInfo').textContent = `Admin: ${me.email}`;

      const form = document.getElementById('createUserForm');
      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        try {
          const email = (document.getElementById('email').value || '').trim();
          const password = (document.getElementById('password').value || '').trim();
          const role = document.getElementById('role').value || 'user';
          if (!email || !password) {
            alert('Email y password son requeridos');
            return;
          }
          await createUser(email, password, role);
          alert('Usuario creado');
          window.location.href = 'welcome-admin.html';
        } catch (e) {
          alert(e.message || 'Error creando usuario');
        }
      });
    } catch (e) {
      alert('Error de autenticación: ' + e.message);
      window.location.href = 'index.html';
    }
  });
})();