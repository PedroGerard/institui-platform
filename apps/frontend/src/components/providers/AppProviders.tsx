'use client';

import { ActiveAssociationProvider } from '@/contexts/ActiveAssociationContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ActiveAssociationProvider>
            {children}
        </ActiveAssociationProvider>
    );
}
