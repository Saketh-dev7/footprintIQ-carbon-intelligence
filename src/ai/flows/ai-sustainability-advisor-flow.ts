'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActionPlanDaySchema = z.object({
  day: z.number().describe('Day of the plan (1-30).'),
  task: z.string().describe('The specific sustainability task for this day.'),
  impact: z.enum(['low', 'medium', 'high']).describe('The carbon reduction impact.'),
});

const AISustainabilityAdvisorInputSchema = z.object({
  total: z.number().describe('Total carbon footprint in kg CO2e.'),
  transport: z.number().describe('Carbon footprint from transportation in kg CO2e.'),
  food: z.number().describe('Carbon footprint from food consumption in kg CO2e.'),
  energy: z.number().describe('Carbon footprint from home energy usage in kg CO2e.'),
  shopping: z.number().describe('Carbon footprint from shopping habits in kg CO2e.'),
  waste: z.number().describe('Carbon footprint from waste management in kg CO2e.'),
});

const AISustainabilityAdvisorOutputSchema = z.object({
  largestEmissionSource: z.string().describe('The category with the largest carbon emission.'),
  topImprovementOpportunities: z.array(z.string()).min(3).max(3),
  weeklySustainabilityChallenge: z.string(),
  monthlyReductionGoal: z.string(),
  estimatedImpactPercentages: z.string(),
  actionPlan: z.array(ActionPlanDaySchema).length(30).describe('A day-by-day 30-day action plan to reduce footprint.'),
});

export type AISustainabilityAdvisorOutput = z.infer<typeof AISustainabilityAdvisorOutputSchema>;

export async function aiSustainabilityAdvisor(input: z.infer<typeof AISustainabilityAdvisorInputSchema>): Promise<AISustainabilityAdvisorOutput> {
  return aiSustainabilityAdvisorFlow(input);
}

const aiSustainabilityAdvisorPrompt = ai.definePrompt({
  name: 'aiSustainabilityAdvisorPrompt',
  input: {schema: AISustainabilityAdvisorInputSchema},
  output: {schema: AISustainabilityAdvisorOutputSchema},
  prompt: `You are the FootprintIQ AI Sustainability Advisor. 
Based on the user's carbon data, generate:
1. Analysis of largest sources and top 3 opportunities.
2. A weekly challenge and monthly SMART goal.
3. A detailed 30-day action plan with one small, actionable task per day. The tasks should be progressively more involved but always achievable for a typical household.

User's Data (kg CO2e):
- Total: {{total}}
- Transportation: {{transport}}
- Food: {{food}}
- Home Energy: {{energy}}
- Shopping: {{shopping}}
- Waste: {{waste}}

Output must be strictly valid JSON following the provided schema.`,
});

const aiSustainabilityAdvisorFlow = ai.defineFlow(
  {
    name: 'aiSustainabilityAdvisorFlow',
    inputSchema: AISustainabilityAdvisorInputSchema,
    outputSchema: AISustainabilityAdvisorOutputSchema,
  },
  async input => {
    const {output} = await aiSustainabilityAdvisorPrompt(input);
    if (!output) throw new Error('Failed to generate sustainability advice.');
    return output;
  }
);
