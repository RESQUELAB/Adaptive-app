$('#changeEsp').click('click', () => {mc.mutate('language', 'es')})
$('#changeEng').click('click', () => {mc.mutate('language', 'en')})

$('#infoShow').click('click', () => {mc.mutate('information', 'show')})
$('#infoPartial').click('click', () => {mc.mutate('information', 'partial')})
$('#infoHide').click('click', () => {mc.mutate('information', 'hide')})

$('#changeLight').click(() => { mc.mutate('theme', 'light')})
$('#changeDark').click( () => { mc.mutate('theme', 'dark') })
$('#changeContrast').click( () => { mc.mutate('theme', 'contrast') })

$('#font_size_small').click(() => { mc.mutate('font', 'small')})
$('#font_size_default').click( () => { mc.mutate('font', 'default') })
$('#font_size_big').click( () => { mc.mutate('font', 'big') })


// Catalog controls
if (document.location.pathname.indexOf("catalog.html") >= 0) {
    $('#catalogControls').attr('style', 'display: grid;')
    
    $('#catalog_grid1cols').click( () => {
        controller.setGridSize(1)
    })
    $('#catalog_grid2cols').click( () => {
        controller.setGridSize(2)
    })
    $('#catalog_grid3cols').click( () => {
        controller.setGridSize(3)
    })
    $('#catalog_grid4cols').click( () => {
        controller.setGridSize(4)
    })
    $('#catalog_grid5cols').click( () => {
        controller.setGridSize(5)
    })
}

// Si el panel no existe, créalo y añádelo dinámicamente
if (!document.getElementById('assistantSidebar')) {
  const adaptationDiv = document.getElementById('adaptation-center') || (() => {
    const div = document.createElement('div');
    div.id = 'adaptation-center';
    document.body.insertBefore(div, document.body.firstChild);
    return div;
  })();
  // Crear el contenedor del sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'assistant-sidebar';
  sidebar.id = 'assistantSidebar';
  sidebar.innerHTML = `
    <button class="minimize-btn" id="assistantMinimizeBtn" title="Minimizar/Expandir" aria-expanded="true">–</button>
    <div class="assistant-title">🛠️ Centro de Adaptación</div>
    <div class="assistant-content" id="assistantContent"></div>
  `;
  adaptationDiv.appendChild(sidebar);
}
window.initAdaptationCenter = function() {
  const sidebar = document.getElementById('assistantSidebar');
  const minBtn = document.getElementById('assistantMinimizeBtn');
  const content = document.getElementById('assistantContent');

  // Mantener grupo usuario fijo
  const userGroup = `<div class="assistant-group">
    <div class="assistant-group-title">Usuario</div>
    <input type="text" id="username" placeholder="Username" value="anonymous" />
    <input type="text" id="host" placeholder="Host" value="localhost" />
  </div>`;

  // Generar grupos y botones dinámicamente
  let dynamicGroups = '';
  if (typeof mc !== 'undefined' && mc.all_mutations) {
    const prettyNames = {
      theme: 'Tema',
      language: 'Idioma',
      information: 'Información',
      display: 'Catálogo',
      font_size: 'Tamaño de Fuente',
      menu_type: 'Tipo de Menú',
      category: 'Categoría',
    };
    const valueLabels = {
      light: 'Claro', dark: 'Oscuro', contrast: 'Alto Contraste',
      es: 'Español', en: 'English',
      show: 'Mostrar', partial: 'Parcial', hide: 'Ocultar',
      list: 'Lista', grid2: '2 Columnas', grid3: '3 Columnas', grid4: '4 Columnas', grid5: '5 Columnas',
      small: 'Pequeña', default: 'Normal', medium: 'Mediana', big: 'Grande',
      line: 'Línea', dropdown: 'Desplegable',
      sports: 'Deportes', courses: 'Cursos', trips: 'Viajes'
    };
    Object.entries(mc.all_mutations).forEach(([mutation, values]) => {
      let group = `<div class="assistant-group"><div class="assistant-group-title">${prettyNames[mutation]||mutation}</div>`;
      values.forEach(val => {
        const btnId = `${mutation}_${val}`;
        const label = valueLabels[val] || val;
        group += `<button id="${btnId}">${label}</button>`;
      });
      group += '</div>';
      dynamicGroups += group;
    });
  }
  if (content) content.innerHTML = userGroup + dynamicGroups;

  // Minimizar/expandir sidebar
  if (sidebar && minBtn && content) {
    minBtn.onclick = function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('minimized');
      const minimized = sidebar.classList.contains('minimized');
      minBtn.textContent = minimized ? '☰' : '–';
      minBtn.setAttribute('aria-expanded', !minimized);
      content.style.display = minimized ? 'none' : 'block';
    };
    sidebar.onclick = function(e) {
      if (sidebar.classList.contains('minimized') && e.target === sidebar) {
        sidebar.classList.remove('minimized');
        minBtn.textContent = '–';
        minBtn.setAttribute('aria-expanded', true);
        content.style.display = 'block';
      }
    };
  }
  // Adaptation actuators for mutations.js
  if (typeof mc !== 'undefined' && mc.all_mutations) {
    Object.entries(mc.all_mutations).forEach(([mutation, values]) => {
      values.forEach(val => {
        const btnId = `${mutation}_${val}`;
        const el = document.getElementById(btnId);
        if (el) el.onclick = () => mc.mutate(mutation, val);
      });
    });
  }
};
if (document.getElementById('assistantSidebar')) window.initAdaptationCenter();