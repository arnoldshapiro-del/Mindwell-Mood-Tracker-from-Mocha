import { useState } from 'react';
import { Activity, Dumbbell, Heart } from 'lucide-react';
import { useActivities } from '@/react-app/hooks/useActivities';

interface ActivitySelectorProps {
  selectedActivities: number[];
  onChange: (activities: number[]) => void;
}

export default function ActivitySelector({ selectedActivities, onChange }: ActivitySelectorProps) {
  const { activities, loading } = useActivities();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: Activity },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'social', name: 'Social', icon: Heart },
    { id: 'productivity', name: 'Work', icon: Activity },
    { id: 'entertainment', name: 'Fun', icon: Activity },
    { id: 'wellness', name: 'Wellness', icon: Heart },
  ];

  const filteredActivities = activeCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === activeCategory);

  const toggleActivity = (activityId: number) => {
    if (selectedActivities.includes(activityId)) {
      onChange(selectedActivities.filter(id => id !== activityId));
    } else {
      onChange([...selectedActivities, activityId]);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
        Activities (Optional)
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
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

      {/* Activities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredActivities.map(activity => {
          const isSelected = selectedActivities.includes(activity.id);
          
          return (
            <button
              key={activity.id}
              onClick={() => toggleActivity(activity.id)}
              className={`group p-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 shadow-lg transform scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
              }`}
              style={{
                backgroundColor: isSelected ? activity.color + '20' : undefined,
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-2xl">{activity.icon}</span>
                <span className={`text-center leading-tight ${
                  isSelected 
                    ? 'text-slate-800 dark:text-slate-200' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {activity.name}
                </span>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Activities Summary */}
      {selectedActivities.length > 0 && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            {selectedActivities.length} activit{selectedActivities.length === 1 ? 'y' : 'ies'} selected
          </p>
        </div>
      )}
    </div>
  );
}
