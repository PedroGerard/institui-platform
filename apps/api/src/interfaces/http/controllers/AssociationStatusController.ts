
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { BaseController } from "../BaseController.js";
import { AssociationStatusDTO } from "../dtos/DashboardDTOs.js";

export class AssociationStatusController extends BaseController {
    constructor(private prisma: PrismaClient) {
        super();
    }

    protected async executeImpl(req: FastifyRequest, reply: FastifyReply): Promise<void | any> {
        try {
            const { associationId } = req.params as { associationId: string };

            // 1. Check Active Statute
            const association = await this.prisma.association.findUnique({
                where: { id: associationId },
                include: { activeStatute: true }
            });

            if (!association) return this.clientError(reply, "Association not found");

            // 2. Check Active Mandates
            const activeMandates = await this.prisma.mandate.findMany({
                where: {
                    associationId: associationId,
                    isActive: true
                }
            });

            // 3. Check Pending Minutes (Held assemblies not registered)
            const pendingAssemblies = await this.prisma.assembly.count({
                where: {
                    associationId: associationId,
                    status: "HELD" // Not REGISTERED_MINUTES
                }
            });

            const hasActiveStatute = !!association.activeStatuteId;
            const hasActiveMandate = activeMandates.length > 0;
            const pendingMinutes = pendingAssemblies;

            // Basic Compliance Logic (Reflecting Facts)
            let complianceLevel: "GREEN" | "YELLOW" | "RED" = "GREEN";

            if (!hasActiveStatute || !hasActiveMandate) {
                complianceLevel = "RED";
            } else if (pendingMinutes > 0) {
                complianceLevel = "YELLOW";
            }

            const dto: AssociationStatusDTO = {
                associationId,
                hasActiveStatute,
                activeStatuteVersion: undefined, // TODO: Load version number
                hasActiveMandate,
                pendingMinutes,
                complianceLevel
            };

            return this.ok(reply, dto);

        } catch (err) {
            return this.fail(reply, err as Error);
        }
    }

}
