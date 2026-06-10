'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { GeneratedDocumentDTO, GeneratedDocumentType } from '@/types/dtos';
import { generatedDocumentTypeLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, FilePlus } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";
const documentTypes = Object.keys(generatedDocumentTypeLabels) as GeneratedDocumentType[];

export default function GenerateDocumentPage() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const [type, setType] = useState<GeneratedDocumentType>('ATA');
    const [referenceId, setReferenceId] = useState('');
    const [title, setTitle] = useState('Oficio institucional');
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocumentDTO | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setGeneratedDocument(null);

        try {
            if (!associationId && (type === 'ESTATUTO' || type === 'OFICIO')) {
                throw new Error('Defina a associacao ativa antes de gerar este documento.');
            }

            let document: GeneratedDocumentDTO;

            if (type === 'ATA') {
                if (!referenceId) throw new Error('Informe o ID da assembleia.');
                document = await api.generateAssemblyMinute(referenceId);
            } else if (type === 'LISTA_PRESENCA') {
                if (!referenceId) throw new Error('Informe o ID da assembleia.');
                document = await api.generatePresenceList(referenceId);
            } else if (type === 'ESTATUTO') {
                document = await api.generateStatute(associationId);
            } else if (type === 'PARECER_FISCAL') {
                if (!referenceId) throw new Error('Informe o ID da prestacao de contas.');
                document = await api.generateFiscalOpinion(referenceId);
            } else {
                document = await api.generateOfficialLetter({
                    associationId,
                    referenceId: referenceId || undefined,
                    title,
                    recipient,
                    subject,
                    content
                });
            }

            setGeneratedDocument(document);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar documento.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Gerar documento" activePath="/documentos/gerar">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href="/documentos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Nova emissao</h2>
                    <p className="mt-1 text-sm text-slate-400">O PDF gerado fica registrado com hash e trilha de auditoria.</p>
                </div>

                {(error || generatedDocument) && (
                    <div className={`flex items-center justify-between gap-3 rounded-lg border p-4 text-sm ${generatedDocument
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        <div className="flex items-center gap-3">
                            {generatedDocument ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {generatedDocument ? 'Documento gerado com sucesso.' : error}
                        </div>
                        {generatedDocument && (
                            <a
                                href={api.generatedDocumentDownloadUrl(generatedDocument.id)}
                                className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/10"
                            >
                                Baixar PDF
                            </a>
                        )}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Informe a associacao ativa no topo para gerar estatuto consolidado ou oficio." />}

                <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Tipo</label>
                            <select
                                value={type}
                                onChange={(event) => {
                                    setType(event.target.value as GeneratedDocumentType);
                                    setGeneratedDocument(null);
                                    setError(null);
                                }}
                                className={inputClass}
                            >
                                {documentTypes.map((documentType) => (
                                    <option key={documentType} value={documentType}>{generatedDocumentTypeLabels[documentType]}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Associacao</label>
                            <input
                                readOnly
                                value={associationId}
                                className={inputClass}
                                placeholder="Defina no seletor superior"
                            />
                        </div>

                        {(type === 'ATA' || type === 'LISTA_PRESENCA') && (
                            <div className="md:col-span-2">
                                <label className={labelClass}>ID da assembleia</label>
                                <input
                                    required
                                    value={referenceId}
                                    onChange={(event) => setReferenceId(event.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        )}

                        {type === 'PARECER_FISCAL' && (
                            <div className="md:col-span-2">
                                <label className={labelClass}>ID da prestacao de contas</label>
                                <input
                                    required
                                    value={referenceId}
                                    onChange={(event) => setReferenceId(event.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        )}

                        {type === 'OFICIO' && (
                            <>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Titulo</label>
                                    <input
                                        required
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Destinatario</label>
                                    <input
                                        required
                                        value={recipient}
                                        onChange={(event) => setRecipient(event.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Assunto</label>
                                    <input
                                        required
                                        value={subject}
                                        onChange={(event) => setSubject(event.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Referencia</label>
                                    <input
                                        value={referenceId}
                                        onChange={(event) => setReferenceId(event.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Conteudo</label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={content}
                                        onChange={(event) => setContent(event.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/documentos/gerados" className="text-sm text-slate-400 hover:text-white">
                            Ver documentos gerados
                        </Link>
                        <button
                            type="submit"
                            disabled={saving || (!hasAssociation && (type === 'ESTATUTO' || type === 'OFICIO'))}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FilePlus size={17} />
                            {saving ? 'Gerando...' : 'Gerar PDF'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
