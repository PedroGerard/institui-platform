'use client';

import { Building2 } from 'lucide-react';

export function AssociationRequired({ message = 'Defina a associacao ativa para carregar os dados desta tela.' }: { message?: string }) {
    return (
        <div className="app-alert app-alert-warning text-sm">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
                <p className="font-bold">Associacao ativa nao definida</p>
                <p className="mt-1">{message}</p>
            </div>
        </div>
    );
}
