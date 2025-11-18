'use client';

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

export default function DashboardTab() {
  const calorieGoal = calculateDailyCalorieGoal(mockUser);
  const waterGoal = mockUser.gender === 'male' ? 3000 : 2500;
  const weightProgress = calculateWeightProgress(mockUser);
  const deficiencies = detectDeficientAreas(todayStats, mockUser);

  const caloriePercentage = (todayStats.caloriesConsumed / calorieGoal) * 100;
  const waterPercentage = (todayStats.waterIntake / waterGoal) * 100;
  const netCalories = todayStats.caloriesConsumed - todayStats.caloriesBurned;

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
        <h2 className="text-2xl font-bold mb-2">Olá, {mockUser.name}! 👋</h2>
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
                  {todayStats.caloriesConsumed}
                </p>
                <p className="text-sm text-[#4A5568]">de {calorieGoal} kcal</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4A5568]">Restante</p>
                <p className="text-xl font-semibold text-[#3ED1A1]">
                  {Math.max(0, calorieGoal - netCalories)}
                </p>
              </div>
            </div>
            <Progress value={Math.min(caloriePercentage, 100)} className="h-3" />
            
            {/* Macros */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div className="text-center">
                <p className="text-xs text-[#4A5568]">Proteína</p>
                <p className="text-sm font-semibold text-[#005A70]">
                  {todayStats.macros.protein}g
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#4A5568]">Carboidratos</p>
                <p className="text-sm font-semibold text-[#005A70]">
                  {todayStats.macros.carbs}g
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#4A5568]">Gordura</p>
                <p className="text-sm font-semibold text-[#005A70]">
                  {todayStats.macros.fat}g
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
                  {(todayStats.waterIntake / 1000).toFixed(1)}L
                </p>
                <p className="text-sm text-[#4A5568]">
                  de {(waterGoal / 1000).toFixed(1)}L
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4A5568]">Faltam</p>
                <p className="text-xl font-semibold text-[#3ED1A1]">
                  {((waterGoal - todayStats.waterIntake) / 1000).toFixed(1)}L
                </p>
              </div>
            </div>
            <Progress value={Math.min(waterPercentage, 100)} className="h-3" />
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
                  {todayStats.activityMinutes}
                </p>
                <p className="text-sm text-[#4A5568]">minutos</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4A5568]">Calorias</p>
                <p className="text-xl font-semibold text-[#3ED1A1]">
                  -{todayStats.caloriesBurned}
                </p>
              </div>
            </div>
            <Progress 
              value={Math.min((todayStats.activityMinutes / 30) * 100, 100)} 
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
                  {weightProgress.current}kg
                </p>
                <p className="text-sm text-[#4A5568]">
                  Meta: {weightProgress.target}kg
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#4A5568]">Faltam</p>
                <p className="text-xl font-semibold text-[#3ED1A1]">
                  {weightProgress.remaining.toFixed(1)}kg
                </p>
              </div>
            </div>
            <Progress value={weightProgress.percentage} className="h-3" />
            <p className="text-xs text-[#4A5568] pt-2">
              🎉 {weightProgress.percentage.toFixed(0)}% do objetivo alcançado
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
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#4A5568] w-12">
                  {day.day}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#3ED1A1] h-full rounded-full transition-all"
                        style={{ width: `${Math.min((day.calories / calorieGoal) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#4A5568] w-16 text-right">
                      {day.calories} kcal
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
