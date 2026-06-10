import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { FileCheck, FilePlus, FileText } from 'lucide-react';

export default function DocumentsPage() {
    return (
        <InstitutionalLayout title="Documentos" activePath="/documentos">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Documentos oficiais</h2>
                        <p className="mt-1 text-sm text-slate-400">Atas, listas, estatutos, oficios e pareceres fiscais.</p>
                    </div>
                    <Link
                        href="/documentos/gerar"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <FilePlus size={17} />
                        Gerar documento
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link
                        href="/documentos/gerados"
                        className="rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/60"
                    >
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                            <FileCheck size={21} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-100">Documentos gerados</h3>
                        <p className="mt-2 text-sm text-slate-400">Consultar, filtrar e baixar PDFs emitidos pelo sistema.</p>
                    </Link>

                    <Link
                        href="/documentos/gerar"
                        className="rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/60"
                    >
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                            <FileText size={21} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-100">Nova emissao</h3>
                        <p className="mt-2 text-sm text-slate-400">Gerar PDFs oficiais a partir dos dados institucionais.</p>
                    </Link>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
