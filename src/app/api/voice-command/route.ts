import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    // Chamar OpenAI para processar comando de voz
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
            content: `Você é um assistente de voz para um app de emagrecimento.
            
            Interprete comandos de voz e extraia informações estruturadas.
            
            Tipos de comandos:
            1. Registrar refeição: "Registrar almoço: arroz, frango e salada"
            2. Registrar água: "Bebi 500ml de água"
            3. Registrar atividade: "Fiz 30 minutos de caminhada"
            4. Consulta: "Quanto posso comer no jantar?"
            
            Retorne APENAS um JSON válido:
            {
              "action": "log_meal" | "log_water" | "log_activity" | "query" | "unknown",
              "data": {
                // Para log_meal:
                "mealType": "breakfast" | "lunch" | "dinner" | "snack",
                "foods": ["alimento1", "alimento2"]
                
                // Para log_water:
                "amount": número em ml
                
                // Para log_activity:
                "activityType": "tipo",
                "duration": número em minutos
                
                // Para query:
                "question": "pergunta do usuário"
              },
              "response": "resposta amigável para o usuário"
            }`,
          },
          {
            role: 'user',
            content: command,
          },
        ],
        max_tokens: 300,
        temperature: 0.3,
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

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao processar comando:', error);
    return NextResponse.json({
      action: 'unknown',
      response: 'Desculpe, não entendi o comando. Tente novamente.',
    });
  }
}
