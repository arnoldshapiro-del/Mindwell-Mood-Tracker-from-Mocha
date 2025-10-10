import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface AdvancedChartProps {
  data: any[];
  type?: 'line' | 'area';
  height?: number;
}

export default function AdvancedChart({ 
  data, 
  type = 'line', 
  height = 300 
}: AdvancedChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                {entry.name.replace('avg_', '').replace('_', ' ')}: {entry.value?.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (tickItem: string) => {
    if (tickItem.includes('-')) {
      // Handle date format
      const date = new Date(tickItem);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return tickItem;
  };

  const chartProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
  };

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...chartProps}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="anxietyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={formatXAxisLabel}
          />
          <YAxis 
            domain={[1, 4]}
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Area
            type="monotone"
            dataKey="avg_mood"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#moodGradient)"
            name="Mood"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="avg_anxiety"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#anxietyGradient)"
            name="Anxiety (Inverted)"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="avg_energy"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#energyGradient)"
            name="Energy"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="avg_sleep"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#sleepGradient)"
            name="Sleep"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          stroke="#64748b"
          fontSize={12}
          tickFormatter={formatXAxisLabel}
        />
        <YAxis 
          domain={[1, 4]}
          stroke="#64748b"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        <Line 
          type="monotone" 
          dataKey="avg_mood" 
          stroke="#10b981" 
          strokeWidth={3}
          name="Mood"
          dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="avg_anxiety" 
          stroke="#f59e0b" 
          strokeWidth={3}
          name="Anxiety (Inverted)"
          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#f59e0b', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="avg_energy" 
          stroke="#3b82f6" 
          strokeWidth={3}
          name="Energy"
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="avg_sleep" 
          stroke="#8b5cf6" 
          strokeWidth={3}
          name="Sleep"
          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
