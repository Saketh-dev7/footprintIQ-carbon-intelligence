'use server';
/**
 * @fileOverview A conversational AI assistant that provides personalized advice on carbon reduction,
 * lifestyle impacts, and green alternatives.
 *
 * - chatWithSustainabilityAssistant - A function to interact with the AI assistant.
 * - ConversationalSustainabilityAssistantInput - The input type for the chat function.
 * - ConversationalSustainabilityAssistantOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConversationalSustainabilityAssistantInputSchema = z
  .string()
  .describe('The question or query from the user regarding carbon reduction or sustainability.');
export type ConversationalSustainabilityAssistantInput = z.infer<
  typeof ConversationalSustainabilityAssistantInputSchema
>;

const ConversationalSustainabilityAssistantOutputSchema = z
  .string()
  .describe('The AI assistant\'s detailed and personalized response.');
export type ConversationalSustainabilityAssistantOutput = z.infer<
  typeof ConversationalSustainabilityAssistantOutputSchema
>;

export async function chatWithSustainabilityAssistant(
  input: ConversationalSustainabilityAssistantInput
): Promise<ConversationalSustainabilityAssistantOutput> {
  return conversationalSustainabilityAssistantFlow(input);
}

const sustainabilityAssistantPrompt = ai.definePrompt({
  name: 'sustainabilityAssistantPrompt',
  input: {schema: ConversationalSustainabilityAssistantInputSchema},
  output: {
  schema: z.string().optional(),
},
  prompt: `You are the FootprintIQ Sustainability Assistant, an expert in carbon reduction, environmental impact, and green living. Your goal is to provide immediate, personalized, and actionable advice to users based on their questions.\n\nWhen a user asks a question, analyze it thoroughly and provide a comprehensive, helpful, and encouraging response. Focus on practical tips, explain concepts clearly, and suggest green alternatives where appropriate. Always maintain a positive and supportive tone.\n\nUser's Question: {{{it}}}`,
});

const conversationalSustainabilityAssistantFlow = ai.defineFlow(
  {
    name: 'conversationalSustainabilityAssistantFlow',
    inputSchema: ConversationalSustainabilityAssistantInputSchema,
    outputSchema: ConversationalSustainabilityAssistantOutputSchema,
  },
  async input => {
  try {
    const { output } = await sustainabilityAssistantPrompt(input);

    if (!output || typeof output !== "string") {
      return "I'm sorry, I couldn't generate a response right now. Please try again.";
    }

    return output;
  } catch (error) {
    console.error("Assistant Flow Error:", error);

    return "I'm currently experiencing high demand. Please try again in a moment.";
  }
        }
);
