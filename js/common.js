// Componente común de perfil y logout + comportamiento de Volver
(function() {
  const token = localStorage.getItem('token');
  const isLoginPage = /\/index\.html$/i.test(location.pathname);

  async function mountProfile() {
    // No mostrar en login o si no hay token
    if (!token || isLoginPage) return;
    const container = document.querySelector('.container');
    if (!container) return;

    // Si existe banner, insertar el perfil dentro de la franja
    const banner = container.querySelector('.udec-banner');
    if (banner) {
      let profile = banner.querySelector('.profile');
      if (!profile) {
        profile = document.createElement('div');
        profile.className = 'profile';
        profile.innerHTML = `
          <button class="profile-button" id="profileBtn">👤</button>
          <div class="profile-menu" id="profileMenu">
            <div class="item item-label" id="currentUserItem">Usuario: ...</div>
            <div class="item" id="logoutItem">Cerrar sesión</div>
          </div>
        `;
        banner.appendChild(profile);
      }
    } else {
      // Fallback: crear toolbar dentro del contenedor si no hay banner
      let toolbar = container.querySelector('.container-toolbar');
      if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.className = 'container-toolbar';
        const profile = document.createElement('div');
        profile.className = 'profile';
        profile.innerHTML = `
          <button class="profile-button" id="profileBtn">👤</button>
          <div class="profile-menu" id="profileMenu">
            <div class="item item-label" id="currentUserItem">Usuario: ...</div>
            <div class="item" id="logoutItem">Cerrar sesión</div>
          </div>
        `;
        toolbar.appendChild(profile);
        container.insertBefore(toolbar, container.firstChild);
      }
    }

    const btn = document.getElementById('profileBtn');
    const menu = document.getElementById('profileMenu');
    const logoutItem = document.getElementById('logoutItem');
    const currentLabel = document.getElementById('currentUserItem');

    // Cargar nombre/email desde localStorage y backend si es posible
    try {
      const localEmail = localStorage.getItem('user_email') || '';
      let display = localEmail;
      if (token) {
        const res = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const me = await res.json();
          display = me?.email || display || 'Usuario';
        }
      }
      if (currentLabel) currentLabel.textContent = `Usuario: ${display || 'N/A'}`;
    } catch(_) {
      // Ignorar errores de red
    }

    if (btn && menu) {
      btn.onclick = () => {
        menu.classList.toggle('open');
      };
      document.addEventListener('click', (ev) => {
        if (!menu.contains(ev.target) && ev.target !== btn) {
          menu.classList.remove('open');
        }
      });
    }
    if (logoutItem) {
      logoutItem.onclick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        window.location.href = 'index.html';
      };
    }
  }

  function wireBackLinks() {
    // Enlaces .link-back: ir siempre a la bienvenida según rol, sin cerrar sesión
    document.querySelectorAll('a.link-back').forEach(a => {
      a.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const tokenVal = localStorage.getItem('token');
        if (!tokenVal) {
          window.location.href = 'index.html';
          return;
        }
        try {
          const res = await fetch(`${BACKEND_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${tokenVal}` }
          });
          if (res.ok) {
            const me = await res.json();
            if (me?.role === 'admin') {
              window.location.href = 'welcome-admin.html';
            } else {
              window.location.href = 'welcome-user.html';
            }
            return;
          }
        } catch(_) {}
        // Fallback si /auth/me falla: ir a la bienvenida genérica
        window.location.href = 'welcome.html';
      }, { capture: true }); // capture para adelantarnos a otros listeners
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    mountProfile();
    wireBackLinks();
  });
})();