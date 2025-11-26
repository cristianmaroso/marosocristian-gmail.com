import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
        };
      };
      user_goals: {
        Row: {
          id: string;
          user_id: string;
          weight: number;
          height: number;
          age: number;
          gender: string;
          activity_level: string;
          goal: string;
          target_weight: number;
          daily_calories: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight: number;
          height: number;
          age: number;
          gender: string;
          activity_level: string;
          goal: string;
          target_weight: number;
          daily_calories: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weight?: number;
          height?: number;
          age?: number;
          gender?: string;
          activity_level?: string;
          goal?: string;
          target_weight?: number;
          daily_calories?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          weight: number | null;
          water_intake: number;
          calories_consumed: number;
          protein: number;
          carbs: number;
          fats: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          weight?: number | null;
          water_intake?: number;
          calories_consumed?: number;
          protein?: number;
          carbs?: number;
          fats?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          weight?: number | null;
          water_intake?: number;
          calories_consumed?: number;
          protein?: number;
          carbs?: number;
          fats?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_type: string;
          food_name: string;
          calories: number;
          protein: number;
          carbs: number;
          fats: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          meal_type: string;
          food_name: string;
          calories: number;
          protein: number;
          carbs: number;
          fats: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          meal_type?: string;
          food_name?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fats?: number;
          created_at?: string;
        };
      };
    };
  };
};
