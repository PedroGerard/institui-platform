
import React from 'react';
import { History, FileText, Gavel, Users } from 'lucide-react';
import { LegalEventDTO } from '@/types/dtos';

const EventIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'AssemblyHeld': return <Users className="text-blue-400" size={16} />;
        case 'StatuteChanged': return <Gavel className="text-purple-400" size={16} />;
        case 'MandateStarted': return <FileText className="text-emerald-400" size={16} />;
        default: return <History className="text-slate-500" size={16} />;
    }
};

const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export function LegalTimeline({ events, loading }: { events: LegalEventDTO[]; loading: boolean }) {
    if (loading) {
        return <div className="animate-pulse bg-slate-800 h-96 rounded-xl w-full"></div>;
    }

    if (events.length === 0) {
        return (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500 h-64">
                <History size={32} className="mb-2 opacity-50" />
                <span>Nenhum evento registrado ainda.</span>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Linha do Tempo Jurídica (Audit Trail)</h3>

            <div className="space-y-6 relative ml-2">
                {/* Vertical Line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-800"></div>

                {events.map((event) => (
                    <div key={event.id} className="relative pl-8 flex flex-col gap-1">
                        <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center z-10">
                            <EventIcon type={event.type} />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-200">{event.type}</span>
                            <span className="text-xs text-slate-500 font-mono">{formatDate(event.timestamp)}</span>
                        </div>

                        <div className="text-xs text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/50 mt-1 font-mono break-all">
                            ID: {event.id.substring(0, 8)}
                        </div>
                        {/* 
                           We observe Strict Read-Only: We show the Payload as-is or simplifed? 
                           Ideally simplified, but for "Transparency" debugging, seeing the payload is good.
                           Let's simplify details based on type if needed, but for now ID is enough proof.
                        */}
                    </div>
                ))}
            </div>
        </div>
    );
}
