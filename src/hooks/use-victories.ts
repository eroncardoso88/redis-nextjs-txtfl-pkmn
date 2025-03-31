import { apiClient } from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Victory {
  id: number;
  userId: string;
  pokemonName: string;
  count: number;
  lastDefeated: string;
}

interface VictorySummary {
  victories: Victory[];
  totalVictories: number;
  uniquePokemonDefeated: number;
}

interface RecordVictoryResponse {
  success: boolean;
  message: string;
  count?: number;
  victory?: Victory;
}

export function useVictories() {
  return useQuery<VictorySummary>({
    queryKey: ['victories'],
    queryFn: () => apiClient.get('/user/victory'),
  });
}

export function useRecordVictory() {
  const queryClient = useQueryClient();
  
  return useMutation<RecordVictoryResponse, Error, { pokemonName: string }>({
    mutationFn: (data) => apiClient.post('/user/victory', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['victories'] });
    },
  });
}