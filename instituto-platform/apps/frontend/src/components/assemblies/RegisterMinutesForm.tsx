
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, AlertCircle, FileText } from "lucide-react";

import { registerMinutesSchema, RegisterMinutesFormData } from "@/types/schemas";
import { api } from "@/services/api";

interface RegisterMinutesFormProps {
    assemblyId: string;
    onSuccess: () => void;
}

export function RegisterMinutesForm({ assemblyId, onSuccess }: RegisterMinutesFormProps) {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterMinutesFormData>({
        resolver: zodResolver(registerMinutesSchema),
        defaultValues: {
            heldConfirmed: false,
            content: "",
        },
    });

    const onSubmit = async (data: RegisterMinutesFormData) => {
        setServerError(null);
        setSuccessMessage(null);
        try {
            // Step 1: Hold the Assembly (logic lock)
            // We call this explicitly to ensure the transition CALLED -> HELD happens strictly before Minutes.
            // In a more complex UI, this might be a separate previous step, but for this Wizard, we bundle it.
            await api.holdAssembly(assemblyId);

            // Step 2: Register Minutes
            await api.registerMinutes(assemblyId, data.content);

            setSuccessMessage("Ata registrada com sucesso! Eventos jurídicos gerados.");
            if (onSuccess) onSuccess();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setServerError(err.message);
            } else {
                setServerError("Erro ao registrar a ata.");
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

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <label className="flex items-start gap-3 cursor-pointer">
                    <div className="pt-0.5">
                        <input
                            type="checkbox"
                            {...register("heldConfirmed")}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900"
                        />
                    </div>
                    <div>
                        <span className="block text-sm font-medium text-slate-200">
                            Confirmar Realização (Quórum Atingido)
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                            Declaro que a assembleia ocorreu na data e local previstos, respeitando o quórum estatutário de instalação.
                            Esta ação mudará o status jurídico para <strong>REALIZADA</strong>.
                        </p>
                    </div>
                </label>
                {errors.heldConfirmed && (
                    <p className="text-red-400 text-xs mt-2 ml-8">{errors.heldConfirmed.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    Teor da Ata
                </label>
                <textarea
                    {...register("content")}
                    rows={12}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-mono text-sm leading-relaxed"
                    placeholder="Aos xx dias do mês de... reuniu-se a Assembleia Geral..."
                />
                <div className="flex justify-between mt-1">
                    {errors.content ? (
                        <p className="text-red-400 text-xs">{errors.content.message}</p>
                    ) : (
                        <span className="text-xs text-slate-500">Formato Texto Puro (Markdown suportado futuramente)</span>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Registrando...
                        </>
                    ) : (
                        <>
                            <FileText size={18} />
                            Registrar Ata Oficial
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
