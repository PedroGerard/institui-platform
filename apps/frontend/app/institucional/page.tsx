'use client';

import { useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { GeneratedDocumentDTO } from '@/types/dtos';
import { DEFAULT_ASSOCIATION_ID } from '@/lib/institutional';
import { AlertCircle, CheckCircle, Download, ScrollText } from 'lucide-react';

export default function InstitutionalPage() {
    const [associationId, setAssociationId] = useState(DEFAULT_ASSOCIATION_ID);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [document, setDocument] = useState<GeneratedDocumentDTO | null>(null);

    async function generateStatute() {
        try {
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
                    <p className="mt-1 text-sm text-slate-400">Estatuto, diretoria e documentos consolidados.</p>
                </div>

                {(error || document) && (
                    <div className={`flex items-center justify-between gap-3 rounded-lg border p-4 text-sm ${document
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        <div className="flex items-center gap-3">
                            {document ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {document ? `${document.title} gerado.` : error}
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

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Associacao</label>
                    <input
                        value={associationId}
                        onChange={(event) => setAssociationId(event.target.value)}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                    />

                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/documentos/gerados" className="text-sm text-slate-400 hover:text-white">
                            Ver documentos gerados
                        </Link>
                        <button
                            type="button"
                            onClick={generateStatute}
                            disabled={loading}
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
