"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle, Building2, AlertTriangle, MessageSquare, User } from 'lucide-react';

const SurveyApp = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [currentResponse, setCurrentResponse] = useState({
    // Contexto do Negócio
    setor: '',
    porte: '',
    objetivoEstrategico: '',
    diferencialCompetitivo: '',
    
    // Dores e Gargalos
    atividadesConsomemTempo: [],
    satisfacaoInformacoes: 3,
    desperdicioRecursos: '',
    areaGargalos: '',
    frequenciaRetrabalho: 3,
    
    // Experiência com IA
    usaIA: '',
    barreiraIA: '',
    liderancaIA: '',
    
    // Questões Abertas
    problemaPrincipal: '',
    comentariosAdicionais: '',
    
    // Lead
    nome: '',
    email: '',
    telefone: ''
  });

  const steps = [
    {
      title: 'Contexto do Negócio',
      icon: Building2,
      questions: [
        {
          id: 'setor',
          label: 'Qual o setor de atuação da sua empresa?',
          type: 'select',
          options: [
            'Tecnologia',
            'Mídia & Telecom',
            'Serviços Profissionais',
            'Saúde & Farmacêutica',
            'Consumo & Varejo',
            'Serviços Financeiros',
            'Indústrias Avançadas',
            'Energia & Materiais',
            'Outro'
          ],
          required: true
        },
        {
          id: 'porte',
          label: 'Qual o porte da sua empresa?',
          type: 'select',
          options: [
            'Pequena (até 49 funcionários)',
            'Média (50 a 249 funcionários)',
            'Grande (250+ funcionários)'
          ],
          required: true
        },
        {
          id: 'objetivoEstrategico',
          label: 'Qual é o principal objetivo estratégico da sua empresa para os próximos 12 meses?',
          type: 'select',
          options: [
            'Aumentar receita',
            'Reduzir custos',
            'Expandir para novos mercados',
            'Melhorar retenção de clientes',
            'Aumentar eficiência operacional',
            'Inovar produtos/serviços',
            'Outro'
          ],
          required: true
        },
        {
          id: 'diferencialCompetitivo',
          label: 'Qual é a principal capacidade ou diferencial que distingue sua empresa dos concorrentes?',
          type: 'select',
          options: [
            'Atendimento personalizado',
            'Qualidade superior',
            'Preço competitivo',
            'Inovação tecnológica',
            'Velocidade de entrega',
            'Conhecimento especializado',
            'Outro'
          ],
          required: true
        }
      ]
    },
    {
      title: 'Dores e Gargalos',
      icon: AlertTriangle,
      questions: [
        {
          id: 'atividadesConsomemTempo',
          label: 'Quais atividades mais consomem tempo da sua equipe? (Selecione até 3)',
          type: 'multiselect',
          options: [
            'Reuniões e alinhamentos',
            'Busca de informações/documentos',
            'Tarefas administrativas',
            'Atendimento ao cliente',
            'Análise de dados',
            'Criação de conteúdo',
            'Processos manuais repetitivos',
            'Outro'
          ],
          maxSelections: 3,
          required: true
        },
        {
          id: 'satisfacaoInformacoes',
          label: 'Em uma escala de 1 a 5, quão satisfeito você está com a capacidade da sua equipe de acessar e utilizar informações internas?',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Muito Insatisfeito', 'Muito Satisfeito'],
          required: true
        },
        {
          id: 'desperdicioRecursos',
          label: 'Onde você percebe os maiores desperdícios de recursos (tempo ou dinheiro)?',
          type: 'select',
          options: [
            'Retrabalho e correções',
            'Processos ineficientes',
            'Falta de automação',
            'Comunicação ineficaz',
            'Busca de informações',
            'Tarefas manuais repetitivas',
            'Outro'
          ],
          required: true
        },
        {
          id: 'areaGargalos',
          label: 'Em qual área você enfrenta os maiores gargalos atualmente?',
          type: 'select',
          options: [
            'Vendas & Marketing',
            'Operações e Processos Internos',
            'Atendimento ao Cliente',
            'Finanças & Compras',
            'Recursos Humanos',
            'Tecnologia & TI'
          ],
          required: true
        },
        {
          id: 'frequenciaRetrabalho',
          label: 'Com que frequência ocorre retrabalho na sua operação?',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Raramente', 'Constantemente'],
          required: true
        }
      ]
    },
    {
      title: 'Experiência com IA',
      icon: MessageSquare,
      questions: [
        {
          id: 'usaIA',
          label: 'Sua empresa já utiliza alguma ferramenta de IA?',
          type: 'select',
          options: ['Sim', 'Não', 'Não sei'],
          required: true
        },
        {
          id: 'barreiraIA',
          label: 'Qual você acredita ser a maior barreira para a adoção de novas tecnologias na sua empresa?',
          type: 'select',
          options: [
            'Resistência da equipe em adotar novas ferramentas',
            'Qualidade ou confiabilidade dos resultados',
            'Experiência de usuário ruim ou complexa',
            'Falta de patrocínio ou apoio da liderança',
            'Custo',
            'Falta de conhecimento técnico',
            'Não sabemos por onde começar'
          ],
          required: true
        },
        {
          id: 'liderancaIA',
          label: 'A liderança da sua empresa utiliza diretamente ferramentas de IA e incentiva a experimentação?',
          type: 'select',
          options: ['Sim', 'Não', 'Não sei'],
          required: true
        }
      ]
    },
    {
      title: 'Questões Abertas',
      icon: MessageSquare,
      questions: [
        {
          id: 'problemaPrincipal',
          label: 'Se pudesse resolver UM problema com tecnologia, qual seria?',
          type: 'textarea',
          placeholder: 'Descreva o problema principal que você gostaria de resolver...',
          required: false
        },
        {
          id: 'comentariosAdicionais',
          label: 'Comentários adicionais (opcional)',
          type: 'textarea',
          placeholder: 'Alguma informação adicional que gostaria de compartilhar?',
          required: false
        }
      ]
    },
    {
      title: 'Seus Dados',
      icon: User,
      questions: [
        {
          id: 'nome',
          label: 'Nome completo',
          type: 'text',
          placeholder: 'Seu nome completo',
          required: true
        },
        {
          id: 'email',
          label: 'E-mail',
          type: 'email',
          placeholder: 'seu@email.com',
          required: true
        },
        {
          id: 'telefone',
          label: 'Telefone',
          type: 'tel',
          placeholder: '(00) 00000-0000',
          required: true
        }
      ]
    }
  ];

  const handleInputChange = (questionId, value) => {
    setCurrentResponse(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiselectChange = (questionId, option) => {
    setCurrentResponse(prev => {
      const current = prev[questionId] || [];
      const maxSelections = steps
        .flatMap(s => s.questions)
        .find(q => q.id === questionId)?.maxSelections || Infinity;
      
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter(item => item !== option) };
      } else if (current.length < maxSelections) {
        return { ...prev, [questionId]: [...current, option] };
      }
      return prev;
    });
  };

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    return step.questions.every(question => {
      if (!question.required) return true;
      const value = currentResponse[question.id];
      if (question.type === 'multiselect') {
        return Array.isArray(value) && value.length > 0;
      }
      if (question.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && emailRegex.test(value);
      }
      if (question.type === 'tel') {
        // Validar telefone brasileiro básico (pelo menos 10 dígitos)
        const phoneRegex = /[\d\s\(\)\-]{10,}/;
        return value && phoneRegex.test(value.replace(/\s/g, ''));
      }
      return value !== '' && value !== null && value !== undefined;
    });
  };

  const handleNext = () => {
    setValidationError('');
    
    if (!validateStep(currentStep)) {
      setValidationError('Por favor, preencha todos os campos obrigatórios corretamente.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const sendToWebhook = async (data) => {
    // Por enquanto apenas console.log, preparado para futura integração com n8n
    console.log('=== WEBHOOK DATA (n8n) ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('========================');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const surveyData = {
      ...currentResponse,
      timestamp: new Date().toISOString()
    };

    // Enviar para webhook
    await sendToWebhook(surveyData);

    try {
      // Chamar API do Gemini para análise
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || `Erro ${response.status}: ${response.statusText}`;
        console.error('Erro na API:', errorMessage, responseData);
        throw new Error(errorMessage);
      }

      // Verificar se a resposta contém erro
      if (responseData.error) {
        console.error('Erro na resposta:', responseData.error);
        throw new Error(responseData.error);
      }

      const analysis = responseData;
      
      // Validar estrutura básica da análise
      if (!analysis.problemasIdentificados || !analysis.ferramentasRecomendadas || !analysis.proximosPassos) {
        console.error('Estrutura de análise inválida:', analysis);
        throw new Error('Resposta da análise em formato inválido');
      }
      
      // Salvar análise no sessionStorage para recuperar na página de obrigado
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('surveyAnalysis', JSON.stringify(analysis));
        sessionStorage.setItem('surveyNome', currentResponse.nome);
      }
      
      router.push('/servey/obrigado');
    } catch (error) {
      console.error('Erro ao processar:', error);
      const errorMessage = error.message || 'Ocorreu um erro ao processar suas respostas. Por favor, tente novamente.';
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  const renderQuestion = (question) => {
    const value = currentResponse[question.id];

    switch (question.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-gray-700"
          >
            <option value="">Selecione uma opção</option>
            {question.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options.map(option => {
              const isSelected = Array.isArray(value) && value.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleMultiselectChange(question.id, option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </button>
              );
            })}
            {Array.isArray(value) && value.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {value.length} de {question.maxSelections} selecionado{question.maxSelections > 1 ? 's' : ''}
              </p>
            )}
          </div>
        );
      
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows="4"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none transition-all text-gray-700"
          />
        );
      
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={question.type}
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-gray-700"
          />
        );
      
      case 'scale':
        const scaleValue = value || question.min;
        const percentage = ((scaleValue - question.min) / (question.max - question.min)) * 100;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">{question.labels[0]}</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-blue-600">{scaleValue}</span>
                <span className="text-sm text-gray-500">/ {question.max}</span>
              </div>
              <span className="text-sm font-medium text-gray-600">{question.labels[1]}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={question.min}
                max={question.max}
                value={scaleValue}
                onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1">
              {Array.from({ length: question.max - question.min + 1 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleInputChange(question.id, question.min + i)}
                  className={`px-2 py-1 rounded transition-colors ${
                    scaleValue === question.min + i
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {question.min + i}
                </button>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Diagnóstico de Oportunidades em IA
          </h1>
          <p className="text-lg text-gray-600">
            Descubra quais problemas a IA pode resolver na sua empresa
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Etapa {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% completo
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 animate-slide-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Icon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentStepData.title}
            </h2>
          </div>

          {validationError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{validationError}</p>
            </div>
          )}

          <div className="space-y-6">
            {currentStepData.questions.map((question, idx) => (
              <div key={question.id} className="space-y-2">
                <label className="block text-gray-700 font-medium text-lg">
                  {idx + 1}. {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderQuestion(question)}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0 || isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 0 || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              } text-white shadow-lg hover:shadow-xl`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : isLastStep ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Ver Resultados
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-blue-600 w-8'
                  : idx < currentStep
                  ? 'bg-green-500 w-2'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SurveyApp;
