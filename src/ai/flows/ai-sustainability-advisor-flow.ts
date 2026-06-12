'use server';
/**
 * @fileOverview A Genkit flow for the FootprintIQ AI Sustainability Advisor.
 * This file defines a flow that analyzes a user's carbon footprint data
 * and generates personalized insights, including largest emission sources,
 * improvement opportunities, a weekly challenge, and a monthly reduction goal.
 *
 * - aiSustainabilityAdvisor - A function that handles the AI sustainability advice process.
 * - AISustainabilityAdvisorInput - The input type for the aiSustainabilityAdvisor function.
 * - AISustainabilityAdvisorOutput - The return type for the aiSustainabilityAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISustainabilityAdvisorInputSchema = z.object({
  total: z.number().describe('Total carbon footprint in kg CO2e.'),
  transport: z.number().describe('Carbon footprint from transportation in kg CO2e.'),
  food: z.number().describe('Carbon footprint from food consumption in kg CO2e.'),
  energy: z.number().describe('Carbon footprint from home energy usage in kg CO2e.'),
  shopping: z.number().describe('Carbon footprint from shopping habits in kg CO2e.'),
  waste: z.number().describe('Carbon footprint from waste management in kg CO2e.'),
});
export type AISustainabilityAdvisorInput = z.infer<typeof AISustainabilityAdvisorInputSchema>;

const AISustainabilityAdvisorOutputSchema = z.object({
  largestEmissionSource: z.string().describe('The category with the largest carbon emission, e.g., "Transportation".'),
  topImprovementOpportunities: z.array(z.string()).min(3).max(3).describe('A list of the top 3 most impactful and actionable recommendations to reduce carbon footprint.'),
  weeklySustainabilityChallenge: z.string().describe('A single, actionable and engaging sustainability challenge for the user to try this week.'),
  monthlyReductionGoal: z.string().describe('A specific, measurable, achievable, relevant, and time-bound (SMART) goal for reducing monthly carbon footprint, e.g., "Reduce total footprint by 5% (10 kg CO2e) next month by focusing on reducing food waste."'),
  estimatedImpactPercentages: z.string().describe('A summary statement of the estimated carbon reduction impact for the suggested opportunities, e.g., "Implementing these suggestions could lead to an estimated 10-15% reduction in your overall monthly carbon footprint."'),
});
export type AISustainabilityAdvisorOutput = z.infer<typeof AISustainabilityAdvisorOutputSchema>;

export async function aiSustainabilityAdvisor(input: AISustainabilityAdvisorInput): Promise<AISustainabilityAdvisorOutput> {
  return aiSustainabilityAdvisorFlow(input);
}

const aiSustainabilityAdvisorPrompt = ai.definePrompt({
  name: 'aiSustainabilityAdvisorPrompt',
  input: {schema: AISustainabilityAdvisorInputSchema},
  output: {schema: AISustainabilityAdvisorOutputSchema},
  prompt: `You are the FootprintIQ AI Sustainability Advisor, an expert in carbon footprint analysis and reduction strategies. Your goal is to help users understand and significantly reduce their environmental impact by providing personalized, context-aware insights.

Based on the user's carbon footprint data provided below, generate a comprehensive analysis including:
1. The largest emission source.
2. The top 3 most impactful and actionable improvement opportunities.
3. A single, actionable and engaging weekly sustainability challenge.
4. A specific, measurable, achievable, relevant, and time-bound (SMART) monthly reduction goal.
5. A summary statement of the estimated carbon reduction impact for the suggested opportunities.

User's Current Carbon Footprint (in kg CO2e):
- Total: {{total}}
- Transportation: {{transport}}
- Food: {{food}}
- Home Energy: {{energy}}
- Shopping: {{shopping}}
- Waste: {{waste}}

Please provide your analysis in a structured JSON format that directly maps to the provided output schema. Ensure all recommendations are practical, actionable, and tailored to the provided data. Focus on making the advice personalized and encouraging.
`,
});

const aiSustainabilityAdvisorFlow = ai.defineFlow(
  {
    name: 'aiSustainabilityAdvisorFlow',
    inputSchema: AISustainabilityAdvisorInputSchema,
    outputSchema: AISustainabilityAdvisorOutputSchema,
  },
  async input => {
    const {output} = await aiSustainabilityAdvisorPrompt(input);
    if (!output) {
      throw new Error('Failed to generate sustainability advice.');
    }
    return output;
  }
);
