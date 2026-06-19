'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/services/api';
import type { AssociationDTO } from '@/types/dtos';

const STORAGE_KEY = 'institui.activeAssociationId';

interface ActiveAssociationContextValue {
    associationId: string;
    activeAssociation?: AssociationDTO;
    associations: AssociationDTO[];
    loadingAssociations: boolean;
    associationError: string | null;
    hasAssociation: boolean;
    setAssociationId: (associationId: string) => void;
    clearAssociationId: () => void;
    refreshAssociations: () => Promise<void>;
}

const ActiveAssociationContext = createContext<ActiveAssociationContextValue | null>(null);

function normalizeAssociationId(value: string) {
    return value.trim();
}

export function ActiveAssociationProvider({ children }: { children: React.ReactNode }) {
    const [associationId, setAssociationIdState] = useState('');
    const [associations, setAssociations] = useState<AssociationDTO[]>([]);
    const [loadingAssociations, setLoadingAssociations] = useState(true);
    const [associationError, setAssociationError] = useState<string | null>(null);
    const [storageLoaded, setStorageLoaded] = useState(false);

    useEffect(() => {
        const storedAssociationId = window.localStorage.getItem(STORAGE_KEY);
        const configuredAssociationId = process.env.NEXT_PUBLIC_ACTIVE_ASSOCIATION_ID || '';
        setAssociationIdState(normalizeAssociationId(storedAssociationId || configuredAssociationId));
        setStorageLoaded(true);
    }, []);

    const setAssociationId = useCallback((nextAssociationId: string) => {
        const normalized = normalizeAssociationId(nextAssociationId);
        setAssociationIdState(normalized);

        if (normalized) {
            window.localStorage.setItem(STORAGE_KEY, normalized);
        } else {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const clearAssociationId = useCallback(() => {
        setAssociationId('');
    }, [setAssociationId]);

    const refreshAssociations = useCallback(async () => {
        try {
            setLoadingAssociations(true);
            setAssociationError(null);
            setAssociations(await api.listAssociations());
        } catch (err: unknown) {
            setAssociationError(err instanceof Error ? err.message : 'Erro ao carregar associacoes.');
        } finally {
            setLoadingAssociations(false);
        }
    }, []);

    useEffect(() => {
        refreshAssociations();
    }, [refreshAssociations]);

    useEffect(() => {
        if (!storageLoaded || associationId || loadingAssociations || associations.length !== 1) {
            return;
        }

        setAssociationId(associations[0].id);
    }, [associationId, associations, loadingAssociations, setAssociationId, storageLoaded]);

    const activeAssociation = useMemo(
        () => associations.find((association) => association.id === associationId),
        [associationId, associations]
    );

    const value = useMemo<ActiveAssociationContextValue>(() => {
        return {
            associationId,
            activeAssociation,
            associations,
            loadingAssociations,
            associationError,
            hasAssociation: Boolean(associationId),
            setAssociationId,
            clearAssociationId,
            refreshAssociations
        };
    }, [
        activeAssociation,
        associationError,
        associationId,
        associations,
        clearAssociationId,
        loadingAssociations,
        refreshAssociations,
        setAssociationId
    ]);

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
