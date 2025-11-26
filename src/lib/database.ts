import { supabase } from './supabase';

export interface UserGoals {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
  target_weight: number;
  daily_calories: number;
}

export interface DailyLog {
  date: string;
  weight?: number;
  water_intake: number;
  calories_consumed: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  date: string;
  meal_type: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  activity_level?: string;
  created_at: string;
  updated_at: string;
}

// User Profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// User Goals
export async function saveUserGoals(userId: string, goals: UserGoals) {
  const { data, error } = await supabase
    .from('user_goals')
    .upsert({
      user_id: userId,
      ...goals,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserGoals(userId: string) {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Daily Logs
export async function saveDailyLog(userId: string, log: DailyLog) {
  const { data, error } = await supabase
    .from('daily_logs')
    .upsert({
      user_id: userId,
      ...log,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDailyLog(userId: string, date: string) {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getDailyLogs(userId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Meals
export async function saveMeal(userId: string, meal: Meal) {
  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      ...meal,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMeals(userId: string, date: string) {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateWaterIntake(userId: string, date: string, amount: number) {
  const { data, error } = await supabase
    .from('daily_logs')
    .upsert({
      user_id: userId,
      date,
      water_intake: amount,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}