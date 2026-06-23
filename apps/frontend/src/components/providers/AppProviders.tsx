'use client';

import { ActiveAssociationProvider } from '@/contexts/ActiveAssociationContext';
import { ActiveOperatorProvider } from '@/contexts/ActiveOperatorContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ActiveAssociationProvider>
            <ActiveOperatorProvider>
                {children}
            </ActiveOperatorProvider>
        </ActiveAssociationProvider>
    );
}
