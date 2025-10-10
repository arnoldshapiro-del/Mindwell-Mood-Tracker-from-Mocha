import { Sun, CloudSun, Moon, Clock } from 'lucide-react';

interface TimeOfDaySelectorProps {
  value: string | null;
  onChange: (timeOfDay: string | null) => void;
}

export default function TimeOfDaySelector({ value, onChange }: TimeOfDaySelectorProps) {
  const timeOptions = [
    {
      id: 'morning',
      label: 'Morning',
      icon: Sun,
      gradient: 'from-yellow-400 to-orange-500',
      description: '6 AM - 12 PM'
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      icon: CloudSun,
      gradient: 'from-blue-400 to-indigo-500',
      description: '12 PM - 6 PM'
    },
    {
      id: 'evening',
      label: 'Evening',
      icon: Moon,
      gradient: 'from-purple-500 to-indigo-600',
      description: '6 PM - 12 AM'
    }
  ];

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="w-5 h-5 text-indigo-600" />
        <label className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Time of Day (Optional)
        </label>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {timeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onChange(isSelected ? null : option.id)}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 shadow-lg transform scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-200 ${
                isSelected ? 'opacity-20' : ''
              }`} />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center space-y-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${option.gradient} ${
                  isSelected ? 'shadow-md' : 'shadow-sm'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="text-center">
                  <div className={`font-semibold ${
                    isSelected 
                      ? 'text-indigo-700 dark:text-indigo-300' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {option.description}
                  </div>
                </div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-600 rounded-full shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
      
      {value && (
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 text-center">
            Selected: {timeOptions.find(opt => opt.id === value)?.label}
          </p>
        </div>
      )}
    </div>
  );
}
