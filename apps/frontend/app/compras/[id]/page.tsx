'use client';

import { FormEvent, use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, CheckCircle, FileText, Plus, Save, ShieldCheck } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { ProcurementPriceMapDTO, ProcurementProcessDTO, SupplierDTO } from '@/types/dtos';
import {
    formatCurrency,
    formatDate,
    procurementDocumentTypeLabels,
    procurementProcessStatusLabels,
    supplierProposalStatusLabels
} from '@/lib/institutional';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function ProcurementProcessDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { associationId, hasAssociation } = useActiveAssociation();
    const [process, setProcess] = useState<ProcurementProcessDTO | null>(null);
    const [priceMap, setPriceMap] = useState<ProcurementPriceMapDTO | null>(null);
    const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [itemForm, setItemForm] = useState({ description: '', unit: 'un', quantity: '', estimatedUnitPrice: '' });
    const [supplierForm, setSupplierForm] = useState({ name: '', cnpj: '', email: '', phone: '' });
    const [proposalSupplierId, setProposalSupplierId] = useState('');
    const [quoteValues, setQuoteValues] = useState<Record<string, string>>({});
    const [contractForm, setContractForm] = useState({
        supplierId: '',
        contractNumber: '',
        title: '',
        amount: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: ''
    });

    const selectedSuppliers = useMemo(() => {
        return process?.proposals
            .filter((proposal) => proposal.status === 'SELECTED')
            .map((proposal) => proposal.supplier) || [];
    }, [process]);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const processData = await api.getProcurementProcess(id);
            const supplierAssociationId = associationId || processData.associationId;
            const [mapData, supplierData] = await Promise.all([
                api.getProcurementPriceMap(id),
                api.listSuppliers({ associationId: supplierAssociationId })
            ]);
            setProcess(processData);
            setPriceMap(mapData);
            setSuppliers(supplierData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar processo.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [associationId, id]);

    async function runAction(action: string, fn: () => Promise<unknown>, message: string) {
        try {
            setSaving(action);
            setError(null);
            setSuccess(null);
            await fn();
            setSuccess(message);
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao executar acao.');
        } finally {
            setSaving(null);
        }
    }

    async function handleAddItem(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await runAction('item', async () => {
            await api.addProcurementItem(id, {
                description: itemForm.description,
                unit: itemForm.unit || undefined,
                quantity: Number(itemForm.quantity),
                estimatedUnitPrice: itemForm.estimatedUnitPrice ? Number(itemForm.estimatedUnitPrice) : undefined
            });
            setItemForm({ description: '', unit: 'un', quantity: '', estimatedUnitPrice: '' });
        }, 'Item incluido no edital.');
    }

    async function handleCreateSupplier(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await runAction('supplier', async () => {
            const created = await api.createSupplier({
                associationId: process?.associationId || '',
                name: supplierForm.name,
                cnpj: supplierForm.cnpj,
                email: supplierForm.email || undefined,
                phone: supplierForm.phone || undefined
            });
            setProposalSupplierId(created.id);
            setSupplierForm({ name: '', cnpj: '', email: '', phone: '' });
        }, 'Fornecedor cadastrado.');
    }

    async function handleCreateProposal(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const items = Object.entries(quoteValues)
            .filter(([, value]) => Number(value) > 0)
            .map(([itemId, value]) => ({ itemId, unitPrice: Number(value) }));

        await runAction('proposal', async () => {
            await api.createSupplierProposal(id, {
                supplierId: proposalSupplierId,
                items
            });
            setQuoteValues({});
        }, 'Proposta registrada e mapa de precos atualizado.');
    }

    async function handleCreateContract(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await runAction('contract', async () => {
            await api.createProcurementContract(id, {
                supplierId: contractForm.supplierId,
                contractNumber: contractForm.contractNumber,
                title: contractForm.title,
                amount: Number(contractForm.amount),
                startDate: new Date(`${contractForm.startDate}T00:00:00.000Z`).toISOString(),
                endDate: contractForm.endDate ? new Date(`${contractForm.endDate}T00:00:00.000Z`).toISOString() : undefined
            });
            setContractForm({
                supplierId: '',
                contractNumber: '',
                title: '',
                amount: '',
                startDate: new Date().toISOString().slice(0, 10),
                endDate: ''
            });
        }, 'Contrato registrado.');
    }

    if (loading && !process) {
        return (
            <InstitutionalLayout title="Compras MROSC" activePath="/compras">
                <div className="text-sm text-slate-400">Carregando processo...</div>
            </InstitutionalLayout>
        );
    }

    if (!process) {
        return (
            <InstitutionalLayout title="Compras MROSC" activePath="/compras">
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">Processo nao encontrado.</div>
            </InstitutionalLayout>
        );
    }

    return (
        <InstitutionalLayout title="Compras MROSC" activePath="/compras">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex gap-4">
                        <Link href="/compras" className="mt-1 rounded-lg border border-slate-800 p-2 text-slate-300 hover:bg-slate-800">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">{process.title}</h2>
                            <p className="mt-1 max-w-3xl text-sm text-slate-400">{process.object}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-blue-300">Edital {process.noticeNumber}</span>
                                <span className="rounded-full bg-slate-800 px-3 py-1 font-semibold text-slate-300">{procurementProcessStatusLabels[process.status]}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            disabled={saving === 'select' || !priceMap?.canSelectSuppliers}
                            onClick={() => runAction('select', () => api.selectProcurementSuppliers(id), 'Fornecedores selecionados e ata registrada.')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ShieldCheck size={16} />
                            Selecionar
                        </button>
                        <button
                            type="button"
                            disabled={saving === 'homologate' || process.status !== 'SUPPLIERS_SELECTED'}
                            onClick={() => runAction('homologate', () => api.homologateProcurement(id), 'Homologacao registrada.')}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle size={16} />
                            Homologar
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="A tela usa a associacao do processo para carregar dados, mas defina a associacao ativa no topo para operar novos cadastros com rastreabilidade." />}

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Itens</div>
                        <div className="mt-2 text-xl font-bold text-slate-100">{priceMap?.totalItems || 0}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Pendentes</div>
                        <div className="mt-2 text-xl font-bold text-amber-300">{priceMap?.pendingItems || 0}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Com menos de 3 cotacoes</div>
                        <div className="mt-2 text-xl font-bold text-rose-300">{priceMap?.itemsBelowThreeQuotes || 0}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Valor vencedor</div>
                        <div className="mt-2 text-xl font-bold text-emerald-300">{formatCurrency(priceMap?.totalWinning)}</div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <form onSubmit={handleAddItem} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <h3 className="mb-4 text-sm font-semibold text-slate-100">Itens do edital</h3>
                        <div className="grid gap-3 md:grid-cols-[1fr_90px_110px_140px_auto]">
                            <input required minLength={3} className={inputClass} placeholder="Especificacao do item/servico" value={itemForm.description} onChange={(event) => setItemForm({ ...itemForm, description: event.target.value })} />
                            <input className={inputClass} placeholder="Un." value={itemForm.unit} onChange={(event) => setItemForm({ ...itemForm, unit: event.target.value })} />
                            <input required min="0.01" step="0.01" type="number" className={inputClass} placeholder="Qtd." value={itemForm.quantity} onChange={(event) => setItemForm({ ...itemForm, quantity: event.target.value })} />
                            <input min="0.01" step="0.01" type="number" className={inputClass} placeholder="Estimado" value={itemForm.estimatedUnitPrice} onChange={(event) => setItemForm({ ...itemForm, estimatedUnitPrice: event.target.value })} />
                            <button type="submit" disabled={saving === 'item'} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                                <Plus size={16} />
                                Item
                            </button>
                        </div>
                        <div className="mt-4 divide-y divide-slate-800">
                            {process.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                                    <div>
                                        <div className="font-medium text-slate-100">{item.description}</div>
                                        <div className="text-xs text-slate-500">{item.quantity} {item.unit || 'un'} {item.estimatedUnitPrice ? `- estimado ${formatCurrency(item.estimatedUnitPrice)}` : ''}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>

                    <form onSubmit={handleCreateSupplier} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <h3 className="mb-4 text-sm font-semibold text-slate-100">Fornecedor</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <input required minLength={2} className={inputClass} placeholder="Razao social" value={supplierForm.name} onChange={(event) => setSupplierForm({ ...supplierForm, name: event.target.value })} />
                            <input required minLength={11} className={inputClass} placeholder="CNPJ" value={supplierForm.cnpj} onChange={(event) => setSupplierForm({ ...supplierForm, cnpj: event.target.value })} />
                            <input type="email" className={inputClass} placeholder="E-mail" value={supplierForm.email} onChange={(event) => setSupplierForm({ ...supplierForm, email: event.target.value })} />
                            <input className={inputClass} placeholder="Telefone" value={supplierForm.phone} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} />
                        </div>
                        <button type="submit" disabled={saving === 'supplier'} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                            <Save size={16} />
                            Cadastrar fornecedor
                        </button>
                    </form>
                </div>

                <form onSubmit={handleCreateProposal} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-100">Proposta do fornecedor</h3>
                        <span className="text-xs font-semibold uppercase text-slate-500">Menor preco por item</span>
                    </div>
                    <div className="mb-4 max-w-xl">
                        <label className={labelClass}>Fornecedor participante</label>
                        <select required className={inputClass} value={proposalSupplierId} onChange={(event) => setProposalSupplierId(event.target.value)}>
                            <option value="">Selecione</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name} - {supplier.cnpj}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {process.items.map((item) => (
                            <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                                <label className={labelClass}>{item.description}</label>
                                <input
                                    min="0.01"
                                    step="0.01"
                                    type="number"
                                    className={inputClass}
                                    placeholder="Preco unitario"
                                    value={quoteValues[item.id] || ''}
                                    onChange={(event) => setQuoteValues({ ...quoteValues, [item.id]: event.target.value })}
                                />
                                <div className="mt-2 text-xs text-slate-500">Qtd. {item.quantity} {item.unit || 'un'}</div>
                            </div>
                        ))}
                    </div>
                    <button type="submit" disabled={saving === 'proposal' || !process.items.length} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                        <Save size={16} />
                        Registrar proposta
                    </button>
                </form>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <table className="w-full min-w-[980px] text-left text-sm">
                        <thead className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Cotacoes</th>
                                <th className="px-4 py-3">Fornecedor vencedor</th>
                                <th className="px-4 py-3">Valor vencedor</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {!priceMap?.rows.length ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Inclua itens e propostas para formar o mapa de precos.</td>
                                </tr>
                            ) : priceMap.rows.map((row) => (
                                <tr key={row.item.id} className="align-top">
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-slate-100">{row.item.description}</div>
                                        <div className="text-xs text-slate-500">{row.item.quantity} {row.item.unit || 'un'}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="space-y-1 text-xs text-slate-300">
                                            {row.quotes.map((quote) => (
                                                <div key={quote.id}>{quote.supplierName}: {formatCurrency(quote.unitPrice)} un. / {formatCurrency(quote.totalPrice)}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-300">{row.winner?.supplierName || '-'}</td>
                                    <td className="px-4 py-4 font-semibold text-emerald-300">{row.winner ? formatCurrency(row.winner.totalPrice) : '-'}</td>
                                    <td className="px-4 py-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.winner ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                                            {row.winner ? (row.hasMinimumQuotes ? 'Completo' : 'Menos de 3 cotacoes') : 'Pendente'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <h3 className="mb-4 text-sm font-semibold text-slate-100">Documentos do processo</h3>
                        <div className="space-y-3">
                            {process.documents.map((document) => (
                                <div key={document.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <FileText size={16} className="text-blue-300" />
                                        <div>
                                            <div className="font-medium text-slate-100">{document.title}</div>
                                            <div className="text-xs text-slate-500">{procurementDocumentTypeLabels[document.type]} - {formatDate(document.createdAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleCreateContract} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <h3 className="mb-4 text-sm font-semibold text-slate-100">Contrato</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <select required className={inputClass} value={contractForm.supplierId} onChange={(event) => setContractForm({ ...contractForm, supplierId: event.target.value })}>
                                <option value="">Fornecedor homologado</option>
                                {selectedSuppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                ))}
                            </select>
                            <input required className={inputClass} placeholder="Contrato 001/2026" value={contractForm.contractNumber} onChange={(event) => setContractForm({ ...contractForm, contractNumber: event.target.value })} />
                            <input required className={inputClass} placeholder="Titulo do contrato" value={contractForm.title} onChange={(event) => setContractForm({ ...contractForm, title: event.target.value })} />
                            <input required min="0.01" step="0.01" type="number" className={inputClass} placeholder="Valor" value={contractForm.amount} onChange={(event) => setContractForm({ ...contractForm, amount: event.target.value })} />
                            <input required type="date" className={inputClass} value={contractForm.startDate} onChange={(event) => setContractForm({ ...contractForm, startDate: event.target.value })} />
                            <input type="date" className={inputClass} value={contractForm.endDate} onChange={(event) => setContractForm({ ...contractForm, endDate: event.target.value })} />
                        </div>
                        <button type="submit" disabled={saving === 'contract' || process.status !== 'HOMOLOGATED'} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                            <Save size={16} />
                            Registrar contrato
                        </button>
                        <div className="mt-4 space-y-2">
                            {process.contracts.map((contract) => (
                                <div key={contract.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm">
                                    <div className="font-medium text-slate-100">{contract.contractNumber} - {contract.title}</div>
                                    <div className="text-xs text-slate-500">{contract.supplier?.name} - {formatCurrency(contract.amount)} - {formatDate(contract.startDate)}</div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
