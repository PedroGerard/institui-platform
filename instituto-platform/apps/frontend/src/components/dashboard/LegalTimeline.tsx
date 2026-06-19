import { FileText, Gavel, History, Users } from 'lucide-react';
import { LegalEventDTO } from '@/types/dtos';

const EventIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'AssemblyHeld':
            return <Users className="text-blue-700" size={16} />;
        case 'StatuteChanged':
            return <Gavel className="text-teal-700" size={16} />;
        case 'MandateStarted':
            return <FileText className="text-emerald-700" size={16} />;
        default:
            return <History className="text-slate-500" size={16} />;
    }
};

const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export function LegalTimeline({ events, loading }: { events: LegalEventDTO[]; loading: boolean }) {
    if (loading) {
        return <div className="h-96 w-full animate-pulse rounded-lg border border-slate-800 bg-slate-800"></div>;
    }

    if (events.length === 0) {
        return (
            <div className="app-panel flex h-64 flex-col items-center justify-center p-6 text-center text-slate-500">
                <History size={32} className="mb-2 opacity-60" />
                <span className="text-sm font-medium">Nenhum evento registrado ainda.</span>
            </div>
        );
    }

    return (
        <div className="app-panel app-panel-pad">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">Linha do tempo juridica</h3>

            <div className="relative ml-2 space-y-6">
                <div className="absolute bottom-2 left-2.5 top-2 w-px bg-slate-800"></div>

                {events.map((event) => (
                    <div key={event.id} className="relative flex flex-col gap-1 pl-8">
                        <div className="absolute left-0 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
                            <EventIcon type={event.type} />
                        </div>

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-sm font-semibold text-slate-200">{event.type}</span>
                            <span className="text-xs font-medium text-slate-500">{formatDate(event.timestamp)}</span>
                        </div>

                        <div className="mt-1 rounded-md border border-slate-800 bg-slate-950/50 p-2 font-mono text-xs text-slate-400">
                            ID: {event.id.substring(0, 8)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
