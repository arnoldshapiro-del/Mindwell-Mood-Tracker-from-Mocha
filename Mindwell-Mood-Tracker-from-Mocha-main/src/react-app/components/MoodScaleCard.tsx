import { LucideIcon } from "lucide-react";

interface MoodScaleCardProps {
  title: string;
  icon: LucideIcon;
  value: number;
  onChange: (value: number) => void;
  labels: [string, string, string, string];
  colors: [string, string, string, string];
}

export default function MoodScaleCard({ 
  title, 
  icon: Icon, 
  value, 
  onChange, 
  labels, 
  colors 
}: MoodScaleCardProps) {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h3>
      </div>
      
      <div className="space-y-3">
        {labels.map((label, index) => {
          const scaleValue = index + 1;
          const isSelected = value === scaleValue;
          
          return (
            <button
              key={scaleValue}
              onClick={() => onChange(scaleValue)}
              className={`w-full p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                isSelected
                  ? `${colors[index]} border-current shadow-md transform scale-[1.02]`
                  : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  isSelected 
                    ? "text-white" 
                    : "text-slate-700 dark:text-slate-300"
                }`}>
                  {label}
                </span>
                <span className={`text-sm ${
                  isSelected 
                    ? "text-white/80" 
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                  {scaleValue}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
