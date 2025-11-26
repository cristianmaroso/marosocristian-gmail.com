'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { saveMeal } from '@/lib/database';

interface AddFoodDialogProps {
  open: boolean;
  onClose: () => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  userId: string;
  onMealAdded: () => void;
}

export default function AddFoodDialog({ open, onClose, mealType, userId, onMealAdded }: AddFoodDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName || !calories) {
      toast.error('Preencha pelo menos o nome e as calorias');
      return;
    }

    setLoading(true);

    try {
      await saveMeal(userId, {
        date: new Date().toISOString().split('T')[0],
        meal_type: mealType,
        food_name: foodName,
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fats: parseFloat(fat) || 0,
      });

      toast.success('Alimento adicionado com sucesso!');
      onMealAdded();
      onClose();
      
      // Reset form
      setFoodName('');
      setPortion('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
    } catch (error: any) {
      toast.error('Erro ao adicionar alimento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#005A70]">Adicionar Alimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Busca de alimentos */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
            <Input
              placeholder="Buscar alimento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Formulário manual */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="foodName">Nome do Alimento *</Label>
              <Input
                id="foodName"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Ex: Arroz integral"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portion">Porção</Label>
              <Input
                id="portion"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="Ex: 100g, 1 xícara"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calorias (kcal) *</Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protein">Proteína (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbs">Carboidratos (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fat">Gordura (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#3ED1A1] hover:bg-[#3ED1A1]/90 text-white"
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}