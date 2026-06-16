'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import type { UserDTO, UserRole } from '@/types/dtos';
import { formatDate, userRoleLabels } from '@/lib/institutional';
import { AlertCircle, RefreshCw, Save, ShieldCheck, UserCog } from 'lucide-react';

type ManageableUserRole = Exclude<UserRole, 'SYSTEM'>;

const manageableRoles: ManageableUserRole[] = ['ADM', 'MEMBER', 'AUDITOR'];

export default function UsersPage() {
    const { associationId, activeAssociation, hasAssociation } = useActiveAssociation();
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [form, setForm] = useState<{
        name: string;
        email: string;
        role: ManageableUserRole;
    }>({
        name: '',
        email: '',
        role: 'ADM'
    });

    const usersByRole = useMemo(() => {
        return users.reduce<Record<ManageableUserRole, number>>(
            (total, user) => {
                if (user.role !== 'SYSTEM') {
                    total[user.role as ManageableUserRole] += 1;
                }

                return total;
            },
            { ADM: 0, MEMBER: 0, AUDITOR: 0 }
        );
    }, [users]);

    async function loadUsers() {
        if (!associationId) {
            setUsers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setUsers(await api.listUsers(associationId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar usuarios.');
        } finally {
            setLoading(false);
        }
    }

    async function createUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!associationId) {
            setError('Selecione uma associacao ativa antes de cadastrar usuarios.');
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            const user = await api.createUser({
                associationId,
                ...form
            });
            setUsers((current) => [...current, user].sort((a, b) => a.name.localeCompare(b.name)));
            setForm({ name: '', email: '', role: 'ADM' });
            setSuccess(`${user.name} cadastrado com perfil ${userRoleLabels[user.role]}.`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao cadastrar usuario.');
        } finally {
            setSaving(false);
        }
    }

    async function updateRole(userId: string, role: ManageableUserRole) {
        try {
            setUpdatingUserId(userId);
            setError(null);
            setSuccess(null);
            const updated = await api.updateUserRole(userId, role);
            setUsers((current) => current.map((user) => user.id === userId ? updated : user));
            setSuccess(`Perfil de ${updated.name} atualizado para ${userRoleLabels[updated.role]}.`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil.');
        } finally {
            setUpdatingUserId(null);
        }
    }

    useEffect(() => {
        loadUsers();
    }, [associationId]);

    return (
        <InstitutionalLayout title="Usuarios" activePath="/usuarios">
            <div className="app-page">
                <div className="app-page-header">
                    <div>
                        <h2 className="app-heading">Usuarios operacionais</h2>
                        <p className="app-subtitle">
                            {activeAssociation ? `${activeAssociation.name} - ` : ''}{users.length} usuarios cadastrados
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={loadUsers}
                        className="app-button app-button-secondary"
                    >
                        <RefreshCw size={16} />
                        Atualizar
                    </button>
                </div>

                {error && (
                    <div className="app-alert app-alert-error text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="app-alert app-alert-success text-sm">
                        <ShieldCheck size={18} />
                        {success}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Selecione a associacao ativa antes de configurar usuarios." />}

                <section className="grid gap-4 md:grid-cols-3">
                    {manageableRoles.map((role) => (
                        <div key={role} className="app-panel app-panel-pad">
                            <p className="text-xs font-semibold uppercase text-slate-500">{userRoleLabels[role]}</p>
                            <p className="mt-2 text-3xl font-bold text-slate-100">{usersByRole[role]}</p>
                        </div>
                    ))}
                </section>

                <section className="app-panel app-panel-pad">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-100">Cadastrar usuario</h3>
                        <p className="mt-1 text-sm text-slate-400">Perfis criados aqui serao usados como base para permissao, auditoria e aprovacao.</p>
                    </div>

                    <form onSubmit={createUser} className="grid gap-4 lg:grid-cols-[1fr_1fr_220px_auto] lg:items-end">
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Nome</span>
                            <input
                                required
                                value={form.name}
                                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                                placeholder="Nome do operador"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">E-mail</span>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                                placeholder="usuario@entidade.org"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Perfil</span>
                            <select
                                value={form.role}
                                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as ManageableUserRole }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                            >
                                {manageableRoles.map((role) => (
                                    <option key={role} value={role}>{userRoleLabels[role]}</option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="submit"
                            disabled={saving || !hasAssociation}
                            className="app-button app-button-primary min-h-11"
                        >
                            <Save size={16} />
                            {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </section>

                <div className="app-table">
                    <div className="min-w-[760px]">
                        <div className="app-table-header grid grid-cols-[1.4fr_1.4fr_220px_180px] gap-4 px-5 py-3">
                            <span>Nome</span>
                            <span>E-mail</span>
                            <span>Perfil</span>
                            <span>Criado em</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando usuarios...</div>
                        ) : users.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <UserCog size={28} />
                                <span className="text-sm">Nenhum usuario operacional cadastrado.</span>
                            </div>
                        ) : (
                            <div>
                                {users.map((user) => (
                                    <div key={user.id} className="app-table-row grid grid-cols-[1.4fr_1.4fr_220px_180px] items-center gap-4 px-5 py-4 text-sm">
                                        <div>
                                            <p className="font-medium text-slate-100">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.id}</p>
                                        </div>
                                        <span className="text-slate-300">{user.email}</span>
                                        <select
                                            value={user.role}
                                            disabled={updatingUserId === user.id || user.role === 'SYSTEM'}
                                            onChange={(event) => updateRole(user.id, event.target.value as ManageableUserRole)}
                                            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {manageableRoles.map((role) => (
                                                <option key={role} value={role}>{userRoleLabels[role]}</option>
                                            ))}
                                        </select>
                                        <span className="text-slate-300">{formatDate(user.createdAt)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
