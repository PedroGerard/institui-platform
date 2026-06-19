import {
    AccountabilityStatus,
    AccountNature,
    AccountType,
    AuditAction,
    DocumentType,
    FiscalOpinionType,
    GovernanceBodyCategory,
    GovernanceBodyMemberRole,
    GovernanceRole,
    InstrumentType,
    MemberStatus,
    MemberType,
    PrismaClient
} from "@prisma/client";

const prisma = new PrismaClient();

const PILOT_ASSOCIATION = {
    name: "Instituto Incentive de Inovacao, Desenvolvimento e Transformacao Social",
    shortName: "Instituto Incentive",
    cnpj: "04.347.564/0001-56",
    foundationDate: new Date("2001-01-23T00:00:00.000Z")
};

const TERM_START = new Date("2026-01-01T00:00:00.000Z");
const TERM_END = new Date("2029-12-31T23:59:59.000Z");
const ASSEMBLY_DATE = new Date("2026-07-15T21:00:00.000Z");

type StandardAccount = {
    code: string;
    name: string;
    type: AccountType;
    nature: AccountNature;
    isAnalytic: boolean;
};

const STANDARD_ACCOUNTS: StandardAccount[] = [
    { code: "1", name: "ATIVO", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "1.1", name: "ATIVO CIRCULANTE", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "1.1.1", name: "Disponibilidades", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "1.1.1.01", name: "Caixa Geral", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "1.1.1.02", name: "Bancos Conta Movimento", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "1.1.1.03", name: "Aplicacoes Financeiras de Liquidez Imediata", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "1.1.2", name: "Creditos", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "1.1.2.01", name: "Mensalidades a Receber", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "1.1.2.02", name: "Adiantamentos a Empregados", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "1.2", name: "ATIVO NAO CIRCULANTE", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "1.2.1", name: "Imobilizado", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "1.2.1.01", name: "Moveis e Utensilios", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "1.2.1.02", name: "Equipamentos de Informatica", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "1.2.1.03", name: "Veiculos", type: AccountType.ASSET, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "1.2.1.99", name: "(-) Depreciacao Acumulada", type: AccountType.ASSET, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "2", name: "PASSIVO", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "2.1", name: "PASSIVO CIRCULANTE", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "2.1.1", name: "Obrigacoes Sociais e Trabalhistas", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "2.1.1.01", name: "Salarios a Pagar", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "2.1.1.02", name: "INSS a Recolher", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "2.1.1.03", name: "FGTS a Recolher", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "2.1.2", name: "Obrigacoes Fiscais", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "2.1.2.01", name: "IRRF a Recolher", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "2.1.3", name: "Fornecedores", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "2.1.3.01", name: "Fornecedores Nacionais", type: AccountType.LIABILITY, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "2.3", name: "PATRIMONIO SOCIAL", type: AccountType.EQUITY, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "2.3.1", name: "Patrimonio Social", type: AccountType.EQUITY, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "2.3.2", name: "Superavits ou Deficits Acumulados", type: AccountType.EQUITY, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "2.3.3", name: "Superavit ou Deficit do Exercicio", type: AccountType.EQUITY, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "3", name: "RECEITAS", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "3.1", name: "Receitas de Atividades", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "3.1.1", name: "Receitas com Restricao", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "3.1.1.01", name: "Convenios Publicos", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "3.1.2", name: "Receitas sem Restricao", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "3.1.2.01", name: "Mensalidades de Associados", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "3.1.2.02", name: "Doacoes", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "3.2", name: "Receitas Financeiras", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "3.3", name: "Gratuidades e Voluntariado", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: false },
    { code: "3.3.1", name: "Trabalho Voluntario", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "3.3.2", name: "Gratuidades Concedidas", type: AccountType.REVENUE, nature: AccountNature.CREDIT, isAnalytic: true },
    { code: "4", name: "DESPESAS", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "4.1", name: "Despesas Operacionais", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "4.1.1", name: "Despesas com Pessoal", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "4.1.1.01", name: "Salarios e Ordenados", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.1.02", name: "Ferias", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.1.03", name: "13o Salario", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.1.04", name: "Trabalho Voluntario (Contrapartida)", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.2", name: "Despesas Administrativas", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: false },
    { code: "4.1.2.01", name: "Energia Eletrica", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.2.02", name: "Agua e Esgoto", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.2.03", name: "Material de Expediente", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.2.04", name: "Servicos de Terceiros - PJ", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.3", name: "Despesas Financeiras", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true },
    { code: "4.1.4", name: "Depreciacao", type: AccountType.EXPENSE, nature: AccountNature.DEBIT, isAnalytic: true }
];

const USERS = [
    { name: "Administrador Piloto", email: "admin@institutoincentive.org.br", role: "ADM" },
    { name: "Operador Tesouraria", email: "tesouraria@institutoincentive.org.br", role: "ADM" },
    { name: "Conselho Fiscal Piloto", email: "conselho.fiscal@institutoincentive.org.br", role: "AUDITOR" }
] as const;

const MEMBERS = [
    {
        key: "founder",
        fullName: "Associado Fundador Piloto",
        cpf: "00000000191",
        email: "fundador.piloto@institutoincentive.org.br",
        memberType: MemberType.FOUNDER,
        birthDate: "1980-01-10"
    },
    {
        key: "president",
        fullName: "Diretora Presidente Piloto",
        cpf: "00000000272",
        email: "presidencia.piloto@institutoincentive.org.br",
        memberType: MemberType.EFFECTIVE,
        birthDate: "1982-03-12"
    },
    {
        key: "finance",
        fullName: "Diretora Administrativo-Financeira Piloto",
        cpf: "00000000353",
        email: "financeiro.piloto@institutoincentive.org.br",
        memberType: MemberType.EFFECTIVE,
        birthDate: "1984-05-21"
    },
    {
        key: "technical",
        fullName: "Diretor Tecnico Piloto",
        cpf: "00000000434",
        email: "tecnico.piloto@institutoincentive.org.br",
        memberType: MemberType.EFFECTIVE,
        birthDate: "1981-08-17"
    },
    {
        key: "fiscal",
        fullName: "Conselheira Fiscal Piloto",
        cpf: "00000000515",
        email: "fiscal.piloto@institutoincentive.org.br",
        memberType: MemberType.EFFECTIVE,
        birthDate: "1979-11-03"
    },
    {
        key: "advisor",
        fullName: "Conselheiro Consultivo Piloto",
        cpf: "00000000604",
        email: "consultivo.piloto@institutoincentive.org.br",
        memberType: MemberType.HONORARY,
        birthDate: "1977-09-27"
    }
] as const;

const GOVERNANCE_BODIES = [
    {
        key: "assembly",
        name: "Assembleia Geral",
        category: GovernanceBodyCategory.GENERAL_ASSEMBLY,
        description: "Orgao maximo de deliberacao institucional.",
        isStatutory: true
    },
    {
        key: "executive",
        name: "Diretoria Executiva",
        category: GovernanceBodyCategory.EXECUTIVE_BOARD,
        description: "Orgao responsavel pela administracao e representacao institucional.",
        isStatutory: true
    },
    {
        key: "fiscal",
        name: "Conselho Fiscal",
        category: GovernanceBodyCategory.FISCAL_COUNCIL,
        description: "Orgao de fiscalizacao, pareceres e acompanhamento de contas.",
        isStatutory: true
    },
    {
        key: "consultative",
        name: "Conselho Consultivo",
        category: GovernanceBodyCategory.CONSULTATIVE_COUNCIL,
        description: "Orgao consultivo configuravel para apoio estrategico.",
        isStatutory: true
    },
    {
        key: "projects",
        name: "Comite Tecnico de Projetos",
        category: GovernanceBodyCategory.PROJECT_COMMITTEE,
        description: "Comite tecnico para analise de projetos, pesquisas e execucao operacional.",
        isStatutory: false
    }
] as const;

const MANDATES = [
    {
        memberKey: "president",
        bodyKey: "executive",
        role: GovernanceRole.DIRECTOR_PRESIDENT,
        roleName: "Diretora Presidente",
        seatName: "Presidencia"
    },
    {
        memberKey: "finance",
        bodyKey: "executive",
        role: GovernanceRole.ADMINISTRATIVE_FINANCIAL_DIRECTOR,
        roleName: "Diretora Administrativo-Financeira",
        seatName: "Administracao e Financas"
    },
    {
        memberKey: "technical",
        bodyKey: "executive",
        role: GovernanceRole.TECHNICAL_DIRECTOR,
        roleName: "Diretor Tecnico",
        seatName: "Tecnico e Projetos"
    },
    {
        memberKey: "fiscal",
        bodyKey: "fiscal",
        role: GovernanceRole.FISCAL_COUNCIL_PRESIDENT,
        roleName: "Presidente do Conselho Fiscal",
        seatName: "Conselho Fiscal"
    },
    {
        memberKey: "advisor",
        bodyKey: "consultative",
        role: GovernanceRole.DIRECTOR,
        roleName: "Conselheiro Consultivo",
        seatName: "Cadeira Consultiva"
    }
] as const;

const GOVERNANCE_BODY_MEMBERS = [
    { memberKey: "president", bodyKey: "executive", role: GovernanceBodyMemberRole.PRESIDENT, roleName: "Diretora Presidente" },
    { memberKey: "finance", bodyKey: "executive", role: GovernanceBodyMemberRole.MEMBER, roleName: "Diretora Administrativo-Financeira" },
    { memberKey: "technical", bodyKey: "executive", role: GovernanceBodyMemberRole.MEMBER, roleName: "Diretor Tecnico" },
    { memberKey: "fiscal", bodyKey: "fiscal", role: GovernanceBodyMemberRole.PRESIDENT, roleName: "Presidente do Conselho Fiscal" },
    { memberKey: "advisor", bodyKey: "consultative", role: GovernanceBodyMemberRole.ADVISOR, roleName: "Conselheiro Consultivo" },
    { memberKey: "technical", bodyKey: "projects", role: GovernanceBodyMemberRole.COORDINATOR, roleName: "Coordenador Tecnico" }
] as const;

const FUNDS = [
    { name: "Recursos Proprios (Livres)", restricted: false, description: "Recursos institucionais sem vinculacao especifica." },
    { name: "Termo de Fomento Piloto", restricted: true, description: "Recursos vinculados ao instrumento piloto de prestacao de contas." }
];

async function upsertUser(associationId: string, user: (typeof USERS)[number]) {
    return prisma.user.upsert({
        where: { email: user.email },
        update: {
            associationId,
            name: user.name,
            role: user.role
        },
        create: {
            associationId,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

async function upsertMember(associationId: string, member: (typeof MEMBERS)[number]) {
    return prisma.member.upsert({
        where: {
            associationId_cpf: {
                associationId,
                cpf: member.cpf
            }
        },
        update: {
            fullName: member.fullName,
            email: member.email,
            memberType: member.memberType,
            status: MemberStatus.ACTIVE
        },
        create: {
            associationId,
            fullName: member.fullName,
            cpf: member.cpf,
            birthDate: new Date(`${member.birthDate}T00:00:00.000Z`),
            email: member.email,
            phone: "(00) 00000-0000",
            memberType: member.memberType,
            status: MemberStatus.ACTIVE,
            admissionDate: PILOT_ASSOCIATION.foundationDate
        }
    });
}

async function upsertGovernanceBody(associationId: string, body: (typeof GOVERNANCE_BODIES)[number]) {
    return prisma.governanceBody.upsert({
        where: {
            associationId_name: {
                associationId,
                name: body.name
            }
        },
        update: {
            category: body.category,
            description: body.description,
            isStatutory: body.isStatutory,
            isActive: true
        },
        create: {
            associationId,
            name: body.name,
            category: body.category,
            description: body.description,
            isStatutory: body.isStatutory,
            isActive: true
        }
    });
}

async function upsertGovernanceBodyMember(input: {
    governanceBodyId: string;
    memberId: string;
    role: GovernanceBodyMemberRole;
    roleName: string;
}) {
    const existing = await prisma.governanceBodyMember.findFirst({
        where: {
            governanceBodyId: input.governanceBodyId,
            memberId: input.memberId,
            role: input.role,
            isActive: true
        }
    });

    if (existing) {
        return prisma.governanceBodyMember.update({
            where: { id: existing.id },
            data: {
                roleName: input.roleName,
                startDate: TERM_START,
                endDate: TERM_END
            }
        });
    }

    return prisma.governanceBodyMember.create({
        data: {
            governanceBodyId: input.governanceBodyId,
            memberId: input.memberId,
            role: input.role,
            roleName: input.roleName,
            startDate: TERM_START,
            endDate: TERM_END,
            isActive: true
        }
    });
}

async function upsertMandate(input: {
    associationId: string;
    memberId: string;
    governanceBodyId: string;
    role: GovernanceRole;
    roleName: string;
    seatName: string;
}) {
    const existing = await prisma.mandate.findFirst({
        where: {
            associationId: input.associationId,
            memberId: input.memberId,
            role: input.role,
            seatName: input.seatName,
            isActive: true
        }
    });

    if (existing) {
        return prisma.mandate.update({
            where: { id: existing.id },
            data: {
                governanceBodyId: input.governanceBodyId,
                roleName: input.roleName,
                startDate: TERM_START,
                endDate: TERM_END
            }
        });
    }

    return prisma.mandate.create({
        data: {
            associationId: input.associationId,
            memberId: input.memberId,
            governanceBodyId: input.governanceBodyId,
            role: input.role,
            roleName: input.roleName,
            seatName: input.seatName,
            startDate: TERM_START,
            endDate: TERM_END,
            isActive: true
        }
    });
}

async function ensureFinancialAccounts(associationId: string) {
    const sortedAccounts = [...STANDARD_ACCOUNTS].sort((a, b) => a.code.localeCompare(b.code));
    const accountByCode = new Map<string, string>();

    for (const account of sortedAccounts) {
        const parentCode = account.code.includes(".") ? account.code.split(".").slice(0, -1).join(".") : null;
        const parentId = parentCode ? accountByCode.get(parentCode) ?? null : null;
        const existing = await prisma.financialAccount.findFirst({
            where: {
                associationId,
                code: account.code
            }
        });

        const saved = existing
            ? await prisma.financialAccount.update({
                where: { id: existing.id },
                data: {
                    name: account.name,
                    type: account.type,
                    nature: account.nature,
                    isAnalytic: account.isAnalytic,
                    parentId
                }
            })
            : await prisma.financialAccount.create({
                data: {
                    associationId,
                    code: account.code,
                    name: account.name,
                    type: account.type,
                    nature: account.nature,
                    isAnalytic: account.isAnalytic,
                    parentId
                }
            });

        accountByCode.set(account.code, saved.id);
    }

    return accountByCode;
}

async function ensureFunds(associationId: string) {
    const fundByName = new Map<string, string>();

    for (const fund of FUNDS) {
        const existing = await prisma.fund.findFirst({
            where: {
                associationId,
                name: fund.name
            }
        });

        const saved = existing
            ? await prisma.fund.update({
                where: { id: existing.id },
                data: {
                    restricted: fund.restricted,
                    description: fund.description
                }
            })
            : await prisma.fund.create({
                data: {
                    associationId,
                    name: fund.name,
                    restricted: fund.restricted,
                    description: fund.description
                }
            });

        fundByName.set(fund.name, saved.id);
    }

    return fundByName;
}

async function ensurePilotAssembly(input: {
    associationId: string;
    chairMemberId: string;
    secretaryMemberId: string;
    activeMemberIds: string[];
}) {
    const title = "Assembleia Geral Ordinaria Piloto";
    const existing = await prisma.assembly.findFirst({
        where: {
            associationId: input.associationId,
            title
        }
    });

    const assembly = existing
        ? await prisma.assembly.update({
            where: { id: existing.id },
            data: {
                type: "AGO",
                status: "CALLED",
                date: ASSEMBLY_DATE,
                scheduledDate: ASSEMBLY_DATE,
                callNoticeDays: 8,
                agendaItemIds: ["eleicao-diretoria", "aprovacao-contas", "plano-operacional"],
                callDate: new Date("2026-07-07T12:00:00.000Z"),
                callMethod: "Edital e comunicacao eletronica",
                callNoticeText: "Convocacao piloto para validar o fluxo institucional do INSTITUI+.",
                convenerType: "Diretoria Executiva",
                location: "Sede institucional",
                address: "Endereco institucional piloto",
                firstCallAt: ASSEMBLY_DATE,
                secondCallAt: new Date("2026-07-15T21:30:00.000Z"),
                totalVotingMembers: input.activeMemberIds.length,
                presentVotingMembers: input.activeMemberIds.length,
                quorumMet: true,
                chairMemberId: input.chairMemberId,
                secretaryMemberId: input.secretaryMemberId,
                minutesContent: "Ata piloto gerada para demonstracao da fundacao operacional do sistema."
            }
        })
        : await prisma.assembly.create({
            data: {
                associationId: input.associationId,
                type: "AGO",
                status: "CALLED",
                date: ASSEMBLY_DATE,
                scheduledDate: ASSEMBLY_DATE,
                callNoticeDays: 8,
                agendaItemIds: ["eleicao-diretoria", "aprovacao-contas", "plano-operacional"],
                title,
                callDate: new Date("2026-07-07T12:00:00.000Z"),
                callMethod: "Edital e comunicacao eletronica",
                callNoticeText: "Convocacao piloto para validar o fluxo institucional do INSTITUI+.",
                convenerType: "Diretoria Executiva",
                location: "Sede institucional",
                address: "Endereco institucional piloto",
                firstCallAt: ASSEMBLY_DATE,
                secondCallAt: new Date("2026-07-15T21:30:00.000Z"),
                totalVotingMembers: input.activeMemberIds.length,
                presentVotingMembers: input.activeMemberIds.length,
                quorumMet: true,
                chairMemberId: input.chairMemberId,
                secretaryMemberId: input.secretaryMemberId,
                minutesContent: "Ata piloto gerada para demonstracao da fundacao operacional do sistema."
            }
        });

    for (const memberId of input.activeMemberIds) {
        const attendance = await prisma.assemblyAttendance.findFirst({
            where: {
                assemblyId: assembly.id,
                memberId
            }
        });

        if (attendance) {
            await prisma.assemblyAttendance.update({
                where: { id: attendance.id },
                data: {
                    hasVotingRight: true,
                    present: true,
                    signedAt: ASSEMBLY_DATE
                }
            });
        } else {
            await prisma.assemblyAttendance.create({
                data: {
                    assemblyId: assembly.id,
                    memberId,
                    hasVotingRight: true,
                    present: true,
                    signedAt: ASSEMBLY_DATE
                }
            });
        }
    }

    const deliberations = [
        {
            agendaItem: "Eleicao da Diretoria Executiva",
            decision: "A assembleia registrou a composicao piloto da Diretoria Executiva para validacao do sistema.",
            result: "APPROVED",
            requiredQuorum: "Maioria simples",
            votesFor: input.activeMemberIds.length,
            votesAgainst: 0,
            abstentions: 0
        },
        {
            agendaItem: "Aprovacao do plano operacional",
            decision: "A assembleia aprovou a utilizacao do INSTITUI+ como ambiente de gestao, governanca e prestacao de contas.",
            result: "APPROVED",
            requiredQuorum: "Maioria simples",
            votesFor: input.activeMemberIds.length,
            votesAgainst: 0,
            abstentions: 0
        }
    ];

    for (const deliberation of deliberations) {
        const existingDeliberation = await prisma.assemblyDeliberation.findFirst({
            where: {
                assemblyId: assembly.id,
                agendaItem: deliberation.agendaItem
            }
        });

        if (existingDeliberation) {
            await prisma.assemblyDeliberation.update({
                where: { id: existingDeliberation.id },
                data: deliberation
            });
        } else {
            await prisma.assemblyDeliberation.create({
                data: {
                    assemblyId: assembly.id,
                    ...deliberation
                }
            });
        }
    }

    return assembly;
}

async function ensureStatute(associationId: string, assemblyId: string) {
    const existing = await prisma.statute.findFirst({
        where: { associationId }
    });

    const statute = existing ?? await prisma.statute.create({
        data: { associationId }
    });

    const existingVersion = await prisma.statuteVersion.findFirst({
        where: {
            statuteId: statute.id,
            versionNumber: 2
        }
    });

    const content = [
        "Estatuto consolidado piloto do Instituto Incentive.",
        "A entidade admite orgaos estatutarios e consultivos configuraveis, incluindo Diretoria Executiva, Conselho Fiscal, Conselho Consultivo e comites tecnicos.",
        "Este conteudo e usado apenas para demonstracao operacional e deve ser substituido pelo estatuto aprovado e registrado."
    ].join("\n\n");

    if (existingVersion) {
        await prisma.statuteVersion.update({
            where: { id: existingVersion.id },
            data: {
                approvalDate: new Date("2026-05-18T00:00:00.000Z"),
                registrationDate: new Date("2026-05-18T00:00:00.000Z"),
                content,
                originatingAssemblyId: assemblyId,
                isConsolidated: true
            }
        });
    } else {
        await prisma.statuteVersion.create({
            data: {
                statuteId: statute.id,
                versionNumber: 2,
                approvalDate: new Date("2026-05-18T00:00:00.000Z"),
                registrationDate: new Date("2026-05-18T00:00:00.000Z"),
                content,
                originatingAssemblyId: assemblyId,
                isConsolidated: true
            }
        });
    }

    await prisma.association.update({
        where: { id: associationId },
        data: { activeStatuteId: statute.id }
    });

    return statute;
}

async function ensureAccountabilityProject(input: {
    associationId: string;
    bankAccountId?: string;
    fiscalUserId: string;
}) {
    const projectName = "Projeto Piloto - Fortalecimento Institucional";
    const existing = await prisma.accountabilityProject.findFirst({
        where: {
            associationId: input.associationId,
            name: projectName
        }
    });

    const project = existing
        ? await prisma.accountabilityProject.update({
            where: { id: existing.id },
            data: {
                grantor: "Orgao Concedente Piloto",
                instrumentType: InstrumentType.TERMO_FOMENTO,
                instrumentNumber: "TF-0001/2026",
                periodStart: new Date("2026-01-01T00:00:00.000Z"),
                periodEnd: new Date("2026-12-31T23:59:59.000Z"),
                bankAccountId: input.bankAccountId,
                status: AccountabilityStatus.AWAITING_FISCAL
            }
        })
        : await prisma.accountabilityProject.create({
            data: {
                associationId: input.associationId,
                name: projectName,
                grantor: "Orgao Concedente Piloto",
                instrumentType: InstrumentType.TERMO_FOMENTO,
                instrumentNumber: "TF-0001/2026",
                periodStart: new Date("2026-01-01T00:00:00.000Z"),
                periodEnd: new Date("2026-12-31T23:59:59.000Z"),
                bankAccountId: input.bankAccountId,
                status: AccountabilityStatus.AWAITING_FISCAL
            }
        });

    const documents = [
        { type: DocumentType.REX, fileUrl: "/documentos/piloto/rex.pdf", validated: true },
        { type: DocumentType.OFICIO_ENCAMINHAMENTO, fileUrl: "/documentos/piloto/oficio-encaminhamento.pdf", validated: false },
        { type: DocumentType.EXTRATO_BANCARIO, fileUrl: "/documentos/piloto/extrato-bancario.pdf", validated: false },
        { type: DocumentType.CERTIDAO_NEGATIVA, fileUrl: "/documentos/piloto/certidao-negativa.pdf", validated: false }
    ];

    for (const document of documents) {
        const existingDocument = await prisma.accountabilityDocument.findFirst({
            where: {
                projectId: project.id,
                type: document.type
            }
        });

        if (existingDocument) {
            await prisma.accountabilityDocument.update({
                where: { id: existingDocument.id },
                data: {
                    fileUrl: document.fileUrl,
                    validated: document.validated,
                    isRequired: true
                }
            });
        } else {
            await prisma.accountabilityDocument.create({
                data: {
                    projectId: project.id,
                    type: document.type,
                    fileUrl: document.fileUrl,
                    validated: document.validated,
                    isRequired: true
                }
            });
        }
    }

    const fiscalOpinion = await prisma.fiscalOpinion.findFirst({
        where: {
            projectId: project.id,
            councilUserId: input.fiscalUserId
        }
    });

    if (fiscalOpinion) {
        await prisma.fiscalOpinion.update({
            where: { id: fiscalOpinion.id },
            data: {
                opinion: FiscalOpinionType.APPROVED,
                notes: "Parecer fiscal piloto para validacao do fluxo de prestacao de contas.",
                signedAt: new Date("2026-12-20T12:00:00.000Z")
            }
        });
    } else {
        await prisma.fiscalOpinion.create({
            data: {
                projectId: project.id,
                councilUserId: input.fiscalUserId,
                opinion: FiscalOpinionType.APPROVED,
                notes: "Parecer fiscal piloto para validacao do fluxo de prestacao de contas.",
                signedAt: new Date("2026-12-20T12:00:00.000Z")
            }
        });
    }

    return project;
}

async function ensureSeedAuditLog(input: {
    associationId: string;
    performedById: string;
}) {
    const existing = await prisma.auditLog.findFirst({
        where: {
            associationId: input.associationId,
            entity: "PilotSeed",
            entityId: input.associationId,
            action: AuditAction.CREATE
        }
    });

    if (existing) {
        return prisma.auditLog.update({
            where: { id: existing.id },
            data: {
                performedById: input.performedById,
                metadata: {
                    source: "prisma-seed",
                    scope: "sprint-01-foundation",
                    updatedAt: new Date().toISOString()
                }
            }
        });
    }

    return prisma.auditLog.create({
        data: {
            associationId: input.associationId,
            entity: "PilotSeed",
            entityId: input.associationId,
            action: AuditAction.CREATE,
            performedById: input.performedById,
            metadata: {
                source: "prisma-seed",
                scope: "sprint-01-foundation"
            }
        }
    });
}

async function main() {
    console.log("Seeding INSTITUI+ pilot foundation...");

    const association = await prisma.association.upsert({
        where: { cnpj: PILOT_ASSOCIATION.cnpj },
        update: {
            name: PILOT_ASSOCIATION.name,
            foundationDate: PILOT_ASSOCIATION.foundationDate
        },
        create: {
            name: PILOT_ASSOCIATION.name,
            cnpj: PILOT_ASSOCIATION.cnpj,
            foundationDate: PILOT_ASSOCIATION.foundationDate
        }
    });

    const users = new Map<string, Awaited<ReturnType<typeof upsertUser>>>();
    for (const user of USERS) {
        users.set(user.email, await upsertUser(association.id, user));
    }

    const members = new Map<string, Awaited<ReturnType<typeof upsertMember>>>();
    for (const member of MEMBERS) {
        members.set(member.key, await upsertMember(association.id, member));
    }

    const governanceBodies = new Map<string, Awaited<ReturnType<typeof upsertGovernanceBody>>>();
    for (const body of GOVERNANCE_BODIES) {
        governanceBodies.set(body.key, await upsertGovernanceBody(association.id, body));
    }

    for (const membership of GOVERNANCE_BODY_MEMBERS) {
        const member = members.get(membership.memberKey);
        const body = governanceBodies.get(membership.bodyKey);

        if (!member || !body) {
            throw new Error(`Missing pilot governance membership reference: ${membership.memberKey}/${membership.bodyKey}`);
        }

        await upsertGovernanceBodyMember({
            governanceBodyId: body.id,
            memberId: member.id,
            role: membership.role,
            roleName: membership.roleName
        });
    }

    for (const mandate of MANDATES) {
        const member = members.get(mandate.memberKey);
        const body = governanceBodies.get(mandate.bodyKey);

        if (!member || !body) {
            throw new Error(`Missing pilot mandate reference: ${mandate.memberKey}/${mandate.bodyKey}`);
        }

        await upsertMandate({
            associationId: association.id,
            memberId: member.id,
            governanceBodyId: body.id,
            role: mandate.role,
            roleName: mandate.roleName,
            seatName: mandate.seatName
        });
    }

    const accountByCode = await ensureFinancialAccounts(association.id);
    await ensureFunds(association.id);

    const president = members.get("president");
    const finance = members.get("finance");
    const activeMemberIds = [...members.values()].map((member) => member.id);

    if (!president || !finance) {
        throw new Error("Missing pilot assembly officers.");
    }

    const assembly = await ensurePilotAssembly({
        associationId: association.id,
        chairMemberId: president.id,
        secretaryMemberId: finance.id,
        activeMemberIds
    });

    await ensureStatute(association.id, assembly.id);

    const fiscalUser = users.get("conselho.fiscal@institutoincentive.org.br");
    if (!fiscalUser) {
        throw new Error("Missing fiscal pilot user.");
    }

    await ensureAccountabilityProject({
        associationId: association.id,
        bankAccountId: accountByCode.get("1.1.1.02"),
        fiscalUserId: fiscalUser.id
    });

    const adminUser = users.get("admin@institutoincentive.org.br");
    if (!adminUser) {
        throw new Error("Missing admin pilot user.");
    }

    await ensureSeedAuditLog({
        associationId: association.id,
        performedById: adminUser.id
    });

    console.log(`Pilot association ready: ${PILOT_ASSOCIATION.shortName}`);
    console.log(`Association ID: ${association.id}`);
    console.log("Users, members, mandates, governance bodies, treasury and accountability seed completed.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
