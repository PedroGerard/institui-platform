
import { z } from "zod";

export const callAssemblySchema = z.object({
    associationId: z.string().uuid("ID da associação inválido"),
    type: z.enum(["AGO", "AGE"]),


    date: z.string().datetime({ message: "Data inválida ou formato incorreto" }),
    agenda: z
        .array(
            z.object({
                value: z.string().min(3, "Item de pauta muito curto"),
            })
        )
        .min(1, "Adicione pelo menos um item à pauta"),
});


export type CallAssemblyFormData = z.infer<typeof callAssemblySchema>;

export const registerMinutesSchema = z.object({
    heldConfirmed: z.boolean().refine((val) => val === true, {
        message: "É necessário confirmar a realização da assembleia",
    }),
    content: z.string().min(50, "A ata deve conter informações detalhadas sobre as deliberações."),
});

export type RegisterMinutesFormData = z.infer<typeof registerMinutesSchema>;

