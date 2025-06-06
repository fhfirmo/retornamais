"use server";

import { generateWhatsappMessage as generateWhatsappMessageFlow, type GenerateWhatsappMessageInput } from "@/ai/flows/generate-whatsapp-message";
import { z } from "zod";

const GenerateMessageActionInputSchema = z.object({
  clientName: z.string(),
  phoneNumber: z.string(),
  purchaseValue: z.number(),
  accumulatedCashback: z.number(),
  currentBalance: z.number(),
  template: z.string(),
});

export async function generateWhatsappMessageAction(
  input: z.infer<typeof GenerateMessageActionInputSchema>
): Promise<{ success: boolean; message?: string; error?: string }> {
  
  const validatedInput = GenerateMessageActionInputSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, error: "Invalid input: " + validatedInput.error.flatten().fieldErrors };
  }
  
  try {
    const aiInput: GenerateWhatsappMessageInput = {
      clientName: validatedInput.data.clientName,
      phoneNumber: validatedInput.data.phoneNumber, // Not directly used by current AI prompt template, but good to have
      purchaseValue: validatedInput.data.purchaseValue,
      accumulatedCashback: validatedInput.data.accumulatedCashback,
      currentBalance: validatedInput.data.currentBalance,
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
    return { success: false, error: "An unexpected error occurred." };
  }
}
