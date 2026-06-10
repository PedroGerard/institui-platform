
"use client";

import InstitutionalLayout from "@/components/layout/InstitutionalLayout";
import { AssociationRequired } from "@/components/layout/AssociationRequired";
import { CallAssemblyForm } from "@/components/assemblies/CallAssemblyForm";
import { useActiveAssociation } from "@/contexts/ActiveAssociationContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CallAssemblyPage() {
    const { associationId, hasAssociation } = useActiveAssociation();

    return (
        <InstitutionalLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors text-sm">
                        <ArrowLeft size={16} />
                        Voltar ao Painel
                    </Link>
                    <h1 className="text-2xl font-semibold text-white">Convocar Assembleia</h1>
                    <p className="text-slate-400 mt-1">
                        Inicie o processo formal de convocação. O sistema validará prazos e regras estatutárias automaticamente.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                    {!hasAssociation ? (
                        <AssociationRequired message="Informe a associacao ativa no topo antes de convocar uma assembleia." />
                    ) : (
                        <CallAssemblyForm
                            associationId={associationId}
                            onSuccess={() => {
                                // Optional: Redirect after delay or just show success message in form
                                // router.push("/");
                            }}
                        />
                    )}
                </div>
            </div>
        </InstitutionalLayout>
    );
}
