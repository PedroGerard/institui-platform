
"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { callAssemblySchema, CallAssemblyFormData } from "@/types/schemas";
import { api } from "@/services/api";

interface CallAssemblyFormProps {
    associationId: string;
    onSuccess: () => void;
}

export function CallAssemblyForm({ associationId, onSuccess }: CallAssemblyFormProps) {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CallAssemblyFormData>({
        resolver: zodResolver(callAssemblySchema),
        defaultValues: {
            associationId,
            type: "AGO",
            date: "",
            agenda: [{ value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "agenda",
    });

    const onSubmit = async (data: CallAssemblyFormData) => {
        setServerError(null);
        setSuccessMessage(null);
        try {
            // Ensure date is ISO string full format
            const isoDate = new Date(data.date).toISOString();

            await api.callAssembly({
                ...data,
                date: isoDate
            });
            setSuccessMessage("Assembleia convocada com sucesso!");
            reset({ associationId, type: "AGO", date: "", agenda: [{ value: "" }] }); // Reset form but keep ID
            if (onSuccess) onSuccess();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setServerError(err.message);
            } else {
                setServerError("Erro ao convocar assembleia.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
                <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg flex items-center gap-3 text-red-200">
                    <AlertCircle size={20} />
                    <span>{serverError}</span>
                </div>
            )}

            {successMessage && (
                <div className="p-4 bg-emerald-900/50 border border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-200">
                    <CheckCircle size={20} />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Tipo de Assembleia
                    </label>
                    <select
                        {...register("type")}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    >
                        <option value="AGO">Assembleia Geral Ordinária (AGO)</option>
                        <option value="AGE">Assembleia Geral Extraordinária (AGE)</option>
                    </select>
                    {errors.type && (
                        <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                        Data e Hora
                    </label>
                    <input
                        type="datetime-local"
                        {...register("date")}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all calendar-icon-white"
                    />
                    {errors.date && (
                        <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    Pauta (Ordem do Dia)
                </label>
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <input
                                {...register(`agenda.${index}.value` as const)}
                                placeholder={`Item ${index + 1}`}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            />
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    aria-label="Remover item da pauta"
                                    title="Remover item da pauta"
                                    onClick={() => remove(index)}
                                    className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {errors.agenda && (
                    <p className="text-red-400 text-xs mt-1">
                        {errors.agenda.message || "Erro na pauta. Verifique se todos os itens estão preenchidos."}
                    </p>

                )}


                <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    <Plus size={16} />
                    Adicionar Item
                </button>
            </div>


            <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Processando...
                        </>
                    ) : (
                        "Convocar Assembleia"
                    )}
                </button>
            </div>
        </form>
    );
}
