'use client';

import { FormEvent, use, useEffect, useState } from 'react';
import { AccountabilityProjectNav } from '@/components/accountability/AccountabilityProjectNav';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AccountabilityDocumentDTO, DocumentType } from '@/types/dtos';
import { documentTypeLabels, formatDate } from '@/lib/institutional';
import { AlertCircle, CheckCircle, FileUp, RefreshCw } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";
const documentTypes = Object.keys(documentTypeLabels) as DocumentType[];

export default function AccountabilityDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [documents, setDocuments] = useState<AccountabilityDocumentDTO[]>([]);
    const [type, setType] = useState<DocumentType>('REX');
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    async function loadDocuments() {
        try {
            setLoading(true);
            setError(null);
            setDocuments(await api.listAccountabilityDocuments(projectId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar documentos.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setMessage(null);
        setError(null);

        try {
            await api.uploadAccountabilityDocument(projectId, { type, fileUrl });
            setFileUrl('');
            setMessage('Documento anexado.');
            await loadDocuments();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao anexar documento.');
        } finally {
            setSaving(false);
        }
    }

    async function validateDocument(documentId: string, validated: boolean) {
        try {
            setMessage(null);
            setError(null);
            await api.validateAccountabilityDocument(documentId, validated);
            setMessage(validated ? 'Documento validado.' : 'Validacao removida.');
            await loadDocuments();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao validar documento.');
        }
    }

    useEffect(() => {
        loadDocuments();
    }, [projectId]);

    return (
        <InstitutionalLayout title="Documentos da prestacao" activePath="/prestacao-contas">
            <div className="space-y-6">
                <AccountabilityProjectNav projectId={projectId} active="/documentos" />

                {(error || message) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${message
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {message ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message || error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-5 md:grid-cols-[1fr_1.4fr_auto] md:items-end">
                        <div>
                            <label className={labelClass}>Tipo documental</label>
                            <select value={type} onChange={(event) => setType(event.target.value as DocumentType)} className={inputClass}>
                                {documentTypes.map((item) => <option key={item} value={item}>{documentTypeLabels[item]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Arquivo ou URL</label>
                            <input required value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} placeholder="/uploads/nota-fiscal.pdf" className={inputClass} />
                        </div>
                        <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <FileUp size={17} />
                            {saving ? 'Anexando...' : 'Anexar'}
                        </button>
                    </div>
                </form>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[820px]">
                        <div className="grid grid-cols-[1fr_1.3fr_1fr_1fr_140px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Tipo</span>
                            <span>Arquivo</span>
                            <span>Enviado em</span>
                            <span>Status</span>
                            <span className="text-right">Validacao</span>
                        </div>
                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando documentos...</div>
                        ) : documents.length === 0 ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Nenhum documento anexado.</div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {documents.map((document) => (
                                    <div key={document.id} className="grid grid-cols-[1fr_1.3fr_1fr_1fr_140px] items-center gap-4 px-5 py-4 text-sm">
                                        <span className="text-slate-200">{documentTypeLabels[document.type]}</span>
                                        <a href={document.fileUrl} className="truncate text-blue-300 hover:text-blue-200">{document.fileUrl}</a>
                                        <span className="text-slate-300">{formatDate(document.uploadedAt)}</span>
                                        <span className={document.validated ? 'text-emerald-300' : 'text-amber-300'}>{document.validated ? 'Validado' : 'Nao validado'}</span>
                                        <button onClick={() => validateDocument(document.id, !document.validated)} className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800">
                                            <RefreshCw size={14} />
                                            {document.validated ? 'Reabrir' : 'Validar'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
