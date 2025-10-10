import { useState, useEffect } from 'react';
import { db } from '@/utils/db';

interface Emotion {
  id: number;
  name: string;
  category: string;
  color: string;
}

export function useEmotions() {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmotions = async () => {
    try {
      setLoading(true);
      const data = await db.getAllEmotions();
      setEmotions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmotions();
  }, []);

  return {
    emotions,
    loading,
    error,
    refresh: fetchEmotions,
  };
}