"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lightbulb, Rocket, Wrench, Sparkles } from 'lucide-react';

interface AnalysisData {
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

export default function ObrigadoPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [nome, setNome] = useState('');

  useEffect(() => {
    // Recuperar análise do sessionStorage
    if (typeof window !== 'undefined') {
      const storedAnalysis = sessionStorage.getItem('surveyAnalysis');
      const storedNome = sessionStorage.getItem('surveyNome');

      if (storedAnalysis) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAnalysis(JSON.parse(storedAnalysis));
        } catch (error) {
          console.error('Erro ao parsear análise:', error);
        }
      }

      if (storedNome) {
        setNome(storedNome);
      }

      // Limpar sessionStorage após recuperar
      sessionStorage.removeItem('surveyAnalysis');
      sessionStorage.removeItem('surveyNome');
    }
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Carregando seu relatório...</p>
          <button
            onClick={() => router.push('/servey')}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Voltar ao questionário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Obrigado{nome ? `, ${nome}` : ''}!
          </h1>
          <p className="text-xl text-gray-600">
            Seu relatório personalizado está pronto
          </p>
        </div>

        {/* Insights Principal */}
        {analysis.insights && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-xl animate-slide-up">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Insight Principal</h2>
                <p className="text-lg leading-relaxed">{analysis.insights}</p>
              </div>
            </div>
          </div>
        )}

        {/* Problemas Identificados */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <Lightbulb className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Problemas Identificados
            </h2>
          </div>
          <ul className="space-y-4">
            {analysis.problemasIdentificados.map((problema, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 font-semibold text-sm">{idx + 1}</span>
                </div>
                <p className="text-gray-700 text-lg">{problema}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Ferramentas Recomendadas */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Ferramentas Recomendadas
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {analysis.ferramentasRecomendadas.map((ferramenta, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{ferramenta.nome}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {ferramenta.categoria}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{ferramenta.descricao}</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Caso de Uso:</p>
                  <p className="text-sm text-gray-600">{ferramenta.casoDeUso}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <Rocket className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Próximos Passos
            </h2>
          </div>
          <ol className="space-y-4">
            {analysis.proximosPassos.map((passo, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">{idx + 1}</span>
                </div>
                <p className="text-gray-700 text-lg pt-2">{passo}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl font-bold mb-3">Pronto para começar?</h3>
          <p className="text-lg mb-6 opacity-90">
            Entre em contato conosco para uma consultoria personalizada
          </p>
          <button
            onClick={() => router.push('/servey')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            Fazer Novo Diagnóstico
          </button>
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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}

