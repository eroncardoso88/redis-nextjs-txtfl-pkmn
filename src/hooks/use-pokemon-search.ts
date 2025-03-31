import { useDebounce } from '@/hooks/use-debounce';
import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export interface PokemonSearchResult {
  id: number;
  name: string;
}

export function usePokemonSearch(searchTerm: string) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [shouldFetch, setShouldFetch] = useState(false);
  
useEffect(() => {
    setShouldFetch(debouncedSearchTerm.length >= 3);
  }, [debouncedSearchTerm]);
  
  return useQuery({
    queryKey: ['pokemon-search', debouncedSearchTerm],
    queryFn: async () => {
      const response = await apiClient.get<PokemonSearchResult[]>(`/pokemon/search?q=${debouncedSearchTerm}`);
      return response;
    },
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5, // 5mm
  });
}