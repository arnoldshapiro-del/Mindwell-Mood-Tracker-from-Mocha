import { useState } from 'react';
import { Pill, Plus, Clock, Check } from 'lucide-react';
import { CreateMedicationSchema } from '@/shared/types';
import { useMedications } from '@/react-app/hooks/useMedications';

export default function Medications() {
  const { medications, loading, createMedication, createLog } = useMedications();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
  });

  const addMedication = async () => {
    try {
      const validatedData = CreateMedicationSchema.parse({
        ...newMedication,
        is_active: true,
      });
      await createMedication(validatedData);
      setNewMedication({ name: '', dosage: '', frequency: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add medication:', error);
    }
  };

  const logMedication = async (medicationId: number) => {
    try {
      await createLog({
        medication_id: medicationId,
        taken_at: new Date().toISOString(),
      });
      console.log('Medication logged successfully');
    } catch (error) {
      console.error('Failed to log medication:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
          Medications
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Track your medications and log when you take them
        </p>
      </div>

      {/* Add Medication Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Add Medication Form */}
      {showAddForm && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Add New Medication
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Medication Name *
              </label>
              <input
                type="text"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Sertraline"
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Dosage
              </label>
              <input
                type="text"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 50mg"
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Frequency
              </label>
              <input
                type="text"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                placeholder="e.g., Once daily"
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={addMedication}
              disabled={!newMedication.name.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Add Medication
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewMedication({ name: '', dosage: '', frequency: '' });
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Medications List */}
      {medications.length === 0 ? (
        <div className="text-center py-16">
          <Pill className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            No Medications Added
          </h3>
          <p className="text-slate-500 dark:text-slate-500">
            Add your medications to start tracking when you take them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medications.map((medication) => (
            <div
              key={medication.id}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {medication.name}
                    </h3>
                    {medication.dosage && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {medication.dosage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {medication.frequency && (
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {medication.frequency}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => logMedication(medication.id!)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
              >
                <Check className="w-4 h-4" />
                <span>Mark as Taken</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
