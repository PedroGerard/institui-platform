
import { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../BaseController.js";
import { CallAssemblyUseCase } from "../../../application/use-cases/CallAssembly.js";
import { AssemblyType } from "../../../domain/entities/Assembly.js";
import { z } from "zod";


const callAssemblySchema = z.object({
    associationId: z.string().uuid(),
    type: z.enum(["AGO", "AGE"]),
    date: z.string().datetime(), // ISO string
    agenda: z.array(z.string()).min(1),
    title: z.string().optional(),
    callMethod: z.string().optional(),
    callNoticeText: z.string().optional(),
    convenerType: z.string().optional(),
    convenerMemberId: z.string().uuid().optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    firstCallAt: z.string().datetime().optional(),
    secondCallAt: z.string().datetime().optional()
});

export class CallAssemblyController extends BaseController {
    private useCase: CallAssemblyUseCase;

    constructor(useCase: CallAssemblyUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async executeImpl(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const body = callAssemblySchema.parse(req.body);

        // Convert to strict Date object
        const scheduledDate = new Date(body.date);
        const today = new Date();

        const assembly = await this.useCase.execute({
            associationId: body.associationId,
            type: body.type as AssemblyType,
            date: scheduledDate,
            callNoticeDate: today, // Assuming request timestamp ~ call notice start
            agenda: body.agenda,
            title: body.title,
            callMethod: body.callMethod,
            callNoticeText: body.callNoticeText,
            convenerType: body.convenerType,
            convenerMemberId: body.convenerMemberId,
            location: body.location,
            address: body.address,
            firstCallAt: body.firstCallAt ? new Date(body.firstCallAt) : undefined,
            secondCallAt: body.secondCallAt ? new Date(body.secondCallAt) : undefined
        });

        return res.status(201).send({
            message: "Assembly called successfully.",
            id: assembly.id.toString()
        });
    }
}
