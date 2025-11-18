// Serviço de IA para FitVida Pro

import type { FoodEntry, MealPlan, User } from './types';

// Analisar imagem de comida usando IA
export async function analyzeFoodImage(imageFile: File): Promise<{
  foods: Array<{
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidence: number;
  }>;
  totalCalories: number;
}> {
  try {
    // Converter imagem para base64
    const base64Image = await fileToBase64(imageFile);

    // Chamar API OpenAI Vision
    const response = await fetch('/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      throw new Error('Erro ao analisar imagem');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    throw error;
  }
}

// Gerar plano alimentar personalizado
export async function generateMealPlan(user: User, preferences: {
  restrictions: string[];
  dislikes?: string[];
  targetCalories: number;
}): Promise<MealPlan> {
  try {
    const response = await fetch('/api/generate-meal-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        preferences,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar plano alimentar');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao gerar plano alimentar:', error);
    throw error;
  }
}

// Gerar dicas de coaching personalizadas
export async function generateCoachingTips(
  user: User,
  recentStats: {
    caloriesConsumed: number;
    caloriesBurned: number;
    waterIntake: number;
    activityMinutes: number;
    macros: { protein: number; carbs: number; fat: number };
  }
): Promise<string[]> {
  try {
    const response = await fetch('/api/coaching-tips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        stats: recentStats,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar dicas');
    }

    const data = await response.json();
    return data.tips;
  } catch (error) {
    console.error('Erro ao gerar dicas:', error);
    return [
      'Continue se hidratando ao longo do dia!',
      'Lembre-se de incluir proteínas em todas as refeições.',
      'Pequenas caminhadas fazem grande diferença!',
    ];
  }
}

// Processar comando de voz
export async function processVoiceCommand(command: string): Promise<{
  action: 'log_meal' | 'log_water' | 'log_activity' | 'query' | 'unknown';
  data?: any;
  response: string;
}> {
  try {
    const response = await fetch('/api/voice-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      throw new Error('Erro ao processar comando');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao processar comando:', error);
    return {
      action: 'unknown',
      response: 'Desculpe, não entendi o comando. Tente novamente.',
    };
  }
}

// Analisar tendências e fazer ajustes automáticos
export async function analyzeProgressAndAdjust(
  user: User,
  weeklyStats: Array<{
    date: Date;
    weight: number;
    caloriesConsumed: number;
    caloriesBurned: number;
  }>
): Promise<{
  recommendation: string;
  adjustedCalorieGoal: number;
  insights: string[];
}> {
  try {
    const response = await fetch('/api/analyze-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        weeklyStats,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao analisar progresso');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao analisar progresso:', error);
    throw error;
  }
}

// Converter arquivo para base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
}

// Buscar informações nutricionais de alimento
export async function searchFoodNutrition(foodName: string): Promise<{
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  servingSize: string;
}[]> {
  try {
    const response = await fetch(`/api/search-food?q=${encodeURIComponent(foodName)}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar alimento');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar alimento:', error);
    return [];
  }
}
