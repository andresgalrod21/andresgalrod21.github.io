// Front de administración: listado de usuarios y todos los tickets

(function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  let usersCache = [];
  let ticketsCache = [];
  let currentUserId = null;

  // Función global para aplicar filtros de tickets (se usa en múltiples flujos)
  function applyTicketsFilters() {
    try {
      const filterMyTicketsEl = document.getElementById('filterMyTickets');
      const filterStatusEl = document.getElementById('filterStatus');
      let list = ticketsCache.slice();
      if (filterMyTicketsEl?.checked && currentUserId) {
        list = list.filter(t => t.user_id === currentUserId);
      }
      const statusVal = filterStatusEl?.value || '';
      if (statusVal) {
        list = list.filter(t => t.status === statusVal);
      }
      renderTickets(list);
    } catch (_) {
      // En caso de que aún no haya datos o elementos, simplemente no hacer nada
    }
  }

  async function getMe() {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('No se pudo leer perfil');
    return res.json();
  }

  // Popup de confirmación
  function openConfirm(title, message) {
    const overlay = document.getElementById('modalConfirm');
    const titleEl = document.getElementById('modalConfirmTitle');
    const bodyEl = document.getElementById('modalConfirmBody');
    const okBtn = document.getElementById('modalOk');
    const cancelBtn = document.getElementById('modalCancel');
    titleEl.textContent = title || 'Confirmación';
    bodyEl.textContent = message || '¿Está seguro?';
    overlay.style.display = 'flex';
    return new Promise(resolve => {
      const cleanup = () => {
        overlay.style.display = 'none';
        okBtn.onclick = null;
        cancelBtn.onclick = null;
      };
      okBtn.onclick = () => { cleanup(); resolve(true); };
      cancelBtn.onclick = () => { cleanup(); resolve(false); };
    });
  }

  function renderUsers(list) {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    list.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.email}</td>
        <td>
          <select data-userid="${u.id}" class="roleSelect">
            <option value="user" ${u.role === 'user' ? 'selected' : ''}>usuario</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option>
          </select>
        </td>
        <td>
          <button class="btn btn-secondary" data-action="saveRole" data-userid="${u.id}">Guardar rol</button>
          <button class="btn btn-danger" data-action="deleteUser" data-userid="${u.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  async function loadUsers() {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '<tr><td colspan="4">Cargando...</td></tr>';
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      usersCache = await res.json();
      usersCache.sort((a, b) => (a.id || 0) - (b.id || 0));
      tbody.innerHTML = '';
      renderUsers(usersCache);
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="4">Error: ${e.message}</td></tr>`;
    }
  }

  function renderTickets(list) {
    const tbody = document.querySelector('#ticketsTable tbody');
    tbody.innerHTML = '';
    list.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.id}</td>
        <td>${t.title}</td>
        <td>
          <select class="statusSelect" data-ticketid="${t.id}">
            ${['open','in_progress','closed'].map(s => `<option value="${s}" ${t.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
        <td>
          <select class="prioritySelect" data-ticketid="${t.id}">
            ${['low','normal','high','urgent'].map(p => `<option value="${p}" ${t.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </td>
        <td>
          <button class="btn" data-action="viewTicket" data-ticketid="${t.id}">Ver</button>
          <button class="btn btn-secondary" data-action="saveTicket" data-ticketid="${t.id}">Guardar</button>
          <button class="btn btn-danger" data-action="deleteTicket" data-ticketid="${t.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  async function loadTickets() {
    const tbody = document.querySelector('#ticketsTable tbody');
    tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
    try {
      const res = await fetch(`${BACKEND_URL}/admin/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      ticketsCache = await res.json();
      tbody.innerHTML = '';
      renderTickets(ticketsCache);
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="5">Error: ${e.message}</td></tr>`;
    }
  }

  async function updateUserRole(userId, role) {
    const res = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function deleteUser(userId) {
    const res = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
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

  // Actualizar contraseña de usuario (admin)
  async function updateUserPassword(userId, password) {
    const res = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }


  async function updateTicket(ticketId, status, priority) {
    const res = await fetch(`${BACKEND_URL}/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, priority })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function deleteTicket(ticketId) {
    const res = await fetch(`${BACKEND_URL}/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function createTicket(title, description, priority) {
    const res = await fetch(`${BACKEND_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, priority })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  function bindEvents() {
    const logoutEl = document.getElementById('logout');
    if (logoutEl) {
      logoutEl.onclick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        window.location.href = 'index.html';
      };
    }

    document.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      try {
        if (action === 'saveRole') {
          const userId = btn.getAttribute('data-userid');
          const select = document.querySelector(`select.roleSelect[data-userid='${userId}']`);
          await updateUserRole(userId, select.value);
          await loadUsers();
        } else if (action === 'deleteUser') {
          const userId = btn.getAttribute('data-userid');
          const ok = await openConfirm('Confirmar eliminación', `¿Eliminar usuario #${userId}? Esta acción es permanente.`);
          if (!ok) return;
          await deleteUser(userId);
          await loadUsers();
        } else if (action === 'saveTicket') {
          const ticketId = btn.getAttribute('data-ticketid');
          const statusSel = document.querySelector(`select.statusSelect[data-ticketid='${ticketId}']`);
          const prioritySel = document.querySelector(`select.prioritySelect[data-ticketid='${ticketId}']`);
          await updateTicket(ticketId, statusSel.value, prioritySel.value);
          await loadTickets();
        } else if (action === 'deleteTicket') {
          const ticketId = btn.getAttribute('data-ticketid');
          const ok = await openConfirm('Confirmar eliminación', `¿Eliminar ticket #${ticketId}? Esta acción es permanente.`);
          if (!ok) return;
          await deleteTicket(ticketId);
          await loadTickets();
        } else if (action === 'viewTicket') {
          const ticketId = btn.getAttribute('data-ticketid');
          window.location.href = `admin-ticket.html?id=${ticketId}`;
        }
      } catch (e) {
        alert(e.message || 'Error');
      }
    });

    // Navegación y visibilidad de secciones
    const btnUsers = document.getElementById('btnUsers');
    const btnTickets = document.getElementById('btnTickets');
    const topMenu = document.getElementById('topMenu');
    const usersSec = document.getElementById('sectionUsers');
    const ticketsSec = document.getElementById('sectionTickets');
    const filterMyTickets = document.getElementById('filterMyTickets');
    const filterStatus = document.getElementById('filterStatus');
    const createTicketAdminBtn = document.getElementById('createTicketAdmin');
    const ticketOverlay = document.getElementById('modalCreateTicketAdmin');
    const ticketCancel = document.getElementById('modalCreateTicketCancel');
    const ticketOk = document.getElementById('modalCreateTicketOk');
    if (btnUsers) {
      btnUsers.addEventListener('click', async () => {
        if (ticketsSec) ticketsSec.style.display = 'none';
        if (usersSec) usersSec.style.display = 'block';
        if (topMenu) topMenu.style.display = 'none';
        await loadUsers();
        usersSec?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    if (btnTickets) {
      btnTickets.addEventListener('click', async () => {
        if (usersSec) usersSec.style.display = 'none';
        if (ticketsSec) ticketsSec.style.display = 'block';
        if (topMenu) topMenu.style.display = 'none';
        await loadTickets();
        ticketsSec?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        applyTicketsFilters();
      });
    }

    function applyTicketsFilters() {
      let list = ticketsCache.slice();
      if (filterMyTickets?.checked && currentUserId) {
        list = list.filter(t => t.user_id === currentUserId);
      }
      const statusVal = filterStatus?.value || '';
      if (statusVal) {
        list = list.filter(t => t.status === statusVal);
      }
      renderTickets(list);
    }
    if (filterMyTickets) filterMyTickets.addEventListener('change', applyTicketsFilters);
    if (filterStatus) filterStatus.addEventListener('change', applyTicketsFilters);

    if (createTicketAdminBtn) {
      createTicketAdminBtn.addEventListener('click', () => {
        if (ticketOverlay) ticketOverlay.style.display = 'flex';
      });
    }
    if (ticketCancel) {
      ticketCancel.addEventListener('click', () => {
        if (ticketOverlay) ticketOverlay.style.display = 'none';
      });
    }
    if (ticketOk) {
      ticketOk.addEventListener('click', async () => {
        try {
          const title = (document.getElementById('modalTicketTitle')?.value || '').trim();
          const desc = (document.getElementById('modalTicketDesc')?.value || '').trim();
          const priority = document.getElementById('modalTicketPriority')?.value || 'normal';
          if (!title || !desc) { alert('Completa título y descripción'); return; }
          await createTicket(title, desc, priority);
          if (ticketOverlay) ticketOverlay.style.display = 'none';
          document.getElementById('modalTicketTitle').value = '';
          document.getElementById('modalTicketDesc').value = '';
          document.getElementById('modalTicketPriority').value = 'normal';
          await loadTickets();
          applyTicketsFilters();
        } catch (e) {
          alert(e.message || 'Error al crear ticket');
        }
      });
    }

    // Búsqueda de usuarios
    const searchBtn = document.getElementById('searchUsers');
    const resetBtn = document.getElementById('resetUsers');
    const idInput = document.getElementById('searchUserId');
    const emailInput = document.getElementById('searchUserEmail');
    const createUserBtn = document.getElementById('createUser');
    const createOverlay = document.getElementById('modalCreateUser');
    const createCancel = document.getElementById('modalCreateCancel');
    const createOk = document.getElementById('modalCreateOk');
    // Elementos para edición de usuario (cambiar contraseña)
    const editUserBtn = document.getElementById('editUser');
    const editOverlay = document.getElementById('modalEditUser');
    const editCancel = document.getElementById('modalEditCancel');
    const editOk = document.getElementById('modalEditOk');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const idVal = idInput?.value ? parseInt(idInput.value, 10) : null;
        const emailVal = (emailInput?.value || '').toLowerCase();
        const filtered = usersCache.filter(u => {
          const matchId = idVal ? u.id === idVal : true;
          const matchEmail = emailVal ? String(u.email).toLowerCase().includes(emailVal) : true;
          return matchId && matchEmail;
        }).sort((a, b) => (a.id || 0) - (b.id || 0));
        renderUsers(filtered);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (idInput) idInput.value = '';
        if (emailInput) emailInput.value = '';
        renderUsers(usersCache);
      });
    }

    if (createUserBtn) {
      createUserBtn.addEventListener('click', () => {
        if (createOverlay) createOverlay.style.display = 'flex';
      });
    }
    if (createCancel) {
      createCancel.addEventListener('click', () => {
        if (createOverlay) createOverlay.style.display = 'none';
      });
    }
    if (createOk) {
      createOk.addEventListener('click', async () => {
        try {
          const email = (document.getElementById('modalUserEmail')?.value || '').trim();
          const password = (document.getElementById('modalUserPassword')?.value || '').trim();
          const role = document.getElementById('modalUserRole')?.value || 'user';
          if (!email || !password) {
            alert('Email y password son requeridos');
            return;
          }
          await createUser(email, password, role);
          if (createOverlay) createOverlay.style.display = 'none';
          document.getElementById('modalUserEmail').value = '';
          document.getElementById('modalUserPassword').value = '';
          document.getElementById('modalUserRole').value = 'user';
          await loadUsers();
        } catch (e) {
          alert(e.message || 'Error creando usuario');
        }
      });
    }

    // Abrir/cerrar modal de edición y enviar cambio de contraseña
    if (editUserBtn) {
      editUserBtn.addEventListener('click', () => {
        if (editOverlay) editOverlay.style.display = 'flex';
      });
    }
    if (editCancel) {
      editCancel.addEventListener('click', () => {
        if (editOverlay) editOverlay.style.display = 'none';
      });
    }
    if (editOk) {
      editOk.addEventListener('click', async () => {
        try {
          const idStr = (document.getElementById('modalEditUserId')?.value || '').trim();
          const newPass = (document.getElementById('modalEditUserPassword')?.value || '').trim();
          const userId = idStr ? parseInt(idStr, 10) : NaN;
          if (!userId || userId <= 0 || !newPass) {
            alert('Ingrese un ID válido y la nueva contraseña');
            return;
          }
          await updateUserPassword(userId, newPass);
          if (editOverlay) editOverlay.style.display = 'none';
          document.getElementById('modalEditUserId').value = '';
          document.getElementById('modalEditUserPassword').value = '';
          await loadUsers();
        } catch (e) {
          alert(e.message || 'Error actualizando contraseña');
        }
      });
    }

    // Enlaces específicos de cada sección para regresar al menú
    const backUsers = document.getElementById('backUsers');
    const backTickets = document.getElementById('backTickets');
    function backToMenu(ev) {
      ev.preventDefault();
      // Evita que otros listeners (comunes) naveguen
      if (typeof ev.stopImmediatePropagation === 'function') {
        ev.stopImmediatePropagation();
      } else {
        ev.stopPropagation();
      }
      if (usersSec) usersSec.style.display = 'none';
      if (ticketsSec) ticketsSec.style.display = 'none';
      if (topMenu) topMenu.style.display = 'flex';
      topMenu?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (backUsers) backUsers.addEventListener('click', backToMenu);
    if (backTickets) backTickets.addEventListener('click', backToMenu);
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const me = await getMe();
      if (me.role !== 'admin') {
        window.location.href = 'welcome-user.html';
        return;
      }
      document.getElementById('userInfo').textContent = `Hola, ${me.email}`;
      currentUserId = me.id;
      bindEvents();
      // Ocultar secciones hasta seleccionar Usuarios/Casos
      const usersSec = document.getElementById('sectionUsers');
      const ticketsSec = document.getElementById('sectionTickets');
      if (usersSec) usersSec.style.display = 'none';
      if (ticketsSec) ticketsSec.style.display = 'none';

      // Si llegamos con ?section=tickets, abrir directamente Casos
      const params = new URLSearchParams(window.location.search);
      if (params.get('section') === 'tickets' && ticketsSec) {
        usersSec && (usersSec.style.display = 'none');
        ticketsSec.style.display = 'block';
        topMenu && (topMenu.style.display = 'none');
        await loadTickets();
        applyTicketsFilters();
        ticketsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      alert('Error de autenticación: ' + e.message);
      window.location.href = 'index.html';
    }
  });
})();