"use strict";

const grupos = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?~"
};
const campoPassword = document.getElementById("password");
const longitud = document.getElementById("length");
const botonCopiar = document.getElementById("copy-button");
const mensaje = document.getElementById("message");
let copiaEnCurso = false;

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.classList.toggle("error", esError);
}

function actualizarLongitud() {
  document.getElementById("length-value").value = longitud.value;
  const progreso = ((Number(longitud.value) - 6) / (32 - 6)) * 100;
  longitud.style.setProperty("--range-progress", `${progreso}%`);
  mostrarMensaje("Configuración actualizada. Pulsa Generar contraseña para aplicarla.");
}

// El rechazo de valores sobrantes evita el sesgo de usar solamente el módulo.
function indiceAleatorio(limite) {
  const valor = new Uint32Array(1);
  const maximo = 2 ** 32 - (2 ** 32 % limite);
  do {
    globalThis.crypto.getRandomValues(valor);
  } while (valor[0] >= maximo);
  return valor[0] % limite;
}

function evaluarSeguridad(password) {
  const tiposPresentes = Object.values(grupos).filter(grupo =>
    Array.from(password).some(caracter => grupo.includes(caracter))
  );
  const variedad = tiposPresentes.reduce((total, grupo) => total + grupo.length, 0);
  // Estimación orientativa; se limita la puntuación de claves cortas.
  const bits = password.length * Math.log2(variedad || 1);
  let nivel = bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
  if (password.length < 8) nivel = 1;
  else if (password.length < 12) nivel = Math.min(nivel, 2);
  const etiquetas = ["Débil", "Media", "Fuerte", "Muy fuerte"];
  const colores = ["#ff9389", "#efc56b", "#b4dc85", "#c2f28a"];
  document.getElementById("strength-label").textContent = etiquetas[nivel - 1];
  document.querySelector(".result-panel").style.setProperty("--strength", colores[nivel - 1]);
  document.getElementById("strength-bar").style.width = `${nivel * 25}%`;
  const medidor = document.getElementById("strength-meter");
  medidor.setAttribute("aria-valuenow", String(nivel));
  medidor.setAttribute("aria-valuetext", etiquetas[nivel - 1]);
  return nivel;
}

function generarPassword(evento) {
  if (evento) evento.preventDefault();
  const seleccionados = Object.entries(grupos)
    .filter(([id]) => document.getElementById(id).checked)
    .map(([, caracteres]) => caracteres);

  if (!seleccionados.length) {
    mostrarMensaje("Selecciona al menos un tipo de carácter", true);
    return;
  }
  if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
    mostrarMensaje("Este navegador no permite generar claves de forma segura. Usa un navegador actualizado.", true);
    return;
  }

  const cantidad = Number(longitud.value);
  const conjunto = seleccionados.join("");
  let caracteres;
  // Repetir hasta incluir todos los tipos mantiene uniforme la selección
  // entre las contraseñas válidas, sin posiciones predecibles.
  do {
    caracteres = Array.from({ length: cantidad }, () => conjunto[indiceAleatorio(conjunto.length)]);
  } while (!seleccionados.every(grupo => caracteres.some(caracter => grupo.includes(caracter))));

  campoPassword.value = caracteres.join("");
  campoPassword.classList.toggle("long", cantidad > 20);
  botonCopiar.disabled = copiaEnCurso;
  evaluarSeguridad(campoPassword.value);
  mostrarMensaje(evento ? "Nueva contraseña generada." : "");
}

function copiarConSeleccion() {
  // Compatibilidad al abrir index.html directamente o sin Clipboard API.
  const focoAnterior = document.activeElement;
  campoPassword.focus();
  campoPassword.select();
  campoPassword.setSelectionRange(0, campoPassword.value.length);
  let copiado = false;
  try {
    copiado = document.execCommand("copy");
  } catch {
    copiado = false;
  }
  if (copiado) {
    campoPassword.setSelectionRange(0, 0);
    if (focoAnterior) focoAnterior.focus();
  }
  return copiado;
}

async function copiarPassword() {
  if (!campoPassword.value || copiaEnCurso) return;
  copiaEnCurso = true;
  botonCopiar.disabled = true;
  const passwordACopiar = campoPassword.value;
  let copiado = false;
  try {
    if (navigator.clipboard && globalThis.isSecureContext) {
      await navigator.clipboard.writeText(passwordACopiar);
      copiado = true;
    } else {
      copiado = copiarConSeleccion();
    }
  } catch {
    // Si la clave cambió durante el permiso, no copiar otra silenciosamente.
    if (campoPassword.value === passwordACopiar) copiado = copiarConSeleccion();
  } finally {
    copiaEnCurso = false;
    botonCopiar.disabled = !campoPassword.value;
  }
  if (campoPassword.value !== passwordACopiar) {
    mostrarMensaje("La contraseña cambió durante la copia. Vuelve a pulsar Copiar contraseña.", true);
    return;
  }
  mostrarMensaje(copiado
    ? "Contraseña copiada correctamente"
    : "No se pudo copiar automáticamente. Selecciona la contraseña y cópiala manualmente.", !copiado);
}

document.getElementById("generator-form").addEventListener("submit", generarPassword);
botonCopiar.addEventListener("click", copiarPassword);
longitud.addEventListener("input", actualizarLongitud);
Object.keys(grupos).forEach(id => {
  document.getElementById(id).addEventListener("change", () => {
    mostrarMensaje("Configuración actualizada. Pulsa Generar contraseña para aplicarla.");
  });
});
actualizarLongitud();
generarPassword();
