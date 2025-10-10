
CREATE TABLE emotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mood_entry_emotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mood_entry_id INTEGER NOT NULL,
  emotion_id INTEGER NOT NULL,
  intensity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO emotions (name, category, color) VALUES
-- Basic emotions (Ekman's 6)
('Joy', 'positive', '#10b981'),
('Happiness', 'positive', '#22c55e'),
('Excitement', 'positive', '#f59e0b'),
('Contentment', 'positive', '#84cc16'),
('Gratitude', 'positive', '#06b6d4'),
('Love', 'positive', '#ec4899'),
('Pride', 'positive', '#8b5cf6'),
('Hope', 'positive', '#3b82f6'),
('Compassion', 'positive', '#14b8a6'),
('Amusement', 'positive', '#f97316'),

-- Negative emotions
('Sadness', 'negative', '#6b7280'),
('Anger', 'negative', '#ef4444'),
('Fear', 'negative', '#7c3aed'),
('Anxiety', 'negative', '#f59e0b'),
('Worry', 'negative', '#eab308'),
('Frustration', 'negative', '#dc2626'),
('Irritation', 'negative', '#ea580c'),
('Guilt', 'negative', '#7c2d12'),
('Shame', 'negative', '#991b1b'),
('Embarrassment', 'negative', '#be185d'),
('Loneliness', 'negative', '#374151'),
('Jealousy', 'negative', '#059669'),
('Envy', 'negative', '#16a34a'),
('Disappointment', 'negative', '#9333ea'),
('Grief', 'negative', '#1f2937'),
('Despair', 'negative', '#111827'),
('Disgust', 'negative', '#65a30d'),
('Contempt', 'negative', '#a16207'),

-- Neutral/Mixed emotions
('Surprise', 'neutral', '#0ea5e9'),
('Confusion', 'neutral', '#6366f1'),
('Curiosity', 'neutral', '#8b5cf6'),
('Boredom', 'neutral', '#71717a'),
('Indifference', 'neutral', '#9ca3af'),
('Nostalgia', 'neutral', '#a855f7'),
('Anticipation', 'neutral', '#06b6d4'),
('Relief', 'neutral', '#10b981'),
('Acceptance', 'neutral', '#6b7280'),
('Calmness', 'neutral', '#0891b2'),

-- Complex emotions
('Overwhelmed', 'negative', '#dc2626'),
('Stressed', 'negative', '#ea580c'),
('Confident', 'positive', '#3b82f6'),
('Insecure', 'negative', '#7c3aed'),
('Motivated', 'positive', '#f59e0b'),
('Apathy', 'neutral', '#6b7280'),
('Optimism', 'positive', '#eab308'),
('Pessimism', 'negative', '#991b1b'),
('Vulnerable', 'negative', '#be185d'),
('Empowered', 'positive', '#7c3aed'),
('Betrayed', 'negative', '#dc2626'),
('Appreciated', 'positive', '#10b981'),
('Neglected', 'negative', '#6b7280'),
('Inspired', 'positive', '#8b5cf6'),
('Defeated', 'negative', '#374151'),
('Energized', 'positive', '#f97316'),
('Drained', 'negative', '#71717a'),
('Peaceful', 'positive', '#06b6d4'),
('Restless', 'negative', '#eab308'),
('Fulfilled', 'positive', '#22c55e');
