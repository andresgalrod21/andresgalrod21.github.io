// Detalle de ticket para usuario: ver info y gestionar comentarios de su propio ticket

(function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  function getTicketId() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id') || '0', 10);
    return isNaN(id) ? null : id;
  }

  async function getMe() {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('No se pudo leer perfil');
    return res.json();
  }

  async function findTicket(ticketId) {
    const res = await fetch(`${BACKEND_URL}/tickets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
    const tickets = await res.json();
    return tickets.find(t => t.id === ticketId) || null;
  }

  async function listMessages(ticketId) {
    const res = await fetch(`${BACKEND_URL}/tickets/${ticketId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function createMessage(ticketId, body) {
    const res = await fetch(`${BACKEND_URL}/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ body })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  function renderTicket(ticket) {
    const info = document.getElementById('ticketInfo');
    document.getElementById('ticketHeader').textContent = `Ticket #${ticket.id} • ${ticket.title}`;
    info.innerHTML = `
      <div class="grid" style="display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px;">
        <div><strong>ID:</strong> ${ticket.id}</div>
        <div><strong>Estado:</strong> ${ticket.status}</div>
        <div><strong>Prioridad:</strong> ${ticket.priority}</div>
        <div style="grid-column: 1 / -1;"><strong>Descripción:</strong><br/>${ticket.description}</div>
      </div>
    `;
  }

  function renderMessages(messages) {
    const list = document.getElementById('messagesList');
    list.classList.add('messages-scrollbox');
    list.innerHTML = '';
    if (!messages.length) {
      list.innerHTML = '<p class="message">Sin comentarios aún.</p>';
      return;
    }
    messages.forEach(m => {
      const item = document.createElement('div');
      item.className = 'message-item';
      item.style.marginBottom = '8px';
      const email = (m.sender && m.sender.email) ? m.sender.email : `Usuario #${m.sender_id ?? 'N/A'}`;
      let createdDisplay = '';
      if (m.created_at) {
        const d = new Date(m.created_at);
        const adjusted = new Date(d.getTime() - (5 * 60 * 60 * 1000));
        createdDisplay = adjusted.toLocaleString('es-ES');
      }
      item.innerHTML = `<strong>De #${m.sender_id ?? 'N/A'} (${email})</strong> <span style="color:#666;">${createdDisplay ? '• ' + createdDisplay : ''}</span><br/>${m.body}`;
      list.appendChild(item);
    });

    const items = Array.from(list.querySelectorAll('.message-item'));
    const visibleCount = Math.min(items.length, 4);
    let totalHeight = 0;
    for (let i = 0; i < visibleCount; i++) {
      totalHeight += items[i].offsetHeight;
    }
    if (totalHeight > 0) {
      list.style.maxHeight = `${totalHeight}px`;
      list.style.overflowY = 'auto';
    }
  }

  function bindEvents(ticketId) {
    const form = document.getElementById('commentForm');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const body = document.getElementById('commentBody').value.trim();
      if (!body) { alert('Escribe un comentario'); return; }
      try {
        await createMessage(ticketId, body);
        document.getElementById('commentBody').value = '';
        const msgs = await listMessages(ticketId);
        renderMessages(msgs);
      } catch (e) {
        alert(e.message || 'Error al agregar comentario');
      }
    });

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        try {
          const ticket = await findTicket(ticketId);
          if (ticket) {
            renderTicket(ticket);
          }
          const msgs = await listMessages(ticketId);
          renderMessages(msgs);
        } catch (e) {
          alert(e.message || 'Error al actualizar información');
        }
      });
    }
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const me = await getMe();
      if (me.role === 'admin') {
        window.location.href = 'welcome-admin.html';
        return;
      }

      const ticketId = getTicketId();
      if (!ticketId) {
        alert('Ticket inválido');
        window.location.href = 'welcome-user.html';
        return;
      }

      const ticket = await findTicket(ticketId);
      if (!ticket) {
        alert('Ticket no encontrado');
        window.location.href = 'welcome-user.html';
        return;
      }

      renderTicket(ticket);
      bindEvents(ticketId);
      const msgs = await listMessages(ticketId);
      renderMessages(msgs);
    } catch (e) {
      alert('Error de autenticación: ' + e.message);
      window.location.href = 'index.html';
    }
  });
})();