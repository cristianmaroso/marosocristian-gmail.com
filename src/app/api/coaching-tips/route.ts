import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { user, stats } = await request.json();

    const calorieGoal = calculateCalorieGoal(user);
    const waterGoal = user.gender === 'male' ? 3000 : 2500;

    // Chamar OpenAI para gerar dicas personalizadas
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
            content: `Você é um coach de emagrecimento motivacional e experiente.
            
            Analise os dados do usuário e forneça 3-4 dicas personalizadas, práticas e motivacionais.
            
            Dados do usuário:
            - Objetivo: ${user.goal === 'lose' ? 'emagrecimento' : user.goal === 'gain' ? 'ganho de massa' : 'manutenção'}
            - Meta calórica: ${calorieGoal} kcal
            - Calorias consumidas hoje: ${stats.caloriesConsumed} kcal
            - Calorias queimadas: ${stats.caloriesBurned} kcal
            - Água ingerida: ${stats.waterIntake}ml (meta: ${waterGoal}ml)
            - Minutos de atividade: ${stats.activityMinutes} min
            - Macros: P:${stats.macros.protein}g C:${stats.macros.carbs}g G:${stats.macros.fat}g
            
            Foque em:
            - Áreas que precisam de atenção
            - Elogios por conquistas
            - Dicas práticas e acionáveis
            - Motivação positiva
            
            Retorne APENAS um array JSON de strings:
            ["dica 1", "dica 2", "dica 3"]`,
          },
          {
            role: 'user',
            content: 'Gere dicas de coaching personalizadas para hoje.',
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao chamar API OpenAI');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extrair array JSON da resposta
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Resposta inválida da IA');
    }

    const tips = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ tips });
  } catch (error) {
    console.error('Erro ao gerar dicas:', error);
    return NextResponse.json(
      {
        tips: [
          'Continue se hidratando ao longo do dia!',
          'Lembre-se de incluir proteínas em todas as refeições.',
          'Pequenas caminhadas fazem grande diferença!',
        ],
      },
      { status: 200 }
    );
  }
}

function calculateCalorieGoal(user: any): number {
  // Fórmula de Harris-Benedict
  let bmr: number;
  if (user.gender === 'male') {
    bmr = 88.362 + 13.397 * user.currentWeight + 4.799 * user.height - 5.677 * user.age;
  } else {
    bmr = 447.593 + 9.247 * user.currentWeight + 3.098 * user.height - 4.33 * user.age;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * activityMultipliers[user.activityLevel];

  if (user.goal === 'lose') {
    return Math.round(tdee - 500);
  } else if (user.goal === 'gain') {
    return Math.round(tdee + 300);
  }
  return Math.round(tdee);
}
