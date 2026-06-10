
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { AssociationStatusDTO } from '@/types/dtos';

function StatusItem({ label, active }: { label: string; active: boolean }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
            <span className="text-sm text-slate-400">{label}</span>
            {active ? (
                <CheckCircle className="text-emerald-500 w-4 h-4" />
            ) : (
                <AlertCircle className="text-red-500 w-4 h-4" />
            )}
        </div>
    );
}

export function ComplianceStatus({ status, loading }: { status: AssociationStatusDTO | null; loading: boolean }) {
    if (loading) {
        return <div className="animate-pulse bg-slate-800 h-48 rounded-xl w-full"></div>;
    }

    if (!status) return null;

    const isYellow = status.complianceLevel === 'YELLOW';
    const isRed = status.complianceLevel === 'RED';


    let color = "text-emerald-500";
    let message = "Regular";
    let Icon = CheckCircle;

    if (isRed) {
        color = "text-red-500";
        message = "Irregular / Bloqueado";
        Icon = AlertCircle;
    } else if (isYellow) {
        color = "text-yellow-500";
        message = "Atenção Necessária";
        Icon = AlertTriangle;
    }

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Status de Compliance</h3>

            <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-full bg-slate-800/50 ${color}`}>
                    <Icon size={32} />
                </div>
                <div>
                    <h4 className={`text-xl font-bold ${color}`}>{message}</h4>
                    <span className="text-xs text-slate-500">Nível: {status.complianceLevel}</span>
                </div>
            </div>

            <div className="space-y-1">
                <StatusItem label="Estatuto Ativo e Regular" active={status.hasActiveStatute} />
                <StatusItem label="Mandato Ativo e Vigente" active={status.hasActiveMandate} />
                <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                    <span className="text-sm text-slate-400">Pendências de Registro</span>
                    <span className={`text-sm font-bold ${status.pendingMinutes > 0 ? "text-yellow-500" : "text-emerald-500"}`}>
                        {status.pendingMinutes}
                    </span>
                </div>
            </div>
        </div>
    );
}
