
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

            const association = await this.prisma.association.findUnique({
                where: { id: associationId },
                include: {
                    activeStatute: {
                        include: {
                            versions: {
                                orderBy: { versionNumber: "desc" },
                                take: 1
                            }
                        }
                    }
                }
            });

            if (!association) return this.clientError(reply, "Association not found");

            const activeMandates = await this.prisma.mandate.findMany({
                where: {
                    associationId: associationId,
                    isActive: true
                }
            });

            const pendingAssemblies = await this.prisma.assembly.count({
                where: {
                    associationId: associationId,
                    status: "HELD"
                }
            });

            const hasActiveStatute = !!association.activeStatuteId;
            const activeStatuteVersion = association.activeStatute?.versions[0]?.versionNumber;
            const hasActiveMandate = activeMandates.length > 0;
            const pendingMinutes = pendingAssemblies;

            let complianceLevel: "GREEN" | "YELLOW" | "RED" = "GREEN";

            if (!hasActiveStatute || !hasActiveMandate) {
                complianceLevel = "RED";
            } else if (pendingMinutes > 0) {
                complianceLevel = "YELLOW";
            }

            const dto: AssociationStatusDTO = {
                associationId,
                hasActiveStatute,
                activeStatuteVersion,
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
