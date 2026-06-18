
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { AssociationStatusDTO, LegalEventDTO } from '@/types/dtos';

export function useAssociationDashboard(associationId: string) {
    const [status, setStatus] = useState<AssociationStatusDTO | null>(null);
    const [events, setEvents] = useState<LegalEventDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!associationId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                // Parallel fetch for dashboard speed
                const [statusData, eventsData] = await Promise.all([
                    api.getAssociationStatus(associationId),
                    api.getLegalEvents(associationId)
                ]);

                setStatus(statusData);
                setEvents(eventsData);
                setError(null);
            } catch (err: unknown) {
                console.error("Dashboard fetch error:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to load dashboard data. Check API connection.");
                }
            } finally {

                setLoading(false);
            }
        };

        fetchData();
        // Poll every 30s to keep "Real-time" feel without WebSockets for now
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);

    }, [associationId]);

    return { status, events, loading, error };
}
