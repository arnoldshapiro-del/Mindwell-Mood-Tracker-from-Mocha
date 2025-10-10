import { useState, useEffect } from 'react';

interface TrendData {
  entry_date: string;
  avg_mood: number;
  avg_anxiety: number;
  avg_energy: number;
  avg_sleep: number;
}

export function useAnalytics() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/trends');
      if (!response.ok) throw new Error('Failed to fetch trends');
      const data = await response.json();
      setTrends(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return {
    trends,
    loading,
    error,
    refresh: fetchTrends,
  };
}
