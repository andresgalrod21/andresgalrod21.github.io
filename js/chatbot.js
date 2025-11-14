// Chatbot básico de ayuda para usuarios (FAQ y guía para crear casos)

(function() {
  function $(id) { return document.getElementById(id); }

  const FAQS = [
    {
      q: '¿Cómo crear un ticket?',
      a: 'Ve a "Crear nuevo ticket". Ingresa un título claro, describe el problema y selecciona la prioridad. Pulsa Crear. El ticket aparecerá en "Mis tickets".',
      keys: ['crear', 'ticket', 'nuevo', 'caso']
    },
    {
      q: 'Estados del ticket',
      a: 'Un ticket puede estar en open, in_progress o closed. Open: recibido; in_progress: atendido; closed: resuelto. Puedes filtrar por estado en "Mis tickets".',
      keys: ['estado', 'open', 'in_progress', 'closed']
    },
    {
      q: 'Prioridades del ticket',
      a: 'Usa baja/normal/alta/urgente según impacto y urgencia. Si afecta múltiples usuarios o servicios críticos, elige alta o urgente.',
      keys: ['prioridad', 'alta', 'urgente', 'baja', 'normal']
    },
    {
      q: 'Qué información incluir',
      a: 'Incluye pasos, mensajes de error, capturas si es posible, y el impacto (a cuántos usuarios/servicios afecta). Esto acelera la resolución.',
      keys: ['información', 'detalles', 'error', 'captura', 'impacto']
    },
    {
      q: 'Tiempo de respuesta',
      a: 'El tiempo depende de la prioridad y carga. Recibirás notificaciones por comentarios en el ticket. Para urgentes, marca prioridad "urgente".',
      keys: ['tiempo', 'respuesta', 'urgente', 'prioridad']
    },
    {
      q: 'Cómo cerrar un ticket',
      a: 'Cuando el problema esté resuelto, puedes solicitar el cierre respondiendo en comentarios o usando la acción de cierre si está disponible.',
      keys: ['cerrar', 'closed', 'resolver']
    }
  ];

  const state = {
    lastUserQuery: ''
  };

  function normalize(s) {
    return (s || '').toLowerCase().trim();
  }

  function scoreFaq(query, faq) {
    const qn = normalize(query);
    let score = 0;
    for (const k of faq.keys) {
      if (qn.includes(k)) score += 2;
    }
    // bonus if question text partially matches
    if (normalize(faq.q).includes(qn) || qn.includes(normalize(faq.q))) score += 1;
    return score;
  }

  function findBestFAQ(query) {
    let best = null; let bestScore = 0;
    for (const faq of FAQS) {
      const s = scoreFaq(query, faq);
      if (s > bestScore) { bestScore = s; best = faq; }
    }
    return bestScore >= 2 ? best : null; // umbral sencillo
  }

  function appendMessage(sender, text) {
    const box = $('chatbotMessages');
    if (!box) return;
    const el = document.createElement('div');
    el.style.padding = '6px 8px';
    el.style.borderBottom = '1px solid var(--border)';
    el.innerHTML = `<strong>${sender === 'bot' ? 'Bot' : 'Tú'}:</strong> ${text}`;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function openChatbot() {
    const modal = $('chatbotModal');
    if (!modal) return;
    modal.style.display = 'block';
    const box = $('chatbotMessages');
    if (box) box.innerHTML = '';
    appendMessage('bot', 'Hola 👋 Soy tu asistente. Puedo ayudarte con:');
    const suggestions = FAQS.map(f => `• ${f.q}`).join('<br/>');
    appendMessage('bot', suggestions);
  }

  function closeChatbot() {
    const modal = $('chatbotModal');
    if (modal) modal.style.display = 'none';
  }

  function handleUserQuery(query) {
    state.lastUserQuery = query;
    appendMessage('user', query);
    const best = findBestFAQ(query);
    if (best) {
      appendMessage('bot', best.a);
    } else {
      appendMessage('bot', 'No encontré una respuesta exacta. ¿Quieres crear un caso para que el equipo lo atienda? Pulsa "Crear caso desde el chat".');
    }
  }

  function prefillCaseFromChat() {
    const titleEl = $('ticketTitle');
    const descEl = $('ticketDesc');
    if (titleEl && descEl) {
      const q = state.lastUserQuery || 'Consulta desde Chatbot';
      titleEl.value = q.length > 60 ? q.slice(0, 60) + '…' : q;
      descEl.value = `Consulta: ${q}\n\nDetalles: (añade pasos, error y contexto aquí)\n\nOrigen: Chatbot de ayuda.`;
      closeChatbot();
      titleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      titleEl.focus();
    } else {
      appendMessage('bot', 'No pude encontrar el formulario. Abre "Crear nuevo ticket" y vuelve a intentar.');
    }
  }

  function bindEvents() {
    const btn = $('btnChatbot');
    const closeBtn = $('chatbotClose');
    const form = $('chatbotForm');
    const createBtn = $('chatbotCreateCase');

    if (btn) btn.addEventListener('click', openChatbot);
    if (closeBtn) closeBtn.addEventListener('click', closeChatbot);
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('chatbotInput');
      const q = normalize(input?.value || '');
      if (!q) {
        appendMessage('bot', 'Escribe una pregunta para ayudarte mejor.');
        return;
      }
      handleUserQuery(q);
      if (input) input.value = '';
    });
    if (createBtn) createBtn.addEventListener('click', prefillCaseFromChat);
  }

  window.addEventListener('DOMContentLoaded', () => {
    bindEvents();
  });
})();