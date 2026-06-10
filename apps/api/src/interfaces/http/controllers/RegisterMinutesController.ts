
import { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../BaseController.js";
import { RegisterMinutesUseCase } from "../../../application/use-cases/RegisterMinutes.js";
import { z } from "zod";

export class RegisterMinutesController extends BaseController {
    private useCase: RegisterMinutesUseCase;

    constructor(useCase: RegisterMinutesUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async executeImpl(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const bodySchema = z.object({
            content: z.string().min(10, "Minutes content too short")
        });

        const params = paramsSchema.parse(req.params);
        const body = bodySchema.parse(req.body);

        await this.useCase.execute({
            assemblyId: params.id,
            content: body.content
        });

        return res.status(201).send({ message: "Minutes registered successfully." });
    }
}
