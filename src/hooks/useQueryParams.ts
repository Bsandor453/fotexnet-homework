'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParams.get(key) || null;

  const setParams = (params: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    router.replace(`?${newParams.toString()}`);
  };

  return { getParam, setParams };
}
