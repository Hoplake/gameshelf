'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Package, Copy, Check } from 'lucide-react';

interface MoveToGameshelfButtonProps {
  slug: string;
  title: string;
}

export function MoveToGameshelfButton({ slug, title }: MoveToGameshelfButtonProps) {
  const [commandCopied, setCommandCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Check if we're running on localhost (development)
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.startsWith('192.168.') ||
       window.location.hostname.startsWith('10.0.'));
    setIsDevelopment(isLocalhost);
  }, []);

  const command = `node scripts/move-to-gameshelf.js ${slug}`;

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCommandCopied(true);
      setTimeout(() => setCommandCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  const handleMove = () => {
    if (!confirm(`Haluatko varmasti siirtää pelin "${title}" kokoelmaan?\n\nKoska sivusto käyttää staattista exportia, sinun täytyy suorittaa komento komentoriviltä.`)) {
      return;
    }
    setShowInstructions(true);
  };

  if (showInstructions) {
    return (
      <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Siirrä peli kokoelmaan komentoriviltä:
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
            {command}
          </code>
          <Button
            onClick={handleCopyCommand}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            {commandCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Kopioi komento leikepöydälle ja suorita se projektin juurikansiossa.
        </p>
        <Button
          onClick={() => setShowInstructions(false)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Sulje
        </Button>
      </div>
    );
  }

  // Don't show the button in production
  if (!isDevelopment) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleMove}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0"
      >
        <Package className="h-4 w-4 mr-2" />
        Siirrä kokoelmaan
      </Button>
    </div>
  );
}
