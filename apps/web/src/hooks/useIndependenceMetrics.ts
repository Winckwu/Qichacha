import { useQuery } from '@tanstack/react-query';
import { independenceApi } from '@/lib/api';
import type { IndependenceMetrics } from '@/types';

export function useIndependenceMetrics(userId: string = 'demo-user') {
  return useQuery<IndependenceMetrics>({
    queryKey: ['independence-metrics', userId],
    queryFn: () => independenceApi.getMetrics(userId),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
