/* ============================================================
   KERLIS & JORGE — Lógica de la invitación virtual
   ============================================================ */

/* ------------------------------------------------------------
   CONFIGURACIÓN — edita estos datos para personalizar
------------------------------------------------------------ */
const CONFIG = {
  nombres: 'Kerlis & Jorge',
  // Fecha y hora de la ceremonia (hora local de Colombia, -05:00)
  fechaBoda: '2026-11-14T16:00:00-05:00',
  // Fecha límite para confirmar asistencia
  fechaLimite: '14 de octubre de 2026',
  // Hashtag de Instagram del matrimonio
  hashtag: '#KerlisYJorge',
  // URLs de Google Forms (reemplaza con las tuyas)
  urlConfirmacion: 'https://docs.google.com/forms/d/e/1FAIpQLSe121pnEn1vJWi0Ts1Ufnj2gvvxPbE92F7mqGyVFumj3IGdlA/viewform?usp=header',
  urlMusica: 'https://docs.google.com/forms/d/e/1FAIpQLSe98DkMtf68TkztYTLjsrTZmW3LfXGm_2aeDq09kkfAtJ0yzw/viewform?usp=publish-editor',
  // Lugares
  lugares: [
    {
      tipo: 'Ceremonia',
      nombre: 'Iglesia de la Inmaculada Concepción',
      direccion: 'Cra. 7 # 45-30, Bogotá D.C., Colombia',
      maps: 'https://www.google.com/maps/search/?api=1&query=Iglesia+de+la+Inmaculada+Concepci%C3%B3n+Bogot%C3%A1',
      icono: 'assets/svg/icono-iglesia.svg'
    },
    {
      tipo: 'Recepción',
      nombre: 'Salón Hacienda San Rafael',
      direccion: 'Km 21 Vía La Calera, Bogotá D.C., Colombia',
      maps: 'https://www.google.com/maps/search/?api=1&query=Hacienda+San+Rafael+La+Calera',
      icono: 'assets/svg/icono-campana.svg'
    }
  ],
  // Itinerario: hora, título, nota
  itinerario: [
    { hora: '4:00 PM', titulo: 'Ceremonia', nota: 'Iglesia de la Inmaculada Concepción', icono: 'assets/svg/icono-iglesia.svg' },
    { hora: '5:00 PM', titulo: 'Recepción', nota: 'Acompáñanos a dar el primer brindis', icono: 'assets/svg/icono-campana.svg' },
    { hora: '5:30 PM', titulo: 'Photocal', nota: 'Capturamos juntos los primeros recuerdos', icono: 'assets/svg/icono-camara.svg' },
    { hora: '6:00 PM', titulo: 'Aperitivos', nota: 'Cóctel y música en vivo', icono: 'assets/svg/icono-copa.svg' },
    { hora: '7:00 PM', titulo: 'Comida', nota: 'Banquete para celebrar', icono: 'assets/svg/icono-comida.svg' },
    { hora: '9:00 PM', titulo: 'Pastel', nota: 'El dulce final de la velada', icono: 'assets/svg/icono-pastel.svg' }
  ]
};

/* ------------------------------------------------------------
   Renderizar itinerario y direcciones desde CONFIG
------------------------------------------------------------ */
function poblarItinerario() {
  const lista = document.getElementById('itinerario-lista');
  const pdfLista = document.getElementById('pdf-itinerario');
  if (!lista) return;

  lista.innerHTML = CONFIG.itinerario.map((item, i) => `
    <div class="itinerario-item reveal" style="--reveal-delay:${0.1 + i * 0.08}s">
      <div class="itinerario-icono"><img src="${item.icono}" alt="" aria-hidden="true"></div>
      <p class="itinerario-hora">${item.hora}</p>
      <h3 class="itinerario-titulo">${item.titulo}</h3>
      <p class="itinerario-nota">${item.nota}</p>
    </div>
  `).join('');

  if (pdfLista) {
    pdfLista.innerHTML = CONFIG.itinerario.map(item => `
      <div class="pdf-linea">
        <span class="hora">${item.hora}</span>
        <span class="dato"><strong>${item.titulo}</strong> — ${item.nota}</span>
      </div>
    `).join('');
  }

  // Volver a observar los nuevos elementos
  lista.querySelectorAll('.reveal').forEach(el => observadorItinerario.observe(el));
}

function poblarPdfDirecciones() {
  const contenedor = document.getElementById('pdf-direcciones');
  if (!contenedor) return;
  contenedor.innerHTML = CONFIG.lugares.map(lugar => `
    <p class="pdf-direccion">
      <span class="pdf-dir-tipo">${lugar.tipo}:</span>
      <span class="pdf-dir-nombre"> ${lugar.nombre}</span><br>
      <span class="pdf-dir-dir">${lugar.direccion}</span>
    </p>
  `).join('');
}

function poblarDirecciones() {
  const contenedor = document.getElementById('direcciones-contenedor');
  if (!contenedor) return;

  contenedor.innerHTML = CONFIG.lugares.map((lugar, i) => `
    <article class="tarjeta-lugar reveal" style="--reveal-delay:${0.1 + i * 0.15}s">
      <div class="lugar-ilustracion"><img src="${lugar.icono}" alt="" aria-hidden="true"></div>
      <p class="lugar-tipo">${lugar.tipo}</p>
      <h3 class="lugar-nombre">${lugar.nombre}</h3>
      <p class="lugar-direccion">${lugar.direccion}</p>
      <a class="boton" href="${lugar.maps}" target="_blank" rel="noopener" data-enlace="maps" data-url="${lugar.maps}">
        <img src="assets/svg/icono-ubicacion.svg" alt="" aria-hidden="true">
        Cómo llegar
      </a>
    </article>
  `).join('');

  contenedor.querySelectorAll('.reveal').forEach(el => observadorItinerario.observe(el));
}

/* ------------------------------------------------------------
   Datos del invitado desde la URL (query params)
------------------------------------------------------------ */
const params = new URLSearchParams(window.location.search);
const invitado = {
  nombre: (params.get('nombre') || '').trim(),
  cupos: (params.get('cupos') || '').trim(),
  mesa: (params.get('mesa') || '').trim()
};

const nombreFormateado = invitado.nombre
  ? invitado.nombre.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  : '';

/* ------------------------------------------------------------
   Overlay del sobre
------------------------------------------------------------ */
const overlay = document.getElementById('overlay');
const sobre = document.getElementById('sobre');
let overlayAbierto = false;

function abrirOverlay() {
  if (overlayAbierto) return;
  overlayAbierto = true;
  overlay.classList.add('abriendo');

  // Reproducir el video al revelar la página (si ya se agregó un source)
  const video = document.getElementById('video-boda');
  if (video && video.querySelector('source')) {
    video.play().catch(() => { /* el navegador puede bloquearlo; el usuario puede dar play */ });
    const placeholder = document.getElementById('video-placeholder');
    if (placeholder) placeholder.classList.add('oculto');
  }

  setTimeout(() => overlay.classList.add('abierto'), 1100);
  document.body.style.overflow = '';

  // Mostrar el indicador de scroll
  indicadorScroll.classList.remove('oculto');
  indicadorScroll.classList.add('visible');
}

/* ------------------------------------------------------------
   Indicador de scroll hacia abajo
------------------------------------------------------------ */
const indicadorScroll = document.getElementById('indicador-scroll');

function ocultarIndicador() {
  indicadorScroll.classList.add('oculto');
  indicadorScroll.classList.remove('visible');
}

if (indicadorScroll) {
  indicadorScroll.addEventListener('click', () => {
    // Salto a la siguiente sección (descripción)
    const siguiente = document.querySelector('.seccion-descripcion');
    if (siguiente) {
      siguiente.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    ocultarIndicador();
  });
  indicadorScroll.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      indicadorScroll.click();
    }
  });

  // Ocultar si el usuario hace scroll manual
  let scrollManual = false;
  window.addEventListener('scroll', () => {
    if (!scrollManual && window.scrollY > window.innerHeight * 0.4) {
      scrollManual = true;
      ocultarIndicador();
    }
  }, { passive: true });
}

if (sobre) {
  sobre.addEventListener('click', abrirOverlay);
  sobre.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirOverlay(); }
  });
  sobre.setAttribute('tabindex', '0');
  sobre.setAttribute('role', 'button');
  sobre.setAttribute('aria-label', 'Abrir invitación');
}

// Bloquear scroll mientras el overlay está visible
document.body.style.overflow = 'hidden';

// Rellenar datos del invitado
if (nombreFormateado) {
  document.querySelectorAll('[data-campo="nombre"]').forEach(el => { el.textContent = nombreFormateado; });
}
if (invitado.cupos) {
  document.querySelectorAll('[data-campo="cupos"]').forEach(el => { el.textContent = invitado.cupos; });
}
if (invitado.mesa) {
  document.querySelectorAll('[data-campo="mesa"]').forEach(el => { el.textContent = invitado.mesa; });
}

// Aviso si la invitación no viene personalizada
if (!nombreFormateado) {
  const aviso = document.getElementById('aviso-sin-nombre');
  if (aviso) aviso.style.display = 'block';
}

/* ------------------------------------------------------------
   Temporizador regresivo
------------------------------------------------------------ */
const fechaBoda = new Date(CONFIG.fechaBoda);
const contadorEl = document.getElementById('contador');

function pad(n) { return String(n).padStart(2, '0'); }

function actualizarContador() {
  const ahora = new Date();
  const destino = new Date(fechaBoda);
  let diff = Math.max(0, destino - ahora);

  const dias = Math.floor(diff / 86400000);
  diff -= dias * 86400000;
  const horas = Math.floor(diff / 3600000);
  diff -= horas * 3600000;
  const minutos = Math.floor(diff / 60000);
  diff -= minutos * 60000;
  const segundos = Math.floor(diff / 1000);

  const nums = contadorEl.querySelectorAll('.contador-numero');
  if (nums.length === 4) {
    nums[0].textContent = dias;
    nums[1].textContent = pad(horas);
    nums[2].textContent = pad(minutos);
    nums[3].textContent = pad(segundos);
  }

  const final = document.getElementById('contador-final');
  if (final && destino - ahora <= 0) {
    final.textContent = '¡Hoy es el día! ¡Nos casamos!';
  }
}

if (contadorEl) {
  actualizarContador();
  setInterval(actualizarContador, 1000);
}

/* ------------------------------------------------------------
   Animaciones de aparición al hacer scroll
------------------------------------------------------------ */
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

const observadorItinerario = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
      observadorItinerario.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-flor').forEach(el => observador.observe(el));

// Pintar itinerario y direcciones dinámicos
poblarItinerario();
poblarDirecciones();
poblarPdfDirecciones();

/* ------------------------------------------------------------
   Botones de Google Forms y Maps
------------------------------------------------------------ */
document.querySelectorAll('[data-enlace="confirmar"]').forEach(b => {
  b.addEventListener('click', () => window.open(CONFIG.urlConfirmacion, '_blank', 'noopener'));
});
document.querySelectorAll('[data-enlace="musica"]').forEach(b => {
  b.addEventListener('click', () => window.open(CONFIG.urlMusica, '_blank', 'noopener'));
});
document.querySelectorAll('[data-enlace="maps"]').forEach(b => {
  b.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(b.dataset.url, '_blank', 'noopener');
  });
});

/* ------------------------------------------------------------
   Descarga de PDF personalizado
------------------------------------------------------------ */
const botonPdf = document.getElementById('boton-pdf');

function escaparPdf(texto) {
  return String(texto).replace(/[^\x20-\x7E\xC0-\xFF]/g, '');
}

function generarPdf() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('No se pudo cargar la librería de PDF. Revisa tu conexión a internet.');
    return;
  }
  if (typeof html2canvas !== 'function') {
    alert('No se pudo cargar la librería de captura. Revisa tu conexión a internet.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const plantilla = document.getElementById('pdf-template');

  botonPdf.disabled = true;
  botonPdf.textContent = 'Generando PDF…';

  html2canvas(plantilla, { scale: 2, useCORS: true, backgroundColor: '#faf6ef' })
    .then(canvas => {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const ancho = 210;
      const alto = (canvas.height * ancho) / canvas.width;
      const img = canvas.toDataURL('image/jpeg', 0.92);
      pdf.addImage(img, 'JPEG', 0, 0, ancho, alto);
      const nombreArchivo = nombreFormateado
        ? `Invitacion-KerlisYJorge-${nombreFormateado.replace(/\s+/g, '-')}.pdf`
        : 'Invitacion-KerlisYJorge.pdf';
      pdf.save(nombreArchivo);
    })
    .catch(() => {
      alert('Ocurrió un error al generar el PDF. Inténtalo de nuevo.');
    })
    .finally(() => {
      botonPdf.disabled = false;
      botonPdf.textContent = 'Descargar invitación en PDF';
    });
}

if (botonPdf) botonPdf.addEventListener('click', generarPdf);
