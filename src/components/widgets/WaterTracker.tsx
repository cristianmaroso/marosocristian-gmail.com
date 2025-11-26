'use client';

import { useState } from 'react';
import { Droplet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { WaterEntry } from '@/lib/types';
import { toast } from 'sonner';
import { updateWaterIntake } from '@/lib/database';

interface WaterTrackerProps {
  entries: WaterEntry[];
  userId: string;
  onWaterUpdate: () => void;
}

export default function WaterTracker({ entries, userId, onWaterUpdate }: WaterTrackerProps) {
  const [localEntries, setLocalEntries] = useState(entries);
  const [loading, setLoading] = useState(false);
  
  const totalWater = localEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const waterGoal = 2500; // ml
  const percentage = Math.min((totalWater / waterGoal) * 100, 100);

  const quickAmounts = [200, 300, 500, 750];

  const addWater = async (amount: number) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const newTotal = totalWater + amount;
      
      await updateWaterIntake(userId, today, newTotal);
      
      const newEntry: WaterEntry = {
        id: `water-${Date.now()}`,
        userId,
        date: new Date(),
        amount,
        time: new Date(),
      };
      
      setLocalEntries([...localEntries, newEntry]);
      toast.success(`${amount}ml de água registrados!`);
      onWaterUpdate();
    } catch (error: any) {
      toast.error('Erro ao registrar água: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Card principal de hidratação */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#005A70]">
            <Droplet className="w-5 h-5" />
            Hidratação do Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-5xl font-bold text-[#2D3748] mb-2">
              {((totalWater || 0) / 1000).toFixed(1)}L
            </p>
            <p className="text-[#4A5568]">
              de {((waterGoal || 0) / 1000).toFixed(1)}L
            </p>
          </div>

          <Progress value={percentage || 0} className="h-4" />

          <div className="text-center text-sm text-[#4A5568]">
            {percentage >= 100 ? (
              <span className="text-[#3ED1A1] font-semibold">
                🎉 Meta de hidratação alcançada!
              </span>
            ) : (
              <span>
                Faltam {(((waterGoal || 0) - (totalWater || 0)) / 1000).toFixed(1)}L para sua meta
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botões rápidos */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#005A70] text-base">
            Adicionar Água Rapidamente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => addWater(amount)}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center border-[#3ED1A1] text-[#005A70] hover:bg-[#3ED1A1]/10"
                disabled={loading}
              >
                <Droplet className="w-6 h-6 mb-1" />
                <span className="font-semibold">{amount}ml</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico do dia */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#005A70] text-base">
            Histórico de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {localEntries.length === 0 ? (
            <div className="text-center py-8 text-[#4A5568]">
              <Droplet className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum registro de água hoje</p>
            </div>
          ) : (
            <div className="space-y-2">
              {localEntries
                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-[#F7FAFC] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3ED1A1]/20 flex items-center justify-center">
                        <Droplet className="w-5 h-5 text-[#3ED1A1]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#2D3748]">
                          {entry.amount || 0}ml
                        </p>
                        <p className="text-sm text-[#4A5568]">
                          {formatTime(entry.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dicas de hidratação */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-[#3ED1A1]/10 to-[#005A70]/10">
        <CardHeader>
          <CardTitle className="text-[#005A70] text-base">
            💡 Dicas de Hidratação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[#2D3748]">
          <p>• Beba água ao acordar para ativar o metabolismo</p>
          <p>• Mantenha uma garrafa de água sempre por perto</p>
          <p>• Beba água antes, durante e após exercícios</p>
          <p>• Se sentir sede, você já está desidratado</p>
        </CardContent>
      </Card>
    </div>
  );
}