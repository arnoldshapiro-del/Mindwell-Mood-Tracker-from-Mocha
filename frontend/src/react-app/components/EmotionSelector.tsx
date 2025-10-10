import { useState, useEffect } from 'react';
import { Heart, Frown, Meh } from 'lucide-react';

interface Emotion {
  id: number;
  name: string;
  category: string;
  color: string;
}

interface SelectedEmotion extends Emotion {
  intensity: number;
}

interface EmotionSelectorProps {
  selectedEmotions: SelectedEmotion[];
  onChange: (emotions: SelectedEmotion[]) => void;
}

export default function EmotionSelector({ selectedEmotions, onChange }: EmotionSelectorProps) {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const response = await fetch('/api/emotions');
        if (response.ok) {
          const data = await response.json();
          setEmotions(data);
        }
      } catch (error) {
        console.error('Failed to fetch emotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: Heart },
    { id: 'positive', name: 'Positive', icon: Heart },
    { id: 'negative', name: 'Negative', icon: Frown },
    { id: 'neutral', name: 'Neutral', icon: Meh },
  ];

  const filteredEmotions = activeCategory === 'all' 
    ? emotions 
    : emotions.filter(emotion => emotion.category === activeCategory);

  const toggleEmotion = (emotion: Emotion) => {
    const existingIndex = selectedEmotions.findIndex(e => e.id === emotion.id);
    
    if (existingIndex >= 0) {
      // Remove emotion
      const newEmotions = selectedEmotions.filter(e => e.id !== emotion.id);
      onChange(newEmotions);
    } else {
      // Add emotion with default intensity
      const newEmotion: SelectedEmotion = {
        ...emotion,
        intensity: 3
      };
      onChange([...selectedEmotions, newEmotion]);
    }
  };

  const updateIntensity = (emotionId: number, intensity: number) => {
    const newEmotions = selectedEmotions.map(emotion =>
      emotion.id === emotionId ? { ...emotion, intensity } : emotion
    );
    onChange(newEmotions);
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
        How are you feeling? (Select multiple)
      </h3>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Emotion Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {filteredEmotions.map(emotion => {
          const isSelected = selectedEmotions.some(e => e.id === emotion.id);
          
          return (
            <button
              key={emotion.id}
              onClick={() => toggleEmotion(emotion)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-current text-white shadow-md transform scale-105'
                  : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              style={{
                backgroundColor: isSelected ? emotion.color : undefined,
              }}
            >
              {emotion.name}
            </button>
          );
        })}
      </div>

      {/* Selected Emotions with Intensity */}
      {selectedEmotions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">
            Adjust Intensity (1-5)
          </h4>
          
          <div className="space-y-3">
            {selectedEmotions.map(emotion => (
              <div key={emotion.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {emotion.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(intensity => (
                    <button
                      key={intensity}
                      onClick={() => updateIntensity(emotion.id, intensity)}
                      className={`w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200 ${
                        emotion.intensity === intensity
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-500'
                      }`}
                    >
                      {intensity}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
