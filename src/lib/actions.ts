
"use server";

import { generateWhatsappMessage as generateWhatsappMessageFlow, type GenerateWhatsappMessageInput } from "@/ai/flows/generate-whatsapp-message";
import { generatePromoImage as generatePromoImageFlow, type GeneratePromoImageInput } from "@/ai/flows/generate-promo-image-flow";
import { z } from "zod";

const GenerateMessageActionInputSchema = z.object({
  clientName: z.string(),
  phoneNumber: z.string(),
  purchaseValue: z.number(),
  cashbackFromThisPurchase: z.number(),
  newCurrentBalance: z.number(),
  minimumRedemptionValue: z.number().optional(),
  template: z.string(),
});

export async function generateWhatsappMessageAction(
  input: z.infer<typeof GenerateMessageActionInputSchema>
): Promise<{ success: boolean; message?: string; error?: string }> {
  
  const validatedInput = GenerateMessageActionInputSchema.safeParse(input);

  if (!validatedInput.success) {
    const errorMessages = Object.entries(validatedInput.error.flatten().fieldErrors)
      .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
      .join('; ');
    return { success: false, error: "Invalid input: " + errorMessages };
  }
  
  try {
    const aiInput: GenerateWhatsappMessageInput = {
      clientName: validatedInput.data.clientName,
      phoneNumber: validatedInput.data.phoneNumber,
      purchaseValue: validatedInput.data.purchaseValue,
      cashbackFromThisPurchase: validatedInput.data.cashbackFromThisPurchase,
      newCurrentBalance: validatedInput.data.newCurrentBalance,
      minimumRedemptionValue: validatedInput.data.minimumRedemptionValue,
      template: validatedInput.data.template,
    };

    const result = await generateWhatsappMessageFlow(aiInput);
    if (result && result.message) {
      return { success: true, message: result.message };
    } else {
      return { success: false, error: "AI failed to generate message." };
    }
  } catch (error) {
    console.error("Error generating WhatsApp message:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}


const GeneratePromoImageActionInputSchema = z.object({
  prompt: z.string().min(3, "Prompt deve ter pelo menos 3 caracteres."),
});

export async function generatePromoImageAction(
  prompt: string
): Promise<{ success: boolean; imageDataUri?: string; error?: string }> {
  const validatedInput = GeneratePromoImageActionInputSchema.safeParse({ prompt });

  if (!validatedInput.success) {
    return { success: false, error: validatedInput.error.flatten().fieldErrors.prompt?.join(', ') || "Prompt inválido." };
  }

  try {
    const result = await generatePromoImageFlow({ prompt: validatedInput.data.prompt });
    if (result.imageDataUri) {
      return { success: true, imageDataUri: result.imageDataUri };
    } else {
      return { success: false, error: result.error || "Falha ao gerar imagem." };
    }
  } catch (error) {
    console.error("Error in generatePromoImageAction:", error);
    let errorMessage = "Ocorreu um erro inesperado ao gerar a imagem.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
