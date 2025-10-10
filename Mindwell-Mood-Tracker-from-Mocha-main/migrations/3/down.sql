
-- Remove new columns and tables
ALTER TABLE mood_entries DROP COLUMN time_of_day;
DROP TABLE activities;
DROP TABLE mood_entry_activities;
DROP TABLE goals;
DROP TABLE goal_completions;
DROP TABLE streaks;
