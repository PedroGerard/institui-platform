import { ShieldAlert } from 'lucide-react';

export function PermissionRequired({
    message = 'O usuario operador selecionado nao possui permissao para acessar esta area.'
}: {
    message?: string;
}) {
    return (
        <div className="app-alert app-alert-warning text-sm">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
                <p className="font-bold">Permissao operacional necessaria</p>
                <p className="mt-1">{message}</p>
            </div>
        </div>
    );
}
