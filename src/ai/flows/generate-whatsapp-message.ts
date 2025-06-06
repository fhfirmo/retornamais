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
  accumulatedCashback: z.number().describe('The total accumulated cashback for the client.'),
  currentBalance: z.number().describe('The current cashback balance for the client.'),
  template: z.string().describe('The template to use for the message. Must include {{{clientName}}}, {{{purchaseValue}}}, {{{accumulatedCashback}}}, and {{{currentBalance}}}'),
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

  Using the provided template, client information, purchase value, accumulated cashback, and current balance, create a compelling WhatsApp message to encourage repeat business.

  Client Name: {{{clientName}}}
  Purchase Value: {{{purchaseValue}}}
  Accumulated Cashback: {{{accumulatedCashback}}}
  Current Balance: {{{currentBalance}}}
  Template: {{{template}}}

  Ensure the message is engaging and includes all the relevant information.

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
    const {output} = await prompt(input);
    return output!;
  }
);
