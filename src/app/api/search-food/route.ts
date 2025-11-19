import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query não fornecida' },
        { status: 400 }
      );
    }

    // Chamar OpenAI para buscar informações nutricionais
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
            content: `Você é um especialista em nutrição.
            
            Forneça informações nutricionais detalhadas para o alimento pesquisado.
            Retorne até 5 variações/porções diferentes do alimento.
            
            Retorne APENAS um JSON válido:
            {
              "results": [
                {
                  "name": "nome completo do alimento",
                  "calories": número,
                  "protein": número em gramas,
                  "carbs": número em gramas,
                  "fat": número em gramas,
                  "fiber": número em gramas (opcional),
                  "sugar": número em gramas (opcional),
                  "servingSize": "tamanho da porção"
                }
              ]
            }`,
          },
          {
            role: 'user',
            content: `Busque informações nutricionais para: ${query}`,
          },
        ],
        max_tokens: 800,
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

    const searchResults = JSON.parse(jsonMatch[0]);

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Erro ao buscar alimento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar alimento' },
      { status: 500 }
    );
  }
}
