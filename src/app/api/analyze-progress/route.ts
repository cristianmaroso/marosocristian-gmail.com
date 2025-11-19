import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { user, weeklyStats } = await request.json();

    // Calcular tendência de peso (regressão linear simples)
    const weights = weeklyStats.map((s: any) => s.weight);
    const trend = calculateWeightTrend(weights);

    // Chamar OpenAI para análise e recomendações
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
            content: `Você é um nutricionista especializado em análise de progresso.
            
            Analise os dados semanais do usuário e forneça:
            1. Recomendação principal
            2. Meta calórica ajustada (se necessário)
            3. 3-4 insights específicos
            
            Dados do usuário:
            - Objetivo: ${user.goal === 'lose' ? 'emagrecimento' : user.goal === 'gain' ? 'ganho de massa' : 'manutenção'}
            - Peso inicial: ${weeklyStats[0].weight}kg
            - Peso atual: ${weeklyStats[weeklyStats.length - 1].weight}kg
            - Tendência: ${trend > 0 ? 'ganho' : 'perda'} de ${Math.abs(trend).toFixed(2)}kg/semana
            
            Dados semanais:
            ${weeklyStats.map((s: any, i: number) => 
              `Dia ${i + 1}: ${s.weight}kg, ${s.caloriesConsumed}kcal consumidas, ${s.caloriesBurned}kcal queimadas`
            ).join('\n')}
            
            Retorne APENAS um JSON válido:
            {
              "recommendation": "recomendação principal",
              "adjustedCalorieGoal": número (meta calórica ajustada),
              "insights": ["insight 1", "insight 2", "insight 3"]
            }`,
          },
          {
            role: 'user',
            content: 'Analise meu progresso semanal e faça recomendações.',
          },
        ],
        max_tokens: 600,
        temperature: 0.5,
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

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Erro ao analisar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar progresso' },
      { status: 500 }
    );
  }
}

function calculateWeightTrend(weights: number[]): number {
  if (weights.length < 2) return 0;

  const n = weights.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = weights;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  return slope;
}
