// components/SafeHTML.tsx
'use client';

import { useEffect, useRef } from 'react';
import { sanitizeHTML, hasHTMLContent } from '@/lib/sanitize';

interface SafeHTMLProps {
  content: string;
  className?: string;
}

/**
 * Komponenta pro bezpečné zobrazení HTML obsahu
 * Automaticky rozpozná, zda jde o HTML nebo čistý text
 */
export default function SafeHTML({ content, className = '' }: SafeHTMLProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && hasHTMLContent(content)) {
      // HTML obsah - sanitizujeme a zobrazíme
      containerRef.current.innerHTML = sanitizeHTML(content);
    }
  }, [content]);

  // Pokud není HTML, zobrazíme jako běžný text
  if (!hasHTMLContent(content)) {
    return (
      <div className={className} style={{ whiteSpace: 'pre-wrap' }}>
        {content}
      </div>
    );
  }

  // HTML obsah
  return (
    <div 
      ref={containerRef}
      className={`prose prose-sm max-w-none ${className}`}
    />
  );
}