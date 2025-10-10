import { EMOTIONS_DATA } from './emotions-data';

const DB_NAME = 'MindwellDB';
const DB_VERSION = 1;

// IndexedDB wrapper for Mindwell Mood Tracker
class MindwellDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create mood_entries store
        if (!db.objectStoreNames.contains('mood_entries')) {
          const moodStore = db.createObjectStore('mood_entries', { keyPath: 'id', autoIncrement: true });
          moodStore.createIndex('entry_date', 'entry_date', { unique: false });
          moodStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // Create emotions store
        if (!db.objectStoreNames.contains('emotions')) {
          const emotionStore = db.createObjectStore('emotions', { keyPath: 'id' });
          emotionStore.createIndex('category', 'category', { unique: false });
          emotionStore.createIndex('name', 'name', { unique: false });
        }

        // Create mood_entry_emotions store (junction table)
        if (!db.objectStoreNames.contains('mood_entry_emotions')) {
          const meeStore = db.createObjectStore('mood_entry_emotions', { keyPath: 'id', autoIncrement: true });
          meeStore.createIndex('mood_entry_id', 'mood_entry_id', { unique: false });
          meeStore.createIndex('emotion_id', 'emotion_id', { unique: false });
        }

        // Create medications store
        if (!db.objectStoreNames.contains('medications')) {
          const medStore = db.createObjectStore('medications', { keyPath: 'id', autoIncrement: true });
          medStore.createIndex('is_active', 'is_active', { unique: false });
        }

        // Create medication_logs store
        if (!db.objectStoreNames.contains('medication_logs')) {
          const logStore = db.createObjectStore('medication_logs', { keyPath: 'id', autoIncrement: true });
          logStore.createIndex('medication_id', 'medication_id', { unique: false });
          logStore.createIndex('taken_at', 'taken_at', { unique: false });
        }

        // Create activities store
        if (!db.objectStoreNames.contains('activities')) {
          const actStore = db.createObjectStore('activities', { keyPath: 'id', autoIncrement: true });
          actStore.createIndex('category', 'category', { unique: false });
        }

        // Create mood_entry_activities store
        if (!db.objectStoreNames.contains('mood_entry_activities')) {
          const meaStore = db.createObjectStore('mood_entry_activities', { keyPath: 'id', autoIncrement: true });
          meaStore.createIndex('mood_entry_id', 'mood_entry_id', { unique: false });
        }
      };
    });
  }

  async seedEmotions(): Promise<void> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction('emotions', 'readwrite');
    const store = tx.objectStore('emotions');
    
    // Check if emotions already exist
    const count = await new Promise<number>((resolve) => {
      const countRequest = store.count();
      countRequest.onsuccess = () => resolve(countRequest.result);
    });

    if (count === 0) {
      // Seed all 56 emotions
      for (const emotion of EMOTIONS_DATA) {
        store.add({
          ...emotion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Mood Entries CRUD
  async getAllMoodEntries(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('mood_entries', 'readonly');
      const store = tx.objectStore('mood_entries');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const entries = request.result.sort((a, b) => {
          const dateCompare = new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime();
          if (dateCompare !== 0) return dateCompare;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        resolve(entries.slice(0, 100));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getMoodEntry(id: number): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('mood_entries', 'readonly');
      const store = tx.objectStore('mood_entries');
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async createMoodEntry(data: any): Promise<any> {
    if (!this.db) await this.init();
    
    const now = new Date().toISOString();
    const entry = {
      ...data,
      created_at: now,
      updated_at: now,
    };

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('mood_entries', 'readwrite');
      const store = tx.objectStore('mood_entries');
      const request = store.add(entry);
      
      request.onsuccess = () => {
        resolve({ ...entry, id: request.result });
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateMoodEntry(id: number, data: any): Promise<any> {
    if (!this.db) await this.init();
    
    const entry = await this.getMoodEntry(id);
    if (!entry) throw new Error('Entry not found');

    const updated = {
      ...entry,
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('mood_entries', 'readwrite');
      const store = tx.objectStore('mood_entries');
      const request = store.put(updated);
      
      request.onsuccess = () => resolve(updated);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteMoodEntry(id: number): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('mood_entries', 'readwrite');
      const store = tx.objectStore('mood_entries');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Emotions CRUD
  async getAllEmotions(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('emotions', 'readonly');
      const store = tx.objectStore('emotions');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const emotions = request.result.sort((a, b) => {
          const catCompare = a.category.localeCompare(b.category);
          if (catCompare !== 0) return catCompare;
          return a.name.localeCompare(b.name);
        });
        resolve(emotions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Mood Entry Emotions CRUD
  async getMoodEntryEmotions(moodEntryId: number): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise(async (resolve, reject) => {
      const tx = this.db!.transaction(['mood_entry_emotions', 'emotions'], 'readonly');
      const meeStore = tx.objectStore('mood_entry_emotions');
      const emotionStore = tx.objectStore('emotions');
      const index = meeStore.index('mood_entry_id');
      const request = index.getAll(moodEntryId);
      
      request.onsuccess = async () => {
        const entries = request.result;
        const withDetails = await Promise.all(
          entries.map(async (entry) => {
            const emotion = await new Promise<any>((res) => {
              const req = emotionStore.get(entry.emotion_id);
              req.onsuccess = () => res(req.result);
            });
            return { ...entry, ...(emotion || {}) };
          })
        );
        resolve(withDetails);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async createMoodEntryEmotion(data: any): Promise<any> {
    if (!this.db) await this.init();
    
    const now = new Date().toISOString();
    const entry = {
      ...data,
      created_at: now,
      updated_at: now,
    };

    return new Promise(async (resolve, reject) => {
      const tx = this.db!.transaction(['mood_entry_emotions', 'emotions'], 'readwrite');
      const meeStore = tx.objectStore('mood_entry_emotions');
      const emotionStore = tx.objectStore('emotions');
      const request = meeStore.add(entry);
      
      request.onsuccess = async () => {
        const emotion = await new Promise<any>((res) => {
          const req = emotionStore.get(entry.emotion_id);
          req.onsuccess = () => res(req.result);
        });
        resolve({ ...entry, id: request.result, ...(emotion || {}) });
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Medications CRUD
  async getAllMedications(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('medications', 'readonly');
      const store = tx.objectStore('medications');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const meds = request.result
          .filter((med: any) => med.is_active === true)
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        resolve(meds);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async createMedication(data: any): Promise<any> {
    if (!this.db) await this.init();
    
    const now = new Date().toISOString();
    const med = {
      ...data,
      created_at: now,
      updated_at: now,
    };

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('medications', 'readwrite');
      const store = tx.objectStore('medications');
      const request = store.add(med);
      
      request.onsuccess = () => resolve({ ...med, id: request.result });
      request.onerror = () => reject(request.error);
    });
  }

  // Medication Logs CRUD
  async getAllMedicationLogs(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise(async (resolve, reject) => {
      const tx = this.db!.transaction(['medication_logs', 'medications'], 'readonly');
      const logStore = tx.objectStore('medication_logs');
      const medStore = tx.objectStore('medications');
      const request = logStore.getAll();
      
      request.onsuccess = async () => {
        const logs = request.result;
        const withMeds = await Promise.all(
          logs.map(async (log) => {
            const med = await new Promise((res) => {
              const req = medStore.get(log.medication_id);
              req.onsuccess = () => res(req.result);
            });
            return { ...log, medication_name: (med as any)?.name };
          })
        );
        const sorted = withMeds.sort((a, b) => 
          new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime()
        );
        resolve(sorted.slice(0, 100));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async createMedicationLog(data: any): Promise<any> {
    if (!this.db) await this.init();
    
    const now = new Date().toISOString();
    const log = {
      ...data,
      created_at: now,
      updated_at: now,
    };

    return new Promise(async (resolve, reject) => {
      const tx = this.db!.transaction(['medication_logs', 'medications'], 'readwrite');
      const logStore = tx.objectStore('medication_logs');
      const medStore = tx.objectStore('medications');
      const request = logStore.add(log);
      
      request.onsuccess = async () => {
        const med = await new Promise((res) => {
          const req = medStore.get(log.medication_id);
          req.onsuccess = () => res(req.result);
        });
        resolve({ ...log, id: request.result, medication_name: (med as any)?.name });
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Analytics queries
  async getTrends(days: number = 30): Promise<any[]> {
    if (!this.db) await this.init();
    
    const entries = await this.getAllMoodEntries();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filtered = entries.filter(e => new Date(e.entry_date) >= cutoffDate);
    
    // Group by date
    const grouped = filtered.reduce((acc, entry) => {
      const date = entry.entry_date;
      if (!acc[date]) {
        acc[date] = { entry_date: date, moods: [], anxieties: [], energies: [], sleeps: [] };
      }
      acc[date].moods.push(entry.mood_level);
      acc[date].anxieties.push(entry.anxiety_level);
      acc[date].energies.push(entry.energy_level);
      acc[date].sleeps.push(entry.sleep_quality);
      return acc;
    }, {} as any);

    return Object.values(grouped).map((g: any) => ({
      entry_date: g.entry_date,
      avg_mood: g.moods.reduce((a: number, b: number) => a + b, 0) / g.moods.length,
      avg_anxiety: g.anxieties.reduce((a: number, b: number) => a + b, 0) / g.anxieties.length,
      avg_energy: g.energies.reduce((a: number, b: number) => a + b, 0) / g.energies.length,
      avg_sleep: g.sleeps.reduce((a: number, b: number) => a + b, 0) / g.sleeps.length,
    })).sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  }

  async getEmotionAnalytics(days: number = 30): Promise<any[]> {
    if (!this.db) await this.init();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const entries = await this.getAllMoodEntries();
    const recentEntries = entries.filter(e => e.entry_date >= cutoffStr);
    const entryIds = recentEntries.map(e => e.id);

    const tx = this.db!.transaction(['mood_entry_emotions', 'emotions'], 'readonly');
    const meeStore = tx.objectStore('mood_entry_emotions');
    const emotionStore = tx.objectStore('emotions');

    return new Promise((resolve) => {
      const allEmotions = meeStore.getAll();
      allEmotions.onsuccess = async () => {
        const filtered = allEmotions.result.filter(mee => entryIds.includes(mee.mood_entry_id));
        
        const grouped = filtered.reduce((acc, mee) => {
          if (!acc[mee.emotion_id]) {
            acc[mee.emotion_id] = { intensities: [], count: 0 };
          }
          acc[mee.emotion_id].intensities.push(mee.intensity);
          acc[mee.emotion_id].count++;
          return acc;
        }, {} as any);

        const results = await Promise.all(
          Object.entries(grouped).map(async ([emotionId, data]: [string, any]) => {
            const emotion = await new Promise((res) => {
              const req = emotionStore.get(Number(emotionId));
              req.onsuccess = () => res(req.result);
            }) as any;

            return {
              name: emotion.name,
              category: emotion.category,
              color: emotion.color,
              avg_intensity: data.intensities.reduce((a: number, b: number) => a + b, 0) / data.intensities.length,
              frequency: data.count,
            };
          })
        );

        resolve(results.sort((a, b) => b.frequency - a.frequency || b.avg_intensity - a.avg_intensity));
      };
    });
  }

  // Export all data
  async exportAllData(): Promise<string> {
    if (!this.db) await this.init();
    
    const data = {
      mood_entries: await this.getAllMoodEntries(),
      emotions: await this.getAllEmotions(),
      mood_entry_emotions: await new Promise((resolve) => {
        const tx = this.db!.transaction('mood_entry_emotions', 'readonly');
        const request = tx.objectStore('mood_entry_emotions').getAll();
        request.onsuccess = () => resolve(request.result);
      }),
      medications: await this.getAllMedications(),
      medication_logs: await this.getAllMedicationLogs(),
      exported_at: new Date().toISOString(),
      version: DB_VERSION,
    };

    return JSON.stringify(data, null, 2);
  }

  // Import data
  async importData(jsonData: string): Promise<void> {
    if (!this.db) await this.init();
    
    const data = JSON.parse(jsonData);
    
    // Clear existing data (except emotions)
    const tx = this.db!.transaction(
      ['mood_entries', 'mood_entry_emotions', 'medications', 'medication_logs'],
      'readwrite'
    );
    
    await Promise.all([
      tx.objectStore('mood_entries').clear(),
      tx.objectStore('mood_entry_emotions').clear(),
      tx.objectStore('medications').clear(),
      tx.objectStore('medication_logs').clear(),
    ]);

    // Import mood entries
    if (data.mood_entries) {
      for (const entry of data.mood_entries) {
        await this.createMoodEntry(entry);
      }
    }

    // Import mood entry emotions
    if (data.mood_entry_emotions) {
      const meeTx = this.db!.transaction('mood_entry_emotions', 'readwrite');
      for (const mee of data.mood_entry_emotions) {
        meeTx.objectStore('mood_entry_emotions').add(mee);
      }
    }

    // Import medications
    if (data.medications) {
      for (const med of data.medications) {
        await this.createMedication(med);
      }
    }

    // Import medication logs
    if (data.medication_logs) {
      for (const log of data.medication_logs) {
        await this.createMedicationLog(log);
      }
    }
  }
}

export const db = new MindwellDB();

// Initialize DB and seed emotions on module load
db.init().then(() => db.seedEmotions());