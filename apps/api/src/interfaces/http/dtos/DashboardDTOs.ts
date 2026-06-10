
export interface LegalEventDTO {
    id: string;
    type: string;
    timestamp: Date;
    actorId?: string;
    payload: any;
}

export interface AssociationStatusDTO {
    associationId: string;
    hasActiveStatute: boolean;
    activeStatuteVersion?: number;
    hasActiveMandate: boolean;
    pendingMinutes: number; // Count of held but unregistered assemblies
    complianceLevel: "GREEN" | "YELLOW" | "RED";
}
