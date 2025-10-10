import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { 
  CreateMoodEntrySchema, 
  CreateMedicationSchema,
  CreateMedicationLogSchema,
  MoodEntryEmotionSchema
} from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Mood Entries API
app.get("/api/mood-entries", async (c) => {
  const db = c.env.DB;
  const entries = await db.prepare(`
    SELECT * FROM mood_entries 
    ORDER BY entry_date DESC, created_at DESC
    LIMIT 100
  `).all();
  
  return c.json(entries.results || []);
});

app.get("/api/mood-entries/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  const entry = await db.prepare(`
    SELECT * FROM mood_entries WHERE id = ?
  `).bind(id).first();
  
  if (!entry) {
    return c.json({ error: "Entry not found" }, 404);
  }
  
  return c.json(entry);
});

app.post("/api/mood-entries", zValidator("json", CreateMoodEntrySchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  const now = new Date().toISOString();
  
  const result = await db.prepare(`
    INSERT INTO mood_entries (mood_level, anxiety_level, energy_level, sleep_quality, notes, entry_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.mood_level,
    data.anxiety_level,
    data.energy_level,
    data.sleep_quality,
    data.notes || null,
    data.entry_date,
    now,
    now
  ).run();
  
  if (!result.success) {
    return c.json({ error: "Failed to create entry" }, 500);
  }
  
  const newEntry = await db.prepare(`
    SELECT * FROM mood_entries WHERE id = ?
  `).bind(result.meta.last_row_id).first();
  
  return c.json(newEntry, 201);
});

app.put("/api/mood-entries/:id", zValidator("json", CreateMoodEntrySchema), async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const now = new Date().toISOString();
  
  const result = await db.prepare(`
    UPDATE mood_entries 
    SET mood_level = ?, anxiety_level = ?, energy_level = ?, sleep_quality = ?, notes = ?, entry_date = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    data.mood_level,
    data.anxiety_level,
    data.energy_level,
    data.sleep_quality,
    data.notes || null,
    data.entry_date,
    now,
    id
  ).run();
  
  if (!result.success || result.meta.changes === 0) {
    return c.json({ error: "Entry not found or update failed" }, 404);
  }
  
  const updatedEntry = await db.prepare(`
    SELECT * FROM mood_entries WHERE id = ?
  `).bind(id).first();
  
  return c.json(updatedEntry);
});

app.delete("/api/mood-entries/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");
  
  const result = await db.prepare(`
    DELETE FROM mood_entries WHERE id = ?
  `).bind(id).run();
  
  if (!result.success || result.meta.changes === 0) {
    return c.json({ error: "Entry not found" }, 404);
  }
  
  return c.json({ success: true });
});

// Medications API
app.get("/api/medications", async (c) => {
  const db = c.env.DB;
  const medications = await db.prepare(`
    SELECT * FROM medications 
    WHERE is_active = 1
    ORDER BY name ASC
  `).all();
  
  return c.json(medications.results || []);
});

app.post("/api/medications", zValidator("json", CreateMedicationSchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  const now = new Date().toISOString();
  
  const result = await db.prepare(`
    INSERT INTO medications (name, dosage, frequency, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    data.name,
    data.dosage || null,
    data.frequency || null,
    data.is_active,
    now,
    now
  ).run();
  
  if (!result.success) {
    return c.json({ error: "Failed to create medication" }, 500);
  }
  
  const newMedication = await db.prepare(`
    SELECT * FROM medications WHERE id = ?
  `).bind(result.meta.last_row_id).first();
  
  return c.json(newMedication, 201);
});

// Medication Logs API
app.get("/api/medication-logs", async (c) => {
  const db = c.env.DB;
  const logs = await db.prepare(`
    SELECT ml.*, m.name as medication_name 
    FROM medication_logs ml
    JOIN medications m ON ml.medication_id = m.id
    ORDER BY ml.taken_at DESC
    LIMIT 100
  `).all();
  
  return c.json(logs.results || []);
});

app.post("/api/medication-logs", zValidator("json", CreateMedicationLogSchema), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  const now = new Date().toISOString();
  
  const result = await db.prepare(`
    INSERT INTO medication_logs (medication_id, taken_at, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    data.medication_id,
    data.taken_at,
    data.notes || null,
    now,
    now
  ).run();
  
  if (!result.success) {
    return c.json({ error: "Failed to create medication log" }, 500);
  }
  
  const newLog = await db.prepare(`
    SELECT ml.*, m.name as medication_name 
    FROM medication_logs ml
    JOIN medications m ON ml.medication_id = m.id
    WHERE ml.id = ?
  `).bind(result.meta.last_row_id).first();
  
  return c.json(newLog, 201);
});

// Emotions API
app.get("/api/emotions", async (c) => {
  const db = c.env.DB;
  const emotions = await db.prepare(`
    SELECT * FROM emotions 
    ORDER BY category ASC, name ASC
  `).all();
  
  return c.json(emotions.results || []);
});

// Mood Entry Emotions API
app.get("/api/mood-entry-emotions/:moodEntryId", async (c) => {
  const db = c.env.DB;
  const moodEntryId = c.req.param("moodEntryId");
  
  const emotions = await db.prepare(`
    SELECT mee.*, e.name, e.category, e.color
    FROM mood_entry_emotions mee
    JOIN emotions e ON mee.emotion_id = e.id
    WHERE mee.mood_entry_id = ?
    ORDER BY e.name ASC
  `).bind(moodEntryId).all();
  
  return c.json(emotions.results || []);
});

app.post("/api/mood-entry-emotions", zValidator("json", MoodEntryEmotionSchema.omit({ id: true, created_at: true, updated_at: true })), async (c) => {
  const db = c.env.DB;
  const data = c.req.valid("json");
  const now = new Date().toISOString();
  
  const result = await db.prepare(`
    INSERT INTO mood_entry_emotions (mood_entry_id, emotion_id, intensity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    data.mood_entry_id,
    data.emotion_id,
    data.intensity,
    now,
    now
  ).run();
  
  if (!result.success) {
    return c.json({ error: "Failed to create mood entry emotion" }, 500);
  }
  
  const newEntry = await db.prepare(`
    SELECT mee.*, e.name, e.category, e.color
    FROM mood_entry_emotions mee
    JOIN emotions e ON mee.emotion_id = e.id
    WHERE mee.id = ?
  `).bind(result.meta.last_row_id).first();
  
  return c.json(newEntry, 201);
});

// Activities API
app.get("/api/activities", async (c) => {
  const db = c.env.DB;
  const activities = await db.prepare(`
    SELECT * FROM activities 
    ORDER BY category ASC, name ASC
  `).all();
  
  return c.json(activities.results || []);
});

// Mood Entry Activities API
app.post("/api/mood-entry-activities", async (c) => {
  const db = c.env.DB;
  const data = await c.req.json();
  const now = new Date().toISOString();
  
  const result = await db.prepare(`
    INSERT INTO mood_entry_activities (mood_entry_id, activity_id, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `).bind(
    data.mood_entry_id,
    data.activity_id,
    now,
    now
  ).run();
  
  if (!result.success) {
    return c.json({ error: "Failed to create mood entry activity" }, 500);
  }
  
  return c.json({ success: true }, 201);
});

// Analytics API
app.get("/api/analytics/trends", async (c) => {
  const db = c.env.DB;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const trends = await db.prepare(`
    SELECT 
      entry_date,
      AVG(mood_level) as avg_mood,
      AVG(anxiety_level) as avg_anxiety,
      AVG(energy_level) as avg_energy,
      AVG(sleep_quality) as avg_sleep
    FROM mood_entries 
    WHERE entry_date >= ?
    GROUP BY entry_date
    ORDER BY entry_date ASC
  `).bind(thirtyDaysAgo.toISOString().split('T')[0]).all();
  
  return c.json(trends.results || []);
});

// Emotion Analytics API
app.get("/api/analytics/emotions", async (c) => {
  const db = c.env.DB;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const emotionTrends = await db.prepare(`
    SELECT 
      e.name,
      e.category,
      e.color,
      AVG(mee.intensity) as avg_intensity,
      COUNT(mee.id) as frequency
    FROM mood_entry_emotions mee
    JOIN emotions e ON mee.emotion_id = e.id
    JOIN mood_entries me ON mee.mood_entry_id = me.id
    WHERE me.entry_date >= ?
    GROUP BY e.id, e.name, e.category, e.color
    ORDER BY frequency DESC, avg_intensity DESC
  `).bind(thirtyDaysAgo.toISOString().split('T')[0]).all();
  
  return c.json(emotionTrends.results || []);
});

// Weekly Analytics API
app.get("/api/analytics/weekly", async (c) => {
  const db = c.env.DB;
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
  
  const weeklyTrends = await db.prepare(`
    SELECT 
      strftime('%Y-W%W', entry_date) as week,
      AVG(mood_level) as avg_mood,
      AVG(anxiety_level) as avg_anxiety,
      AVG(energy_level) as avg_energy,
      AVG(sleep_quality) as avg_sleep
    FROM mood_entries 
    WHERE entry_date >= ?
    GROUP BY strftime('%Y-W%W', entry_date)
    ORDER BY week ASC
  `).bind(twelveWeeksAgo.toISOString().split('T')[0]).all();
  
  return c.json(weeklyTrends.results || []);
});

// Monthly Analytics API
app.get("/api/analytics/monthly", async (c) => {
  const db = c.env.DB;
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
  
  const monthlyTrends = await db.prepare(`
    SELECT 
      strftime('%Y-%m', entry_date) as month,
      AVG(mood_level) as avg_mood,
      AVG(anxiety_level) as avg_anxiety,
      AVG(energy_level) as avg_energy,
      AVG(sleep_quality) as avg_sleep
    FROM mood_entries 
    WHERE entry_date >= ?
    GROUP BY strftime('%Y-%m', entry_date)
    ORDER BY month ASC
  `).bind(twelveMonthsAgo.toISOString().split('T')[0]).all();
  
  return c.json(monthlyTrends.results || []);
});

// Time Patterns Analytics API
app.get("/api/analytics/time-patterns", async (c) => {
  const db = c.env.DB;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const timePatterns = await db.prepare(`
    SELECT 
      time_of_day,
      AVG(mood_level) as avg_mood,
      AVG(anxiety_level) as avg_anxiety,
      AVG(energy_level) as avg_energy,
      AVG(sleep_quality) as avg_sleep,
      COUNT(*) as entry_count
    FROM mood_entries 
    WHERE entry_date >= ? AND time_of_day IS NOT NULL
    GROUP BY time_of_day
    ORDER BY 
      CASE time_of_day 
        WHEN 'morning' THEN 1 
        WHEN 'afternoon' THEN 2 
        WHEN 'evening' THEN 3 
        ELSE 4 
      END
  `).bind(thirtyDaysAgo.toISOString().split('T')[0]).all();
  
  return c.json(timePatterns.results || []);
});

export default app;
