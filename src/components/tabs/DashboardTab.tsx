'use client';

import { useState, useEffect } from 'react';
import { 
  Flame, 
  Droplet, 
  Activity, 
  TrendingDown, 
  AlertCircle,
  Zap,
  Target
} from 'lucide-react';
import { mockUser, todayStats, weeklyData } from '@/lib/mock-data';
import { 
  calculateDailyCalorieGoal, 
  calculateWeightProgress,
  detectDeficientAreas 
} from '@/lib/utils-fitvida';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserGoals, getDailyLog, getDailyLogs, UserGoals, DailyLog } from '@/lib/database';

interface DashboardTabProps {
  userId: string;
}

export default function DashboardTab({ userId }: DashboardTabProps) {
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [goalsData, todayLogData, weeklyLogsData] = await Promise.all([
        getUserGoals(userId),
        getDailyLog(userId, today),
        getDailyLogs(userId, weekAgo, today)
      ]);

      setGoals(goalsData);
      setTodayLog(todayLogData);
      setWeeklyLogs(weeklyLogsData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const calorieGoal = goals ? calculateDailyCalorieGoal(goals) : 2000;
  const waterGoal = goals?.gender === 'male' ? 3000 : 2500;
  const weightProgress = goals ? calculateWeightProgress({
    currentWeight: goals.weight,
    targetWeight: goals.target_weight,
    startWeight: goals.weight
  }) : { current: 0, target: 0, remaining: 0, percentage: 0 };

  const currentStats = todayLog || {
    calories_consumed: 0,
    water_intake: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    calories_burned: 0,
    activity_minutes: 0
  };

  const deficiencies = detectDeficientAreas({
    caloriesConsumed: currentStats.calories_consumed,
    waterIntake: currentStats.water_intake,
    protein: currentStats.protein,
    carbs: currentStats.carbs,
    fats: currentStats.fats,
    activityMinutes: currentStats.activity_minutes || 0
  }, goals || mockUser);

  const caloriePercentage = (currentStats.calories_consumed / calorieGoal) * 100;
  const waterPercentage = (currentStats.water_intake / waterGoal) * 100;
  const netCalories = currentStats.calories_consumed - (currentStats.calories_burned || 0);

  // Função helper para garantir que valores numéricos sejam válidos
  const safeNumber = (value: number, fallback: number = 0): number => {
    return isNaN(value) || !isFinite(value) ? fallback : value;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Alerta de área defasada */}
      {deficiencies.length > 0 && (
        <Alert className={`border-l-4 ${
          deficiencies[0].priority === 'high' 
            ? 'border-red-500 bg-red-50' 
            : 'border-yellow-500 bg-yellow-50'
        }`}>
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            {deficiencies[0].message}
          </AlertDescription>
        </Alert>
      )}

      {/* Saudação e motivação */}
      <div className="bg-gradient-to-r from-[#005A70] to-[#3ED1A1] rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Olá, {goals?.weight ? 'Usuário' : 'Bem-vindo'}! 👋</h2>
        <p className="text-white/90">
          Você está indo muito bem! Continue assim e alcance seus objetivos.
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calorias */}
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#005A70]">
              <Flame className="w-5 h-5" />
              Calorias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-3xl font-bold text-[#2D3748]">
                  {safeNumber(currentStats.calories_consumed).toString()}
                </p>
                <p className="text-sm text-[#4A5568]">de {safeNumber(calorieGoal).toString()} kcal</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4A5568]">Restante</p>
                <p className="text-xl font-semibold text-[#3ED1A1]">
                  {safeNumber(Math.max(0, calorieGoal - netCalories)).toString()}
                </p>
              </div>
            </div>
            <Progress value={Math.min(safeNumber(caloriePercentage), 100)} className="h-3" />
            
            {/* Macros */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div className="text-center">
                <p className="text-xs text-[#4A5568]">Proteína</p>
                <p className="text-sm font-semibold text-[#005A70]">
                  {safeNumber(currentStats.protein).toString()}g
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#4A5568]">Carboidratos</p>
                <p className="text-sm font-semibold text-[#005A70]">
                  {safeNumber(currentStats.carbs).toString()}g
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#4A5568]">Gordura</p>
                <p className="text-sm font-semibold text-[#005A70]">
                  {safeNumber(currentStats.fats).toString()}g
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidratação */}
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#005A70]">
              <Droplet className="w-5 h-5" />
              Hidratação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-3xl font-bold text-[#2D3748]">
                  {safeNumber(currentStats.water_intake / 1000).toFixed(1)}L
                </p>
                <p className="text-sm text-[#4A5568]">
                  de {safeNumber(waterGoal / 1000).toFixed(1)}L
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4A5568]">Faltam</p>
                <p className="text-xl font-semibold text-[#3ED1A1]">
                  {safeNumber((waterGoal - currentStats.water_intake) / 1000).toFixed(1)}L
                </p>
              </div>
            </div>
            <Progress value={Math.min(safeNumber(waterPercentage), 100)} className="h-3" />
            <p className="text-xs text-[#4A5568] pt-2">
              💧 Beba água regularmente ao longo do dia
            </p>
          </CardContent>
        </Card>

        {/* Atividade Física */}
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#005A70]">
              <Activity className="w-5 h-5" />
              Atividade Física
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-3xl font-bold text-[#2D3748]">
                  {safeNumber(currentStats.activity_minutes || 0).toString()}
                </p>
                <p className="text-sm text-[#4A5568]">minutos</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4A5568]">Calorias</p>
                <p className="text-xl font-semibold text-[#3ED1A1]">
                  -{safeNumber(currentStats.calories_burned || 0).toString()}
                </p>
              </div>
            </div>
            <Progress 
              value={Math.min(safeNumber(((currentStats.activity_minutes || 0) / 30) * 100), 100)} 
              className="h-3" 
            />
            <p className="text-xs text-[#4A5568] pt-2">
              🎯 Meta: 30 minutos por dia
            </p>
          </CardContent>
        </Card>

        {/* Peso */}
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#005A70]">
              <TrendingDown className="w-5 h-5" />
              Progresso de Peso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-3xl font-bold text-[#2D3748]">
                  {safeNumber(weightProgress.current).toString()}kg
                </p>
                <p className="text-sm text-[#4A5568]">
                  Meta: {safeNumber(weightProgress.target).toString()}kg
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4A5568]">Faltam</p>
                <p className="text-xl font-semibold text-[#3ED1A1]">
                  {safeNumber(weightProgress.remaining).toFixed(1)}kg
                </p>
              </div>
            </div>
            <Progress value={safeNumber(weightProgress.percentage)} className="h-3" />
            <p className="text-xs text-[#4A5568] pt-2">
              🎉 {safeNumber(weightProgress.percentage).toFixed(0)}% do objetivo alcançado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso Semanal */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#005A70]">
            <Target className="w-5 h-5" />
            Progresso Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyLogs.slice(-7).map((log, index) => {
              const date = new Date(log.date);
              const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
              return (
                <div key={log.date} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#4A5568] w-12">
                    {dayName}
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#3ED1A1] h-full rounded-full transition-all"
                          style={{ width: `${Math.min(safeNumber((log.calories_consumed / calorieGoal) * 100), 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#4A5568] w-16 text-right">
                        {safeNumber(log.calories_consumed).toString()} kcal
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dicas do Coach */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-[#005A70]/5 to-[#3ED1A1]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#005A70]">
            <Zap className="w-5 h-5" />
            Dica do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#2D3748]">
            Sua ingestão de proteína está ótima! Continue incluindo fontes magras 
            em todas as refeições para manter a saciedade e preservar massa muscular.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}