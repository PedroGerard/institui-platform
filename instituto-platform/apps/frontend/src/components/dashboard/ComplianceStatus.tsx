import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { AssociationStatusDTO } from '@/types/dtos';

function StatusItem({ label, active }: { label: string; active: boolean }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-800 py-2 last:border-0">
            <span className="text-sm text-slate-400">{label}</span>
            {active ? (
                <CheckCircle className="h-4 w-4 text-emerald-700" />
            ) : (
                <AlertCircle className="h-4 w-4 text-red-700" />
            )}
        </div>
    );
}

export function ComplianceStatus({ status, loading }: { status: AssociationStatusDTO | null; loading: boolean }) {
    if (loading) {
        return <div className="h-48 w-full animate-pulse rounded-lg border border-slate-800 bg-slate-800"></div>;
    }

    if (!status) return null;

    const isYellow = status.complianceLevel === 'YELLOW';
    const isRed = status.complianceLevel === 'RED';

    let color = 'text-emerald-700';
    let iconBg = 'bg-emerald-600/10';
    let message = 'Regular';
    let Icon = CheckCircle;

    if (isRed) {
        color = 'text-red-700';
        iconBg = 'bg-red-600/10';
        message = 'Irregular / bloqueado';
        Icon = AlertCircle;
    } else if (isYellow) {
        color = 'text-amber-700';
        iconBg = 'bg-amber-500/10';
        message = 'Atencao necessaria';
        Icon = AlertTriangle;
    }

    return (
        <div className="app-panel app-panel-pad">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">Status de compliance</h3>

            <div className="mb-8 flex items-center gap-4">
                <div className={`app-icon-tile ${iconBg} ${color}`}>
                    <Icon size={30} />
                </div>
                <div>
                    <h4 className={`text-xl font-bold ${color}`}>{message}</h4>
                    <span className="text-xs text-slate-500">Nivel: {status.complianceLevel}</span>
                </div>
            </div>

            <div className="space-y-1">
                <StatusItem label="Estatuto ativo e regular" active={status.hasActiveStatute} />
                <StatusItem label="Mandato ativo e vigente" active={status.hasActiveMandate} />
                <div className="flex items-center justify-between border-b border-slate-800 py-2 last:border-0">
                    <span className="text-sm text-slate-400">Pendencias de registro</span>
                    <span className={`text-sm font-bold ${status.pendingMinutes > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {status.pendingMinutes}
                    </span>
                </div>
            </div>
        </div>
    );
}
