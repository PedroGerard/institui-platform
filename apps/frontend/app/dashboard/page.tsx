'use client';

import InstitutionalLayout from "@/components/layout/InstitutionalLayout";
import { ComplianceStatus } from "@/components/dashboard/ComplianceStatus";
import { LegalTimeline } from "@/components/dashboard/LegalTimeline";
import { useAssociationDashboard } from "@/hooks/useAssociationDashboard";
import { DEFAULT_ASSOCIATION_ID } from "@/lib/institutional";
import Link from "next/link";
import { FileCheck2, FileText, Landmark, Scale, ShieldCheck, ShoppingCart, Users, Vote, Wallet } from "lucide-react";

const modules = [
  { href: "/membros", label: "Membros", description: "Associados, status e historico institucional.", icon: Users, color: "text-blue-700", bg: "bg-blue-600/10" },
  { href: "/mandatos", label: "Mandatos", description: "Cargos, vigencia e diretoria ativa.", icon: ShieldCheck, color: "text-emerald-700", bg: "bg-emerald-600/10" },
  { href: "/assembleias", label: "Assembleias", description: "Convocacao, quorum, presencas e deliberacoes.", icon: Vote, color: "text-teal-700", bg: "bg-cyan-600/10" },
  { href: "/compras", label: "Compras MROSC", description: "Edital, mapa de precos, homologacao e contrato.", icon: ShoppingCart, color: "text-indigo-700", bg: "bg-indigo-600/10" },
  { href: "/tesouraria/pagamentos", label: "Pagamentos", description: "Solicitacoes, aprovacao conjunta e baixa.", icon: Wallet, color: "text-amber-700", bg: "bg-amber-500/10" },
  { href: "/tesouraria/conciliacao", label: "Conciliacao", description: "Extrato bancario vinculado aos lancamentos.", icon: Landmark, color: "text-sky-700", bg: "bg-sky-600/10" },
  { href: "/prestacao-contas", label: "Prestacao de Contas", description: "Checklist, parecer fiscal e relatorios oficiais.", icon: FileCheck2, color: "text-green-700", bg: "bg-green-600/10" },
  { href: "/documentos", label: "Documentos", description: "Atas, listas, estatutos, oficios e pareceres.", icon: FileText, color: "text-rose-700", bg: "bg-rose-600/10" }
];

export default function Dashboard() {
  const { status, events, loading, error } = useAssociationDashboard(DEFAULT_ASSOCIATION_ID);

  return (
    <InstitutionalLayout title="Visao Geral" activePath="/dashboard">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm font-medium text-amber-900">
            Nao foi possivel carregar todos os dados do backend agora. As telas continuam disponiveis para navegacao.
          </div>
        )}

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700">
                <Scale size={26} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-slate-500">Central operacional</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-100">Governanca, financeiro e prestacao em uma so esteira.</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Acompanhe a situacao institucional, as decisoes formais, compras MROSC, pagamentos e documentos que sustentam auditoria e prestacao de contas.
                </p>
              </div>
            </div>
          </div>
          <ComplianceStatus status={status} loading={loading} />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <Link key={module.href} href={module.href} className="group rounded-lg border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800/50">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${module.bg} ${module.color}`}>
                <module.icon size={23} aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-100">{module.label}</h3>
              <p className="mt-2 text-sm leading-5 text-slate-400">{module.description}</p>
            </Link>
          ))}
        </section>

        <LegalTimeline events={events} loading={loading} />
      </div>
    </InstitutionalLayout>
  );
}
