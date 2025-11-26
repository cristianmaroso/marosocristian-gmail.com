'use client';

import { Crown, Check, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PREMIUM_FEATURES } from '@/lib/constants';
import { toast } from 'sonner';

interface PremiumDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PremiumDialog({ open, onClose }: PremiumDialogProps) {
  const plans = [
    {
      id: 'monthly',
      name: 'Mensal',
      price: 'R$ 29,90',
      period: '/mês',
      description: 'Perfeito para começar',
      popular: false,
    },
    {
      id: 'quarterly',
      name: 'Trimestral',
      price: 'R$ 24,90',
      period: '/mês',
      description: 'Economize 17%',
      popular: true,
      totalPrice: 'R$ 74,70',
    },
    {
      id: 'yearly',
      name: 'Anual',
      price: 'R$ 19,90',
      period: '/mês',
      description: 'Melhor custo-benefício',
      popular: false,
      totalPrice: 'R$ 238,80',
    },
  ];

  const handleSubscribe = (planId: string) => {
    toast.success('Funcionalidade de pagamento será implementada em breve!');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-8 h-8 text-[#3ED1A1]" />
            <DialogTitle className="text-2xl text-[#005A70]">
              Upgrade para PRO
            </DialogTitle>
          </div>
          <p className="text-center text-[#4A5568]">
            Desbloqueie todo o potencial do FitVida e acelere seus resultados
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Recursos Premium */}
          <div>
            <h3 className="text-lg font-semibold text-[#2D3748] mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#3ED1A1]" />
              Recursos Inclusos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PREMIUM_FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-[#2D3748]"
                >
                  <Check className="w-4 h-4 text-[#3ED1A1] mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Planos */}
          <div>
            <h3 className="text-lg font-semibold text-[#2D3748] mb-4 text-center">
              Escolha seu Plano
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative border-2 ${
                    plan.popular
                      ? 'border-[#3ED1A1] shadow-lg'
                      : 'border-[#E2E8F0]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-[#005A70] to-[#3ED1A1] text-white">
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-[#2D3748] mb-1">
                        {plan.name}
                      </h4>
                      <p className="text-xs text-[#4A5568] mb-3">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-[#005A70]">
                          {plan.price}
                        </span>
                        <span className="text-sm text-[#4A5568]">
                          {plan.period}
                        </span>
                      </div>
                      {plan.totalPrice && (
                        <p className="text-xs text-[#4A5568] mt-1">
                          {plan.totalPrice} cobrado hoje
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[#005A70] to-[#3ED1A1] hover:opacity-90'
                          : 'bg-[#005A70] hover:bg-[#005A70]/90'
                      } text-white`}
                    >
                      Assinar Agora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Garantia */}
          <div className="bg-[#F7FAFC] rounded-lg p-4 text-center">
            <p className="text-sm text-[#4A5568]">
              <strong className="text-[#2D3748]">Garantia de 7 dias:</strong>{' '}
              Se não ficar satisfeito, devolvemos seu dinheiro sem perguntas.
            </p>
          </div>

          {/* Botão Cancelar */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-[#4A5568] hover:text-[#2D3748]"
            >
              Talvez Mais Tarde
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

