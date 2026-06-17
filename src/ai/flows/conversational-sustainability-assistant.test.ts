import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPromptFn } = vi.hoisted(() => {
  return { mockPromptFn: vi.fn() };
});

vi.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: vi.fn(() => mockPromptFn),
    defineFlow: (_config: unknown, handler: (input: string) => Promise<string>) => handler,
  },
}));

import { chatWithSustainabilityAssistant } from './conversational-sustainability-assistant';

describe('chatWithSustainabilityAssistant', () => {
  beforeEach(() => {
    mockPromptFn.mockReset();
  });

  it('returns the model output on a successful call', async () => {
    mockPromptFn.mockResolvedValue({ output: 'Try carpooling twice a week to cut emissions.' });

    const result = await chatWithSustainabilityAssistant('How can I reduce my commute emissions?');

    expect(result).toBe('Try carpooling twice a week to cut emissions.');
  });

  it('falls back to a static suggestions message when the AI call throws', async () => {
    mockPromptFn.mockRejectedValue(new Error('Gemini API unavailable'));

    const result = await chatWithSustainabilityAssistant('How can I reduce my commute emissions?');

    expect(result).toContain('AI service temporarily unavailable');
    expect(result).toContain('Reduce car usage by 2 trips/week');
    expect(result).toContain('Estimated footprint reduction: 10-25%.');
  });

  it('falls back to a static suggestions message on a rejected promise with no Error object', async () => {
    mockPromptFn.mockRejectedValue('network timeout');

    const result = await chatWithSustainabilityAssistant('What is the carbon cost of beef?');

    expect(result).toContain('AI service temporarily unavailable');
  });

  it('returns a generic apology when the model output is missing', async () => {
    mockPromptFn.mockResolvedValue({ output: undefined });

    const result = await chatWithSustainabilityAssistant('How can I reduce my commute emissions?');

    expect(result).toBe("I'm sorry, I couldn't generate a response right now. Please try again.");
  });

  it('returns a generic apology when the model output is not a string', async () => {
    mockPromptFn.mockResolvedValue({ output: 12345 });

    const result = await chatWithSustainabilityAssistant('How can I reduce my commute emissions?');

    expect(result).toBe("I'm sorry, I couldn't generate a response right now. Please try again.");
  });
});
