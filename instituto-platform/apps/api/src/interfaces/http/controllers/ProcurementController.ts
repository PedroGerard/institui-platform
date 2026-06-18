import { FastifyReply, FastifyRequest } from "fastify";
import { ProcurementService } from "../../../application/usecases/procurement/ProcurementService";
import {
    addProcurementItemSchema,
    createProcurementContractSchema,
    createProcurementProcessSchema,
    createSupplierProposalSchema,
    createSupplierSchema,
    listProcurementProcessesSchema,
    listSuppliersSchema
} from "../dtos/ProcurementDTOs";

export class ProcurementController {
    constructor(private readonly procurements: ProcurementService) { }

    async createSupplier(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createSupplierSchema.parse(request.body);
            return reply.status(201).send(await this.procurements.createSupplier(data, this.actorId(request)));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async listSuppliers(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listSuppliersSchema.parse(request.query);
            const associationId = query.associationId || (request.headers["x-association-id"] as string | undefined);

            return reply.send(await this.procurements.listSuppliers({ ...query, associationId }));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async createProcess(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createProcurementProcessSchema.parse(request.body);
            return reply.status(201).send(await this.procurements.createProcess(data, this.actorId(request)));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async listProcesses(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listProcurementProcessesSchema.parse(request.query);
            const associationId = query.associationId || (request.headers["x-association-id"] as string | undefined);

            return reply.send(await this.procurements.listProcesses({ ...query, associationId }));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async getProcess(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.procurements.getProcess(request.params.id));
        } catch (error: any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async addItem(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = addProcurementItemSchema.parse(request.body);
            return reply.status(201).send(await this.procurements.addItem(request.params.id, data, this.actorId(request)));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async createProposal(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = createSupplierProposalSchema.parse(request.body);
            return reply.status(201).send(await this.procurements.createProposal(request.params.id, data, this.actorId(request)));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async priceMap(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.procurements.priceMap(request.params.id));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async selectSuppliers(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.procurements.selectSuppliers(request.params.id, this.actorId(request)));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async homologate(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.procurements.homologate(request.params.id, this.actorId(request)));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async createContract(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = createProcurementContractSchema.parse(request.body);
            return reply.status(201).send(await this.procurements.createContract(request.params.id, data, this.actorId(request)));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    private actorId(request: FastifyRequest) {
        return request.headers["x-user-id"] as string | undefined;
    }
}
