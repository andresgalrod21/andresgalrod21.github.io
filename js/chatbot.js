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
  const BOT_SUFFIX = ' ¿Puedo colaborarte con algo más?';

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

  function appendMessage(sender, text, addSuffix = false) {
    const box = $('chatbotMessages');
    if (!box) return;
    const el = document.createElement('div');
    el.style.padding = '6px 8px';
    el.style.borderBottom = '1px solid var(--border)';
    const content = addSuffix && sender === 'bot' ? text + BOT_SUFFIX : text;
    el.innerHTML = `<strong>${sender === 'bot' ? 'Bot' : 'Tú'}:</strong> ${content}`;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function renderOptions() {
    const opt = $('chatbotOptions');
    if (!opt) return;
    opt.innerHTML = '';
    const items = [...FAQS, { q: 'Mi duda no está en la lista', a: 'He creado una plantilla para ayudarte a abrir un caso.', keys: ['otra', 'duda', 'lista'] }];
    items.forEach((f, i) => {
      const b = document.createElement('button');
      b.className = 'btn btn-secondary';
      b.type = 'button';
      b.dataset.index = String(i);
      b.textContent = `${i + 1}. ${f.q}`;
      b.addEventListener('click', () => handleOption(i, items));
      opt.appendChild(b);
    });
  }

  function openChatbot() {
    const modal = $('chatbotModal');
    if (!modal) return;
    modal.style.display = 'block';
    const box = $('chatbotMessages');
    if (box) box.innerHTML = '';
    appendMessage('bot', 'Hola 👋 Soy tu asistente. Selecciona una opción por número:');
    renderOptions();
  }

  function closeChatbot() {
    const modal = $('chatbotModal');
    if (modal) modal.style.display = 'none';
  }

  function handleOption(index, items = FAQS) {
    const faq = items[index];
    if (!faq) {
      appendMessage('bot', 'Opción no válida. Elige un número de la lista.', true);
      return;
    }
    state.lastUserQuery = faq.q;
    appendMessage('user', `${index + 1}. ${faq.q}`);
    // Si es la opción "Mi duda no está en la lista", prellenar y cerrar
    const isGeneric = /Mi duda no está en la lista/i.test(faq.q);
    if (isGeneric) {
      appendMessage('bot', 'Perfecto, te ayudo a abrir un caso con una plantilla.', true);
      prefillGeneralTemplate();
      closeChatbot();
      return;
    }
    appendMessage('bot', faq.a, true);
  }

  function handleFreeText(query) {
    state.lastUserQuery = query;
    appendMessage('user', query);
    const best = findBestFAQ(query);
    if (best) {
      appendMessage('bot', best.a, true);
      return;
    }
    // Sin coincidencia: avisar y prellenar el formulario con la duda
    appendMessage(
      'bot',
      'Por ahora no puedo colaborar directamente con esta consulta. Al crear el ticket, será remitido al área encargada.',
      true
    );
    prefillCaseFromText(query);
    closeChatbot();
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
      const raw = (input?.value || '').trim();
      if (!raw) {
        appendMessage('bot', 'Escribe una pregunta o el número de la opción.', true);
        return;
      }
      const n = parseInt(raw, 10);
      const total = FAQS.length + 1; // incluye opción genérica
      if (!isNaN(n)) {
        if (n < 1 || n > total) {
          appendMessage('bot', `Número inválido. Elige entre 1 y ${total}.`, true);
        } else {
          handleOption(n - 1);
        }
      } else {
        handleFreeText(raw);
      }
      if (input) input.value = '';
    });
    if (createBtn) createBtn.addEventListener('click', prefillCaseFromChat);
  }

  window.addEventListener('DOMContentLoaded', () => {
    bindEvents();
  });
})();

function prefillGeneralTemplate() {
  const titleEl = document.getElementById('ticketTitle');
  const descEl = document.getElementById('ticketDesc');
  if (titleEl && descEl) {
    titleEl.value = 'Consulta general desde Chatbot';
    descEl.value = [
      'Resumen: [describe en una línea el problema]',
      '',
      'Pasos para reproducir:',
      '1) ',
      '2) ',
      '3) ',
      '',
      'Comportamiento esperado vs actual:',
      '- Esperado: ',
      '- Actual: ',
      '',
      'Impacto:',
      '- Usuarios/servicios afectados: ',
      '- Frecuencia: ',
      '',
      'Datos adicionales:',
      '- Mensajes de error, capturas, versión, entorno'
    ].join('\n');
    titleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    titleEl.focus();
  }

function prefillCaseFromText(userText) {
  const titleEl = document.getElementById('ticketTitle');
  const descEl = document.getElementById('ticketDesc');
  if (titleEl && descEl) {
    const title = userText.length > 60 ? userText.slice(0, 60) + '…' : userText;
    titleEl.value = title || 'Consulta desde Chatbot';
    descEl.value = [
      `Consulta del usuario: ${userText}`,
      '',
      'Aviso: remitido al área encargada por el chatbot.',
      '',
      'Detalles adicionales (completa si puedes):',
      '- Pasos para reproducir:',
      '- Mensajes de error / capturas:',
      '- Impacto (usuarios/servicios afectados):'
    ].join('\n');
    titleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    titleEl.focus();
  } else {
    // Si no hay formulario visible, informar al usuario
    const msg = 'No pude encontrar el formulario. Abre "Crear nuevo ticket" y vuelve a intentar.';
    const box = document.getElementById('chatbotMessages');
    if (box) {
      const el = document.createElement('div');
      el.style.padding = '6px 8px';
      el.style.borderBottom = '1px solid var(--border)';
      el.innerHTML = `<strong>Bot:</strong> ${msg}${' ¿Puedo colaborarte con algo más?'}`;
      box.appendChild(el);
      box.scrollTop = box.scrollHeight;
    }
  }
}
}