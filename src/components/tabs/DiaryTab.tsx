'use client';

import { useState } from 'react';
import { Plus, Camera, Search, Utensils, Coffee, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { todayFoodEntries, todayWaterEntries } from '@/lib/mock-data';
import { MEAL_TYPES } from '@/lib/constants';
import AddFoodDialog from '../dialogs/AddFoodDialog';
import FoodPhotoDialog from '../dialogs/FoodPhotoDialog';
import WaterTracker from '../widgets/WaterTracker';

export default function DiaryTab() {
  const [showAddFood, setShowAddFood] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee className="w-5 h-5" />;
      case 'lunch':
        return <Sun className="w-5 h-5" />;
      case 'dinner':
        return <Moon className="w-5 h-5" />;
      default:
        return <Utensils className="w-5 h-5" />;
    }
  };

  const getMealEntries = (mealType: string) => {
    return todayFoodEntries.filter(entry => entry.mealType === mealType);
  };

  const getMealCalories = (mealType: string) => {
    return getMealEntries(mealType).reduce((sum, entry) => sum + entry.calories, 0);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header com ações rápidas */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => setShowPhotoCapture(true)}
          className="flex-1 bg-gradient-to-r from-[#005A70] to-[#3ED1A1] hover:opacity-90 text-white"
        >
          <Camera className="w-5 h-5 mr-2" />
          Tirar Foto da Refeição
        </Button>
        <Button
          onClick={() => setShowAddFood(true)}
          variant="outline"
          className="flex-1 border-[#005A70] text-[#005A70] hover:bg-[#005A70]/5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Manualmente
        </Button>
      </div>

      {/* Tabs de visualização */}
      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#E2E8F0]">
          <TabsTrigger value="meals">Refeições</TabsTrigger>
          <TabsTrigger value="water">Hidratação</TabsTrigger>
        </TabsList>

        {/* Tab de Refeições */}
        <TabsContent value="meals" className="space-y-4 mt-4">
          {Object.entries(MEAL_TYPES).map(([key, label]) => {
            const entries = getMealEntries(key);
            const totalCalories = getMealCalories(key);

            return (
              <Card key={key} className="border-none shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-[#005A70]">
                      {getMealIcon(key)}
                      {label}
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-[#4A5568]">Total</p>
                      <p className="text-lg font-bold text-[#2D3748]">
                        {totalCalories} kcal
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entries.length === 0 ? (
                    <div className="text-center py-6 text-[#4A5568]">
                      <Utensils className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhum alimento registrado</p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSelectedMeal(key as any);
                          setShowAddFood(true);
                        }}
                        className="text-[#005A70] mt-2"
                      >
                        Adicionar alimento
                      </Button>
                    </div>
                  ) : (
                    <>
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 bg-[#F7FAFC] rounded-lg hover:bg-[#E2E8F0] transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-[#2D3748]">
                              {entry.foodName}
                            </p>
                            <p className="text-sm text-[#4A5568]">
                              {entry.portion}
                            </p>
                            <div className="flex gap-3 mt-1 text-xs text-[#4A5568]">
                              <span>P: {entry.protein}g</span>
                              <span>C: {entry.carbs}g</span>
                              <span>G: {entry.fat}g</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#005A70]">
                              {entry.calories}
                            </p>
                            <p className="text-xs text-[#4A5568]">kcal</p>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedMeal(key as any);
                          setShowAddFood(true);
                        }}
                        className="w-full text-[#005A70] hover:bg-[#005A70]/5"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar mais
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Análise do dia */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-[#3ED1A1]/10 to-[#005A70]/10">
            <CardHeader>
              <CardTitle className="text-[#005A70]">Análise do Dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-[#2D3748]">
                ✅ Sua ingestão de proteína está ótima hoje!
              </p>
              <p className="text-[#2D3748]">
                💡 Considere adicionar mais vegetais no jantar para aumentar fibras.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Hidratação */}
        <TabsContent value="water" className="mt-4">
          <WaterTracker entries={todayWaterEntries} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddFoodDialog
        open={showAddFood}
        onClose={() => setShowAddFood(false)}
        mealType={selectedMeal}
      />
      <FoodPhotoDialog
        open={showPhotoCapture}
        onClose={() => setShowPhotoCapture(false)}
      />
    </div>
  );
}
