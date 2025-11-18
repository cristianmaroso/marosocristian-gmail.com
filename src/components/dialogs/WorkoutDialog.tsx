'use client';

import { Play, Clock, Target, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface WorkoutDialogProps {
  workout: any;
  open: boolean;
  onClose: () => void;
}

export default function WorkoutDialog({ workout, open, onClose }: WorkoutDialogProps) {
  if (!workout) return null;

  const handleStartWorkout = () => {
    toast.success(`Treino "${workout.title}" iniciado!`);
    onClose();
  };

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#005A70] flex items-center gap-2">
            {workout.title}
            {workout.isPremium && (
              <Badge className="bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white">
                PRO
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do treino */}
          <div className="space-y-3">
            <p className="text-[#4A5568]">{workout.description}</p>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#F7FAFC] rounded-lg">
                <Clock className="w-4 h-4 text-[#4A5568]" />
                <span className="text-sm text-[#2D3748]">
                  {workout.duration} minutos
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#F7FAFC] rounded-lg">
                <Target className="w-4 h-4 text-[#4A5568]" />
                <span className="text-sm text-[#2D3748]">
                  ~{workout.caloriesBurn} kcal
                </span>
              </div>
              <Badge
                variant="outline"
                className={getDifficultyColor(workout.difficulty)}
              >
                {getDifficultyLabel(workout.difficulty)}
              </Badge>
            </div>
          </div>

          {/* Exercícios */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#2D3748]">Exercícios</h4>
            <div className="space-y-3">
              {workout.exercises.map((exercise: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-[#2D3748]">
                      {index + 1}. {exercise.name}
                    </h5>
                    {exercise.duration > 0 && (
                      <span className="text-sm text-[#4A5568]">
                        {exercise.duration} min
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#4A5568] mb-2">
                    {exercise.description}
                  </p>
                  {(exercise.sets || exercise.reps) && (
                    <div className="flex gap-3 text-xs text-[#4A5568]">
                      {exercise.sets && <span>{exercise.sets} séries</span>}
                      {exercise.reps && <span>{exercise.reps} repetições</span>}
                      {exercise.restTime && (
                        <span>{exercise.restTime}s descanso</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              onClick={handleStartWorkout}
              className="flex-1 bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white hover:opacity-90"
              disabled={workout.isPremium}
            >
              <Play className="w-4 h-4 mr-2" />
              {workout.isPremium ? 'Requer Plano PRO' : 'Iniciar Treino'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
