(function () {
  // Añade TailwindCSS
  document.head.insertAdjacentHTML(
    'beforeend',
    '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">'
  );

  // Crea el contenedor del widget
  const agentWidgetContainer = document.createElement('div');
  agentWidgetContainer.id = 'agent-widget-container';
  document.body.appendChild(agentWidgetContainer);

  // Palabras clave para detectar temas y tamaños de fuente
  const themeKeywords = ['fondo', 'tema', 'background', 'theme'];
  const darkKeywords = ['oscuro', 'negro', 'dark'];
  const lightKeywords = ['claro', 'blanco', 'light'];

  const fontKeywords = ['fuente', 'letra', 'tamaño', 'font', 'size', 'letter'];
  const smallKeywords = ['pequeño', 'pequeña', 'small'];
  const largeKeywords = ['grande', 'big', 'large'];
  const mediumKeywords = ['mediano', 'mediana', 'defecto', 'medium', 'default'];

  const languageKeywords = ['idioma', 'language'];
  const enKeywords = ['english', 'inglés'];
  const esKeywords = ['español', 'spanish'];

  // HTML del widget
  agentWidgetContainer.innerHTML = `
    <div id="agent-bubble" class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-3xl">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0,0,256,256">
        <g fill="#09ab00" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M30.7,7.27l-2.37,1.83c-1.605,-2.067 -4.068,-3.209 -6.697,-3.092c-4.32,0.192 -7.633,3.945 -7.633,8.269v9.143l10.5,6.12l-1,1.72l-11.706,-6.827c-0.492,-0.287 -0.794,-0.813 -0.794,-1.382v-8.687c0,-6.264 5.129,-11.574 11.39,-11.357c3.279,0.113 6.29,1.656 8.31,4.263z"></path><path d="M12.861,9.833l0.4,2.967c-2.592,0.357 -4.813,1.919 -6.026,4.254c-1.994,3.837 -0.4,8.582 3.345,10.745l7.918,4.571l10.55,-6.033l0.99,1.726l-11.765,6.724c-0.494,0.282 -1.101,0.281 -1.594,-0.003l-7.523,-4.343c-5.426,-3.133 -7.46,-10.23 -4.142,-15.543c1.738,-2.784 4.58,-4.619 7.847,-5.065z"></path><path d="M6.161,26.563l2.77,1.137c-0.987,2.423 -0.745,5.128 0.671,7.346c2.326,3.645 7.233,4.638 10.977,2.476l7.918,-4.572l0.05,-12.153l1.99,0.006l-0.059,13.551c-0.002,0.569 -0.307,1.094 -0.8,1.379l-7.523,4.343c-5.425,3.132 -12.588,1.345 -15.531,-4.185c-1.541,-2.897 -1.71,-6.275 -0.463,-9.328z"></path><path d="M17.3,40.73l2.37,-1.83c1.605,2.067 4.068,3.209 6.697,3.092c4.32,-0.192 7.633,-3.945 7.633,-8.269v-9.143l-10.5,-6.12l1,-1.72l11.706,6.827c0.492,0.287 0.794,0.813 0.794,1.382v8.687c0,6.264 -5.13,11.574 -11.39,11.358c-3.279,-0.114 -6.29,-1.657 -8.31,-4.264z"></path><path d="M35.139,38.167l-0.4,-2.967c2.592,-0.357 4.813,-1.919 6.026,-4.254c1.994,-3.837 0.4,-8.582 -3.345,-10.745l-7.918,-4.571l-10.55,6.033l-0.99,-1.726l11.765,-6.724c0.494,-0.282 1.101,-0.281 1.594,0.003l7.523,4.343c5.425,3.132 7.459,10.229 4.141,15.543c-1.737,2.784 -4.579,4.619 -7.846,5.065z"></path><path d="M41.839,21.437l-2.77,-1.137c0.987,-2.423 0.745,-5.128 -0.671,-7.346c-2.326,-3.645 -7.233,-4.638 -10.977,-2.476l-7.918,4.572l-0.05,12.153l-1.99,-0.006l0.059,-13.551c0.002,-0.569 0.307,-1.094 0.8,-1.379l7.523,-4.343c5.425,-3.132 12.588,-1.345 15.531,4.185c1.541,2.897 1.71,6.275 0.463,9.328z"></path></g></g>
      </svg>
    </div>
    <div id="agent-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-md shadow-md flex flex-col transition-all text-sm border border-gray-300">
      <div id="agent-header" class="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-md">
        <h3 class="m-0 text-lg">Agente externo GPT</h3>
        <button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div id="agent-messages" class="flex-1 p-4 overflow-y-auto"></div>
      <div id="agent-input-container" class="p-4 border-t border-gray-200">
        <div class="flex space-x-4 items-center">
          <input type="text" id="agent-input" class="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none w-3/4" placeholder="Escriba su prompt aquí...">
          <button id="agent-submit" class="bg-gray-800 text-white rounded-md px-4 py-2 cursor-pointer">Enviar</button>
        </div>
      </div>
    </div>
  `;

  // Utilidades
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // Posiciona el popup junto al bubble, sin salirse de pantalla
  function positionPopup() {
    const bubbleRect = agentBubble.getBoundingClientRect();
    const popupRect = agentPopup.getBoundingClientRect();
    const padding = 16;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    let popupX, popupY;

    if (bubbleRect.right + padding + popupRect.width <= winW) {
      // Derecha
      popupX = bubbleRect.right + padding;
      popupY = clamp(bubbleRect.top, padding, winH - popupRect.height - padding);
    } else if (bubbleRect.left - padding - popupRect.width >= 0) {
      // Izquierda
      popupX = bubbleRect.left - popupRect.width - padding;
      popupY = clamp(bubbleRect.top, padding, winH - popupRect.height - padding);
    } else if (bubbleRect.top - padding - popupRect.height >= 0) {
      // Arriba
      popupX = clamp(bubbleRect.left, padding, winW - popupRect.width - padding);
      popupY = bubbleRect.top - popupRect.height - padding;
    } else {
      // Abajo (por defecto)
      popupX = clamp(bubbleRect.left, padding, winW - popupRect.width - padding);
      popupY = bubbleRect.bottom + padding;
    }

    agentPopup.style.left = popupX + 'px';
    agentPopup.style.top = popupY + 'px';
    agentPopup.style.right = 'auto';
    agentPopup.style.bottom = 'auto';
  }

  // Elementos
  const agentInput = document.getElementById('agent-input');
  const agentSubmit = document.getElementById('agent-submit');
  const agentMessages = document.getElementById('agent-messages');
  const agentBubble = document.getElementById('agent-bubble');
  const agentPopup = document.getElementById('agent-popup');
  const closePopup = document.getElementById('close-popup');

  // Drag & Drop
  let isDragging = false, offsetX = 0, offsetY = 0, dragMoved = false;

  agentBubble.style.position = 'fixed';
  agentBubble.style.bottom = '40px';
  agentBubble.style.right = '40px';
  agentBubble.style.zIndex = 9999;

  agentPopup.style.position = 'fixed';
  agentPopup.style.right = '40px';
  agentPopup.style.bottom = '120px';
  agentPopup.style.zIndex = 9998;

  agentBubble.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragMoved = false;
    offsetX = e.clientX - agentBubble.getBoundingClientRect().left;
    offsetY = e.clientY - agentBubble.getBoundingClientRect().top;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    dragMoved = true;
    const bubbleW = agentBubble.offsetWidth;
    const bubbleH = agentBubble.offsetHeight;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const padding = 16;

    let x = clamp(e.clientX - offsetX, padding, winW - bubbleW - padding);
    let y = clamp(e.clientY - offsetY, padding, winH - bubbleH - padding);

    agentBubble.style.left = x + 'px';
    agentBubble.style.top = y + 'px';
    agentBubble.style.right = 'auto';
    agentBubble.style.bottom = 'auto';

    if (!agentPopup.classList.contains('hidden')) {
      positionPopup();
    }
  });

  document.addEventListener('mouseup', function () {
    if (isDragging && !dragMoved) {
      togglePopup();
      if (!agentPopup.classList.contains('hidden')) {
        positionPopup();
      }
    }
    isDragging = false;
    document.body.style.userSelect = '';
  });

  // Abrir/cerrar popup
  function togglePopup() {
    agentPopup.classList.toggle('hidden');
    if (!agentPopup.classList.contains('hidden')) {
      agentInput.focus();
      positionPopup();
    }
  }

  closePopup.addEventListener('click', function () {
    togglePopup();
  });

  // Enviar mensaje
  agentSubmit.addEventListener('click', function () {
    const message = agentInput.value.trim();
    if (!message) return;
    addUserMessage(message);
    agentInput.value = '';
    onUserRequest(message);
  });

  agentInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      agentSubmit.click();
    }
  });

  // Añade mensaje del usuario
  function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex justify-end mb-3';
    messageElement.innerHTML = `
      <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]">
        ${message}
      </div>
    `;
    agentMessages.appendChild(messageElement);
    agentMessages.scrollTop = agentMessages.scrollHeight;
  }

  // Añade respuesta del bot
  function reply(message) {
    const replyElement = document.createElement('div');
    replyElement.className = 'flex mb-3';
    replyElement.innerHTML = `
      <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
        ${message}
      </div>
    `;
    agentMessages.appendChild(replyElement);
    agentMessages.scrollTop = agentMessages.scrollHeight;
  }

  // Simula respuesta del bot
  function onUserRequest(message) {
    console.log('User request:', message);
    setTimeout(function () {

      const lowerMsg = message.toLowerCase();
      var countMainKeywords = 0;

      if (themeKeywords.some(keyword => lowerMsg.includes(keyword))) {
        countMainKeywords++;
        if (darkKeywords.some(keyword => lowerMsg.includes(keyword))) {
          mc.mutate('theme', 'dark');
          reply('OK, cambiando a fondo oscuro.');
        } else if (lightKeywords.some(keyword => lowerMsg.includes(keyword))) {
          mc.mutate('theme', 'light');
          reply('OK, cambiando a fondo claro.');
        }
        else{
          reply('No entendí el tema que quieres.');
        }
      }
      if (fontKeywords.some(keyword => lowerMsg.includes(keyword))) {
        countMainKeywords++;
        if (smallKeywords.some(keyword => lowerMsg.includes(keyword))) {
          mc.mutate('font_size', 'small');
          reply('OK, cambiando a tamaño de fuente pequeño.');
        } else if (largeKeywords.some(keyword => lowerMsg.includes(keyword))) {
          mc.mutate('font_size', 'big');
          reply('OK, cambiando a tamaño de fuente grande.');
        } else if (mediumKeywords.some(keyword => lowerMsg.includes(keyword))) {
          mc.mutate('font_size', 'default');
          reply('OK, cambiando a tamaño de fuente por defecto.');
        }else{
          reply('No entendí el tamaño de fuente que quieres.');
        }
      }
      if (languageKeywords.some(keyword => lowerMsg.includes(keyword))) {
        countMainKeywords++;
        if (enKeywords.some(keyword => lowerMsg.includes(keyword))) {
          mc.mutate('language', 'en');
          reply('OK, cambiando a idioma inglés.');
        } else if (esKeywords.some(keyword => lowerMsg.includes(keyword))) {
          mc.mutate('language', 'es');
          reply('OK, cambiando a idioma español.');
        }
        else{
          reply('No entendí el idioma que quieres.');
        }
      }
      if (countMainKeywords === 0) {
        reply('Lo siento, no entendí tu prompt. ZzZzZz...');
      }
    }, 1500);
  }
})();
