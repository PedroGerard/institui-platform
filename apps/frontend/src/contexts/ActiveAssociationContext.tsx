'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'institui.activeAssociationId';

interface ActiveAssociationContextValue {
    associationId: string;
    hasAssociation: boolean;
    setAssociationId: (associationId: string) => void;
    clearAssociationId: () => void;
}

const ActiveAssociationContext = createContext<ActiveAssociationContextValue | null>(null);

function normalizeAssociationId(value: string) {
    return value.trim();
}

export function ActiveAssociationProvider({ children }: { children: React.ReactNode }) {
    const [associationId, setAssociationIdState] = useState('');

    useEffect(() => {
        const storedAssociationId = window.localStorage.getItem(STORAGE_KEY);
        const configuredAssociationId = process.env.NEXT_PUBLIC_ACTIVE_ASSOCIATION_ID || '';
        setAssociationIdState(normalizeAssociationId(storedAssociationId || configuredAssociationId));
    }, []);

    const value = useMemo<ActiveAssociationContextValue>(() => {
        function setAssociationId(nextAssociationId: string) {
            const normalized = normalizeAssociationId(nextAssociationId);
            setAssociationIdState(normalized);

            if (normalized) {
                window.localStorage.setItem(STORAGE_KEY, normalized);
            } else {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        }

        function clearAssociationId() {
            setAssociationId('');
        }

        return {
            associationId,
            hasAssociation: Boolean(associationId),
            setAssociationId,
            clearAssociationId
        };
    }, [associationId]);

    return (
        <ActiveAssociationContext.Provider value={value}>
            {children}
        </ActiveAssociationContext.Provider>
    );
}

export function useActiveAssociation() {
    const context = useContext(ActiveAssociationContext);

    if (!context) {
        throw new Error('useActiveAssociation deve ser usado dentro de ActiveAssociationProvider.');
    }

    return context;
}
