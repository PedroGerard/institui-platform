import Link from 'next/link';
import { TrendingUp, TrendingDown, Wallet, FileText, ArrowRight } from 'lucide-react';

export default function TreasuryDashboard() {
    const stats = [
        { label: 'Saldo Atual', value: 'R$ 145.200,00', icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Receitas (Mês)', value: 'R$ 12.500,00', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: 'Despesas (Mês)', value: 'R$ 8.350,00', icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Tesouraria (Fluxo de Caixa)</h2>
                <div className="flex gap-3">
                    <Link href="/tesouraria/lancamentos/novo" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        + Novo Lançamento
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} p-3 rounded-lg`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-slate-500 text-sm font-medium">Jan/2026</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Mock */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-100">Últimos Lançamentos</h3>
                    <Link href="/tesouraria/lancamentos" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        Ver todos <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="divide-y divide-slate-800">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{i === 1 ? 'Pagamento Energia' : 'Mensalidade Associado'}</p>
                                    <p className="text-xs text-slate-500">Há 2 horas • Documento #123{i}</p>
                                </div>
                            </div>
                            <span className={`text-sm font-bold ${i === 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {i === 1 ? '- R$ 450,00' : '+ R$ 150,00'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
