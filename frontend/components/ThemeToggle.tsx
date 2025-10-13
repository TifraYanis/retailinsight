'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // évite le mismatch SSR/CSR

  const current = theme === 'system' ? systemTheme : theme;
  const next = current === 'dark' ? 'light' : 'dark';
  return (
    <button className="btn" onClick={() => setTheme(next || 'light')} title="Toggle theme">
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden md:inline">&nbsp;Theme</span>
    </button>
  );
}
