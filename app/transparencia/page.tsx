'use client';

import { useState } from 'react';
import { Search, FileText, Filter, Download } from 'lucide-react';

interface ContratoTransparencia {
  id: string;
  proponente: string;
  parlamentarOuPrograma: string;
  modalidade: string;
  objeto: string;
  orgaoConcedente: string;
  numInstrumento: string;
  numEmendaOuEdital: string;
  anoEmenda: string;
  valorTotal: string;
  dataAssinatura: string;
  situacao: string;
  linkArquivo: string;
}

const contratosData: ContratoTransparencia[] = [
  {
    id: '1',
    proponente: 'INSTITUTO INCENTIVE',
    parlamentarOuPrograma: 'PNAB - Política Nacional Aldir Blanc',
    modalidade: 'Termo de Execução Cultural',
    objeto: 'SONS DO SERTÃO: FORMAÇÃO MUSICAL COMUNITÁRIA E DEMOCRATIZAÇÃO DO ACESSO A CULTURA EM TERRITÓRIO PERIURBANO',
    orgaoConcedente: 'Prefeitura Municipal de Pereiro/CE - Sec. de Cultura e Turismo / MinC',
    numInstrumento: '027/2026',
    numEmendaOuEdital: 'Edital nº 01/2026',
    anoEmenda: '2026',
    valorTotal: 'R$ 5.000,00',
    dataAssinatura: '22/05/2026',
    situacao: 'Em Execução (Vigência: 8 meses)',
    linkArquivo: '/TERMO DE EXECUÇÃO CULTURAL N027-2026-SECULT.pdf',
  },
];

export default function TransparenciaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalidade, setFilterModalidade] = useState('TODOS');

  const filteredContratos = contratosData.filter((item) => {
    const matchesSearch =
      item.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.numInstrumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgaoConcedente.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModalidade = filterModalidade === 'TODOS' || item.modalidade === filterModalidade;

    return matchesSearch && matchesModalidade;
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Prestação de Contas Pública
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Transparência, Contratos e Fontes de Recursos
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600">
            Acompanhe a aplicação dos recursos públicos e privados repassados ao Instituto Incentive. Apresentamos todos os instrumentos celebrados, emendas, editais e prestação de contas.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Nº do Instrumento, Objeto ou Órgão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={filterModalidade}
                onChange={(e) => setFilterModalidade(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="TODOS">Todas as Modalidades</option>
                <option value="Termo de Execução Cultural">Termo de Execução Cultural</option>
                <option value="Termo de Fomento">Termo de Fomento</option>
                <option value="Termo de Colaboração">Termo de Colaboração</option>
              </select>
            </div>

            {(searchTerm || filterModalidade !== 'TODOS') && (
              <button
                onClick={() => { setSearchTerm(''); setFilterModalidade('TODOS'); }}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-900 text-white uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="p-4">Proponente / Programa</th>
                  <th className="p-4">Modalidade</th>
                  <th className="p-4 min-w-[280px]">Objeto</th>
                  <th className="p-4">Órgão Concedente</th>
                  <th className="p-4 whitespace-nowrap">Nº Instrumento / Edital</th>
                  <th className="p-4 text-right">Valor Total</th>
                  <th className="p-4 whitespace-nowrap">Data Assinatura</th>
                  <th className="p-4">Situação</th>
                  <th className="p-4 text-center">Arquivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContratos.length > 0 ? (
                  filteredContratos.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">
                        <div>{item.proponente}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{item.parlamentarOuPrograma}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          {item.modalidade}
                        </span>
                      </td>
                      <td className="p-4 leading-relaxed font-normal text-slate-800">
                        {item.objeto}
                      </td>
                      <td className="p-4 text-slate-600">
                        {item.orgaoConcedente}
                      </td>
                      <td className="p-4 whitespace-nowrap font-mono font-bold text-slate-900">
                        <div>{item.numInstrumento}</div>
                        <div className="text-[10px] font-normal text-slate-500">{item.numEmendaOuEdital} ({item.anoEmenda})</div>
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                        {item.valorTotal}
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-600">
                        {item.dataAssinatura}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          {item.situacao}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <a
                          href={item.linkArquivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-600 transition-all"
                          title="Acessar documento na íntegra"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      Nenhum instrumento contratual encontrado para os critérios selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
