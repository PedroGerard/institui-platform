'use client';

import { Building2 } from 'lucide-react';

export function AssociationRequired({ message = 'Defina a associacao ativa para carregar os dados desta tela.' }: { message?: string }) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
                <p className="font-semibold text-amber-100">Associacao ativa nao definida</p>
                <p className="mt-1 text-amber-200/90">{message}</p>
            </div>
        </div>
    );
}
