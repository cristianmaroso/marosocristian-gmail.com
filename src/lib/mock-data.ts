// Mock data store para FitVida Pro (simulação de banco de dados)

import type { 
  User, 
  FoodEntry, 
  WaterEntry, 
  ActivityEntry, 
  DailyStats,
  Achievement,
  CommunityPost,
  Workout
} from './types';
import { generateId } from './utils-fitvida';

// Usuário mock
export const mockUser: User = {
  id: 'user-1',
  name: 'Maria Silva',
  email: 'maria@example.com',
  isPremium: false,
  currentWeight: 75,
  targetWeight: 65,
  height: 165,
  age: 32,
  gender: 'female',
  activityLevel: 'moderate',
  goal: 'lose',
  dietaryRestrictions: ['Sem Lactose'],
  healthConditions: [],
  createdAt: new Date('2024-01-01'),
};

// Dados do dia atual
export const todayStats: DailyStats = {
  date: new Date(),
  caloriesConsumed: 1450,
  caloriesBurned: 320,
  waterIntake: 1800,
  activityMinutes: 45,
  weight: 75,
  macros: {
    protein: 85,
    carbs: 160,
    fat: 48,
  },
};

// Entradas de alimentos de hoje
export const todayFoodEntries: FoodEntry[] = [
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    mealType: 'breakfast',
    foodName: 'Omelete com legumes',
    calories: 320,
    protein: 24,
    carbs: 12,
    fat: 18,
    portion: '2 ovos + vegetais',
    isAIDetected: false,
  },
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    mealType: 'breakfast',
    foodName: 'Café com leite de amêndoas',
    calories: 80,
    protein: 2,
    carbs: 8,
    fat: 4,
    portion: '200ml',
    isAIDetected: false,
  },
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    mealType: 'lunch',
    foodName: 'Frango grelhado',
    calories: 280,
    protein: 42,
    carbs: 0,
    fat: 12,
    portion: '150g',
    isAIDetected: false,
  },
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    mealType: 'lunch',
    foodName: 'Arroz integral',
    calories: 220,
    protein: 5,
    carbs: 45,
    fat: 2,
    portion: '100g',
    isAIDetected: false,
  },
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    mealType: 'lunch',
    foodName: 'Salada verde',
    calories: 50,
    protein: 2,
    carbs: 8,
    fat: 1,
    portion: '1 prato',
    isAIDetected: false,
  },
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    mealType: 'snack',
    foodName: 'Iogurte grego com frutas',
    calories: 180,
    protein: 15,
    carbs: 22,
    fat: 4,
    portion: '150g',
    isAIDetected: false,
  },
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    mealType: 'dinner',
    foodName: 'Salmão grelhado',
    calories: 320,
    protein: 35,
    carbs: 0,
    fat: 18,
    portion: '120g',
    isAIDetected: false,
  },
];

// Entradas de água
export const todayWaterEntries: WaterEntry[] = [
  { id: generateId(), userId: 'user-1', date: new Date(), amount: 300, time: new Date(new Date().setHours(8, 0)) },
  { id: generateId(), userId: 'user-1', date: new Date(), amount: 500, time: new Date(new Date().setHours(10, 30)) },
  { id: generateId(), userId: 'user-1', date: new Date(), amount: 400, time: new Date(new Date().setHours(13, 0)) },
  { id: generateId(), userId: 'user-1', date: new Date(), amount: 300, time: new Date(new Date().setHours(15, 30)) },
  { id: generateId(), userId: 'user-1', date: new Date(), amount: 300, time: new Date(new Date().setHours(18, 0)) },
];

// Atividades de hoje
export const todayActivities: ActivityEntry[] = [
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    activityType: 'Caminhada',
    duration: 30,
    caloriesBurned: 120,
    intensity: 'medium',
  },
  {
    id: generateId(),
    userId: 'user-1',
    date: new Date(),
    activityType: 'Yoga',
    duration: 15,
    caloriesBurned: 45,
    intensity: 'low',
  },
];

// Conquistas
export const userAchievements: Achievement[] = [
  {
    id: 'first-meal',
    title: 'Primeira Refeição',
    description: 'Registre sua primeira refeição',
    icon: 'utensils',
    unlockedAt: new Date('2024-01-01'),
    progress: 1,
    target: 1,
  },
  {
    id: 'week-streak',
    title: 'Semana Completa',
    description: 'Registre refeições por 7 dias seguidos',
    icon: 'calendar',
    unlockedAt: new Date('2024-01-07'),
    progress: 7,
    target: 7,
  },
  {
    id: 'hydration-master',
    title: 'Mestre da Hidratação',
    description: 'Beba 2L de água por 30 dias',
    icon: 'droplet',
    progress: 18,
    target: 30,
  },
  {
    id: 'weight-loss-5',
    title: 'Primeiros 5kg',
    description: 'Perca 5kg',
    icon: 'trophy',
    progress: 3.5,
    target: 5,
  },
  {
    id: 'workout-warrior',
    title: 'Guerreiro do Treino',
    description: 'Complete 50 treinos',
    icon: 'dumbbell',
    progress: 12,
    target: 50,
  },
];

// Posts da comunidade
export const communityPosts: CommunityPost[] = [
  {
    id: generateId(),
    userId: 'user-2',
    userName: 'João Santos',
    content: 'Perdi 3kg em 2 semanas! O segredo é consistência e hidratação. 💪',
    type: 'progress',
    likes: 45,
    comments: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    userId: 'user-3',
    userName: 'Ana Costa',
    content: 'Receita incrível de panqueca de banana: 1 banana + 2 ovos + canela. Só 180 calorias! 🥞',
    type: 'recipe',
    likes: 89,
    comments: 23,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    userId: 'user-4',
    userName: 'Carlos Mendes',
    content: 'Dica: troque refrigerante por água com limão. Faz toda diferença! 🍋',
    type: 'tip',
    likes: 67,
    comments: 8,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

// Treinos disponíveis
export const availableWorkouts: Workout[] = [
  {
    id: 'workout-1',
    title: 'Caminhada Matinal',
    description: 'Caminhada leve para começar o dia com energia',
    duration: 30,
    difficulty: 'beginner',
    caloriesBurn: 120,
    isPremium: false,
    exercises: [
      {
        name: 'Aquecimento',
        duration: 5,
        description: 'Caminhada leve para aquecer',
      },
      {
        name: 'Caminhada moderada',
        duration: 20,
        description: 'Mantenha um ritmo confortável',
      },
      {
        name: 'Desaceleração',
        duration: 5,
        description: 'Reduza o ritmo gradualmente',
      },
    ],
  },
  {
    id: 'workout-2',
    title: 'HIIT Iniciante',
    description: 'Treino intervalado de alta intensidade para queimar calorias',
    duration: 20,
    difficulty: 'intermediate',
    caloriesBurn: 240,
    isPremium: true,
    exercises: [
      {
        name: 'Polichinelos',
        duration: 1,
        sets: 3,
        restTime: 30,
        description: 'Saltos abrindo e fechando braços e pernas',
      },
      {
        name: 'Burpees',
        duration: 1,
        sets: 3,
        restTime: 30,
        description: 'Agachamento + prancha + salto',
      },
      {
        name: 'Mountain Climbers',
        duration: 1,
        sets: 3,
        restTime: 30,
        description: 'Posição de prancha alternando joelhos ao peito',
      },
    ],
  },
  {
    id: 'workout-3',
    title: 'Yoga Relaxante',
    description: 'Sequência de yoga para flexibilidade e relaxamento',
    duration: 25,
    difficulty: 'beginner',
    caloriesBurn: 75,
    isPremium: false,
    exercises: [
      {
        name: 'Saudação ao Sol',
        duration: 5,
        description: 'Sequência clássica de aquecimento',
      },
      {
        name: 'Posturas de equilíbrio',
        duration: 10,
        description: 'Árvore, guerreiro III',
      },
      {
        name: 'Alongamentos finais',
        duration: 10,
        description: 'Relaxamento e respiração',
      },
    ],
  },
  {
    id: 'workout-4',
    title: 'Força em Casa',
    description: 'Treino de força sem equipamentos',
    duration: 35,
    difficulty: 'intermediate',
    caloriesBurn: 210,
    isPremium: true,
    exercises: [
      {
        name: 'Flexões',
        sets: 3,
        reps: 12,
        restTime: 60,
        duration: 0,
        description: 'Flexões tradicionais ou de joelhos',
      },
      {
        name: 'Agachamentos',
        sets: 3,
        reps: 15,
        restTime: 60,
        duration: 0,
        description: 'Agachamento livre',
      },
      {
        name: 'Prancha',
        duration: 1,
        sets: 3,
        restTime: 60,
        description: 'Mantenha a posição de prancha',
      },
    ],
  },
];

// Dados semanais para gráficos
export const weeklyData = [
  { day: 'Seg', calories: 1520, burned: 280, water: 2100, weight: 75.5 },
  { day: 'Ter', calories: 1480, burned: 320, water: 2400, weight: 75.3 },
  { day: 'Qua', calories: 1550, burned: 150, water: 1800, weight: 75.2 },
  { day: 'Qui', calories: 1420, burned: 380, water: 2600, weight: 75.0 },
  { day: 'Sex', calories: 1490, burned: 290, water: 2200, weight: 74.8 },
  { day: 'Sáb', calories: 1680, burned: 200, water: 1900, weight: 75.0 },
  { day: 'Dom', calories: 1450, burned: 320, water: 1800, weight: 75.0 },
];
