import { useState, useEffect } from 'react';
import { MoodEntry, CreateMoodEntrySchema } from '@/shared/types';
import { db } from '@/utils/db';

export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await db.getAllMoodEntries();
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
      const newEntry = await db.createMoodEntry(validatedData);
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  const updateEntry = async (id: number, entryData: any) => {
    try {
      const validatedData = CreateMoodEntrySchema.parse(entryData);
      const updatedEntry = await db.updateMoodEntry(id, validatedData);
      setEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry));
      return updatedEntry;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      await db.deleteMoodEntry(id);
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