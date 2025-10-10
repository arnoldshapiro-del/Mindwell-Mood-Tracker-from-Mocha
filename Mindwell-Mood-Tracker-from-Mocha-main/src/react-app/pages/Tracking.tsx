import { useState } from 'react';
import { Smile, Zap, Battery, Moon, Save, Calendar } from 'lucide-react';
import MoodScaleCard from '@/react-app/components/MoodScaleCard';
import EmotionSelector from '@/react-app/components/EmotionSelector';
import TimeOfDaySelector from '@/react-app/components/TimeOfDaySelector';
import ActivitySelector from '@/react-app/components/ActivitySelector';
import { useMoodEntries } from '@/react-app/hooks/useMoodEntries';

export default function Tracking() {
  const { createEntry } = useMoodEntries();
  const [formData, setFormData] = useState({
    mood_level: 0,
    anxiety_level: 0,
    energy_level: 0,
    sleep_quality: 0,
    notes: '',
    entry_date: new Date().toISOString().split('T')[0],
    time_of_day: null as string | null,
  });
  const [selectedEmotions, setSelectedEmotions] = useState<Array<{
    id: number;
    name: string;
    category: string;
    color: string;
    intensity: number;
  }>>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    if (!formData.mood_level || !formData.anxiety_level || !formData.energy_level || !formData.sleep_quality) {
      setSaveMessage('Please complete all mood scales');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    try {
      setSaving(true);
      const entry = await createEntry(formData);
      
      // Save emotions if any selected
      if (selectedEmotions.length > 0) {
        await Promise.all(
          selectedEmotions.map(emotion =>
            fetch('/api/mood-entry-emotions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mood_entry_id: entry.id,
                emotion_id: emotion.id,
                intensity: emotion.intensity,
              }),
            })
          )
        );
      }
      
      // Save activities if any selected
      if (selectedActivities.length > 0) {
        await Promise.all(
          selectedActivities.map(activityId =>
            fetch('/api/mood-entry-activities', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mood_entry_id: entry.id,
                activity_id: activityId,
              }),
            })
          )
        );
      }
      
      setSaveMessage('Entry saved successfully!');
      // Reset form
      setFormData({
        mood_level: 0,
        anxiety_level: 0,
        energy_level: 0,
        sleep_quality: 0,
        notes: '',
        entry_date: new Date().toISOString().split('T')[0],
        time_of_day: null,
      });
      setSelectedEmotions([]);
      setSelectedActivities([]);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save entry. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Track Your Mood
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Take a moment to reflect on how you're feeling today
        </p>
      </div>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <label className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Entry Date
            </label>
          </div>
          <input
            type="date"
            value={formData.entry_date}
            onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <TimeOfDaySelector
          value={formData.time_of_day}
          onChange={(timeOfDay) => setFormData(prev => ({ ...prev, time_of_day: timeOfDay }))}
        />
      </div>

      {/* Emotions */}
      <EmotionSelector
        selectedEmotions={selectedEmotions}
        onChange={setSelectedEmotions}
      />

      {/* Activities */}
      <ActivitySelector
        selectedActivities={selectedActivities}
        onChange={setSelectedActivities}
      />

      {/* Mood Scales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MoodScaleCard
          title="Overall Mood"
          icon={Smile}
          value={formData.mood_level}
          onChange={(value) => setFormData(prev => ({ ...prev, mood_level: value }))}
          labels={['Very Low', 'Low', 'Good', 'Excellent']}
          colors={[
            'bg-gradient-to-r from-red-500 to-red-600 text-white',
            'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
            'bg-gradient-to-r from-green-500 to-green-600 text-white',
            'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
          ]}
        />

        <MoodScaleCard
          title="Anxiety Level"
          icon={Zap}
          value={formData.anxiety_level}
          onChange={(value) => setFormData(prev => ({ ...prev, anxiety_level: value }))}
          labels={['Very High', 'High', 'Moderate', 'Low']}
          colors={[
            'bg-gradient-to-r from-red-500 to-red-600 text-white',
            'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
            'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
            'bg-gradient-to-r from-green-500 to-green-600 text-white'
          ]}
        />

        <MoodScaleCard
          title="Energy Level"
          icon={Battery}
          value={formData.energy_level}
          onChange={(value) => setFormData(prev => ({ ...prev, energy_level: value }))}
          labels={['Exhausted', 'Low', 'Good', 'High']}
          colors={[
            'bg-gradient-to-r from-red-500 to-red-600 text-white',
            'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
            'bg-gradient-to-r from-green-500 to-green-600 text-white',
            'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
          ]}
        />

        <MoodScaleCard
          title="Sleep Quality"
          icon={Moon}
          value={formData.sleep_quality}
          onChange={(value) => setFormData(prev => ({ ...prev, sleep_quality: value }))}
          labels={['Poor', 'Fair', 'Good', 'Excellent']}
          colors={[
            'bg-gradient-to-r from-red-500 to-red-600 text-white',
            'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
            'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
            'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
          ]}
        />
      </div>

      {/* Notes */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Reflection Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="How are you feeling? Any thoughts, triggers, or insights you'd like to remember?"
          rows={4}
          className="w-full p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Save Button */}
      <div className="flex flex-col items-center space-y-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving...' : 'Save Entry'}</span>
        </button>
        
        {saveMessage && (
          <p className={`text-sm font-medium ${
            saveMessage.includes('success') 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
}
