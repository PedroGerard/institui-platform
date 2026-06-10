
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function Home() {
    return (
        <InstitutionalLayout>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 p-6 bg-slate-900 rounded-xl border border-slate-800">
                    <h2 className="text-lg font-medium text-white mb-4">Bem-vindo ao Painel de Governança</h2>
                    <p className="text-slate-400">
                        Selecione uma opção no menu lateral para visualizar os atos constitutivos e eventos jurídicos.
                    </p>
                </div>

                <div className="col-span-4 p-6 bg-slate-900 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Status Rápido</h3>
                    <div className="flex items-center gap-2 text-yellow-500">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        <span className="font-medium">Aguardando Conexão API</span>
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
