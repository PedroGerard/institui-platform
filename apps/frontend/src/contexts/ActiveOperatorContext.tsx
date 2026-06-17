'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/services/api';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import type { UserDTO } from '@/types/dtos';

const STORAGE_KEY = 'institui.activeUserId';

interface ActiveOperatorContextValue {
    operatorId: string;
    activeOperator?: UserDTO;
    operators: UserDTO[];
    loadingOperators: boolean;
    operatorError: string | null;
    hasOperator: boolean;
    setOperatorId: (operatorId: string) => void;
    clearOperatorId: () => void;
    refreshOperators: () => Promise<void>;
}

const ActiveOperatorContext = createContext<ActiveOperatorContextValue | null>(null);

function normalizeOperatorId(value: string) {
    return value.trim();
}

export function ActiveOperatorProvider({ children }: { children: React.ReactNode }) {
    const { associationId } = useActiveAssociation();
    const [operatorId, setOperatorIdState] = useState('');
    const [operators, setOperators] = useState<UserDTO[]>([]);
    const [operatorsAssociationId, setOperatorsAssociationId] = useState('');
    const [loadingOperators, setLoadingOperators] = useState(false);
    const [operatorError, setOperatorError] = useState<string | null>(null);
    const [storageLoaded, setStorageLoaded] = useState(false);

    useEffect(() => {
        const storedOperatorId = window.localStorage.getItem(STORAGE_KEY);
        setOperatorIdState(normalizeOperatorId(storedOperatorId || ''));
        setStorageLoaded(true);
    }, []);

    const setOperatorId = useCallback((nextOperatorId: string) => {
        const normalized = normalizeOperatorId(nextOperatorId);
        setOperatorIdState(normalized);

        if (normalized) {
            window.localStorage.setItem(STORAGE_KEY, normalized);
        } else {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const clearOperatorId = useCallback(() => {
        setOperatorId('');
    }, [setOperatorId]);

    const refreshOperators = useCallback(async () => {
        if (!associationId) {
            setOperators([]);
            setOperatorsAssociationId('');
            setOperatorError(null);
            setLoadingOperators(false);
            return;
        }

        try {
            setLoadingOperators(true);
            setOperatorError(null);
            setOperators(await api.listUsers(associationId));
            setOperatorsAssociationId(associationId);
        } catch (err: unknown) {
            setOperatorError(err instanceof Error ? err.message : 'Erro ao carregar usuarios.');
        } finally {
            setLoadingOperators(false);
        }
    }, [associationId]);

    useEffect(() => {
        refreshOperators();
    }, [refreshOperators]);

    const activeOperator = useMemo(
        () => operators.find((operator) => operator.id === operatorId),
        [operatorId, operators]
    );

    useEffect(() => {
        if (!storageLoaded || loadingOperators) return;

        if (!associationId || operatorsAssociationId !== associationId) return;

        if (operatorId && !activeOperator) {
            clearOperatorId();
            return;
        }

        if (!operatorId && operators.length === 1) {
            setOperatorId(operators[0].id);
        }
    }, [
        activeOperator,
        clearOperatorId,
        loadingOperators,
        operatorId,
        associationId,
        operatorsAssociationId,
        operators,
        setOperatorId,
        storageLoaded
    ]);

    const value = useMemo<ActiveOperatorContextValue>(() => {
        return {
            operatorId,
            activeOperator,
            operators,
            loadingOperators,
            operatorError,
            hasOperator: Boolean(operatorId && activeOperator),
            setOperatorId,
            clearOperatorId,
            refreshOperators
        };
    }, [
        activeOperator,
        clearOperatorId,
        loadingOperators,
        operatorError,
        operatorId,
        operators,
        refreshOperators,
        setOperatorId
    ]);

    return (
        <ActiveOperatorContext.Provider value={value}>
            {children}
        </ActiveOperatorContext.Provider>
    );
}

export function useActiveOperator() {
    const context = useContext(ActiveOperatorContext);

    if (!context) {
        throw new Error('useActiveOperator deve ser usado dentro de ActiveOperatorProvider.');
    }

    return context;
}
