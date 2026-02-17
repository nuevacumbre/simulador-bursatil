// src/utils/sanitize.js
import DOMPurify from 'dompurify'

// Configuración de DOMPurify (opcional)
DOMPurify.setConfig({
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'], // etiquetas permitidas
  ALLOWED_ATTR: ['href', 'title', 'target'], // atributos permitidos
  FORBID_TAGS: ['script', 'style', 'iframe'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick'],
})

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim())
  }
  return input
}

export const sanitizeObject = (obj) => {
  const sanitized = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = sanitizeInput(obj[key])
    }
  }
  return sanitized
}

// Para sanitizar HTML directamente
export const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html)
}
