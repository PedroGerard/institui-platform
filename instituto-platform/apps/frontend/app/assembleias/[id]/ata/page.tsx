'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { RegisterMinutesForm } from '@/components/assemblies/RegisterMinutesForm';

export default function RegisterMinutesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <InstitutionalLayout title="Registro de ata" activePath="/assembleias">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href={`/assembleias/${id}`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar para assembleia
                </Link>

                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                        <BookOpenCheck size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Registrar ata oficial</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Formalize o teor da assembleia e gere o registro auditavel das deliberacoes.
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 md:p-8">
                    <RegisterMinutesForm assemblyId={id} onSuccess={() => undefined} />
                </div>
            </div>
        </InstitutionalLayout>
    );
}
