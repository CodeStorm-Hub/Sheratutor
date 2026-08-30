'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/** Live social-proof line — client island; stays hidden until a real count loads. */
export function StudentCount({ lang }: { lang: 'bn' | 'en' }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { count: c } = await supabase
          .from('student_profiles')
          .select('*', { count: 'exact', head: true });
        if (c !== null && c > 0) setCount(c);
      } catch {
        /* leave hidden */
      }
    })();
  }, []);

  if (count === null) return null;

  return (
    <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
      <span className="size-2 animate-pulse rounded-full bg-mint" />
      <span>
        <strong className="font-bold text-foreground">
          {count.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}+
        </strong>{' '}
        {lang === 'bn' ? 'জন শিক্ষার্থী ইতিমধ্যে যুক্ত হয়েছে' : 'students already practicing'}
      </span>
    </div>
  );
}
