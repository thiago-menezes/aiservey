import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface SurveyResponse {
  setor: string;
  porte: string;
  objetivoEstrategico: string;
  diferencialCompetitivo: string;
  atividadesConsomemTempo: string[];
  satisfacaoInformacoes: number;
  desperdicioRecursos: string;
  areaGargalos: string;
  frequenciaRetrabalho: number;
  usaIA: string;
  barreiraIA: string;
  liderancaIA: string;
  problemaPrincipal?: string;
  comentariosAdicionais?: string;
  nome: string;
  email: string;
  telefone: string;
  timestamp: string;
}

interface GeminiAnalysis {
  problemasIdentificados: string[];
  ferramentasRecomendadas: Array<{
    nome: string;
    descricao: string;
    casoDeUso: string;
    categoria: string;
  }>;
  proximosPassos: string[];
  insights: string;
}

export async function POST(request: NextRequest) {
  try {
    const surveyData: SurveyResponse = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY não configurada');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada' },
        { status: 500 }
      );
    }

    console.log('Iniciando análise com Gemini API...');

    // Construir prompt estruturado para o Gemini
    const prompt = buildPrompt(surveyData);

    // Usar SDK oficial do Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Primeiro, tentar listar modelos disponíveis
    let availableModels: string[] = [];
    try {
      console.log('Listando modelos disponíveis...');
      const modelsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
      );
      
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        availableModels = (modelsData.models || [])
          .map((m: { name: string }) => m.name?.replace('models/', '') || '')
          .filter((name: string) => name.includes('gemini'));
        console.log('Modelos disponíveis encontrados:', availableModels);
      }
    } catch {
      console.log('Não foi possível listar modelos, usando lista padrão');
    }
    
    // Lista de modelos para tentar, começando pelos disponíveis se encontrados
    const modelsToTry = availableModels.length > 0 
      ? availableModels 
      : [
          'gemini-2.5-flash',
          'gemini-2.5-pro',
          'gemini-2.0-flash',
          'gemini-1.5-flash-latest',
          'gemini-1.5-flash',
          'gemini-1.5-pro'
        ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Tentando modelo: ${modelName}...`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        console.log(`✅ Sucesso com modelo ${modelName}! Resposta recebida (primeiros 200 chars):`, responseText.substring(0, 200));
        
        // Parsear resposta do Gemini
        const analysis = parseGeminiResponse(responseText, surveyData);
        
        return NextResponse.json(analysis);
      } catch (modelError: unknown) {
        const errorMessage = modelError instanceof Error ? modelError.message : String(modelError);
        console.error(`❌ Erro com modelo ${modelName}:`, errorMessage);
        
        // Se for erro de chave vazada ou permissão, usar fallback imediatamente
        if (errorMessage.includes('403') || 
            errorMessage.includes('leaked') || 
            errorMessage.includes('Forbidden') ||
            errorMessage.includes('permission') ||
            errorMessage.includes('API key')) {
          console.error('⚠️ Problema com a chave da API. Usando análise fallback.');
          const fallbackAnalysis = generateFallbackAnalysis(surveyData);
          return NextResponse.json(fallbackAnalysis);
        }
        
        // Se não for erro 404/not found, pode ser outro problema - não tentar outros modelos
        if (!errorMessage.includes('404') && 
            !errorMessage.includes('not found') && 
            !errorMessage.includes('is not found')) {
          console.error('Erro não relacionado a modelo não encontrado, usando fallback');
          const fallbackAnalysis = generateFallbackAnalysis(surveyData);
          return NextResponse.json(fallbackAnalysis);
        }
        
        // Continuar para o próximo modelo
        continue;
      }
    }
    
    // Se chegou aqui, todos os modelos falharam - usar fallback
    console.error('❌ Todos os modelos tentados falharam. Usando análise fallback baseada nas respostas.');
    const fallbackAnalysis = generateFallbackAnalysis(surveyData);
    return NextResponse.json(fallbackAnalysis);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Erro ao processar análise:', errorMessage);
    
    // Se houver erro, retornar análise fallback baseada nos dados
    try {
      // Re-ler o request body para fallback
      const requestClone = request.clone();
      const surveyData: SurveyResponse = await requestClone.json();
      const fallbackAnalysis = generateFallbackAnalysis(surveyData);
      console.log('Retornando análise fallback devido a erro na API');
      return NextResponse.json(fallbackAnalysis);
    } catch {
      return NextResponse.json(
        { error: `Erro ao processar análise: ${errorMessage}` },
        { status: 500 }
      );
    }
  }
}

function buildPrompt(surveyData: SurveyResponse): string {
  return `Você é um consultor especializado em identificar oportunidades de IA para empresas. 
Analise as respostas do questionário abaixo e forneça recomendações personalizadas.

DADOS DO QUESTIONÁRIO:
- Setor: ${surveyData.setor}
- Porte: ${surveyData.porte}
- Objetivo Estratégico: ${surveyData.objetivoEstrategico}
- Diferencial Competitivo: ${surveyData.diferencialCompetitivo}
- Atividades que Consomem Tempo: ${surveyData.atividadesConsomemTempo.join(', ')}
- Satisfação com Informações (1-5): ${surveyData.satisfacaoInformacoes}
- Desperdício de Recursos: ${surveyData.desperdicioRecursos}
- Área com Maiores Gargalos: ${surveyData.areaGargalos}
- Frequência de Retrabalho (1-5): ${surveyData.frequenciaRetrabalho}
- Usa IA Atualmente: ${surveyData.usaIA}
- Barreira para IA: ${surveyData.barreiraIA}
- Liderança Incentiva IA: ${surveyData.liderancaIA}
- Problema Principal: ${surveyData.problemaPrincipal || 'Não informado'}
- Comentários Adicionais: ${surveyData.comentariosAdicionais || 'Nenhum'}

INSTRUÇÕES:
Analise essas respostas e forneça um relatório estruturado em JSON com o seguinte formato:

{
  "problemasIdentificados": ["problema 1", "problema 2", "problema 3"],
  "ferramentasRecomendadas": [
    {
      "nome": "Nome da Ferramenta",
      "descricao": "Descrição breve de como ajuda",
      "casoDeUso": "Caso de uso específico para esta empresa",
      "categoria": "Categoria (ex: Automação, Análise, Comunicação)"
    }
  ],
  "proximosPassos": ["passo 1", "passo 2", "passo 3"],
  "insights": "Insight principal personalizado baseado nas respostas"
}

REQUISITOS:
1. Identifique 3-5 problemas principais baseados nas respostas
2. Recomende 3-5 ferramentas de IA específicas e práticas que resolvam os problemas identificados
3. Forneça 3-5 próximos passos acionáveis e práticos
4. Inclua um insight personalizado que conecte os problemas às oportunidades de IA
5. Seja específico e prático, evitando generalidades
6. Considere o porte da empresa e o setor ao fazer recomendações
7. Retorne APENAS o JSON, sem texto adicional antes ou depois, sem markdown

IMPORTANTE: Retorne apenas o JSON válido, sem markdown, sem explicações adicionais.`;
}

function parseGeminiResponse(responseText: string, surveyData: SurveyResponse): GeminiAnalysis {
  try {
    // Tentar parse direto primeiro
    let jsonText = responseText.trim();
    
    try {
      const parsed = JSON.parse(jsonText);
      console.log('Parse direto bem sucedido');
      return validateAndReturnAnalysis(parsed, surveyData);
    } catch {
      console.log('Parse direto falhou, tentando extrair de bloco markdown...');
    }
    
    // Extrair JSON de bloco de código markdown
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]+?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        console.log('Parse do JSON extraído de markdown bem sucedido');
        return validateAndReturnAnalysis(parsed, surveyData);
      } catch (e2) {
        console.error('Erro ao fazer parse do JSON extraído de markdown:', e2);
      }
    }
    
    // Remover markdown code blocks se existirem
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remover texto antes do primeiro {
    const firstBrace = jsonText.indexOf('{');
    if (firstBrace > 0) {
      jsonText = jsonText.substring(firstBrace);
    }
    
    // Remover texto depois do último }
    const lastBrace = jsonText.lastIndexOf('}');
    if (lastBrace > 0 && lastBrace < jsonText.length - 1) {
      jsonText = jsonText.substring(0, lastBrace + 1);
    }
    
    // Tentar encontrar JSON válido usando regex
    const plainJsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (plainJsonMatch) {
      try {
        const parsed = JSON.parse(plainJsonMatch[0]);
        console.log('Parse do JSON extraído do texto bem sucedido');
        return validateAndReturnAnalysis(parsed, surveyData);
      } catch (e3) {
        console.error('Erro ao fazer parse do JSON do texto:', e3);
      }
    }
    
    console.error('Nenhum JSON válido encontrado na resposta');
    throw new Error('A resposta da API não está no formato JSON esperado.');
  } catch (error) {
    console.error('Erro ao parsear resposta do Gemini:', error);
    console.log('Resposta original (primeiros 500 chars):', responseText.substring(0, 500));
    
    // Fallback: retornar análise básica baseada nos dados
    return generateFallbackAnalysis(surveyData);
  }
}

function validateAndReturnAnalysis(parsed: unknown, surveyData: SurveyResponse): GeminiAnalysis {
  // Verificar se parsed é um objeto
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Resposta não é um objeto válido');
  }
  
  const analysis = parsed as Partial<GeminiAnalysis>;
  
  // Validar estrutura básica
  if (!analysis.problemasIdentificados || !Array.isArray(analysis.problemasIdentificados)) {
    throw new Error('problemasIdentificados ausente ou inválido');
  }
  
  if (!analysis.ferramentasRecomendadas || !Array.isArray(analysis.ferramentasRecomendadas)) {
    throw new Error('ferramentasRecomendadas ausente ou inválido');
  }
  
  if (!analysis.proximosPassos || !Array.isArray(analysis.proximosPassos)) {
    throw new Error('proximosPassos ausente ou inválido');
  }
  
  // Garantir que insights existe
  if (!analysis.insights || typeof analysis.insights !== 'string') {
    analysis.insights = generateFallbackAnalysis(surveyData).insights;
  }
  
  return analysis as GeminiAnalysis;
}

function generateFallbackAnalysis(surveyData: SurveyResponse): GeminiAnalysis {
  const problemas: string[] = [];
  
  if (surveyData.frequenciaRetrabalho >= 4) {
    problemas.push('Alta frequência de retrabalho impactando eficiência');
  }
  
  if (surveyData.satisfacaoInformacoes <= 2) {
    problemas.push('Dificuldade no acesso e utilização de informações internas');
  }
  
  if (surveyData.atividadesConsomemTempo.includes('Busca de informações/documentos')) {
    problemas.push('Tempo excessivo gasto na busca de informações');
  }
  
  if (surveyData.atividadesConsomemTempo.includes('Processos manuais repetitivos')) {
    problemas.push('Processos manuais repetitivos consumindo tempo da equipe');
  }
  
  if (problemas.length === 0) {
    problemas.push('Oportunidades de otimização identificadas');
  }
  
  const ferramentas = [
    {
      nome: 'ChatGPT ou Claude',
      descricao: 'Assistente de IA para automação de tarefas e geração de conteúdo',
      casoDeUso: 'Automatizar tarefas repetitivas e melhorar produtividade',
      categoria: 'Automação'
    },
    {
      nome: 'Notion AI ou Obsidian',
      descricao: 'Gestão de conhecimento com IA para organizar informações',
      casoDeUso: 'Criar base de conhecimento pesquisável e acessível',
      categoria: 'Gestão de Conhecimento'
    },
    {
      nome: 'Zapier ou Make',
      descricao: 'Automação de processos entre diferentes ferramentas',
      casoDeUso: 'Conectar sistemas e automatizar fluxos de trabalho',
      categoria: 'Automação'
    }
  ];
  
  const proximosPassos = [
    'Identificar o processo mais crítico que pode ser automatizado',
    'Começar com uma ferramenta simples e de fácil adoção',
    'Treinar a equipe em uso básico de IA',
    'Estabelecer métricas para medir o impacto das melhorias'
  ];
  
  const insights = `Com base nas suas respostas, identificamos oportunidades significativas de otimização através de IA. 
O foco deve ser em ${surveyData.areaGargalos.toLowerCase()}, onde há maior potencial de impacto imediato.`;
  
  return {
    problemasIdentificados: problemas,
    ferramentasRecomendadas: ferramentas,
    proximosPassos,
    insights
  };
}
