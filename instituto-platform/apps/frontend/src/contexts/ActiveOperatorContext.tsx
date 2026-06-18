'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/services/api';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import type { PermissionKey, UserDTO } from '@/types/dtos';

const STORAGE_KEY = 'institui.activeUserId';

interface ActiveOperatorContextValue {
    operatorId: string;
    activeOperator?: UserDTO;
    operators: UserDTO[];
    permissions: PermissionKey[];
    loadingOperators: boolean;
    loadingPermissions: boolean;
    operatorError: string | null;
    permissionError: string | null;
    hasOperator: boolean;
    hasPermission: (permission: PermissionKey) => boolean;
    setOperatorId: (operatorId: string) => void;
    clearOperatorId: () => void;
    refreshOperators: () => Promise<void>;
    refreshPermissions: () => Promise<void>;
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
    const [permissions, setPermissions] = useState<PermissionKey[]>([]);
    const [loadingOperators, setLoadingOperators] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [operatorError, setOperatorError] = useState<string | null>(null);
    const [permissionError, setPermissionError] = useState<string | null>(null);
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

    const refreshPermissions = useCallback(async () => {
        if (!associationId || !operatorId || !activeOperator || activeOperator.associationId !== associationId) {
            setPermissions([]);
            setPermissionError(null);
            setLoadingPermissions(false);
            return;
        }

        try {
            setLoadingPermissions(true);
            setPermissionError(null);
            const context = await api.getOperationalContext();

            if (context.associationId !== associationId || context.user.id !== operatorId) {
                throw new Error('Contexto operacional retornou usuario divergente.');
            }

            setPermissions(context.permissions);
        } catch (err: unknown) {
            setPermissions([]);
            setPermissionError(err instanceof Error ? err.message : 'Erro ao carregar permissoes.');
        } finally {
            setLoadingPermissions(false);
        }
    }, [activeOperator, associationId, operatorId]);

    useEffect(() => {
        refreshPermissions();
    }, [refreshPermissions]);

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

    const hasPermission = useCallback(
        (permission: PermissionKey) => permissions.includes(permission),
        [permissions]
    );

    const value = useMemo<ActiveOperatorContextValue>(() => {
        return {
            operatorId,
            activeOperator,
            operators,
            permissions,
            loadingOperators,
            loadingPermissions,
            operatorError,
            permissionError,
            hasOperator: Boolean(operatorId && activeOperator),
            hasPermission,
            setOperatorId,
            clearOperatorId,
            refreshOperators,
            refreshPermissions
        };
    }, [
        activeOperator,
        clearOperatorId,
        hasPermission,
        loadingPermissions,
        loadingOperators,
        operatorError,
        operatorId,
        operators,
        permissions,
        permissionError,
        refreshOperators,
        refreshPermissions,
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
