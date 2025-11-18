'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FoodPhotoDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function FoodPhotoDialog({ open, onClose }: FoodPhotoDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simular análise de IA
    setIsAnalyzing(true);
    
    // Simulação de delay da API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Dados mockados da análise
    const mockAnalysis = {
      foods: [
        {
          name: 'Arroz branco',
          portion: '150g',
          calories: 195,
          protein: 4,
          carbs: 43,
          fat: 0.5,
          confidence: 0.95,
        },
        {
          name: 'Frango grelhado',
          portion: '120g',
          calories: 198,
          protein: 37,
          carbs: 0,
          fat: 4,
          confidence: 0.92,
        },
        {
          name: 'Brócolis',
          portion: '80g',
          calories: 27,
          protein: 3,
          carbs: 5,
          fat: 0.3,
          confidence: 0.88,
        },
      ],
      totalCalories: 420,
    };

    setAnalyzedData(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleConfirm = () => {
    toast.success('Refeição registrada com sucesso!');
    onClose();
    setAnalyzedData(null);
    setImagePreview(null);
  };

  const handleReset = () => {
    setAnalyzedData(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#005A70]">
            Reconhecimento de Alimentos por IA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!imagePreview ? (
            // Upload area
            <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-[#4A5568]" />
              <h3 className="text-lg font-semibold text-[#2D3748] mb-2">
                Tire uma foto da sua refeição
              </h3>
              <p className="text-sm text-[#4A5568] mb-4">
                Nossa IA identificará os alimentos e calculará as calorias automaticamente
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Foto
              </Button>
            </div>
          ) : (
            // Preview e resultados
            <div className="space-y-4">
              {/* Preview da imagem */}
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Análise em progresso */}
              {isAnalyzing && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#3ED1A1] animate-spin" />
                  <p className="text-[#2D3748] font-medium">
                    Analisando sua refeição...
                  </p>
                  <p className="text-sm text-[#4A5568]">
                    Identificando alimentos e calculando nutrientes
                  </p>
                </div>
              )}

              {/* Resultados da análise */}
              {analyzedData && !isAnalyzing && (
                <div className="space-y-4">
                  <div className="bg-[#3ED1A1]/10 border border-[#3ED1A1] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-[#3ED1A1]" />
                      <h4 className="font-semibold text-[#2D3748]">
                        Análise Concluída
                      </h4>
                    </div>
                    <p className="text-sm text-[#4A5568]">
                      Identificamos {analyzedData.foods.length} alimentos na sua foto
                    </p>
                  </div>

                  {/* Lista de alimentos detectados */}
                  <div className="space-y-3">
                    {analyzedData.foods.map((food: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-[#2D3748]">
                              {food.name}
                            </h5>
                            <span className="text-xs text-[#4A5568] bg-white px-2 py-0.5 rounded">
                              {Math.round(food.confidence * 100)}% confiança
                            </span>
                          </div>
                          <p className="text-sm text-[#4A5568] mb-2">
                            Porção: {food.portion}
                          </p>
                          <div className="flex gap-3 text-xs text-[#4A5568]">
                            <span>P: {food.protein}g</span>
                            <span>C: {food.carbs}g</span>
                            <span>G: {food.fat}g</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#005A70]">
                            {food.calories}
                          </p>
                          <p className="text-xs text-[#4A5568]">kcal</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total da Refeição</span>
                      <span className="text-2xl font-bold">
                        {analyzedData.totalCalories} kcal
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Tirar Outra Foto
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="flex-1 bg-[#3ED1A1] hover:bg-[#3ED1A1]/90 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirmar e Salvar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
