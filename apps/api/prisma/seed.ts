import { PrismaClient, AccountType, AccountNature } from '@prisma/client';

const prisma = new PrismaClient();

const STANDARD_ACCOUNTS = [
    // 1. ATIVO
    { code: '1', name: 'ATIVO', type: 'ASSET', nature: 'DEBIT', isAnalytic: false },
    { code: '1.1', name: 'ATIVO CIRCULANTE', type: 'ASSET', nature: 'DEBIT', isAnalytic: false },
    { code: '1.1.1', name: 'Disponibilidades', type: 'ASSET', nature: 'DEBIT', isAnalytic: false },
    { code: '1.1.1.01', name: 'Caixa Geral', type: 'ASSET', nature: 'DEBIT', isAnalytic: true },
    { code: '1.1.1.02', name: 'Bancos Conta Movimento', type: 'ASSET', nature: 'DEBIT', isAnalytic: true },
    { code: '1.1.1.03', name: 'Aplicações Financeiras de Liquidez Imediata', type: 'ASSET', nature: 'DEBIT', isAnalytic: true },
    { code: '1.1.2', name: 'Créditos', type: 'ASSET', nature: 'DEBIT', isAnalytic: false },
    { code: '1.1.2.01', name: 'Mensalidades a Receber', type: 'ASSET', nature: 'DEBIT', isAnalytic: true },
    { code: '1.1.2.02', name: 'Adiantamentos a Empregados', type: 'ASSET', nature: 'DEBIT', isAnalytic: true },

    { code: '1.2', name: 'ATIVO NÃO CIRCULANTE', type: 'ASSET', nature: 'DEBIT', isAnalytic: false },
    { code: '1.2.1', name: 'Imobilizado', type: 'ASSET', nature: 'DEBIT', isAnalytic: false },
    { code: '1.2.1.01', name: 'Móveis e Utensílios', type: 'ASSET', nature: 'DEBIT', isAnalytic: true },
    { code: '1.2.1.02', name: 'Equipamentos de Informática', type: 'ASSET', nature: 'DEBIT', isAnalytic: true },
    { code: '1.2.1.03', name: 'Veículos', type: 'ASSET', nature: 'DEBIT', isAnalytic: true },
    { code: '1.2.1.99', name: '(-) Depreciação Acumulada', type: 'ASSET', nature: 'CREDIT', isAnalytic: true }, // Credit nature in Asset group (Redutora)

    // 2. PASSIVO
    { code: '2', name: 'PASSIVO', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: false },
    { code: '2.1', name: 'PASSIVO CIRCULANTE', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: false },
    { code: '2.1.1', name: 'Obrigações Sociais e Trabalhistas', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: false },
    { code: '2.1.1.01', name: 'Salários a Pagar', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: true },
    { code: '2.1.1.02', name: 'INSS a Recolher', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: true },
    { code: '2.1.1.03', name: 'FGTS a Recolher', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: true },
    { code: '2.1.2', name: 'Obrigações Fiscais', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: false },
    { code: '2.1.2.01', name: 'IRRF a Recolher', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: true },
    { code: '2.1.3', name: 'Fornecedores', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: false },
    { code: '2.1.3.01', name: 'Fornecedores Nacionais', type: 'LIABILITY', nature: 'CREDIT', isAnalytic: true },

    // 2.3 PATRIMÔNIO SOCIAL (Following NBC T 10.19 structure where Equity is part of Passive side broadly, or distinct group 3? 
    // Sticking to 2.x for standard structure, but labeled clearly)
    { code: '2.3', name: 'PATRIMÔNIO SOCIAL', type: 'EQUITY', nature: 'CREDIT', isAnalytic: false },
    { code: '2.3.1', name: 'Patrimônio Social', type: 'EQUITY', nature: 'CREDIT', isAnalytic: true },
    { code: '2.3.2', name: 'Superávits ou Déficits Acumulados', type: 'EQUITY', nature: 'CREDIT', isAnalytic: true },
    { code: '2.3.3', name: 'Superávit ou Déficit do Exercício', type: 'EQUITY', nature: 'CREDIT', isAnalytic: true },

    // 3. RECEITAS (Result Accounts)
    { code: '3', name: 'RECEITAS', type: 'REVENUE', nature: 'CREDIT', isAnalytic: false },
    { code: '3.1', name: 'Receitas de Atividades', type: 'REVENUE', nature: 'CREDIT', isAnalytic: false },
    { code: '3.1.1', name: 'Receitas com Restrição', type: 'REVENUE', nature: 'CREDIT', isAnalytic: false },
    { code: '3.1.1.01', name: 'Convênios Públicos', type: 'REVENUE', nature: 'CREDIT', isAnalytic: true },
    { code: '3.1.2', name: 'Receitas sem Restrição', type: 'REVENUE', nature: 'CREDIT', isAnalytic: false },
    { code: '3.1.2.01', name: 'Mensalidades de Associados', type: 'REVENUE', nature: 'CREDIT', isAnalytic: true },
    { code: '3.1.2.02', name: 'Doações', type: 'REVENUE', nature: 'CREDIT', isAnalytic: true },
    { code: '3.2', name: 'Receitas Financeiras', type: 'REVENUE', nature: 'CREDIT', isAnalytic: true },

    // ITG 2002 R1 Specifics
    { code: '3.3', name: 'Gratuidades e Voluntariado', type: 'REVENUE', nature: 'CREDIT', isAnalytic: false },
    { code: '3.3.1', name: 'Trabalho Voluntário', type: 'REVENUE', nature: 'CREDIT', isAnalytic: true },
    { code: '3.3.2', name: 'Gratuidades Concedidas', type: 'REVENUE', nature: 'CREDIT', isAnalytic: true },

    // 4. DESPESAS (Result Accounts)
    { code: '4', name: 'DESPESAS', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: false },
    { code: '4.1', name: 'Despesas Operacionais', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: false },
    { code: '4.1.1', name: 'Despesas com Pessoal', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: false },
    { code: '4.1.1.01', name: 'Salários e Ordenados', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.1.02', name: 'Férias', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.1.03', name: '13º Salário', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.1.04', name: 'Trabalho Voluntário (Contrapartida)', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.2', name: 'Despesas Administrativas', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: false },
    { code: '4.1.2.01', name: 'Energia Elétrica', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.2.02', name: 'Água e Esgoto', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.2.03', name: 'Material de Expediente', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.2.04', name: 'Serviços de Terceiros - PJ', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.3', name: 'Despesas Financeiras', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
    { code: '4.1.4', name: 'Depreciação', type: 'EXPENSE', nature: 'DEBIT', isAnalytic: true },
];

async function main() {
    console.log('🌱 Seeding Treasury Module (NBC T 10.19)...');

    const association = await prisma.association.upsert({
        where: { cnpj: '00.000.000/0001-91' },
        update: {},
        create: {
            name: 'Associação Beneficente Modelo',
            cnpj: '00.000.000/0001-91',
            foundationDate: new Date('2020-01-01'),
        },
    });

    console.log(`organization: ${association.name}`);

    // Sort by code length to ensure parents exist
    const sortedAccounts = STANDARD_ACCOUNTS.sort((a, b) => a.code.localeCompare(b.code));

    for (const acc of sortedAccounts) {
        let parentId = null;
        const parts = acc.code.split('.');

        // Attempt to find parent
        if (parts.length > 1) {
            // Logic: 1.1.1 -> parent is 1.1. 1.1 -> parent is 1.
            // 1.1.1.01 -> parent is 1.1.1
            const parentCode = parts.slice(0, -1).join('.');

            const parent = await prisma.financialAccount.findFirst({
                where: { associationId: association.id, code: parentCode }
            });

            if (parent) {
                parentId = parent.id;
            }
        }

        // Checking existence
        const existing = await prisma.financialAccount.findFirst({
            where: { associationId: association.id, code: acc.code }
        });

        if (!existing) {
            await prisma.financialAccount.create({
                data: {
                    associationId: association.id,
                    code: acc.code,
                    name: acc.name,
                    type: acc.type as AccountType,
                    nature: acc.nature as AccountNature,
                    isAnalytic: acc.isAnalytic,
                    parentId: parentId
                }
            });
            console.log(`✅ Created ${acc.code} ${acc.name}`);
        } else {
            // Optional: Update parent if it was missing before or name changed
            // process.stdout.write('.');
        }
    }

    // Create Funds
    const funds = [
        { name: 'Recursos Próprios (Livres)', restricted: false },
        { name: 'Convênio Municipal da Saúde', restricted: true, description: 'Recursos vinculados ao termo de fomento 01/2024' },
    ];

    for (const f of funds) {
        const existing = await prisma.fund.findFirst({ where: { associationId: association.id, name: f.name } });
        if (!existing) {
            await prisma.fund.create({
                data: {
                    associationId: association.id,
                    name: f.name,
                    restricted: f.restricted,
                    description: f.description
                }
            });
            console.log(`✅ Created Fund ${f.name}`);
        }
    }

    console.log('\n💰 Plan of Accounts & Funds Seeded Successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
