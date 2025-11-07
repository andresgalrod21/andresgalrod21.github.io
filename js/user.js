// Front de usuario: creación y gestión de tickets propios

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

  let userTicketsCache = [];

  async function loadTickets() {
    const tbody = document.querySelector('#userTicketsTable tbody');
    tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
    try {
      const res = await fetch(`${BACKEND_URL}/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      userTicketsCache = await res.json();
      tbody.innerHTML = '';
      userTicketsCache.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${t.id}</td>
          <td>${t.title}</td>
          <td>${t.status}</td>
          <td>${t.priority}</td>
          <td>
            <button class="btn" data-action="viewTicket" data-ticketid="${t.id}">Ver</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="5">Error: ${e.message}</td></tr>`;
    }
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

  // Filtro por estado en Mis tickets
  function applyUserTicketsFilter() {
    try {
      const filterStatusEl = document.getElementById('userFilterStatus');
      const statusVal = filterStatusEl?.value || '';
      const tbody = document.querySelector('#userTicketsTable tbody');
      tbody.innerHTML = '';
      let list = userTicketsCache.slice();
      if (statusVal) list = list.filter(t => t.status === statusVal);
      list.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${t.id}</td>
          <td>${t.title}</td>
          <td>${t.status}</td>
          <td>${t.priority}</td>
          <td>
            <button class="btn" data-action="viewTicket" data-ticketid="${t.id}">Ver</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (_) {}
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

    const form = document.getElementById('createTicketForm');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const title = document.getElementById('ticketTitle').value.trim();
      const desc = document.getElementById('ticketDesc').value.trim();
      const priority = document.getElementById('ticketPriority').value;
      if (!title || !desc) { alert('Completa título y descripción'); return; }
      try {
        await createTicket(title, desc, priority);
        form.reset();
        await loadTickets();
      } catch (e) {
        alert(e.message || 'Error al crear ticket');
      }
    });

    document.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      try {
        if (action === 'viewTicket') {
          const ticketId = btn.getAttribute('data-ticketid');
          window.location.href = `user-ticket.html?id=${ticketId}`;
        }
      } catch (e) {
        alert(e.message || 'Error');
      }
    });
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const me = await getMe();
      if (me.role === 'admin') {
        window.location.href = 'welcome-admin.html';
        return;
      }
      document.getElementById('userInfo').textContent = `Hola, ${me.email}`;
      bindEvents();
      await loadTickets();
      applyUserTicketsFilter();
      const filterStatusEl = document.getElementById('userFilterStatus');
      if (filterStatusEl) filterStatusEl.addEventListener('change', applyUserTicketsFilter);
    } catch (e) {
      alert('Error de autenticación: ' + e.message);
      window.location.href = 'index.html';
    }
  });
})();