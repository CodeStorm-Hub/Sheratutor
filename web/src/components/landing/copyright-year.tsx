'use client';

import { useEffect, useState } from 'react';

/** Current year, computed client-side so the server shell stays deterministic. */
export function CopyrightYear() {
  const [year, setYear] = useState('');
  useEffect(() => setYear(String(new Date().getFullYear())), []);
  return <>{year}</>;
}
