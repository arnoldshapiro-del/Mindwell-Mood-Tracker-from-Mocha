import { useState, useEffect } from 'react';
import { MoodEntry, CreateMoodEntrySchema } from '@/shared/types';

export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mood-entries');
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: any) => {
    try {
      const validatedData = CreateMoodEntrySchema.parse(entryData);
      const response = await fetch('/api/mood-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });
      if (!response.ok) throw new Error('Failed to create entry');
      const newEntry = await response.json();
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  const updateEntry = async (id: number, entryData: any) => {
    try {
      const validatedData = CreateMoodEntrySchema.parse(entryData);
      const response = await fetch(`/api/mood-entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });
      if (!response.ok) throw new Error('Failed to update entry');
      const updatedEntry = await response.json();
      setEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry));
      return updatedEntry;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/mood-entries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete entry');
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refresh: fetchEntries,
  };
}
