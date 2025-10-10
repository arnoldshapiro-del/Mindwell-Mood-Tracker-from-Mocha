import z from "zod";

export const MoodEntrySchema = z.object({
  id: z.number().optional(),
  mood_level: z.number().min(1).max(4),
  anxiety_level: z.number().min(1).max(4),
  energy_level: z.number().min(1).max(4),
  sleep_quality: z.number().min(1).max(4),
  notes: z.string().optional(),
  entry_date: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const MedicationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const MedicationLogSchema = z.object({
  id: z.number().optional(),
  medication_id: z.number(),
  taken_at: z.string(),
  notes: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type MoodEntry = z.infer<typeof MoodEntrySchema>;
export type Medication = z.infer<typeof MedicationSchema>;
export type MedicationLog = z.infer<typeof MedicationLogSchema>;

export const CreateMoodEntrySchema = MoodEntrySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const CreateMedicationSchema = MedicationSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const CreateMedicationLogSchema = MedicationLogSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const EmotionSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  color: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const MoodEntryEmotionSchema = z.object({
  id: z.number().optional(),
  mood_entry_id: z.number(),
  emotion_id: z.number(),
  intensity: z.number().min(1).max(5).default(1),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Emotion = z.infer<typeof EmotionSchema>;
export type MoodEntryEmotion = z.infer<typeof MoodEntryEmotionSchema>;
