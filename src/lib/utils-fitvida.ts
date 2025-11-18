// Utilitários e funções auxiliares do FitVida Pro

import { CALORIE_MULTIPLIERS, GOAL_ADJUSTMENTS } from './constants';
import type { User, DailyStats, FoodEntry } from './types';

// Calcular TMB (Taxa Metabólica Basal) usando fórmula de Mifflin-St Jeor
export function calculateBMR(user: User): number {
  const { weight, height, age, gender } = user;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Calcular TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(user: User): number {
  const bmr = calculateBMR(user);
  const multiplier = CALORIE_MULTIPLIERS[user.activityLevel];
  return Math.round(bmr * multiplier);
}

// Calcular meta calórica diária baseada no objetivo
export function calculateDailyCalorieGoal(user: User): number {
  const tdee = calculateTDEE(user);
  const adjustment = GOAL_ADJUSTMENTS[user.goal];
  return Math.round(tdee + adjustment);
}

// Calcular progresso de peso
export function calculateWeightProgress(user: User): {
  current: number;
  target: number;
  remaining: number;
  percentage: number;
} {
  const { currentWeight, targetWeight } = user;
  const totalToLose = Math.abs(currentWeight - targetWeight);
  const remaining = Math.abs(currentWeight - targetWeight);
  const lost = totalToLose - remaining;
  const percentage = totalToLose > 0 ? (lost / totalToLose) * 100 : 0;

  return {
    current: currentWeight,
    target: targetWeight,
    remaining,
    percentage: Math.min(percentage, 100),
  };
}

// Analisar déficit/superávit calórico
export function analyzeCalorieBalance(stats: DailyStats, goal: number): {
  balance: number;
  status: 'deficit' | 'surplus' | 'balanced';
  message: string;
} {
  const netCalories = stats.caloriesConsumed - stats.caloriesBurned;
  const balance = netCalories - goal;

  let status: 'deficit' | 'surplus' | 'balanced';
  let message: string;

  if (Math.abs(balance) < 100) {
    status = 'balanced';
    message = 'Você está no caminho certo! Calorias equilibradas.';
  } else if (balance < 0) {
    status = 'deficit';
    message = `Déficit de ${Math.abs(balance)} calorias. Ótimo para emagrecimento!`;
  } else {
    status = 'surplus';
    message = `Superávit de ${balance} calorias. Cuidado para não exceder a meta.`;
  }

  return { balance, status, message };
}

// Analisar macronutrientes
export function analyzeMacros(entries: FoodEntry[]): {
  protein: number;
  carbs: number;
  fat: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
  recommendations: string[];
} {
  const totals = entries.reduce(
    (acc, entry) => ({
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  const totalCalories = totals.protein * 4 + totals.carbs * 4 + totals.fat * 9;
  
  const proteinPercentage = totalCalories > 0 ? (totals.protein * 4 / totalCalories) * 100 : 0;
  const carbsPercentage = totalCalories > 0 ? (totals.carbs * 4 / totalCalories) * 100 : 0;
  const fatPercentage = totalCalories > 0 ? (totals.fat * 9 / totalCalories) * 100 : 0;

  const recommendations: string[] = [];

  if (proteinPercentage < 20) {
    recommendations.push('Sua ingestão de proteína está baixa. Adicione mais carnes magras, ovos ou leguminosas.');
  }
  if (carbsPercentage > 50) {
    recommendations.push('Seu consumo de carboidratos está alto. Considere reduzir pães e massas.');
  }
  if (fatPercentage < 20) {
    recommendations.push('Gorduras saudáveis são importantes! Adicione abacate, castanhas ou azeite.');
  }

  return {
    ...totals,
    proteinPercentage,
    carbsPercentage,
    fatPercentage,
    recommendations,
  };
}

// Gerar mensagem de coaching personalizada
export function generateCoachingMessage(stats: DailyStats, user: User): string {
  const calorieGoal = calculateDailyCalorieGoal(user);
  const waterGoal = user.gender === 'male' ? 3000 : 2500;
  
  const messages: string[] = [];

  // Análise de calorias
  if (stats.caloriesConsumed < calorieGoal * 0.7) {
    messages.push('Você está comendo muito pouco! Isso pode desacelerar seu metabolismo.');
  } else if (stats.caloriesConsumed > calorieGoal * 1.2) {
    messages.push('Cuidado! Você ultrapassou sua meta calórica em mais de 20%.');
  } else {
    messages.push('Ótimo trabalho mantendo suas calorias dentro da meta!');
  }

  // Análise de hidratação
  if (stats.waterIntake < waterGoal * 0.5) {
    messages.push('⚠️ Sua hidratação está muito baixa! Beba mais água.');
  } else if (stats.waterIntake >= waterGoal) {
    messages.push('💧 Excelente hidratação hoje!');
  }

  // Análise de atividade física
  if (stats.activityMinutes === 0) {
    messages.push('Que tal fazer uma caminhada de 15 minutos hoje?');
  } else if (stats.activityMinutes >= 30) {
    messages.push('🏃 Parabéns pelos exercícios! Continue assim!');
  }

  return messages.join(' ');
}

// Detectar áreas defasadas
export function detectDeficientAreas(stats: DailyStats, user: User): {
  area: 'hydration' | 'calories' | 'activity' | 'none';
  priority: 'high' | 'medium' | 'low';
  message: string;
}[] {
  const calorieGoal = calculateDailyCalorieGoal(user);
  const waterGoal = user.gender === 'male' ? 3000 : 2500;
  const deficiencies: {
    area: 'hydration' | 'calories' | 'activity' | 'none';
    priority: 'high' | 'medium' | 'low';
    message: string;
  }[] = [];

  // Verificar hidratação
  const waterPercentage = (stats.waterIntake / waterGoal) * 100;
  if (waterPercentage < 30) {
    deficiencies.push({
      area: 'hydration',
      priority: 'high',
      message: 'Hidratação crítica! Beba água agora.',
    });
  } else if (waterPercentage < 60) {
    deficiencies.push({
      area: 'hydration',
      priority: 'medium',
      message: 'Você precisa beber mais água hoje.',
    });
  }

  // Verificar calorias
  const caloriePercentage = (stats.caloriesConsumed / calorieGoal) * 100;
  if (caloriePercentage < 50 && new Date().getHours() > 18) {
    deficiencies.push({
      area: 'calories',
      priority: 'high',
      message: 'Você comeu muito pouco hoje!',
    });
  }

  // Verificar atividade física
  if (stats.activityMinutes === 0 && new Date().getHours() > 16) {
    deficiencies.push({
      area: 'activity',
      priority: 'medium',
      message: 'Ainda não se exercitou hoje. Que tal uma caminhada?',
    });
  }

  return deficiencies.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// Formatar data
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Formatar hora
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Calcular tempo relativo
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  return `${Math.floor(diffInSeconds / 86400)}d atrás`;
}

// Gerar ID único
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
