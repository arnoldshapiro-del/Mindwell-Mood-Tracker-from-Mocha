import { useState, useEffect } from 'react';
import { db } from '@/utils/db';

interface TrendData {
  entry_date: string;
  avg_mood: number;
  avg_anxiety: number;
  avg_energy: number;
  avg_sleep: number;
}

interface EmotionAnalytics {
  name: string;
  category: string;
  color: string;
  avg_intensity: number;
  frequency: number;
}

export function useAnalytics() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [emotionAnalytics, setEmotionAnalytics] = useState<EmotionAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [trendsData, emotionsData] = await Promise.all([
        db.getTrends(30),
        db.getEmotionAnalytics(30),
      ]);
      setTrends(trendsData);
      setEmotionAnalytics(emotionsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    trends,
    emotionAnalytics,
    loading,
    error,
    refresh: fetchAnalytics,
  };
}