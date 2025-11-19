import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { user, preferences } = await request.json();

    // Chamar OpenAI para gerar plano alimentar personalizado
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um nutricionista especializado em planos alimentares personalizados.
            
            Crie um plano alimentar completo para 1 dia baseado no perfil do usuário.
            
            Considere:
            - Objetivo: ${user.goal === 'lose' ? 'emagrecimento' : user.goal === 'gain' ? 'ganho de massa' : 'manutenção'}
            - Restrições: ${preferences.restrictions.join(', ') || 'nenhuma'}
            - Meta calórica: ${preferences.targetCalories} kcal
            - Condições: ${user.healthConditions.join(', ') || 'nenhuma'}
            
            Retorne APENAS um JSON válido no formato:
            {
              "meals": {
                "breakfast": [
                  {
                    "name": "nome do alimento",
                    "portion": "porção",
                    "calories": número,
                    "protein": número,
                    "carbs": número,
                    "fat": número,
                    "recipe": "instruções simples (opcional)"
                  }
                ],
                "lunch": [...],
                "dinner": [...],
                "snacks": [...]
              },
              "totalCalories": número,
              "macros": {
                "protein": número,
                "carbs": número,
                "fat": número
              }
            }`,
          },
          {
            role: 'user',
            content: `Crie um plano alimentar personalizado para hoje.`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao chamar API OpenAI');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta inválida da IA');
    }

    const mealPlan = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      id: `plan-${Date.now()}`,
      userId: user.id,
      date: new Date(),
      ...mealPlan,
    });
  } catch (error) {
    console.error('Erro ao gerar plano alimentar:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar plano alimentar' },
      { status: 500 }
    );
  }
}
