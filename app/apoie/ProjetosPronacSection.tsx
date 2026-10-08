'use client';

import { useState } from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface ProjetoPRONAC {
  id: string;
  pronac: string;
  nome: string;
  segmento: string;
  descricao: string;
  banco: string;
  agencia: string;
  contaCaptacao: string;
  cnpj: string;
  proponente: string;
  enquadramento: string;
}

const projetosPronac: ProjetoPRONAC[] = [
  {
    id: 'literatura',
    pronac: '268027',
    nome: 'Palavras que Transformam: Letramento Literário e Literatura Cearense em Pereiro',
    segmento: 'Humanidades / Letramento Literário',
    descricao: 'Formação leitora e letramento literário de crianças e adolescentes (6 a 19 anos) em Pereiro-CE, incluindo criação de acervo, clube de leitura e festival de recitação.',
    banco: 'Banco do Brasil (001)',
    agencia: '4047-9',
    contaCaptacao: '15.253-6',
    cnpj: '04.347.564/0001-56',
    proponente: 'INSTITUTO INCENTIVE DE INOVACAO, DESENVOLVIMENTO E TRANSFORMACAO SOCIAL',
    enquadramento: 'Artigo 18 (Dedução de 100% no IR)',
  },
  {
    id: 'bale',
    pronac: '265369',
    nome: 'Conservatório de Belas Artes Incentive: Balé Clássico',
    segmento: 'Artes Cênicas / Capacitação e Treinamento',
    descricao: 'Curso livre de balé clássico com formação técnica e artística, mediação cultural, apresentações públicas de dança e registro audiovisual.',
    banco: 'Banco do Brasil (001)',
    agencia: '4047-9',
    contaCaptacao: '15.181-5',
    cnpj: '04.347.564/0001-56',
    proponente: 'INSTITUTO INCENTIVE DE INOVACAO, DESENVOLVIMENTO E TRANSFORMACAO SOCIAL',
    enquadramento: 'Artigo 18 (Dedução de 100% no IR)',
  },
  {
    id: 'capoeira',
    pronac: '265239',
    nome: 'Capoeira das Comunidades: Formação, Ancestralidade e Salvaguarda no Semiárido Cearense',
    segmento: 'Patrimônio Cultural / Educação Patrimonial',
    descricao: 'Ações integradas de formação cultural, salvaguarda da capoeira, aquisição de instrumentos tradicionais e oficinas continuadas em Pereiro/CE.',
    banco: 'Banco do Brasil (001)',
    agencia: '4047-9',
    contaCaptacao: '15.174-2',
    cnpj: '04.347.564/0001-56',
    proponente: 'INSTITUTO INCENTIVE DE INOVACAO, DESENVOLVIMENTO E TRANSFORMACAO SOCIAL',
    enquadramento: 'Artigo 18 (Dedução de 100% no IR)',
  },
];

export default function ProjetosPronacSection() {
  const [selectedProjeto, setSelectedProjeto] = useState<ProjetoPRONAC>(projetosPronac[0]);

  return (
    <section className="bg-slate-50 py-16 border-t border-slate-200" id="projetos-pronac">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Cultura & Qualificação • Vale do Jaguaribe
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-3">
            Patrocínio a Projetos Específicos via Lei Rouanet
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Sua empresa (Lucro Real) ou você (PF - Declaração Completa) pode direcionar o Imposto de Renda (até 4% PJ e 6% PF) para apoiar diretamente nossas iniciativas culturais aprovadas no PRONAC.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {projetosPronac.map((proj) => {
            const isSelected = selectedProjeto.id === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjeto(proj)}
                className={`flex flex-col justify-between text-left p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-white shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 mb-2">
                    PRONAC {proj.pronac}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{proj.nome}</h3>
                  <p className="text-xs text-slate-500 mt-1">{proj.segmento}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                  <span>{isSelected ? 'Projeto Selecionado' : 'Selecionar Projeto'}</span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                {selectedProjeto.enquadramento}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {selectedProjeto.nome}
              </h3>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                {selectedProjeto.descricao}
              </p>
              <div className="mt-6 space-y-2 text-xs text-slate-500">
                <p><strong>Proponente:</strong> {selectedProjeto.proponente}</p>
                <p><strong>CNPJ:</strong> {selectedProjeto.cnpj}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 items-center">
                <a
                  href="https://www27.receita.fazenda.gov.br/simulador-irpf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                >
                  Faça uma simulação no site da Receita Federal
                  <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center border-b border-slate-200 pb-3 mb-4">
                  Dados da Conta do Projeto (Captação)
                </h4>
                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <dt className="text-slate-500">Banco:</dt>
                    <dd className="font-semibold text-slate-900">{selectedProjeto.banco}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <dt className="text-slate-500">Agência:</dt>
                    <dd className="font-mono font-bold text-slate-900">{selectedProjeto.agencia}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <dt className="text-slate-500">Conta Captação:</dt>
                    <dd className="font-mono font-bold text-emerald-700">{selectedProjeto.contaCaptacao}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <dt className="text-slate-500">CNPJ Proponente:</dt>
                    <dd className="font-mono text-slate-800">{selectedProjeto.cnpj}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">Nº PRONAC:</dt>
                    <dd className="font-mono font-bold text-slate-900">{selectedProjeto.pronac}</dd>
                  </div>
                </dl>
                <div className="mt-5 rounded-xl bg-emerald-50 p-3.5 border border-emerald-200 text-center">
                  <p className="text-[11px] text-emerald-800">
                    Após o depósito de patrocínio/doação, envie seu comprovante para:
                  </p>
                  <a
                    href="mailto:contato@institutoincentive.org.br"
                    className="mt-1 block font-semibold text-xs text-emerald-900 underline hover:text-emerald-700"
                  >
                    contato@institutoincentive.org.br
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
