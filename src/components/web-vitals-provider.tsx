'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export function WebVitalsProvider() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return null;
}
