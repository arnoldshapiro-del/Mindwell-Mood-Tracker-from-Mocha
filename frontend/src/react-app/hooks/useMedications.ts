import { useState, useEffect } from 'react';
import { db } from '@/utils/db';

interface Medication {
  id?: number;
  name: string;
  dosage?: string;
  frequency?: string;
  is_active: boolean;
}

interface MedicationLog {
  id?: number;
  medication_id: number;
  taken_at: string;
  notes?: string;
  medication_name?: string;
}

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await db.getAllMedications();
      setMedications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const data = await db.getAllMedicationLogs();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const createMedication = async (data: Medication) => {
    try {
      const newMed = await db.createMedication(data);
      setMedications(prev => [...prev, newMed].sort((a, b) => a.name.localeCompare(b.name)));
      return newMed;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  const createLog = async (data: MedicationLog) => {
    try {
      const newLog = await db.createMedicationLog(data);
      setLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  useEffect(() => {
    fetchMedications();
    fetchLogs();
  }, []);

  return {
    medications,
    logs,
    loading,
    error,
    createMedication,
    createLog,
    refresh: () => {
      fetchMedications();
      fetchLogs();
    },
  };
}