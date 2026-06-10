
import { Association } from "../entities/Association";
import { Assembly, AssemblyType } from "../entities/Assembly";
import { Statute } from "../entities/Statute";
import { Document } from "../entities/Document";
import { Member } from "../entities/Member";
import { GovernanceRole, Mandate } from "../entities/Mandate";
import { AccountabilityProject } from "../entities/AccountabilityProject";


import { UniqueEntityID } from "../shared/Entity";


export interface IAssociationRepository {
    findById(id: UniqueEntityID): Promise<Association | null>;
    save(association: Association): Promise<void>;
}

export interface IAssemblyRepository {
    findById(id: UniqueEntityID): Promise<Assembly | null>;
    findByScheduledDate(associationId: UniqueEntityID, type: any, date: Date): Promise<Assembly | null>; // type should be AssemblyType
    save(assembly: Assembly): Promise<void>;
}


export interface IStatuteRepository {
    findByAssociationId(associationId: UniqueEntityID): Promise<Statute | null>;
    save(statute: Statute): Promise<void>;
}

export interface IDocumentRepository {
    findById(id: UniqueEntityID): Promise<Document | null>;
    save(document: Document): Promise<void>;
}

export interface IMemberRepository {
    findById(id: UniqueEntityID): Promise<Member | null>;
    findByCpf(associationId: UniqueEntityID, cpf: string): Promise<Member | null>;
    save(member: Member): Promise<void>;
    listByAssociation(associationId?: UniqueEntityID): Promise<Member[]>;
}

export interface IMandateRepository {
    findById(id: UniqueEntityID): Promise<Mandate | null>;
    findActiveByMemberId(memberId: UniqueEntityID): Promise<Mandate[]>;
    findActiveByRole(associationId: UniqueEntityID, role: GovernanceRole): Promise<Mandate | null>;
    listByAssociation(associationId?: UniqueEntityID, onlyActive?: boolean): Promise<Mandate[]>;
    save(mandate: Mandate): Promise<void>;
}

export interface IAccountabilityRepository {
    findById(id: UniqueEntityID): Promise<AccountabilityProject | null>;
    save(project: AccountabilityProject): Promise<void>;
    listByAssociation(associationId: UniqueEntityID): Promise<AccountabilityProject[]>;
}


