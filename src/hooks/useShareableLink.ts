'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { UseFormReturn } from 'react-hook-form';

const customDebounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
};

export function useShareableLink<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldsToSync: (keyof T)[]
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // On mount, read from URL and set form values
  useEffect(() => {
    const stateParam = searchParams.get('s');
    if (stateParam) {
      try {
        const decodedState = JSON.parse(atob(stateParam));
        for (const key in decodedState) {
          if (fieldsToSync.includes(key as keyof T)) {
            const value = decodedState[key];
            if (value !== undefined) {
              form.setValue(key as any, value, { shouldValidate: true });
            }
          }
        }
      } catch (error) {
        console.error('Failed to parse shareable link state:', error);
      }
    }
  }, []); // Only on mount

  // Debounced function to update URL
  const updateUrl = useCallback(
    customDebounce((values: T) => {
      const stateToSync: Partial<T> = {};
      fieldsToSync.forEach(field => {
        stateToSync[field] = values[field];
      });

      const newParams = new URLSearchParams(searchParams.toString());
      if (Object.keys(stateToSync).length > 0) {
        const encodedState = btoa(JSON.stringify(stateToSync));
        newParams.set('s', encodedState);
      } else {
        newParams.delete('s');
      }
      
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, 500),
    [pathname, router, searchParams, fieldsToSync]
  );

  // Watch for form changes and update URL
  useEffect(() => {
    const subscription = form.watch((values) => {
      updateUrl(values as T);
    });
    return () => subscription.unsubscribe();
  }, [form, updateUrl]);
}
