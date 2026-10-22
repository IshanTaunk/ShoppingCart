import { getAICompletion } from "./openai-client";
import { SEARCH_PROCESSOR_SYSTEM_PROMPT, SEARCH_PROCESSOR_USER_PROMPT } from "./prompts/chat-assistant";

export type ExtractedFilters = {
  keywords: string;
  category: string | null;
  priceMin: number | null;
  priceMax: number | null;
  attributes: {
    color: string | null;
    style: string | null;
    material: string | null;
  };
  interpretation: string;
};

export function isNaturalLanguageQuery(query: string): boolean {
  // Natural language queries typically:
  // - Have more than 3-4 words
  // - Contain prepositions, articles, or adjectives
  // - Include price indicators or descriptive phrases

  const words = query.trim().split(/\s+/);

  if (words.length <= 2) {
    return false;
  }

  // Check for natural language indicators
  const nlIndicators = [
    'under',
    'below',
    'above',
    'around',
    'between',
    'for',
    'with',
    'that',
    'which',
    'want',
    'need',
    'looking',
    'find',
    'show',
    'cheap',
    'expensive',
    'affordable',
    'best',
    'good',
    'nice',
    'comfortable',
    'stylish',
    'modern',
    'classic',
    'casual',
    'formal',
    'summer',
    'winter',
    'spring',
    'fall',
  ];

  const lowerQuery = query.toLowerCase();
  const hasIndicator = nlIndicators.some((indicator) =>
    lowerQuery.includes(indicator),
  );

  // Check for price patterns
  const hasPricePattern = /\$\d+|\d+\s*dollars?/i.test(query);

  return words.length > 3 || hasIndicator || hasPricePattern;
}

export async function processNaturalLanguageQuery(
  query: string,
): Promise<ExtractedFilters> {
  const userPrompt = SEARCH_PROCESSOR_USER_PROMPT(query);

  const aiResponse = await getAICompletion(
    [{ role: 'user', content: userPrompt }],
    {
      systemPrompt: SEARCH_PROCESSOR_SYSTEM_PROMPT,
      model: 'gpt-4o-mini',
      maxTokens: 300,
      temperature: 0.1,
    },
  );

  try {
    // Extract JSON from potential markdown code blocks
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        keywords: parsed.keywords || query,
        category: parsed.category || null,
        priceMin: parsed.priceMin || null,
        priceMax: parsed.priceMax || null,
        attributes: {
          color: parsed.attributes?.color || null,
          style: parsed.attributes?.style || null,
          material: parsed.attributes?.material || null,
        },
        interpretation: parsed.interpretation || `Searching for: ${query}`,
      };
    }
  } catch (error) {
    console.error('Failed to parse AI search response:', error);
  }

  // Fallback to basic processing
  return {
    keywords: query,
    category: null,
    priceMin: null,
    priceMax: null,
    attributes: { color: null, style: null, material: null },
    interpretation: `Searching for: ${query}`,
  };
}