import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Activity, AlertCircle, BarChart3, PieChart, Sun, CloudSun, Moon } from 'lucide-react';
import AdvancedChart from '@/react-app/components/AdvancedChart';
import { useMoodEntries } from '@/react-app/hooks/useMoodEntries';

interface AnalyticsData {
  daily: any[];
  weekly: any[];
  monthly: any[];
  timePatterns: any[];
}

export default function Analytics() {
  const { entries, loading: entriesLoading } = useMoodEntries();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    daily: [],
    weekly: [],
    monthly: [],
    timePatterns: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [trendsResponse, weeklyResponse, monthlyResponse, timePatternsResponse] = await Promise.all([
          fetch('/api/analytics/trends'),
          fetch('/api/analytics/weekly'),
          fetch('/api/analytics/monthly'),
          fetch('/api/analytics/time-patterns')
        ]);

        if (!trendsResponse.ok || !weeklyResponse.ok || !monthlyResponse.ok || !timePatternsResponse.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const [trends, weekly, monthly, timePatterns] = await Promise.all([
          trendsResponse.json(),
          weeklyResponse.json(),
          monthlyResponse.json(),
          timePatternsResponse.json()
        ]);

        // Process daily data
        const dailyData = trends.reduce((acc: any[], trend: any) => {
          const date = trend.entry_date;
          const existing = acc.find(item => item.date === date);
          
          if (existing) {
            // Average multiple entries per day
            existing.avg_mood = (existing.avg_mood + trend.avg_mood) / 2;
            existing.avg_anxiety = (existing.avg_anxiety + (5 - trend.avg_anxiety)) / 2; // Invert anxiety
            existing.avg_energy = (existing.avg_energy + trend.avg_energy) / 2;
            existing.avg_sleep = (existing.avg_sleep + trend.avg_sleep) / 2;
          } else {
            acc.push({
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              avg_mood: Number(trend.avg_mood.toFixed(1)),
              avg_anxiety: Number((5 - trend.avg_anxiety).toFixed(1)), // Invert anxiety
              avg_energy: Number(trend.avg_energy.toFixed(1)),
              avg_sleep: Number(trend.avg_sleep.toFixed(1)),
            });
          }
          return acc;
        }, []);

        // Process weekly data
        const weeklyData = weekly.map((week: any) => ({
          date: `Week ${week.week.split('-')[1]}`,
          avg_mood: Number(week.avg_mood.toFixed(1)),
          avg_anxiety: Number((5 - week.avg_anxiety).toFixed(1)),
          avg_energy: Number(week.avg_energy.toFixed(1)),
          avg_sleep: Number(week.avg_sleep.toFixed(1)),
        }));

        // Process monthly data
        const monthlyData = monthly.map((month: any) => ({
          date: new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          avg_mood: Number(month.avg_mood.toFixed(1)),
          avg_anxiety: Number((5 - month.avg_anxiety).toFixed(1)),
          avg_energy: Number(month.avg_energy.toFixed(1)),
          avg_sleep: Number(month.avg_sleep.toFixed(1)),
        }));

        setAnalyticsData({
          daily: dailyData,
          weekly: weeklyData,
          monthly: monthlyData,
          timePatterns: timePatterns.map((pattern: any) => ({
            ...pattern,
            avg_anxiety: 5 - pattern.avg_anxiety // Invert anxiety
          }))
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || entriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Failed to load analytics data
          </p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
          No Data Yet
        </h3>
        <p className="text-slate-500 dark:text-slate-500">
          Start tracking your mood to see analytics and insights here.
        </p>
      </div>
    );
  }

  const stats = entries.length > 0 ? {
    totalEntries: entries.length,
    avgMood: (entries.reduce((sum, entry) => sum + entry.mood_level, 0) / entries.length).toFixed(1),
    avgAnxiety: (entries.reduce((sum, entry) => sum + entry.anxiety_level, 0) / entries.length).toFixed(1),
    avgEnergy: (entries.reduce((sum, entry) => sum + entry.energy_level, 0) / entries.length).toFixed(1),
    avgSleep: (entries.reduce((sum, entry) => sum + entry.sleep_quality, 0) / entries.length).toFixed(1),
  } : null;

  const currentData = analyticsData[activeView];

  const timeIcons = {
    morning: Sun,
    afternoon: CloudSun,
    evening: Moon,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Advanced Analytics
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Deep insights into your mood patterns and trends
        </p>
      </div>

      {/* Enhanced Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50 text-center">
            <div className="flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              {stats.totalEntries}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Entries
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 dark:border-green-700/50 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.avgMood}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Avg Mood
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-orange-200/50 dark:border-orange-700/50 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.avgAnxiety}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Avg Anxiety
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.avgEnergy}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Avg Energy
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.avgSleep}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Avg Sleep
            </div>
          </div>
        </div>
      )}

      {/* Chart Controls */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Mood Trends
            </h2>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            {/* Time Period Selection */}
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActiveView(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === period
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Chart Type Selection */}
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              {(['line', 'area'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    chartType === type
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {type === 'line' ? <BarChart3 className="w-4 h-4" /> : <PieChart className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {currentData.length > 0 ? (
          <div className="mt-6 h-96">
            <AdvancedChart 
              data={currentData} 
              type={chartType}
              height={384}
            />
          </div>
        ) : (
          <div className="mt-6 h-96 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">
              No data available for {activeView} view
            </p>
          </div>
        )}
      </div>

      {/* Time of Day Patterns */}
      {analyticsData.timePatterns.length > 0 && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
            Time of Day Patterns
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData.timePatterns.map((pattern) => {
              const Icon = timeIcons[pattern.time_of_day as keyof typeof timeIcons] || Sun;
              
              return (
                <div key={pattern.time_of_day} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 capitalize">
                      {pattern.time_of_day}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Mood:</span>
                      <span className="font-semibold text-green-600">{pattern.avg_mood.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Anxiety:</span>
                      <span className="font-semibold text-orange-600">{pattern.avg_anxiety.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Energy:</span>
                      <span className="font-semibold text-blue-600">{pattern.avg_energy.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Sleep:</span>
                      <span className="font-semibold text-purple-600">{pattern.avg_sleep.toFixed(1)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {pattern.entry_count} entries
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
