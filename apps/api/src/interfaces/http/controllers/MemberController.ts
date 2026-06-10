import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { RegisterMember } from '../../../application/usecases/members/RegisterMember';
import { ListMembers } from '../../../application/usecases/members/ListMembers';
import { PrismaMemberRepository } from '../../../infrastructure/database/PrismaMemberRepository';
import { prisma } from '../../../infrastructure/database/prisma';
import { Member, MemberStatus, MemberType } from '../../../domain/entities/Member';
import { UniqueEntityID } from '../../../domain/shared/Entity';

const dateFromString = z.string().transform((value) => new Date(value));

const registerMemberSchema = z.object({
    associationId: z.string().uuid(),
    fullName: z.string().min(3),
    cpf: z.string().min(11),
    rg: z.string().optional(),
    birthDate: dateFromString,
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    memberType: z.nativeEnum(MemberType),
    admissionDate: dateFromString
});

const updateStatusSchema = z.object({
    status: z.nativeEnum(MemberStatus),
    resignationDate: dateFromString.optional()
});

function memberToDTO(member: Member) {
    return {
        id: member.id.toString(),
        associationId: member.associationId.toString(),
        fullName: member.fullName,
        cpf: member.cpf,
        rg: member.rg,
        birthDate: member.birthDate,
        email: member.email || undefined,
        phone: member.phone,
        memberType: member.memberType,
        status: member.status,
        admissionDate: member.admissionDate,
        resignationDate: member.resignationDate,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt
    };
}

export class MemberController {
    static async register(req: FastifyRequest, reply: FastifyReply) {
        try {
            const data = registerMemberSchema.parse(req.body);
            const repo = new PrismaMemberRepository(prisma);
            const useCase = new RegisterMember(repo);
            const member = await useCase.execute({
                ...data,
                email: data.email || undefined
            });

            return reply.status(201).send(memberToDTO(member));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async list(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = req.query as { associationId?: string };
            const associationId = query.associationId || (req.headers['x-association-id'] as string | undefined);
            const repo = new PrismaMemberRepository(prisma);
            const useCase = new ListMembers(repo);
            const members = await useCase.execute(associationId);

            return reply.send(members.map(memberToDTO));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async getById(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const repo = new PrismaMemberRepository(prisma);
            const member = await repo.findById(new UniqueEntityID(id));

            if (!member) {
                return reply.status(404).send({ error: "Member not found" });
            }

            return reply.send(memberToDTO(member));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async updateStatus(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = updateStatusSchema.parse(req.body);
            const repo = new PrismaMemberRepository(prisma);
            const member = await repo.findById(new UniqueEntityID(id));

            if (!member) {
                return reply.status(404).send({ error: "Member not found" });
            }

            member.updateStatus(data.status, data.resignationDate);
            await repo.save(member);

            return reply.send(memberToDTO(member));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }
}
