'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, Building2, FileText, History, Landmark, LayoutDashboard, LucideIcon, Network, RefreshCcw, Scale, ScrollText, Search, ShoppingCart, TrendingUp, UserCheck, UserCog, Users, Vote, Wallet } from 'lucide-react';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { useActiveOperator } from '@/contexts/ActiveOperatorContext';
import { userRoleLabels } from '@/lib/institutional';

interface SidebarItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    active?: boolean;
}

const navGroups = [
    {
        title: "Governanca",
        items: [
            { href: "/dashboard", icon: LayoutDashboard, label: "Visao Geral" },
            { href: "/institucional", icon: Scale, label: "Institucional" },
            { href: "/usuarios", icon: UserCog, label: "Usuarios" },
            { href: "/orgaos", icon: Network, label: "Orgaos e Comites" },
            { href: "/eleicoes", icon: Vote, label: "Eleicoes" },
            { href: "/mandatos", icon: Users, label: "Mandatos" },
            { href: "/assembleias", icon: Users, label: "Assembleias" }
        ]
    },
    {
        title: "Secretaria",
        items: [
            { href: "/membros", icon: Users, label: "Membros" },
            { href: "/atas", icon: ScrollText, label: "Atas & Registros" }
        ]
    },
    {
        title: "Operacao",
        items: [
            { href: "/tesouraria", icon: TrendingUp, label: "Fluxo de Caixa" },
            { href: "/compras", icon: ShoppingCart, label: "Compras MROSC" },
            { href: "/tesouraria/pagamentos", icon: Wallet, label: "Pagamentos" },
            { href: "/tesouraria/conciliacao", icon: RefreshCcw, label: "Conciliacao" },
            { href: "/tesouraria/relatorios", icon: BarChart3, label: "Relatorios" },
            { href: "/tesouraria/plano-contas", icon: Landmark, label: "Plano de Contas" },
            { href: "/tesouraria/lancamentos", icon: Wallet, label: "Lancamentos" },
            { href: "/prestacao-contas", icon: FileText, label: "Prestacao de Contas" }
        ]
    },
    {
        title: "Juridico",
        items: [
            { href: "/documentos", icon: FileText, label: "Documentos" },
            { href: "/auditoria", icon: History, label: "Auditoria" }
        ]
    }
];

const mobileNavItems = navGroups.flatMap((group) => group.items);

function isActiveNav(href: string, activePath: string) {
    if (href === "/dashboard") return activePath === "/dashboard";
    if (href === "/tesouraria") return activePath === "/tesouraria";
    return activePath.startsWith(href);
}

const SidebarItem = ({ href, icon: Icon, label, active }: SidebarItemProps) => (
    <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`app-nav-item flex min-h-11 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${active ? "app-nav-item-active" : ""}`}
    >
        <Icon size={19} aria-hidden="true" />
        <span>{label}</span>
    </Link>
);

const NavSection = ({ children }: { children: React.ReactNode }) => (
    <div className="app-nav-section px-4 pb-2 pt-5 text-xs font-bold uppercase tracking-[0.08em]">
        {children}
    </div>
);

function AssociationSwitcher() {
    const {
        associationId,
        activeAssociation,
        associations,
        loadingAssociations,
        associationError,
        hasAssociation,
        setAssociationId,
        refreshAssociations
    } = useActiveAssociation();

    const selectedAssociationIsMissing = Boolean(associationId && !activeAssociation);
    const helperText = loadingAssociations
        ? 'Carregando entidades cadastradas.'
        : associationError
            ? `Nao foi possivel carregar: ${associationError}`
            : activeAssociation
                ? `${activeAssociation.cnpjFormatted || activeAssociation.cnpj} - ${activeAssociation.counts?.members || 0} membros`
                : associations.length === 0
                    ? 'Cadastre uma entidade na tela Institucional.'
                    : 'Selecione a OSC que sera operada.';

    return (
        <section className="w-full min-w-0 rounded-lg border border-slate-800 bg-slate-950 p-2 lg:min-w-[310px]" aria-label="Associacao ativa">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <Building2 size={14} aria-hidden="true" />
                Associacao ativa
            </div>
            <div className="flex gap-2">
                <select
                    aria-label="Selecionar associacao ativa"
                    value={associationId}
                    disabled={loadingAssociations || associations.length === 0}
                    onChange={(event) => setAssociationId(event.target.value)}
                    className="h-9 min-w-0 flex-1 rounded-md border border-slate-800 bg-slate-900 px-3 text-xs text-slate-100 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <option value="">Selecionar OSC</option>
                    {selectedAssociationIsMissing && (
                        <option value={associationId}>Associacao salva nao encontrada</option>
                    )}
                    {associations.map((association) => (
                        <option key={association.id} value={association.id}>
                            {association.name}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={refreshAssociations}
                    disabled={loadingAssociations}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Atualizar associacoes"
                    title="Atualizar associacoes"
                >
                    <RefreshCcw size={15} aria-hidden="true" className={loadingAssociations ? 'animate-spin' : ''} />
                </button>
            </div>
            <div className={`mt-1 text-[11px] ${hasAssociation ? 'text-slate-400' : 'text-amber-300'}`} aria-live="polite">
                {helperText}
            </div>
        </section>
    );
}

function OperatorSwitcher() {
    const { associationId } = useActiveAssociation();
    const {
        operatorId,
        activeOperator,
        operators,
        loadingOperators,
        operatorError,
        hasOperator,
        setOperatorId,
        refreshOperators
    } = useActiveOperator();

    const selectedOperatorIsMissing = Boolean(operatorId && !activeOperator);
    const helperText = !associationId
        ? 'Selecione uma OSC antes do operador.'
        : loadingOperators
            ? 'Carregando usuarios da associacao.'
            : operatorError
                ? `Nao foi possivel carregar: ${operatorError}`
                : activeOperator
                    ? `${userRoleLabels[activeOperator.role]} - usado em auditoria`
                    : operators.length === 0
                        ? 'Cadastre usuarios para registrar auditoria.'
                        : 'Selecione quem esta operando.';

    return (
        <section className="w-full min-w-0 rounded-lg border border-slate-800 bg-slate-950 p-2 lg:min-w-[260px]" aria-label="Usuario operador ativo">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                <UserCheck size={14} aria-hidden="true" />
                Operador
            </div>
            <div className="flex gap-2">
                <select
                    aria-label="Selecionar usuario operador"
                    value={operatorId}
                    disabled={!associationId || loadingOperators || operators.length === 0}
                    onChange={(event) => setOperatorId(event.target.value)}
                    className="h-9 min-w-0 flex-1 rounded-md border border-slate-800 bg-slate-900 px-3 text-xs text-slate-100 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <option value="">Selecionar operador</option>
                    {selectedOperatorIsMissing && (
                        <option value={operatorId}>Operador salvo nao encontrado</option>
                    )}
                    {operators.map((operator) => (
                        <option key={operator.id} value={operator.id}>
                            {operator.name}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={refreshOperators}
                    disabled={!associationId || loadingOperators}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Atualizar operadores"
                    title="Atualizar operadores"
                >
                    <RefreshCcw size={15} aria-hidden="true" className={loadingOperators ? 'animate-spin' : ''} />
                </button>
            </div>
            <div className={`mt-1 text-[11px] ${hasOperator ? 'text-slate-400' : 'text-amber-300'}`} aria-live="polite">
                {helperText}
            </div>
        </section>
    );
}

export default function InstitutionalLayout({
    children,
    title = "Visao Geral",
    activePath = "/dashboard"
}: {
    children: React.ReactNode;
    title?: string;
    activePath?: string;
}) {
    const { activeOperator } = useActiveOperator();

    return (
        <div className="app-shell flex min-h-screen font-sans">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950">
                Pular para o conteudo principal
            </a>

            <aside className="app-sidebar hidden w-72 shrink-0 flex-col border-r app-sidebar-border lg:flex">
                <div className="app-sidebar-border flex h-20 items-center border-b px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#0c2144]">I+</div>
                        <div>
                            <span className="block text-lg font-bold tracking-tight text-white">INSTITUI+</span>
                            <span className="block text-xs font-medium text-[#b9cbe3]">Governanca para OSCs</span>
                        </div>
                    </div>
                </div>

                <nav aria-label="Modulos do sistema" className="flex-1 overflow-y-auto px-3 py-4">
                    {navGroups.map((group) => (
                        <React.Fragment key={group.title}>
                            <NavSection>{group.title}</NavSection>
                            {group.items.map((item) => (
                                <SidebarItem
                                    key={item.href}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    active={isActiveNav(item.href, activePath)}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </nav>

                <div className="app-sidebar-border border-t p-4">
                    <div className="flex items-center gap-3 rounded-lg bg-white/8 px-3 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0c2144]">
                            {activeOperator?.name.slice(0, 2).toUpperCase() || 'OP'}
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold text-white">{activeOperator?.name || 'Usuario operador'}</div>
                            <div className="text-xs text-[#b9cbe3]">
                                {activeOperator ? userRoleLabels[activeOperator.role] : 'Selecione para auditoria'}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-5 backdrop-blur md:px-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">INSTITUI+ ERP</p>
                        <h1 className="mt-1 text-xl font-bold text-slate-100 md:text-2xl">{title}</h1>
                    </div>
                    <div className="hidden items-center gap-4 lg:flex">
                        <label className="relative block">
                            <span className="sr-only">Buscar no sistema</span>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                            <input
                                className="h-10 w-72 rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 text-sm text-slate-100 outline-none"
                                placeholder="Buscar modulo, processo ou documento"
                                type="search"
                            />
                        </label>
                        <AssociationSwitcher />
                        <OperatorSwitcher />
                    </div>
                </header>
                <div className="space-y-3 border-b border-slate-800 bg-slate-900/50 p-4 lg:hidden">
                    <AssociationSwitcher />
                    <OperatorSwitcher />
                </div>
                <nav className="app-mobile-nav border-b border-slate-800 bg-slate-900/50" aria-label="Modulos do sistema em telas menores">
                    {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActiveNav(item.href, activePath);

                        return (
                            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                                <Icon size={16} aria-hidden="true" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div id="main-content" className="flex-1 overflow-y-auto p-5 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
