/* ============================================================
   KERLIS & JORGE — Vista del invitador (generador de links)
   ============================================================ */

const form = document.getElementById('form-invitador');
const resultado = document.getElementById('link-generado');
const inputLink = document.getElementById('input-link');
const botonCopiar = document.getElementById('boton-copiar');
const avisoCopiado = document.getElementById('copiado-aviso');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('campo-nombre').value.trim();
  const cupos = document.getElementById('campo-cupos').value.trim();
  const mesa = document.getElementById('campo-mesa').value.trim();

  if (!nombre) {
    document.getElementById('campo-nombre').focus();
    return;
  }

  const base = window.location.origin + window.location.pathname.replace(/index\.html$/, '') + 'invitacion.html';
  const query = new URLSearchParams();
  query.set('nombre', nombre);
  if (cupos) query.set('cupos', cupos);
  if (mesa) query.set('mesa', mesa);
  if (document.getElementById('campo-participante').checked) query.set('participante', 'true');

  const url = `${base}?${query.toString()}`;
  inputLink.value = url;
  resultado.classList.add('visible');
  avisoCopiado.classList.remove('visible');
  resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

botonCopiar.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(inputLink.value);
  } catch {
    inputLink.select();
    document.execCommand('copy');
  }
  avisoCopiado.classList.add('visible');
  setTimeout(() => avisoCopiado.classList.remove('visible'), 2200);
});
