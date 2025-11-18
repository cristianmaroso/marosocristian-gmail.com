'use client';

import { useState } from 'react';
import { Play, Trophy, Target, Dumbbell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { availableWorkouts, todayActivities } from '@/lib/mock-data';
import { CHALLENGES } from '@/lib/constants';
import WorkoutDialog from '../dialogs/WorkoutDialog';
import ChallengesSection from '../widgets/ChallengesSection';

export default function ActivitiesTab() {
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);

  const totalMinutes = todayActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalCalories = todayActivities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return difficulty;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Resumo do dia */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#3ED1A1]/10 rounded-full">
                <Clock className="w-6 h-6 text-[#3ED1A1]" />
              </div>
              <div>
                <p className="text-sm text-[#4A5568]">Minutos Hoje</p>
                <p className="text-2xl font-bold text-[#2D3748]">{totalMinutes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#005A70]/10 rounded-full">
                <Target className="w-6 h-6 text-[#005A70]" />
              </div>
              <div>
                <p className="text-sm text-[#4A5568]">Calorias</p>
                <p className="text-2xl font-bold text-[#2D3748]">{totalCalories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workouts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#E2E8F0]">
          <TabsTrigger value="workouts">Treinos</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
        </TabsList>

        {/* Tab de Treinos */}
        <TabsContent value="workouts" className="space-y-4 mt-4">
          {/* Atividades de hoje */}
          {todayActivities.length > 0 && (
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#005A70]">Atividades de Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-[#F7FAFC] rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-[#2D3748]">
                        {activity.activityType}
                      </p>
                      <p className="text-sm text-[#4A5568]">
                        {activity.duration} minutos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#005A70]">
                        -{activity.caloriesBurned}
                      </p>
                      <p className="text-xs text-[#4A5568]">kcal</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Treinos disponíveis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2D3748]">
              Treinos Recomendados
            </h3>
            {availableWorkouts.map((workout) => (
              <Card
                key={workout.id}
                className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedWorkout(workout);
                  setShowWorkoutDialog(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-[#2D3748]">
                          {workout.title}
                        </h4>
                        {workout.isPremium && (
                          <Badge className="bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white text-xs">
                            PRO
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#4A5568] mb-2">
                        {workout.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#4A5568]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {workout.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          ~{workout.caloriesBurn} kcal
                        </span>
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(workout.difficulty)}
                        >
                          {getDifficultyLabel(workout.difficulty)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#3ED1A1] hover:bg-[#3ED1A1]/90 text-white ml-3"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab de Desafios */}
        <TabsContent value="challenges" className="mt-4">
          <ChallengesSection />
        </TabsContent>
      </Tabs>

      {/* Dialog de treino */}
      <WorkoutDialog
        workout={selectedWorkout}
        open={showWorkoutDialog}
        onClose={() => {
          setShowWorkoutDialog(false);
          setSelectedWorkout(null);
        }}
      />
    </div>
  );
}
