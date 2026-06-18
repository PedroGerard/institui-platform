import Link from 'next/link';
import { ClipboardCheck, FileText, Gauge, MessageSquareText, PieChart } from 'lucide-react';

const links = [
    { href: '', label: 'Visao geral', icon: Gauge },
    { href: '/documentos', label: 'Documentos', icon: FileText },
    { href: '/checklist', label: 'Checklist', icon: ClipboardCheck },
    { href: '/parecer', label: 'Parecer', icon: MessageSquareText },
    { href: '/relatorios', label: 'Relatorios', icon: PieChart }
];

export function AccountabilityProjectNav({ projectId, active }: { projectId: string; active: string }) {
    return (
        <div className="flex flex-wrap gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2">
            {links.map(({ href, label, icon: Icon }) => {
                const fullHref = `/prestacao-contas/${projectId}${href}`;
                const selected = active === href || (active === '' && href === '');

                return (
                    <Link
                        key={href || 'overview'}
                        href={fullHref}
                        className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${selected
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <Icon size={15} />
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
