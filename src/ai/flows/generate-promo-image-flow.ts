
'use server';
/**
 * @fileOverview Generates a promotional image based on a text prompt.
 *
 * - generatePromoImage - A function to generate the promotional image.
 * - GeneratePromoImageInput - The input type for the generatePromoImage function.
 * - GeneratePromoImageOutput - The return type for the generatePromoImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePromoImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the image from.'),
});
export type GeneratePromoImageInput = z.infer<typeof GeneratePromoImageInputSchema>;

const GeneratePromoImageOutputSchema = z.object({
  imageDataUri: z.string().optional().describe("The generated image as a Base64 encoded data URI. Format: 'data:image/png;base64,<encoded_data>'."),
  error: z.string().optional().describe('An error message if image generation failed.'),
});
export type GeneratePromoImageOutput = z.infer<typeof GeneratePromoImageOutputSchema>;

export async function generatePromoImage(input: GeneratePromoImageInput): Promise<GeneratePromoImageOutput> {
  return generatePromoImageFlow(input);
}

const generatePromoImageFlow = ai.defineFlow(
  {
    name: 'generatePromoImageFlow',
    inputSchema: GeneratePromoImageInputSchema,
    outputSchema: GeneratePromoImageOutputSchema,
  },
  async (input) => {
    try {
      const { media, text } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Must use this model for image generation
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
           safetySettings: [ // Example safety settings, adjust as needed
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        },
      });

      if (media?.url) {
        return { imageDataUri: media.url };
      } else {
        console.warn('Image generation did not return a media URL. Text response:', text);
        return { error: `Falha ao gerar imagem. Resposta do modelo: ${text || 'Nenhuma imagem retornada.'}` };
      }
    } catch (e: any) {
      console.error('Error in generatePromoImageFlow:', e);
      return { error: e.message || 'Ocorreu um erro desconhecido ao gerar a imagem.' };
    }
  }
);
