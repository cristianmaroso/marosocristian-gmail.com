// Constantes do FitVida Pro

export const COLORS = {
  primary: '#005A70', // Azul petróleo
  secondary: '#3ED1A1', // Verde menta
  white: '#FFFFFF',
  graphite: '#2D3748',
  lightGray: '#F7FAFC',
  mediumGray: '#E2E8F0',
  darkGray: '#4A5568',
};

export const MEAL_TYPES = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snack: 'Lanche',
};

export const ACTIVITY_LEVELS = {
  sedentary: 'Sedentário',
  light: 'Levemente Ativo',
  moderate: 'Moderadamente Ativo',
  active: 'Muito Ativo',
  very_active: 'Extremamente Ativo',
};

export const GOALS = {
  lose: 'Emagrecer',
  maintain: 'Manter Peso',
  gain: 'Ganhar Massa',
};

export const DIETARY_RESTRICTIONS = [
  'Vegano',
  'Vegetariano',
  'Low Carb',
  'Sem Glúten',
  'Sem Lactose',
  'Sem Açúcar',
  'Paleo',
  'Cetogênica',
];

export const HEALTH_CONDITIONS = [
  'Diabetes',
  'Hipertensão',
  'Colesterol Alto',
  'Doença Celíaca',
  'Intolerância à Lactose',
  'Nenhuma',
];

export const WORKOUT_TYPES = [
  { id: 'walking', name: 'Caminhada', caloriesPerMin: 4 },
  { id: 'running', name: 'Corrida', caloriesPerMin: 10 },
  { id: 'cycling', name: 'Ciclismo', caloriesPerMin: 8 },
  { id: 'swimming', name: 'Natação', caloriesPerMin: 11 },
  { id: 'hiit', name: 'HIIT', caloriesPerMin: 12 },
  { id: 'yoga', name: 'Yoga', caloriesPerMin: 3 },
  { id: 'strength', name: 'Musculação', caloriesPerMin: 6 },
  { id: 'dance', name: 'Dança', caloriesPerMin: 7 },
];

export const PREMIUM_FEATURES = [
  'Reconhecimento por foto ilimitado',
  'Planos alimentares avançados',
  'Treinos profissionais personalizados',
  'Relatórios completos em PDF',
  'Ajustes automáticos de metas',
  'Acesso à comunidade completa',
  'Coaching IA avançado',
  'Análise de tendências',
  'Suporte prioritário',
];

export const CHALLENGES = [
  {
    id: 'hydration-7',
    title: 'Desafio de 7 Dias de Hidratação',
    description: 'Beba 2L de água por dia durante 7 dias',
    type: 'hydration',
    duration: 7,
    goal: 2000,
  },
  {
    id: 'sugar-free-30',
    title: 'Desafio 30 Dias Sem Açúcar',
    description: 'Elimine açúcar refinado por 30 dias',
    type: 'sugar_free',
    duration: 30,
    goal: 30,
  },
  {
    id: 'steps-10k',
    title: 'Desafio 10.000 Passos',
    description: 'Caminhe 10.000 passos por dia durante 21 dias',
    type: 'steps',
    duration: 21,
    goal: 10000,
  },
];

export const ACHIEVEMENTS = [
  {
    id: 'first-meal',
    title: 'Primeira Refeição',
    description: 'Registre sua primeira refeição',
    icon: 'utensils',
    target: 1,
  },
  {
    id: 'week-streak',
    title: 'Semana Completa',
    description: 'Registre refeições por 7 dias seguidos',
    icon: 'calendar',
    target: 7,
  },
  {
    id: 'hydration-master',
    title: 'Mestre da Hidratação',
    description: 'Beba 2L de água por 30 dias',
    icon: 'droplet',
    target: 30,
  },
  {
    id: 'weight-loss-5',
    title: 'Primeiros 5kg',
    description: 'Perca 5kg',
    icon: 'trophy',
    target: 5,
  },
  {
    id: 'workout-warrior',
    title: 'Guerreiro do Treino',
    description: 'Complete 50 treinos',
    icon: 'dumbbell',
    target: 50,
  },
];

export const WATER_GOALS = {
  male: 3000, // ml
  female: 2500, // ml
  default: 2500,
};

export const CALORIE_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const GOAL_ADJUSTMENTS = {
  lose: -500, // déficit calórico
  maintain: 0,
  gain: 300, // superávit calórico
};
