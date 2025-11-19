import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // Chamar OpenAI Vision API
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
            content: `Você é um nutricionista especializado em análise de alimentos por imagem. 
            Analise a foto e identifique TODOS os alimentos visíveis.
            
            Para cada alimento, estime:
            - Nome do alimento
            - Tamanho da porção (use objetos de referência como talheres, pratos)
            - Calorias
            - Proteínas (g)
            - Carboidratos (g)
            - Gorduras (g)
            - Nível de confiança (0-1)
            
            Retorne APENAS um JSON válido no formato:
            {
              "foods": [
                {
                  "name": "nome do alimento",
                  "portion": "tamanho estimado",
                  "calories": número,
                  "protein": número,
                  "carbs": número,
                  "fat": número,
                  "confidence": número entre 0 e 1
                }
              ],
              "totalCalories": soma total
            }`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta refeição e identifique todos os alimentos com suas informações nutricionais.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
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

    const analysisResult = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar imagem' },
      { status: 500 }
    );
  }
}
