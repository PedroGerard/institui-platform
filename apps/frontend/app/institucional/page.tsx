'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { GeneratedDocumentDTO } from '@/types/dtos';
import { formatDate } from '@/lib/institutional';
import { AlertCircle, Building2, CheckCircle, Download, Save, ScrollText } from 'lucide-react';

export default function InstitutionalPage() {
    const {
        associationId,
        activeAssociation,
        associations,
        hasAssociation,
        setAssociationId,
        refreshAssociations
    } = useActiveAssociation();
    const [loading, setLoading] = useState(false);
    const [savingAssociation, setSavingAssociation] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [associationFeedback, setAssociationFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [document, setDocument] = useState<GeneratedDocumentDTO | null>(null);
    const [associationForm, setAssociationForm] = useState({
        name: '',
        cnpj: '',
        foundationDate: ''
    });

    async function createAssociation(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSavingAssociation(true);
            setAssociationFeedback(null);
            setError(null);

            const association = await api.createAssociation(associationForm);
            await refreshAssociations();
            setAssociationId(association.id);
            setAssociationForm({ name: '', cnpj: '', foundationDate: '' });
            setAssociationFeedback({
                type: 'success',
                message: `${association.name} cadastrada e definida como associacao ativa.`
            });
        } catch (err: unknown) {
            setAssociationFeedback({
                type: 'error',
                message: err instanceof Error ? err.message : 'Erro ao cadastrar associacao.'
            });
        } finally {
            setSavingAssociation(false);
        }
    }

    async function generateStatute() {
        try {
            if (!associationId) {
                throw new Error('Defina a associacao ativa antes de gerar o estatuto.');
            }

            setLoading(true);
            setError(null);
            setDocument(await api.generateStatute(associationId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar estatuto.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <InstitutionalLayout title="Institucional" activePath="/institucional">
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Cadastro institucional</h2>
                    <p className="mt-1 text-sm text-slate-400">Entidade, estatuto, diretoria e documentos consolidados do sistema de gestao.</p>
                </div>

                {(associationFeedback || error || document) && (
                    <div className={`flex items-center justify-between gap-3 rounded-lg border p-4 text-sm ${document
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : associationFeedback?.type === 'success' && !error
                            ? 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                            : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        <div className="flex items-center gap-3">
                            {document || associationFeedback?.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {document ? `${document.title} gerado.` : associationFeedback?.message || error}
                        </div>
                        {document && (
                            <a
                                href={api.generatedDocumentDownloadUrl(document.id)}
                                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/10"
                            >
                                <Download size={14} />
                                Baixar
                            </a>
                        )}
                    </div>
                )}

                <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                                <Building2 size={15} aria-hidden="true" />
                                Entidade operacional
                            </div>
                            <h3 className="mt-2 text-xl font-bold text-slate-100">
                                {activeAssociation?.name || 'Nenhuma associacao ativa'}
                            </h3>
                            <p className="mt-1 text-sm text-slate-400">
                                {activeAssociation
                                    ? `${activeAssociation.cnpjFormatted || activeAssociation.cnpj} - Fundacao em ${formatDate(activeAssociation.foundationDate)}`
                                    : associations.length > 0
                                        ? 'Selecione a OSC no topo para operar membros, mandatos, assembleias e tesouraria.'
                                        : 'Cadastre a primeira OSC para iniciar a operacao do ERP.'}
                            </p>
                        </div>
                        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800">
                            Ver painel
                        </Link>
                    </div>

                    {activeAssociation && (
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {[
                                ['Membros', activeAssociation.counts?.members || 0],
                                ['Mandatos', activeAssociation.counts?.mandates || 0],
                                ['Orgaos', activeAssociation.counts?.governanceBodies || 0],
                                ['Assembleias', activeAssociation.counts?.assemblies || 0],
                                ['Prestacoes', activeAssociation.counts?.accountabilityProjects || 0]
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                                    <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-100">Cadastrar associacao</h3>
                        <p className="mt-1 text-sm text-slate-400">Use este cadastro para configurar a entidade que sera operada pelo sistema de gestao.</p>
                    </div>

                    <form onSubmit={createAssociation} className="grid gap-4 md:grid-cols-[1.3fr_0.8fr_0.6fr_auto] md:items-end">
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Nome da entidade</span>
                            <input
                                required
                                value={associationForm.name}
                                onChange={(event) => setAssociationForm((current) => ({ ...current, name: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                                placeholder="Instituto Incentive"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">CNPJ</span>
                            <input
                                required
                                value={associationForm.cnpj}
                                onChange={(event) => setAssociationForm((current) => ({ ...current, cnpj: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                                placeholder="00.000.000/0001-91"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Fundacao</span>
                            <input
                                required
                                type="date"
                                value={associationForm.foundationDate}
                                onChange={(event) => setAssociationForm((current) => ({ ...current, foundationDate: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={savingAssociation}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={16} aria-hidden="true" />
                            {savingAssociation ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </section>

                {!hasAssociation && <AssociationRequired message="Cadastre ou selecione uma associacao ativa antes de gerar o estatuto consolidado." />}

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Associacao</label>
                    <input
                        readOnly
                        value={activeAssociation?.name || associationId}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                        placeholder="Defina no seletor superior ou cadastre acima"
                    />

                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/documentos/gerados" className="text-sm text-slate-400 hover:text-white">
                            Ver documentos gerados
                        </Link>
                        <button
                            type="button"
                            onClick={generateStatute}
                            disabled={loading || !hasAssociation}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <ScrollText size={17} />
                            {loading ? 'Gerando...' : 'Gerar Estatuto Consolidado'}
                        </button>
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
