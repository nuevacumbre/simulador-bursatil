// src/utils/sanitize.js
// Podemos usar nuestra librería o funciones nativas. Usaremos la librería instalada.

import VueSanitizeEscape from 'vue-sanitize-escape';

// Creamos una instancia del sanitizador (asumiendo que no está global por algún motivo)
// O simplemente, usamos el método que nos provee el plugin. Como lo tenemos instalado globalmente,
// podemos crear una función que lo use internamente.

// Esta función es una capa de abstracción. Si en el futuro cambiamos de librería,
// solo cambiamos esta función.
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Usamos un método simple de escape. Para una sanitización más profunda (eliminar etiquetas),
    // podríamos necesitar una función más compleja, pero para empezar, escapar es seguro.
    // Nota: VueSanitizeEscape tiene un método .escape(). Asumimos que está disponible.
    // Como la instanciación global puede ser complicada aquí, por ahora, lo haremos con lógica nativa
    // para que el código sea 100% funcional sin depender de la instancia del plugin.
    // *** Alternativa segura y nativa: ***
    const div = document.createElement('div');
    div.textContent = input; // textContent asigna el texto como texto plano, no como HTML.
    return div.innerHTML;     // innerHTML devuelve una versión escapada del texto.
  }
  return input;
};

// Para limpiar objetos completos (útil para formularios grandes)
export const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = sanitizeInput(obj[key]);
    }
  }
  return sanitized;
};