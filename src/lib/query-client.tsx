
'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // * 24 HH
      staleTime: 1000 * 60 * 5, // 5 mm
    },
  },
});

function createWebStoragePersister() {
  if (typeof window !== 'undefined') {
    return createSyncStoragePersister({
      storage: window.localStorage,
      key: 'POKEMON_APP_QUERY_CACHE',
      throttleTime: 1000, // 1 ss.
    });
  }
  return null;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const persister = createWebStoragePersister();
  
  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }
  
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}