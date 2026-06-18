export const permissionKeys = [
    "DASHBOARD_READ",
    "ASSOCIATION_READ",
    "ASSOCIATION_CONFIGURE",
    "USERS_READ",
    "USERS_MANAGE",
    "MEMBERS_READ",
    "MEMBERS_MANAGE",
    "GOVERNANCE_READ",
    "GOVERNANCE_MANAGE",
    "TREASURY_READ",
    "TREASURY_MANAGE",
    "PROCUREMENT_READ",
    "PROCUREMENT_MANAGE",
    "ACCOUNTABILITY_READ",
    "ACCOUNTABILITY_MANAGE",
    "ACCOUNTABILITY_REVIEW",
    "DOCUMENTS_READ",
    "DOCUMENTS_GENERATE",
    "AUDIT_READ",
    "REPORTS_READ"
] as const;

export type PermissionKey = typeof permissionKeys[number];
export type OperationalUserRole = "ADM" | "MEMBER" | "AUDITOR" | "SYSTEM";

const rolePermissions: Record<OperationalUserRole, PermissionKey[]> = {
    ADM: [...permissionKeys],
    AUDITOR: [
        "DASHBOARD_READ",
        "ASSOCIATION_READ",
        "USERS_READ",
        "MEMBERS_READ",
        "GOVERNANCE_READ",
        "TREASURY_READ",
        "PROCUREMENT_READ",
        "ACCOUNTABILITY_READ",
        "ACCOUNTABILITY_REVIEW",
        "DOCUMENTS_READ",
        "AUDIT_READ",
        "REPORTS_READ"
    ],
    MEMBER: [
        "DASHBOARD_READ",
        "ASSOCIATION_READ",
        "MEMBERS_READ",
        "GOVERNANCE_READ",
        "DOCUMENTS_READ"
    ],
    SYSTEM: []
};

function normalizeRole(role: string): OperationalUserRole {
    if (role === "ADM" || role === "MEMBER" || role === "AUDITOR" || role === "SYSTEM") {
        return role;
    }

    return "SYSTEM";
}

export function getPermissionsForRole(role: string): PermissionKey[] {
    return [...rolePermissions[normalizeRole(role)]];
}

export function hasPermission(role: string, permission: PermissionKey) {
    return rolePermissions[normalizeRole(role)].includes(permission);
}
