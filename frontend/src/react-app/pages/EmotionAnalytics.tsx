import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Heart, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { db } from '@/utils/db';

interface EmotionTrend {
  name: string;
  category: string;
  color: string;
  avg_intensity: number;
  frequency: number;
}

interface CategoryData {
  category: string;
  count: number;
  color: string;
}

export default function EmotionAnalytics() {
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmotionAnalytics = async () => {
      try {
        setLoading(true);
        const data = await db.getEmotionAnalytics(30);
        setEmotionTrends(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmotionAnalytics();
  }, []);

  if (loading) {
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
            Failed to load emotion analytics
          </p>
        </div>
      </div>
    );
  }

  if (emotionTrends.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
          No Emotion Data Yet
        </h3>
        <p className="text-slate-500 dark:text-slate-500">
          Start tracking emotions to see detailed analytics here.
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const topEmotions = emotionTrends.slice(0, 10);
  const categoryData = emotionTrends.reduce((acc, emotion) => {
    const existing = acc.find(item => item.category === emotion.category);
    if (existing) {
      existing.count += emotion.frequency;
    } else {
      acc.push({
        category: emotion.category,
        count: emotion.frequency,
        color: emotion.category === 'positive' ? '#06D6A0' : 
               emotion.category === 'negative' ? '#FF6B6B' : '#4ECDC4'
      });
    }
    return acc;
  }, [] as Array<{ category: string; count: number; color: string }>);

  const intensityData = topEmotions.map(emotion => ({
    name: emotion.name,
    intensity: Number(emotion.avg_intensity.toFixed(1)),
    frequency: emotion.frequency,
    color: emotion.color
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
          Emotion Analytics
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Deep insights into your emotional patterns and trends
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 text-center">
          <Heart className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {emotionTrends.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Different Emotions Tracked
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {topEmotions[0]?.name || 'N/A'}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Most Frequent Emotion
          </div>
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 text-center">
          <Activity className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {emotionTrends.reduce((sum, emotion) => sum + emotion.frequency, 0)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Total Emotion Logs
          </div>
        </div>
      </div>

      {/* Emotion Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
            Emotion Categories
          </h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ category }: { category: string }) => category}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Emotions by Frequency */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
            Most Frequent Emotions
          </h2>
          
          <div className="space-y-3">
            {topEmotions.slice(0, 8).map((emotion, index) => (
              <div key={emotion.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-bold text-slate-500 w-6">
                    #{index + 1}
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {emotion.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {emotion.frequency} times
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Avg: {emotion.avg_intensity.toFixed(1)}/5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Average Intensity Chart */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
          Average Emotion Intensity
        </h2>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={intensityData} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                domain={[0, 5]}
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  name === 'intensity' ? `${value}/5` : value,
                  name === 'intensity' ? 'Avg Intensity' : 'Frequency'
                ]}
              />
              <Bar 
                dataKey="intensity" 
                radius={[4, 4, 0, 0]}
              >
                {intensityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
