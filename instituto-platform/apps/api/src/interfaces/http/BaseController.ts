import { FastifyReply, FastifyRequest } from "fastify";
import { DomainError } from "../../domain/shared/LegalErrors.js";
import { ZodError } from "zod";


export abstract class BaseController {

    protected abstract executeImpl(req: FastifyRequest, res: FastifyReply): Promise<void | any>;

    public async execute(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            await this.executeImpl(req, res);
        } catch (err) {
            this.handleError(res, err);
        }
    }

    protected ok<T>(res: FastifyReply, dto?: T) {
        if (!!dto) {
            return res.status(200).send(dto);
        } else {
            return res.status(200).send();
        }
    }

    protected clientError(res: FastifyReply, message?: string) {
        return res.status(400).send({ error: message || "Bad Request" });
    }

    protected fail(res: FastifyReply, error: Error | string) {
        console.error(error);
        return res.status(500).send({
            error: "INTERNAL_SERVER_ERROR",
            message: error.toString()
        });
    }

    private handleError(res: FastifyReply, err: any) {
        if (err instanceof DomainError) {
            // Legal Domain Errors = 422 Unprocessable Entity
            // Or specific codes
            console.warn(`[LegalError] ${err.code}: ${err.message}`);
            return res.status(422).send({
                error: err.code,
                message: err.message
            });
        }

        if (err instanceof ZodError) {
            // Input validation error = 400
            return res.status(400).send({
                error: "VALIDATION_ERROR",
                details: err.issues
            });
        }

        // Default 500
        console.error(err);
        return res.status(500).send({ error: "INTERNAL_SERVER_ERROR" });
    }

}
