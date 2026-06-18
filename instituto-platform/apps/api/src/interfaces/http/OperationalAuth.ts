import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../infrastructure/database/prisma";
import { hasPermission, type PermissionKey } from "../../application/services/AccessControlService";

export async function requireOperationalPermission(
    request: FastifyRequest,
    reply: FastifyReply,
    input: {
        permission: PermissionKey;
        associationId?: string;
    }
) {
    const activeAssociationId = request.headers["x-association-id"] as string | undefined;
    const associationId = input.associationId || activeAssociationId;
    const userId = request.headers["x-user-id"] as string | undefined;

    if (!associationId) {
        reply.status(400).send({ error: "Informe a associacao ativa para continuar." });
        return null;
    }

    if (!activeAssociationId || activeAssociationId !== associationId) {
        reply.status(403).send({ error: "A associacao ativa deve ser a mesma da operacao solicitada." });
        return null;
    }

    if (!userId) {
        reply.status(401).send({ error: "Selecione um usuario operador para continuar." });
        return null;
    }

    const operator = await prisma.user.findUnique({ where: { id: userId } });

    if (!operator || operator.associationId !== associationId) {
        reply.status(403).send({ error: "Usuario operador nao autorizado para esta associacao." });
        return null;
    }

    if (!hasPermission(operator.role, input.permission)) {
        reply.status(403).send({ error: "Usuario operador sem permissao para executar esta operacao." });
        return null;
    }

    return {
        associationId,
        operator
    };
}
