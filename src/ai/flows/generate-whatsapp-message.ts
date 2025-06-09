
'use server';

/**
 * @fileOverview Generates personalized WhatsApp messages for clients after a purchase.
 *
 * - generateWhatsappMessage - A function to generate the WhatsApp message.
 * - GenerateWhatsappMessageInput - The input type for the generateWhatsappMessage function.
 * - GenerateWhatsappMessageOutput - The return type for the generateWhatsappMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWhatsappMessageInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  phoneNumber: z.string().describe('The WhatsApp number of the client (including country code).'),
  purchaseValue: z.number().describe('The value of the current purchase.'),
  cashbackFromThisPurchase: z.number().describe('The amount of cashback earned from this specific purchase.'),
  newCurrentBalance: z.number().describe('The total current spendable cashback balance for the client *after* this purchase.'),
  minimumRedemptionValue: z.number().optional().describe('The minimum cashback balance required for redemption. If not provided or 0, there is no minimum.'),
  template: z.string().describe('The template to use for the message. Must include {{{clientName}}}, {{{purchaseValue}}}, {{{cashbackFromThisPurchase}}}, {{{newCurrentBalance}}}, and {{{redemptionInfo}}}'),
});
export type GenerateWhatsappMessageInput = z.infer<typeof GenerateWhatsappMessageInputSchema>;

const GenerateWhatsappMessageOutputSchema = z.object({
  message: z.string().describe('The generated WhatsApp message.'),
});
export type GenerateWhatsappMessageOutput = z.infer<typeof GenerateWhatsappMessageOutputSchema>;

export async function generateWhatsappMessage(input: GenerateWhatsappMessageInput): Promise<GenerateWhatsappMessageOutput> {
  return generateWhatsappMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWhatsappMessagePrompt',
  input: {schema: GenerateWhatsappMessageInputSchema},
  output: {schema: GenerateWhatsappMessageOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in crafting personalized WhatsApp messages for clients after they make a purchase.

  Using the provided client information and purchase details, create a compelling WhatsApp message.

  Client Name: {{{clientName}}}
  Purchase Value: {{{purchaseValue}}}
  Cashback from this purchase: {{{cashbackFromThisPurchase}}}
  New Current Cashback Balance: {{{newCurrentBalance}}}
  Minimum Value for Redemption: {{{minimumRedemptionValue}}}
  Template to use: {{{template}}}

  In the provided template, you will find placeholders like {{{clientName}}}, {{{purchaseValue}}}, {{{cashbackFromThisPurchase}}}, {{{newCurrentBalance}}}.
  You also need to replace the placeholder {{{redemptionInfo}}}.

  To generate the content for {{{redemptionInfo}}}:
  - If minimumRedemptionValue is provided, is greater than 0, and newCurrentBalance is less than minimumRedemptionValue:
    - Calculate the difference: needed = minimumRedemptionValue - newCurrentBalance.
    - Format all monetary values to two decimal places, using a comma as the decimal separator (e.g., R$10,50).
    - {{{redemptionInfo}}} should be: "Faltam R$[FORMATTED_NEEDED_AMOUNT] para você poder resgatar seu cashback (mínimo de R$[FORMATTED_MINIMUM_VALUE])."
  - If minimumRedemptionValue is provided, is greater than 0, and newCurrentBalance is equal to or greater than minimumRedemptionValue:
    - {{{redemptionInfo}}} should be: "Você já pode resgatar seu cashback!"
  - If minimumRedemptionValue is not provided or is 0:
    - {{{redemptionInfo}}} should be: "Continue acumulando para resgatar ainda mais!"

  Use the information to fill all placeholders in the template.
  Ensure the final message is engaging and all monetary values are formatted to two decimal places with a comma separator (e.g., R$XX,YY).

  Here is the generated message:
  `,
});

const generateWhatsappMessageFlow = ai.defineFlow(
  {
    name: 'generateWhatsappMessageFlow',
    inputSchema: GenerateWhatsappMessageInputSchema,
    outputSchema: GenerateWhatsappMessageOutputSchema,
  },
  async input => {
    // Helper to format numbers to R$XX,YY
    const formatCurrency = (value: number | undefined) => {
        if (value === undefined) return '0,00';
        return value.toFixed(2).replace('.', ',');
    };
    
    const formattedInput = {
        ...input,
        purchaseValue: parseFloat(input.purchaseValue.toFixed(2)),
        cashbackFromThisPurchase: parseFloat(input.cashbackFromThisPurchase.toFixed(2)),
        newCurrentBalance: parseFloat(input.newCurrentBalance.toFixed(2)),
        minimumRedemptionValue: input.minimumRedemptionValue !== undefined ? parseFloat(input.minimumRedemptionValue.toFixed(2)) : undefined,
    };

    const {output} = await prompt(formattedInput);
    return output!;
  }
);
