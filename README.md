# Diagnóstico de Oportunidades em IA

Sistema de questionário inteligente que identifica problemas de negócio e recomenda ferramentas de IA personalizadas usando Google Gemini.

## Características

- Questionário enxuto e focado (10-15 perguntas)
- Interface moderna e responsiva
- Análise inteligente com Google Gemini API
- Relatório personalizado com recomendações práticas
- Captura de leads antes dos resultados
- Preparado para integração com webhook (n8n)

## Configuração

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave da API do Gemini:

```
GEMINI_API_KEY=sua_chave_aqui
```

Para obter uma chave da API do Gemini, acesse: https://makersuite.google.com/app/apikey

3. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Questionário

1. **Contexto do Negócio** - Setor, porte, objetivos estratégicos
2. **Dores e Gargalos** - Identificação de problemas operacionais
3. **Experiência com IA** - Barreiras e maturidade atual
4. **Questões Abertas** - Problema principal (opcional)
5. **Captura de Lead** - Nome, email e telefone

## Tecnologias

- Next.js 16
- React 19
- Tailwind CSS
- Google Gemini API
- TypeScript

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
