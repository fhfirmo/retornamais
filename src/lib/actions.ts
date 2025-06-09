
"use server";

import { generateWhatsappMessage as generateWhatsappMessageFlow, type GenerateWhatsappMessageInput } from "@/ai/flows/generate-whatsapp-message";
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
    // Construct a more detailed error message from Zod's error object
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
