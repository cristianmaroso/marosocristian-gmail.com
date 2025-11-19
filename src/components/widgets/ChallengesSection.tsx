'use client';

import { Trophy, Target, Droplet, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CHALLENGES } from '@/lib/constants';

export default function ChallengesSection() {
  // Mock de progresso dos desafios
  const challengeProgress = {
    'hydration-7': 4,
    'sugar-free-30': 12,
    'steps-10k': 7,
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'hydration':
        return <Droplet className="w-5 h-5" />;
      case 'steps':
        return <TrendingUp className="w-5 h-5" />;
      case 'sugar_free':
        return <Target className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#2D3748]">
          Desafios Ativos
        </h3>
        <Badge className="bg-[#3ED1A1] text-white">
          {Object.keys(challengeProgress).length} ativos
        </Badge>
      </div>

      {CHALLENGES.map((challenge) => {
        const progress = challengeProgress[challenge.id as keyof typeof challengeProgress] || 0;
        const percentage = (progress / challenge.duration) * 100;

        return (
          <Card key={challenge.id} className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[#005A70] text-base">
                  {getIcon(challenge.type)}
                  {challenge.title}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {challenge.duration} dias
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-[#4A5568]">
                {challenge.description}
              </p>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#4A5568]">
                  <span>Progresso</span>
                  <span>
                    {progress}/{challenge.duration} dias
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>

              {percentage >= 100 ? (
                <div className="bg-[#3ED1A1]/10 border border-[#3ED1A1] rounded-lg p-3 text-center">
                  <p className="text-sm font-semibold text-[#3ED1A1]">
                    🎉 Desafio Concluído!
                  </p>
                </div>
              ) : (
                <div className="bg-[#F7FAFC] rounded-lg p-3 text-center">
                  <p className="text-sm text-[#4A5568]">
                    Continue assim! Faltam {challenge.duration - progress} dias
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Novos desafios disponíveis */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-[#005A70]/5 to-[#3ED1A1]/5">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-[#005A70]" />
          <h4 className="font-semibold text-[#2D3748] mb-2">
            Mais Desafios em Breve!
          </h4>
          <p className="text-sm text-[#4A5568]">
            Novos desafios semanais serão adicionados para você continuar evoluindo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
