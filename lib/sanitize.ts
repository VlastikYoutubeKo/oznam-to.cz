// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

// Konfigurace pro povolené HTML tagy a atributy
const sanitizeConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3',
    'ul', 'ol', 'li', 'blockquote', 'a', 'code', 'pre'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
};

/**
 * Bezpečně vyčistí HTML obsah od nebezpečných tagů a skriptů
 * Funguje jak v browseru, tak na serveru (díky isomorphic-dompurify)
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, sanitizeConfig);
}

/**
 * Zkontroluje, jestli obsah obsahuje HTML tagy
 */
export function hasHTMLContent(content: string): boolean {
  return /<[^>]+>/.test(content);
}