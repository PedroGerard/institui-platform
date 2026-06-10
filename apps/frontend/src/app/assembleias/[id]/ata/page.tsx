
"use client";

import React from 'react'; // Explicit import for unwrapping params if needed in future Next.js
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";
import { RegisterMinutesForm } from "@/components/assemblies/RegisterMinutesForm";
import { ArrowLeft, BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { use } from "react"; // For params unwrapping in Next 15+ if valid, but we use standard params prop

// In Next.js 15+, params is a Promise. We need to await it or use `use()`.
// Since we are unsure of exact Next version constraints in this env, we'll try standard props.
// If error occurs, we fix. The package.json said "next": "16.1.1" ?? Ah no, "latest".
// Actually package.json showed "next": "16.1.1". This requires `await params`.

export default function RegisterMinutesPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrapping params for Next 15/16
    const { id } = use(params);

    return (
        <InstitutionalLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors text-sm">
                        <ArrowLeft size={16} />
                        Voltar ao Painel
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <BookOpenCheck size={24} />
                        </div>
                        <h1 className="text-2xl font-semibold text-white">Registro de Ata</h1>
                    </div>
                    <p className="text-slate-400 mt-2 max-w-2xl">
                        Este é o ato formal de registro das deliberações.
                        Ao confirmar, o sistema irá:
                        <span className="block mt-2 text-sm text-slate-500 ml-4 border-l border-slate-700 pl-3 space-y-1">
                            <span className="block">• Alterar o status da assembleia para <strong>REALIZADA</strong>.</span>
                            <span className="block">• Tornar o conteúdo auditável e imutável.</span>
                            <span className="block">• Desbloquear alterações estatutárias ou eleitorais aprovadas.</span>
                        </span>
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                    <RegisterMinutesForm
                        assemblyId={id}
                        onSuccess={() => {
                            // Optional: Redirect
                        }}
                    />
                </div>
            </div>
        </InstitutionalLayout>
    );
}
