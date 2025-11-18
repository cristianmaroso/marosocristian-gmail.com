// Types para FitVida Pro

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  dietaryRestrictions: string[];
  healthConditions: string[];
  createdAt: Date;
}

export interface FoodEntry {
  id: string;
  userId: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  portion: string;
  imageUrl?: string;
  isAIDetected: boolean;
}

export interface WaterEntry {
  id: string;
  userId: string;
  date: Date;
  amount: number; // em ml
  time: Date;
}

export interface ActivityEntry {
  id: string;
  userId: string;
  date: Date;
  activityType: string;
  duration: number; // em minutos
  caloriesBurned: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface DailyStats {
  date: Date;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake: number;
  activityMinutes: number;
  weight?: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'hydration' | 'steps' | 'sugar_free' | 'custom';
  duration: number; // em dias
  goal: number;
  participants: number;
  startDate: Date;
  endDate: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  date: Date;
  meals: {
    breakfast: MealPlanItem[];
    lunch: MealPlanItem[];
    dinner: MealPlanItem[];
    snacks: MealPlanItem[];
  };
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealPlanItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  recipe?: string;
}

export interface CoachingMessage {
  id: string;
  userId: string;
  date: Date;
  message: string;
  type: 'tip' | 'motivation' | 'warning' | 'achievement';
  priority: 'low' | 'medium' | 'high';
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  type: 'recipe' | 'progress' | 'tip' | 'question';
  likes: number;
  comments: number;
  createdAt: Date;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  caloriesBurn: number;
  exercises: Exercise[];
  isPremium: boolean;
}

export interface Exercise {
  name: string;
  duration: number;
  sets?: number;
  reps?: number;
  restTime?: number;
  description: string;
}
